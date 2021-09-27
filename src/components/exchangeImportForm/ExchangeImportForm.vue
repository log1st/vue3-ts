<template>
  <form
    :class="$style.wrapper"
    @submit.prevent="submit"
  >
    <div :class="$style.title">
      {{ t(`title.${dataType}`) }}
    </div>
    <div :class="$style.content">
      <div
        :class="$style.form"
      >
        <div :class="$style.header">
          <SelectInput
            v-if="model.mode === 'table'"
            v-model="model.year"
            :class="[$style.headerYear]"
            :options="years"
            :allow-empty="false"
            :state="['primary', 'white']"
          />
          <div :class="[$style.headerTab, $style.active]">
            {{ t('upload') }}
          </div>
          <div :class="$style.headerTab">
            {{ t('integration') }}
          </div>
        </div>
        <template v-if="isCustom">
          <Tabs
            v-model="model.mode"
            :tabs="modes"
            :class="$style.modes"
            state="tertiary"
          />
          <div
            v-if="model.mode === 'table'"
            :class="$style.periods"
          >
            <Checkbox
              v-for="period in periods"
              :key="period.key"
              v-model="model.period"
              :true-value="period.key"
              :false-value="period.key"
              :label="period.label"
              :class="$style.period"
              state="primary"
            />
          </div>
        </template>
        <div :class="$style.filesWrapper">
          <div
            :class="[
              $style.files,
              $style[model.period]
            ]"
            @drop.prevent="dropFiles"
            @dragover.prevent="showDropZone"
            @dragleave.prevent="hideDropZone"
          >
            <div
              v-if="isDropzoneVisible"
              :class="$style.dropZone"
            >
              <Icon
                icon="files"
                :class="$style.dropZoneIcon"
              />
              <div :class="$style.dropZoneLabel">
                {{ t('dropZone') }}
              </div>
            </div>
            <FileField
              v-for="(file, index) in model.files"
              :key="file.key"
              v-model:file="file.file"
              v-model:name="file.name"
              is-editing
              :with-name="false"
              drop-zone
              :class="$style.file"
              @remove="removeFile(index)"
            >
              <template
                v-if="model.period === 'monthly'"
                #label
              >
                {{
                  formatDate(
                    new Date((new Date()).setMonth(index)),
                    $i18n.locale,
                    {month: 'long'}
                  )
                }}
              </template>
            </FileField>
            <FileField
              v-if="model.period === 'all'"
              key="add"
              is-creator
              is-editing
              drop-zone
              is-multiple
              :class="$style.file"
              @create="addFiles"
            />
          </div>
        </div>
      </div>
      <div :class="$style.side">
        <ExchangeImportSide
          v-if="['judicial', 'pretrial', 'executive'].includes(dataType)"
          :data-type="dataType"
          :class="$style.side"
        />
        <Btn
          type="submit"
          state="primary"
          :label="t('submit')"
          :class="$style.submit"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  PropType,
  Ref,
  ref,
  toRefs,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { DataTypeKey } from '@/hooks/useExchange';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import ExchangeImportSide from '@/components/exchangeImportSide/ExchangeImportSide.vue';
import SelectInput from '@/components/selectInput/SelectInput.vue';
import {
  ExchangeImportMode,
  ExchangeImportPeriod,
  ExchangeImportRequest,
  useExchangeImport,
} from '@/hooks/useExchangeImport';
import { ISelectInput } from '@/components/selectInput/useSelectInput';
import Tabs from '@/components/tabs/Tabs.vue';
import { ITabs } from '@/components/tabs/useTabs';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import FileField from '@/components/documentField/DocumentField.vue';
import { formatDate } from '@/utils/date';
import { useToggle } from '@/hooks/useToggle';
import { convertFileToBase64 } from '@/hooks/useFileManager';
import Icon from '@/components/icon/Icon.vue';
import Btn from '@/components/btn/Btn.vue';
import { Company, CompanySettings } from '@/hooks/useCompanies';
import { IToastLevel, IToastProgressbar, useToast } from '@/hooks/useToast';

export default defineComponent({
  name: 'ExchangeImportForm',
  components: {
    Btn,
    Icon,
    FileField,
    Checkbox,
    Tabs,
    SelectInput,
    ExchangeImportSide,
  },
  props: {
    dataType: {
      type: String as PropType<DataTypeKey>,
      required: true,
    },
  },
  setup(props) {
    const companyId = inject<Ref<Company['id']>>('companyId');
    const regionId = inject<Ref<CompanySettings['default_region']>>('regionId');
    const { dataType } = toRefs(props);
    const {
      t,
    } = useLocalI18n('exchange.import.form');
    const {
      t: localT,
    } = useI18n();

    const isCustom = computed(() => ([
      DataTypeKey.judicial,
      DataTypeKey.executive,
      DataTypeKey.pretrial,
    ].includes(dataType.value)));

    const now = (new Date()).getFullYear() - 1;
    const model = ref<ExchangeImportRequest>({
      year: now - 1,
      dataType: props.dataType,
      mode: ExchangeImportMode.table,
      period: ExchangeImportPeriod.all,
      files: [],
      companyId: companyId?.value || null,
      regionId: regionId?.value || null,
      module: null,
    });
    watch(computed(() => companyId?.value || null), (id) => {
      model.value.companyId = id;
    }, {
      immediate: true,
    });
    watch(computed(() => regionId?.value || null), (id) => {
      model.value.regionId = id;
    }, {
      immediate: true,
    });

    const getEmptyMonthlyFiles = (): (typeof model.value)['files'] => (
      Array(12).fill(null).map((i, index) => ({
        key: index,
        file: null,
        name: null,
      }))
    );

    watch(isCustom, (value) => {
      model.value.files = [];
      if (!value) {
        model.value.mode = ExchangeImportMode.linear;
        model.value.period = ExchangeImportPeriod.all;
      }

      model.value.module = value ? ({
        [DataTypeKey.pretrial]: 1,
        [DataTypeKey.judicial]: 2,
        [DataTypeKey.executive]: 3,
      } as any)[dataType.value] : null;
    }, {
      immediate: true,
    });
    watch(computed(() => model.value.mode), (mode) => {
      if (mode === ExchangeImportMode.linear) {
        model.value.period = ExchangeImportPeriod.all;
      }
    });
    watch(computed(() => model.value.period), (period) => {
      if (period === ExchangeImportPeriod.all) {
        model.value.files = [];
      } else {
        model.value.files = getEmptyMonthlyFiles();
      }
    });
    watch(dataType, (type) => {
      model.value.dataType = type;
      model.value.files = [];
    }, {
      immediate: true,
    });

    const years = ref<ISelectInput<any>['options']>(
      Array(11).fill(null).map((i, index) => ({
        value: now - index - 1,
        label: localT('other.year', { year: now - index }),
      })),
    );

    const modes = ref<ITabs<any>['tabs']>([
      ExchangeImportMode.table,
      ExchangeImportMode.linear,
    ].map((key) => ({
      key,
      label: t(`mode.${key}`),
    })));

    const periods = ref<ITabs<any>['tabs']>([
      ExchangeImportPeriod.monthly,
      ExchangeImportPeriod.all,
    ].map((key) => ({
      key,
      label: t(`period.${key}`),
    })));

    const addFiles = (files: Array<{file: string; name: string}>) => {
      model.value.files.push(
        ...files.map((file, index) => ({
          key: model.value.files.length + index,
          ...file,
        })),
      );
    };

    const removeFile = (index: number) => {
      model.value.files.splice(
        index,
        1,
        ...(
          model.value.period === ExchangeImportPeriod.monthly ? [{
            key: index,
            file: null,
            name: null,
          }] : []
        ),
      );
    };

    const [isDropzoneVisible] = useToggle();
    const showDropZone = () => {
      isDropzoneVisible.value = true;
    };
    const hideDropZone = () => {
      isDropzoneVisible.value = false;
    };

    const dropFiles = async (e: DragEvent) => {
      addFiles(
        await Promise.all(
          Array.from(e.dataTransfer?.files || []).map(async (file) => ({
            file: await convertFileToBase64(file),
            name: file.name,
          })),
        ),
      );
    };

    const {
      uploadData,
      uploadMetrics,
    } = useExchangeImport();

    const {
      showToast,
    } = useToast();
    const progressbars = computed<Array<IToastProgressbar>>(() => ([
      {
        key: 'uploading',
        label: 'exchange.import.form.toast.submit.progresses.uploading',
        current: uploadMetrics.value.uploaded,
        max: uploadMetrics.value.uploading,
      },
      {
        key: 'uploading',
        label: 'exchange.import.form.toast.submit.progresses.checking',
        current: uploadMetrics.value.checked,
        max: uploadMetrics.value.uploading,
      },
    ]));

    const unsubs: Array<() => void> = [];
    onBeforeUnmount(() => {
      unsubs.forEach((unsub) => unsub());
    });
    const submit = async () => {
      if (!model.value.regionId) {
        await showToast({
          message: 'exchange.import.form.noRegion',
          level: IToastLevel.danger,
        });
        return;
      }
      const hideToast = await showToast({
        message: 'exchange.import.form.toast.submit.message',
        progressbars,
        level: IToastLevel.info,
        duration: null,
      });
      unsubs.push(hideToast);
      await uploadData(model.value);
      const timeout = setTimeout(() => {
        hideToast();
        unsubs.splice(unsubs.findIndex((i) => i === hideToast), 1);
      }, 2000);
      unsubs.push(() => {
        clearTimeout(timeout);
      });
      model.value.files = model.value.period === ExchangeImportPeriod.monthly
        ? getEmptyMonthlyFiles()
        : [];
    };

    return {
      t,
      submit,
      model,
      years,
      modes,
      periods,
      isCustom,

      addFiles,
      removeFile,

      formatDate,

      isDropzoneVisible,
      showDropZone,
      hideDropZone,
      dropFiles,
    };
  },
});
</script>

<style lang="scss" module>
@import "./exchangeImportForm";
</style>
