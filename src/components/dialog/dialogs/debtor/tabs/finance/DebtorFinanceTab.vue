<template>
  <div
    :class="[
      $style.container,
      $style[activeTab]
    ]"
  >
    <Tabs
      v-model="activeTab"
      :tabs="tabs"
      :class="$style.tabs"
      :state="['tertiary', 'tiny']"
    />
    <div :class="$style.summaries">
      <div
        v-for="summary in summaries"
        :key="summary.key"
        :class="$style.summary"
      >
        <div :class="$style.summaryLabel">
          {{ summary.label }}
        </div>
        <div :class="$style.summaryValue">
          {{ formatMoney(summary.value, 'RUB', $i18n.locale) }}
        </div>
      </div>
    </div>
    <div :class="$style.tableWrapper">
      <ActiveTable
        key-field="id"
        :class="$style.table"
        :table-key="`debtor-finance-${activeTab}`"
        :records="records"
        :columns="columns"
        :state="['secondary', 'stripeless', 'bold']"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, toRefs,
} from 'vue';
import Tabs from '@/components/tabs/Tabs.vue';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import { Debtor } from '@/hooks/useDebtors';
import { DebtorPayload, useDialogRouteParam } from '@/hooks/useDialog';
import { ITab } from '@/components/tabs/useTabs';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { ActiveTableColumn, ActiveTableColumnFormat, useActiveTable } from '@/hooks/useActiveTable';
import { ProductionType } from '@/hooks/useConstructor';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { formatMoney } from '@/utils/string';

export default defineComponent({
  name: 'DebtorFinanceTab',
  components: { ActiveTable, Tabs },
  props: {
    debtor: Object as PropType<Debtor>,
    productionType: {
      type: String as PropType<DebtorPayload['productionType']>,
      required: true,
    },
  },
  setup(props) {
    const { debtor, productionType } = toRefs(props);
    const { t } = useLocalI18n('debtor.finance');
    type ActiveTabKey = 'accruals' | 'debts' | 'paid-ups' | 'penalties';
    const tabs = computed<Array<ITab<ActiveTabKey>>>(() => ((([
      productionType.value !== ProductionType.executive && {
        key: 'accruals',
      },
      {
        key: 'debts',
      },
      {
        key: 'paid-ups',
      },
      productionType.value !== ProductionType.executive && {
        key: 'penalties',
      },
    ] as Array<ITab<ActiveTabKey> | boolean>))
      .filter(Boolean) as Array<ITab<ActiveTabKey>>)
      .map((tab) => ({
        ...tab,
        label: t(`${tab.key}.tab`),
      })));

    const [activeTab] = useDialogRouteParam<ActiveTabKey>(
      'finance-tab',
      productionType.value === ProductionType.executive
        ? 'debts'
        : 'accruals',
      ref(true),
    );

    const {
      records,
      columns,
    } = useActiveTable<any & {id: 'id'}, any, 'id'>({
      keyField: 'id',
      async fetch({ params }) {
        if (records?.value?.length) {
          records.value = [];
        }

        const data = (({
          accruals: () => (
            debtor.value?.accruals_data.map((record, index) => ({
              id: index + 1,
              date: record.date ? new Date(record.date) : null,
              ...debtor.value?.accrual_columns.reduce((acc, key) => ({
                ...acc,
                [key]: record.parts.filter(({
                  title,
                }: any) => title === key).map(({
                  value,
                }: any) => value).reduce(
                  (a: string, c: string) => parseFloat(a) + parseFloat(c),
                  0,
                ),
              }), {}),
            })) || []
          ),
          'paid-ups': () => (
            debtor.value?.paid_ups_data.map((record, index) => ({
              id: index + 1,
              date: record.date ? new Date(record.date) : null,
              ...debtor.value?.paid_up_columns.reduce((acc, key) => ({
                ...acc,
                [key]: record.parts.filter(({
                  title,
                }: any) => title === key).map(({
                  value,
                }: any) => value).reduce(
                  (a: string, c: string) => parseFloat(a) + parseFloat(c),
                  0,
                ),
              }), {}),
            })) || []
          ),
          debts: () => (debtor.value?.debts_data || []).map((item) => ({
            ...item,
            start_date: item.start_date ? new Date(item.start_date) : null,
            end_date: item.end_date ? new Date(item.end_date) : null,
          })),
          penalties: () => (debtor.value?.penalties_data || []).map((item) => ({
            ...item,
            start_date: item.start_date ? new Date(item.start_date) : null,
          })),
        } as {
          [key in ActiveTabKey]: () => Array<any>
          // eslint-disable-next-line no-underscore-dangle
        })[params.filters!.__tab as ActiveTabKey])();
        return {
          count: data.length,
          results: data,
        };
      },
      filters: computed(() => (([
        {
          key: '__tab',
          field: '__tab',
          type: ActiveFormFieldType.input,
          defaultValue: activeTab.value,
        },
        {
          key: 'debtor_id',
          field: 'debtor_id',
          type: ActiveFormFieldType.input,
          defaultValue: debtor.value?.debtor.pk,
        },
      ] as Array<ActiveFormField<any> | boolean>)
        .filter(Boolean) as Array<ActiveFormField<any>>)),
      columns: computed(() => (((({
        accruals: [
          {
            key: 'date',
            width: '200px',
            format: ActiveTableColumnFormat.date,
          },
          ...(debtor.value as Debtor)?.accrual_columns.map((label) => ({
            key: label,
            label,
            format: ActiveTableColumnFormat.money,
          })) || [],
        ],
        'paid-ups': [
          {
            key: 'date',
            width: '200px',
            format: ActiveTableColumnFormat.date,
          },
          ...(debtor.value as Debtor)?.paid_up_columns.map((label) => ({
            key: label,
            label,
            format: ActiveTableColumnFormat.money,
          })) || [],
        ],
        debts: [
          {
            key: 'start_date',
            format: ActiveTableColumnFormat.date,
          },
          {
            key: 'end_date',
            format: ActiveTableColumnFormat.date,
          },
          {
            key: 'value',
            format: ActiveTableColumnFormat.money,
          },
        ],
        penalties: [
          {
            key: 'start_date',
            format: ActiveTableColumnFormat.date,
          },
          {
            key: 'value',
            format: ActiveTableColumnFormat.money,
          },
        ],
      } as {
        [key in ActiveTabKey]: Array<ActiveTableColumn<any>>
      })[activeTab.value]) as Array<ActiveTableColumn<any> | boolean> || [])
        .filter(Boolean) as Array<ActiveTableColumn<any>>)
        .map((column) => ({
          ...column,
          field: column.key,
          label: column.label || t(`column.${activeTab.value}.${String(column.key).split('.').pop()}`),
        }))),
    });

    const summaries = computed(() => ([
      productionType.value !== 'executive' && {
        key: 'accruals',
        label: t('summaries.accruals'),
        value: debtor.value?.accrual,
      },
      {
        key: 'paid-ups',
        label: t('summaries.paid-ups'),
        value: debtor.value?.paid_up,
      },
      {
        key: 'debt',
        label: t('summaries.debt'),
        value: debtor.value?.debt,
      },
      productionType.value !== 'executive' && {
        key: 'penalty',
        label: t('summaries.penalty'),
        value: debtor.value?.penalty,
      },
    ].filter(Boolean)));

    return {
      activeTab,
      tabs,
      records,
      columns,
      summaries,
      formatMoney,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorFinanceTab";
</style>
