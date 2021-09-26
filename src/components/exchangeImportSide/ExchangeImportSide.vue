<template>
  <div :class="$style.side">
    <div :class="$style.title">
      {{ t('side.description') }}
    </div>
    <div
      v-if="dataType !== 'executive'"
      :class="$style.template"
    >
      <div :class="$style.label">
        {{ t('side.tableTemplate') }}
      </div>
      <ExchangeTemplates
        :class="$style.templates"
        :templates="tableTemplates"
      />
    </div>
    <div :class="$style.template">
      <div :class="$style.label">
        {{ t('side.linearTemplate') }}
      </div>
      <ExchangeTemplates
        :class="$style.templates"
        :templates="linearTemplates"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import ExchangeTemplates from '@/components/exchangeTemplates/ExchangeTemplates.vue';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { ExchangeTemplate } from '@/components/exchangeTemplates/useExchangeTemplates';
import { useLayout } from '@/hooks/useLayout';
import { ImportFileTemplate } from '@/store/modules/layout';
import { DebtorsDataTypeKey } from '@/hooks/useExchange';

export default defineComponent({
  name: 'ExchangeImportSide',
  components: { ExchangeTemplates },
  props: {
    dataType: {
      type: String as PropType<DebtorsDataTypeKey>,
      required: true,
    },
  },
  setup(props) {
    const {
      t,
    } = useLocalI18n('exchange.import.form');

    const { t: commonT } = useI18n();
    const {
      settings,
    } = useLayout();

    const tableTemplates = computed<Array<ExchangeTemplate>>(() => ([
      ImportFileTemplate.csv,
      ImportFileTemplate.xls,
      ImportFileTemplate.xlsx,
    ].map((key) => ({
      key,
      label: commonT(`file.${key}`),
      url: settings.value.importFilesTemplates[props.dataType].table[key],
    }))));

    const linearTemplates = computed<Array<ExchangeTemplate>>(() => ([
      ImportFileTemplate.csv,
      ImportFileTemplate.xls,
      ImportFileTemplate.xlsx,
    ].map((key) => ({
      key,
      label: commonT(`file.${key}`),
      url: settings.value.importFilesTemplates[props.dataType].linear[key],
    }))));

    return {
      t,
      tableTemplates,
      linearTemplates,
    };
  },
});
</script>

<style lang="scss" module>
@import "./exchangeImportSide";
</style>
