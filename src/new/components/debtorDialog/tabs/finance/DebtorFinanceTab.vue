<template>
  <div :class="$style.documents">
    <div :class="$style.summaries">
      <div :class="$style.summary" v-for="summary in summaries" :key="summary.label">
        <div :class="$style.summaryLabel">{{summary.label}}</div>
        <div :class="$style.summaryValue">{{formatMoney(summary.value)}}</div>
      </div>
    </div>
    <div :class="$style.tabs">
      <div :class="[
        $style.tab,
        activeTab.key === tab.key && $style.activeTab
      ]" v-for="tab in tabs" :key="tab.key" @click="selectTab(tab)">
        {{tab.label}}
      </div>
    </div>
    <div :class="$style.content">
      <table :class="$style.table">
        <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{column.label}}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="document in documents" :key="document.id">
          <td v-for="column in columns" :key="column.key">
            <template v-if="['start_date', 'end_date', 'date'].includes(column.key)">
              <template v-if="document[column.key]">
                {{formatDbDate(document[column.key])}}
              </template>
              <template v-else>
                <span :class="$style.na">N/A</span>
              </template>
            </template>
            <template v-else-if="activeTab.key === 'accruals' && column.key !== 'date'">
              {{formatMoney(document[column.key])}}
            </template>
            <template v-else-if="activeTab.key === 'paidUps' && column.key !== 'date'">
              {{formatMoney(document[column.key])}}
            </template>
            <template v-else-if="activeTab.key === 'debts' && column.key === 'value'">
              {{formatMoney(document[column.key])}}
            </template>
            <template v-else-if="activeTab.key === 'penalties' && column.key === 'value'">
              {{formatMoney(document[column.key])}}
            </template>
            <template v-else-if="document[column.key] || document[column.key] === 0">
              {{document[column.key]}}
            </template>
            <span v-else :class="$style.na">Н/Д</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, inject, ref, watch} from "@vue/composition-api";
import {formatDate, formatDbDate} from "@/new/utils/date";
import Btn from "@/new/components/btn/Btn";
import {downloadFile} from "@/new/utils/file";
import {formatMoney} from "@/new/utils/money";

export default defineComponent({
  name: "DebtorFinanceTab",
  components: {Btn},
  setup() {
    const data = inject('data');
    const productionType = inject('productionType');

    const tabs = computed(() => ([
      productionType.value !== 'executive' && {
        key: 'accruals',
        label: 'Начислено',
        async fetch() {
          return data.value.accruals_data.map((record, index) => ({
            id: index + 1,
            date: record.date,
            ...(data.value.accrual_columns || []).reduce((acc, key) => ({
              ...acc,
              [key]: record.parts.filter(({title}) => title === key).map(({value}) => value).reduce((a, c) => parseFloat(a) + parseFloat(c), 0)
            }), {}),
          }))
        }
      },
      productionType.value === 'executive' && {
        key: 'debts',
        label: 'Общая сумма задолженности',
        async fetch() {
          return data.value.debts_data;
        }
      },
      {
        key: 'paidUps',
        label: 'Оплачено',
        async fetch() {
          return data.value.paid_ups_data.map((record, index) => ({
            id: index + 1,
            date: record.date,
            ...(data.value.paid_up_columns || []).reduce((acc, key) => ({
              ...acc,
              [key]: record.parts.filter(({title}) => title === key).map(({value}) => value).reduce((a, c) => parseFloat(a) + parseFloat(c), 0)
            }), {}),
          }));
        }
      },
      productionType.value !== 'executive' && {
        key: 'debts',
        label: 'Задолженность',
        async fetch() {
          return data.value.debts_data;
        }
      },
      productionType.value !== 'executive' && {
        key: 'penalties',
        label: 'Пеня',
        async fetch() {
          return data.value.penalties_data;
        }
      },
    ].filter(Boolean)));

    const activeTab = ref(tabs.value[0]);
    const selectTab = tab => {
      activeTab.value = tab;
    }

    const columns = computed(() => ([
      ...({
        accruals: [
          {key: 'date', label: 'Дата'},
          ...(data.value.accrual_columns || []).map(label => ({
            key: label,
            label,
          })),
        ],
        paidUps: [
          {key: 'date', label: 'Месяц оплаты'},
          ...(data.value.paid_up_columns || []).map(label => ({
            key: label,
            label,
          })),
        ],
        debts: [
          {key: 'start_date', label: 'Начало просрочки'},
          {key: 'end_date', label: 'Конец просрочки'},
          {key: 'value', label: 'Задолженность'},
        ],
        penalties: [
          {key: 'start_date', label: 'Начало просрочки'},
          {key: 'value', label: 'Пеня'},
        ],
      }[activeTab.value.key] || []),
    ]));
    const documents = ref([]);

    watch(computed(() => activeTab.value.key), async () => {
      await new Promise(requestAnimationFrame);
      try {
        documents.value = [];
        documents.value = await activeTab.value.fetch()
      } catch (e) {
        //
      }
    }, {
      immediate: true,
    });

    watch(computed(() => data.value.debtor.pk), async () => {
      await new Promise(requestAnimationFrame);
      try {
        documents.value = [];
        documents.value = await activeTab.value.fetch()
      } catch (e) {
        //
      }
    }, {
      immediate: true,
    });

    const downloadDocument = (file) => {
      downloadFile({
        url: file,
        name: file.split('/').pop()
      })
    }

    const summaries = computed(() => (
      [
        productionType.value !== 'executive' && {label: 'Начислено', value: data.value.accrual},
        {label: 'Оплачено', value: data.value.paid_up},
        {label: 'Задолженность', value: data.value.debt},
        productionType.value !== 'executive' && {label: 'Пеня', value: data.value.penalty},
      ].filter(Boolean)
    ));

    const onceAmount = computed(() => data.value.total_recalculations)

    return {
      onceAmount,

      activeTab,
      selectTab,
      tabs,

      data,

      columns,
      documents,

      formatDate,
      formatDbDate,

      formatMoney,

      downloadDocument,

      summaries,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorFinanceTab";
</style>
