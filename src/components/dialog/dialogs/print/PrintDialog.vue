<template>
  <div
    :class="[
      $style.dialog,
      $style.default,
    ]"
  >
    <div :class="$style.caption">
      {{ t('title') }}
    </div>
    <form
      :class="[
        $style.form,
        $style[productionType],
      ]"
      @submit.prevent="submit(false)"
    >
      <div :class="$style.documents">
        <div :class="$style.label">
          {{ t('documents.title') }}
        </div>
        <div :class="$style.documentsHeader">
          <div :class="$style.documentIcons">
            <Icon
              icon="eye"
              :class="$style.documentIcon"
            />
            <Icon
              icon="printer"
              :class="$style.documentIcon"
            />
          </div>
          <div :class="$style.documentsLabel">
            {{ t('documents.label') }}
          </div>
        </div>
        <Draggable
          v-model="model.documents"
          :class="$style.documentsList"
          :handle="`.${$style.documentHandle}`"
          :drag-class="$style.dragging"
          :item-key="item => item"
        >
          <template #item="{element: document, index}">
            <div :class="$style.document">
              <div :class="$style.documentControls">
                <Icon
                  icon="drag-n-sort"
                  :class="[
                    $style.documentHandle,
                    $style.documentControl
                  ]"
                />
                <Checkbox
                  v-model="model.documents[index].is_active"
                  :class="$style.documentControl"
                  :state="['switch', 'light']"
                />
              </div>
              <div :class="$style.documentsLabel">
                {{ index + 1 }}. {{ document.name }}
              </div>
            </div>
          </template>
        </Draggable>
      </div>
      <div
        v-if="['pretrial', 'judicial'].includes(productionType)"
        :class="$style.period"
      >
        <div :class="$style.label">
          {{ t('period.title') }}
        </div>
        <Checkbox
          v-model="model.wholePeriod"
          :label="t('period.whole')"
          :class="$style.wholePeriod"
        />
        <div :class="$style.periods">
          <DateInput
            v-model="model.from"
            :with-days="false"
            auto-day="first"
            :is-disabled="model.wholePeriod"
            :placeholder="t('period.from')"
            :class="$style.periodField"
            :errors="errorsMap.date_from"
          />
          <DateInput
            v-model="model.to"
            :with-days="false"
            auto-day="last"
            :is-disabled="model.wholePeriod"
            :placeholder="t('period.to')"
            :class="$style.periodField"
            :errors="errorsMap.date_to"
          />
        </div>
        <div
          :class="$style.moratorium"
        >
          <Checkbox
            v-model="model.moratorium"
            :state="['switch', 'light']"
          />
          <div :class="$style.moratoriumLabel">
            {{ t('period.moratorium') }}
          </div>
        </div>
      </div>
      <div :class="$style.services">
        <!--        <div :class="$style.label">-->
        <!--          {{ t('services') }}-->
        <!--        </div>-->
      </div>
      <div :class="$style.actions">
        <Btn
          :state="['tertiary', 'vertical']"
          type="submit"
          :label="t('submit')"
          prepend-icon="printer"
          :class="$style.action"
        />
        <Btn
          v-if="['judicial', 'executive'].includes(productionType)"
          :state="['tertiary', 'vertical']"
          :label="t('signAndSubmit')"
          prepend-icon="flash-drive"
          :class="$style.action"
          @click="submit(true)"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, watch,
} from 'vue';
import Draggable from 'vuedraggable';
import { IDialogComponent, PrintPayload, useDialog } from '@/hooks/useDialog';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import Btn from '@/components/btn/Btn.vue';
import Icon from '@/components/icon/Icon.vue';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import {
  DocumentAttachment,
  GenerateMergedAttachmentsModel,
  PrintModel,
  usePrint,
} from '@/hooks/usePrint';
import DateInput from '@/components/dateInput/DateInput.vue';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { dateToApiDate } from '@/utils/date';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import { useSocket } from '@/hooks/useSocket';
import { SocketSubscriber } from '@/store/modules/socket';
import { IToastLevel, IToastProgressbar, useToast } from '@/hooks/useToast';
import { SignalType, useSignal } from '@/hooks/useSignal';

export default defineComponent({
  name: 'PrintDialog',
  components: {
    DateInput, Checkbox, Icon, Btn, Draggable,
  },
  props: {
    productionType: {
      type: String as PropType<PrintPayload['productionType']>,
      required: true,
    },
    debtorIds: {
      type: Array as PropType<PrintPayload['debtorIds']>,
      required: true,
    },
  },
  emits: ['hide', 'close'],
  setup(props, { emit }) {
    const {
      t,
    } = useLocalI18n('print');

    const model = ref<PrintModel>({
      wholePeriod: true,
      from: null,
      to: null,
      moratorium: true,
      documents: [],
    });

    watch(computed(() => model.value.wholePeriod), () => {
      model.value.from = null;
      model.value.to = null;
    });

    const {
      fetchCompanyAttachments,
      fetchDefaultAttachments,
      generateMergedAttachments,
      createBulkAttachments,
    } = usePrint();

    const { company } = useDefaultCompany();

    const fetchAvailableDocuments = async () => {
      const currentResponse = await fetchCompanyAttachments({
        productionType: props.productionType,
        companyId: company.value!.id,
      });
      const defaultResponse = await fetchDefaultAttachments();

      model.value.documents = [
        ...currentResponse.response.results,
      ] as Array<DocumentAttachment>;

      model.value.documents.push(...(
        defaultResponse.response.productions[props.productionType].filter((type: string) => (
          model.value.documents.findIndex((d) => d.type === type) === -1
        )).map((type: string) => ({
          type,
          name: defaultResponse.response.attachments[type].name,
          is_active: false,
        }))
      ) as Array<DocumentAttachment>);
    };

    watch(computed(() => company.value?.id), () => {
      requestAnimationFrame(fetchAvailableDocuments);
    }, {
      immediate: true,
    });

    watch(computed(() => props.productionType), () => {
      requestAnimationFrame(fetchAvailableDocuments);
    });

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors<keyof GenerateMergedAttachmentsModel>();

    const {
      subscribe,
    } = useSocket();

    const { showToast } = useToast();
    const maxProgress = ref(0);
    const currentProgress = ref(0);
    const progressbars = computed<Array<IToastProgressbar>>(() => ([
      {
        key: 'progress',
        label: 'print.toast.progress',
        max: maxProgress.value,
        current: currentProgress.value,
      },
    ]));

    const {
      showDialog,
    } = useDialog();

    const {
      awaitSignalResponse,
    } = useSignal();

    const submit = async (encrypt: boolean) => {
      clearErrors();

      const filters = await awaitSignalResponse<Record<any, any>>(
        SignalType.getDebtorFilters,
        SignalType.debtorFilters,
      );

      await createBulkAttachments({
        company_id: company.value!.id,
        production_type: props.productionType,
        attachments: model.value.documents.map((document, index) => ({
          ...document,
          order_number: index + 1,
        })),
      });

      const hideToast = await showToast({
        message: 'print.toast.message',
        progressbars,
        level: IToastLevel.info,
        duration: null,
      });

      const { status, response } = await generateMergedAttachments({
        production_type: props.productionType,
        company_id: company.value!.id,
        encrypt,
        ...(props.debtorIds?.length ? {
          debtor_ids: props.debtorIds,
        } : {
          filters: filters || {},
        }),
        ...(model.value.wholePeriod ? {} : {
          date_from: dateToApiDate(model.value.from!),
          date_to: dateToApiDate(model.value.to!),
        }),
        moratorium_enabled: model.value.moratorium,
      });

      if (!status) {
        setErrors(Object.entries(
          response,
        ) as unknown as SourceErrors<keyof GenerateMergedAttachmentsModel>);
        hideToast();
      }

      emit('hide');

      maxProgress.value = 0;
      currentProgress.value = 0;

      const unsub = await subscribe({
        condition: (payload) => (
          (
            payload.action === 'progress_event'
            && payload.data.event === `document_attachments/generate_merged/${response.id}/`
          ) || (
            payload.action === 'model_event'
            && payload.data.model === 'document_attachments/status/update'
            && payload.data.obj.id === response.id
          )
        ),
        async handler(payload) {
          if ('error_message' in payload.data) {
            await showToast({
              label: 'pureLabel',
              message: 'pure',
              params: {
                label: payload.data.description,
                message: payload.data.error_message,
              },
              level: IToastLevel.danger,
            });
          }
          if (payload.action === 'progress_event') {
            maxProgress.value = payload.data.debtor_total;

            if (currentProgress.value !== maxProgress.value) {
              currentProgress.value = payload.data.debtor_step;
            }
          } else {
            currentProgress.value = maxProgress.value;

            const { file_pdf, file } = payload?.data?.obj || {};

            if (file) {
              await showToast({
                message: 'print.toast.success',
                level: IToastLevel.success,
                duration: 10000,
              });
              await showDialog({
                component: IDialogComponent.file,
                addInRoute: false,
                payload: {
                  title: t('dialog.title'),
                  url: `${encrypt ? file : file_pdf}`,
                  withPreview: !encrypt,
                  withCopy: !encrypt,
                },
              });
            } else {
              await showToast({
                message: 'print.toast.failure',
                level: IToastLevel.danger,
              });
            }

            hideToast();
            unsub();

            emit('close');
          }
        },
      } as SocketSubscriber);
    };

    return {
      t,
      model,

      submit,

      errorsMap,
    };
  },
});
</script>

<style lang="scss" module>
@import "./printDialog";
</style>
