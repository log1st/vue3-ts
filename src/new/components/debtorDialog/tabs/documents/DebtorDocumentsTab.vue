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
      <Icon v-if="isLoading" icon="loader" spin :class="$style.loader"/>
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
              <Btn :class="$style.action" prepend-icon="megaphone" state="quinary" @click="listenSound(document)" v-if="activeTab === 'voice'"/>
              <Btn :class="$style.action" prepend-icon="download" state="quinary" @click="downloadDocument(document.file)" v-else/>
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
import {computed, defineComponent, inject, onMounted, ref, watch} from "@vue/composition-api";
import {baseURL} from "@/settings/config";
import {formatDate} from "@/new/utils/date";
import Btn from "@/new/components/btn/Btn";
import {downloadFile} from "@/new/utils/file";
import {formatMoney} from "@/new/utils/money";
import Icon from "@/new/components/icon/Icon";
import {useDialog} from "@/new/hooks/useDialog";

export default defineComponent({
  name: "DebtorDocumentsTab",
  components: {Icon, Btn},
  setup() {
    const data = inject('data');
    const productionType = inject('productionType');

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
      productionType.value === 'judicial' && {
        key: 'homebook',
        label: 'Выписка из домовой книги',
        async fetch() {
          return [];
        }
      },
      productionType.value === 'judicial' && {
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
      productionType.value === 'judicial' && {
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
      productionType.value === 'judicial' && {
        key: 'fee',
        label: 'ПП об оплате госпошлины',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/judicial/debtor/${data.value.debtor.pk}/payments/`,
          });

          return response.data.results;
        }
      },
      productionType.value === 'judicial' && {
        key: 'judgments',
        label: 'Судебное решение',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/judicial/debtor/${data.value.debtor.pk}/decisions/`,
          });

          return response.data.results;
        }
      },
      productionType.value === 'pretrial' && {
        key: 'pretrials',
        label: 'Досудебное требование',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/pretrial/claim/debtor/${data.value.debtor.pk}/`,
          });

          return response.data.results;
        }
      },
      productionType.value === 'pretrial' && {
        key: 'sms',
        label: 'Уведомления',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/pretrial/sms/debtor/${data.value.debtor.pk}/`,
          });

          return response.data.results;
        }
      },
      productionType.value === 'pretrial' && {
        key: 'voice',
        label: 'Голосовое оповещение',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/pretrial/voice/debtor/${data.value.debtor.pk}/`,
          });

          return response.data.results;
        }
      },
    ].filter(Boolean)));

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
        pretrials: [
          {key: 'id', label: '№'},
          {key: 'file', label: 'Название'},
          {key: 'document_formation_date', label: 'Дата'},
          {key: 'status', label: 'Статус'},
        ],
        sms: [
          {key: 'phone_number', label: 'Телефон'},
          {key: 'status_text', label: 'Статус'},
          {key: 'operator', label: 'Оператор'},
          {key: 'send_at', label: 'Отправено'},
          {key: 'status_at', label: 'Статус измненен в'},
          {key: 'cost', label: 'Стоимость'},
          {key: 'message', label: 'Сообщение'},
        ],
        voice: [
          {key: 'phone_number', label: 'Телефон'},
          {key: 'status_text', label: 'Статус'},
          {key: 'operator', label: 'Оператор'},
          {key: 'send_at', label: 'Отправено'},
          {key: 'status_at', label: 'Статус измненен в'},
          {key: 'cost', label: 'Стоимость'},
          {key: 'payload', label: 'Переданные данные'},
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

    const isLoading = ref(false);
    const documents = ref([]);

    watch(computed(() => activeTab.value.key), async () => {
      isLoading.value = true;
      await new Promise(requestAnimationFrame);
      try {
        documents.value = [];
        documents.value = await activeTab.value.fetch()
      } catch (e) {
        //
      }
      isLoading.value = false;
    }, {
      immediate: true,
    });

    const downloadDocument = (file) => {
      downloadFile({
        url: file,
        name: file.split('/').pop()
      })
    }

    const {
      showDialog,
    } = useDialog();

    const listenSound = ({name, file}) => {
      showDialog({
        component: 'listenFile',
        payload: {
          title: name,
          file,
        }
      })
    }

    watch(activeTab, (tab) => {
      if(tab.key === 'voice' && (productionType.value === 'pretrial')) {
        listenSound({
          name: 'Test file',
          file: 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3'
        })
      }
    }, {
      immediate: true,
    })

    return {
      activeTab,
      selectTab,
      tabs,

      data,

      isLoading,
      columns,
      documents,

      formatDate,

      formatMoney,

      downloadDocument,
      listenSound,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorDocumentsTab";
</style>
