<template>
  <form
    :class="[
      $style.dialog,
      $style.default
    ]"
    @submit.prevent="submit"
  >
    <div :class="$style.header">
      <Icon
        :class="$style.icon"
        icon="egrn-excerpt"
      />
      <div :class="$style.caption">
        {{ t('title') }}
      </div>
    </div>
    <div :class="$style.disclaimer">
      {{ t('disclaimer') }}
    </div>
    <div :class="$style.fields">
      <Checkbox
        v-for="field in ['data', 'rights']"
        :key="field"
        v-model="model[field]"
        :class="$style.field"
      >
        <template #label>
          <div :class="$style.label">
            {{ t(`field.${field}`) }} - <b>{{ $i18n.t('other.currencyPerItem', {amount: 10}) }}</b>
          </div>
        </template>
      </Checkbox>
      <Checkbox
        v-model="model.force"
        :class="[$style.force, $style.field]"
        :label="t('force')"
      />
    </div>
    <div :class="$style.attention">
      <div :class="$style.attentionTitle">
        {{ t('attention.title') }}
      </div>
      <div :class="$style.attentionText">
        {{ t('attention.text') }}
      </div>
    </div>
    <Btn
      :class="$style.submit"
      :label="t('submit')"
      type="submit"
    />
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref,
} from 'vue';
import { EgrnPayload } from '@/hooks/useDialog';
import Icon from '@/components/icon/Icon.vue';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import Btn from '@/components/btn/Btn.vue';
import {
  RosreestrStatusLocalModel,
  RosreestrStatusModelType,
  useRosreestr,
} from '@/hooks/useRosreestr';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { IToastLevel, useToast } from '@/hooks/useToast';
import { useSocket } from '@/hooks/useSocket';
import { SocketSubscriber } from '@/store/modules/socket';
import { SignalType, useSignal } from '@/hooks/useSignal';

export default defineComponent({
  name: 'EgrnDialog',
  components: { Btn, Checkbox, Icon },
  props: {
    productionType: {
      type: String as PropType<EgrnPayload['productionType']>,
      required: true,
    },
    debtorIds: {
      type: Array as PropType<EgrnPayload['debtorIds']>,
      required: true,
    },
  },
  emits: ['close', 'hide'],
  setup(props, { emit }) {
    const { t } = useLocalI18n('egrn');

    const { companyId } = useDefaultCompany();

    const {
      extractFromEgrn,
    } = useRosreestr();

    const model = ref<RosreestrStatusLocalModel>({
      data: false,
      force: false,
      rights: false,
    });

    const {
      showToast,
    } = useToast();

    const {
      subscribe,
    } = useSocket();

    const {
      awaitSignalResponse,
    } = useSignal();

    const maxProgress = ref(0);
    const currentProgress = ref(0);

    const progressbars = computed(() => ([
      {
        key: 'progress',
        label: 'egrn.toast.progress',
        max: maxProgress.value,
        current: currentProgress.value,
      },
    ]));

    const submit = async () => {
      const filters = await awaitSignalResponse<Record<any, any>>(
        SignalType.getDebtorFilters,
        SignalType.debtorFilters,
      );

      const { status, response } = await extractFromEgrn({
        company_id: companyId.value!,
        ...props.debtorIds?.length ? {
          debtor_ids: props.debtorIds,
        } : {
          filters: filters || {},
        },
        type: ([
          model.value.data && RosreestrStatusModelType.data,
          model.value.rights && RosreestrStatusModelType.rights,
        ] as Array<RosreestrStatusModelType | boolean>)
          .filter(Boolean) as Array<RosreestrStatusModelType>,
        force: model.value.force,
        production_type: props.productionType,
      });

      if (status) {
        maxProgress.value = 0;
        currentProgress.value = 0;

        emit('hide');

        const hideToast = await showToast({
          message: 'egrn.toast.message',
          level: IToastLevel.info,
          duration: null,
          progressbars,
        });

        const unsub = await subscribe({
          condition: (payload) => (
            (
              payload.action === 'progress_event'
              && payload.data.event === `rosreestr/status/${response.id}/`
            ) || (
              payload.action === 'model_event'
              && payload.data.model === 'rosreestr/status/update'
              && payload.data.obj.id === response.id
            )
          ),
          async handler(payload) {
            if (payload.action === 'progress_event') {
              maxProgress.value = payload.data.progress.total;

              if (currentProgress.value !== maxProgress.value) {
                currentProgress.value = payload.data.progress.step;
              }
            } else {
              currentProgress.value = maxProgress.value;

              const { stats } = payload?.data?.obj || {};

              if (stats) {
                await showToast({
                  message: 'egrn.toast.success',
                  level: IToastLevel.success,
                  duration: 5000,
                });
              } else {
                await showToast({
                  message: 'egrn.toast.failure',
                  level: IToastLevel.danger,
                  duration: 5000,
                });
              }

              hideToast();
              unsub();

              emit('close');
            }
          },
        } as SocketSubscriber);
      } else {
        await showToast({
          message: t('toast.failure'),
          level: IToastLevel.danger,
          duration: 5000,
        });
        emit('close');
      }
    };

    return {
      t,
      model,
      submit,
    };
  },
});
</script>

<style lang="scss" module>
@import "./egrnDialog";
</style>
