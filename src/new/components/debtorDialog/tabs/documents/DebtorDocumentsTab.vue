<template>
  <div :class="$style.documents">
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
            <div :class="$style.actions" v-if="column.key === 'actions'">
              <Btn :class="$style.action" prepend-icon="eye" state="quinary" :url="document.file" target="_blank"/>
              <Btn :class="$style.action" prepend-icon="download" state="quinary" @click="downloadDocument(document.file)"/>
            </div>
            <template v-else>
              <template v-if="document[column.key]">
                <template v-if="activeTab.key === 'common' && column.key === 'file'">
                  {{document[column.key].split('/').pop()}}
                </template>
                <template v-else-if="activeTab.key === 'common' && column.key === 'document_formation_date'">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else-if="activeTab.key === 'egrn' && column.key === 'file'">
                  {{document[column.key].split('/').pop()}}
                </template>
                <template v-else-if="activeTab.key === 'egrn' && column.key === 'created_at'">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else-if="activeTab.key === 'egrnRights' && column.key === 'file'">
                  {{document[column.key].split('/').pop()}}
                </template>
                <template v-else-if="activeTab.key === 'egrnRights' && column.key === 'created_at'">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else-if="activeTab.key === 'fee' && column.key === 'file'">
                  {{document[column.key].split('/').pop()}}
                </template>
                <template v-else-if="activeTab.key === 'fee' && column.key === 'amount'">
                  {{formatMoney(document[column.key])}}
                </template>
                <template v-else>
                  {{document[column.key]}}
                </template>
              </template>
              <span v-else :class="$style.na">N/A</span>
            </template>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, inject, ref, watch} from "@vue/composition-api";
import {baseURL} from "@/settings/config";
import {formatDate} from "@/new/utils/date";
import Btn from "@/new/components/btn/Btn";
import {downloadFile} from "@/new/utils/file";
import {formatMoney} from "@/new/utils/money";

export default defineComponent({
  name: "DebtorDocumentsTab",
  components: {Btn},
  setup() {
    const data = inject('data');

    const tabs = computed(() => ([
      {
        key: 'common',
        label: 'Общий',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/documents/general_document_flow/`,
            params: {
              debtor_id: data.value.debtor.pk,
            }
          });

          return response.data;
        }
      },
      {
        key: 'homebook',
        label: 'Выписка из домовой книги',
        async fetch() {
          return [];
        }
      },
      {
        key: 'egrn',
        label: 'Выписка из ЕГРН',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/documents/extract_from_egrn/`,
            params: {
              debtor_id: data.value.debtor.pk,
            },
          });

          return response.data;
        }
      },
      {
        key: 'egrnRights',
        label: 'Выписка ЕГРН о переходе прав',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/documents/extract_from_egrn_transfer_of_rights/`,
            params: {
              debtor_id: data.value.debtor.pk,
            },
          });

          return response.data;
        }
      },
      {
        key: 'fee',
        label: 'ПП об оплате госпошлины',
        async fetch() {
          return data.value.paid_ups_data.map((record, index) => ({
            id: index + 1,
            file: null,
            amount: record.parts.reduce((acc, {value}) => acc + Number(value), 0),
            status: null,
          }))
        }
      },
      {
        key: 'judgments',
        label: 'Судебное решение',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/reference_books/court_cases_history/`,
          });

          return response.data;
        }
      },
    ]));

    const activeTab = ref(tabs.value[0]);
    const selectTab = tab => {
      activeTab.value = tab;
    }

    const columns = computed(() => ([
      ...({
        common: [
          {key: 'id', label: '№'},
          {key: 'file', label: 'Название'},
          {key: 'document_formation_date', label: 'Дата'},
          {key: 'status', label: 'Статус'},
        ],
        homebook: [
          {key: 'id', label: '№'},
          {key: 'file', label: 'Название'},
          {key: 'created_at', label: 'Дата'},
        ],
        egrn: [
          {key: 'id', label: '№'},
          {key: 'status_tracking', label: '№ заказа выписки'},
          {key: 'file', label: 'Наименование'},
          {key: 'created_at', label: 'Дата запроса'},
          {key: 'tracked_at', label: 'Дата выгрузки'},
          {key: 'status', label: 'Статус'},
          {key: 'statuses', label: 'История статусов'},
        ],
        egrnRights: [
          {key: 'id', label: '№'},
          {key: 'status_tracking', label: '№ заказа выписки'},
          {key: 'file', label: 'Наименование'},
          {key: 'created_at', label: 'Дата запроса'},
          {key: 'tracked_at', label: 'Дата выгрузки'},
          {key: 'status', label: 'Статус'},
          {key: 'statuses', label: 'История статусов'},
        ],
        fee: [
          {key: 'id', label: '№'},
          {key: 'file', label: 'Наименование'},
          {key: 'amount', label: 'Сумма оплаты'},
          {key: 'status', label: 'Статус'},
        ],
        judgments: [
          {key: 'id', label: '№'},
          {key: 'case_id', label: 'Индефикатор дела'},
          {key: 'case_number', label: '№ дела'},
          {key: 'file', label: 'Название'},
          {key: 'created_at', label: 'Дата поступления'},
          {key: 'considerated_at', label: 'Дата рассмотрения'},
          {key: 'effected_at', label: 'Дата вступления в силу'},
          {key: 'judge_full_name', label: 'ФИО судьи'},
          {key: 'status', label: 'Статус'},
          {key: 'statuses', label: 'История статусов'},
        ],
      }[activeTab.value.key] || []),
      {
        key: 'actions',
        label: ''
      }
    ]));
    const documents = ref([]);

    watch(computed(() => activeTab.value.key), async () => {
      await new Promise(requestAnimationFrame);
      try {
        documents.value = [];
        documents.value = await activeTab.value.fetch()
      } catch (e) {
        console.error('blya', e);
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

    return {
      activeTab,
      selectTab,
      tabs,

      data,

      columns,
      documents,

      formatDate,

      formatMoney,

      downloadDocument,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorDocumentsTab";
</style>
