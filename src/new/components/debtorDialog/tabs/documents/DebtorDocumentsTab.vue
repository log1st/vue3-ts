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
    <div :class="$style.controls">
      <Btn
        state="primary"
        prepend-icon="upload"
        label="Загрузить документы"
        @click="selectHousebookDocuments"
        v-if="activeTab.key === 'homebook'"
        :class="$style.control"
      />
      <Btn
        state="primary"
        prepend-icon="upload"
        label="Загрузить документы"
        @click="selectMyDocuments"
        v-if="activeTab.key === 'myDocuments'"
        :class="$style.control"
      />
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
            <div :class="$style.actions" v-if="column.key === 'actions' && !['sms'].includes(activeTab.key)">
              <Btn :class="$style.action" prepend-icon="eye" state="quinary" :url="document.file" target="_blank"/>
              <Btn :class="$style.action" prepend-icon="megaphone" state="quinary" @click="listenSound(document)" v-if="activeTab.key === 'voice'"/>
              <Btn :class="$style.action" prepend-icon="download" state="quinary" @click="downloadDocument(document.file)" v-else/>
            </div>
            <template v-else>
              <template v-if="document[column.key]">
                <template v-if="activeTab.key === 'common' && column.key === 'file'">
                  {{decodeURIComponent(document[column.key].split('/').pop())}}
                </template>
                <template v-else-if="['sms', 'voice'].includes(activeTab.key) && column.key === 'operator'">
                  <template v-if="document.operator && document.operator.name">
                    {{document.operator && document.operator.name}}
                  </template>
                  <div :class="$style.na" v-else>
                    Н/Д
                  </div>
                </template>
                <template v-else-if="activeTab.key === 'common' && column.key === 'document_formation_date'">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else-if="activeTab.key === 'egrn' && column.key === 'file'">
                  {{decodeURIComponent(document[column.key].split('/').pop())}}
                </template>
                <template v-else-if="activeTab.key === 'egrn' && column.key === 'created_at'">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else-if="activeTab.key === 'egrnRights' && column.key === 'file'">
                  {{decodeURIComponent(document[column.key].split('/').pop())}}
                </template>
                <template v-else-if="activeTab.key === 'egrnRights' && column.key === 'created_at'">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else-if="activeTab.key === 'homebook' && column.key === 'created_at'">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else-if="activeTab.key === 'homebook' && column.key === 'document_formation_date'">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else-if="activeTab.key === 'fns' && column.key.includes('date')">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else-if="activeTab.key === 'banks' && column.key.includes('date')">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else-if="activeTab.key === 'homebook' && column.key === 'file'">
                  {{decodeURIComponent(document[column.key].split('/').pop())}}
                </template>
                <template v-else-if="activeTab.key === 'myDocuments' && column.key === 'file'">
                  {{decodeURIComponent(document[column.key].split('/').pop())}}
                </template>
                <template v-else-if="activeTab.key === 'fee' && column.key === 'file'">
                  {{decodeURIComponent(document[column.key].split('/').pop())}}
                </template>
                <template v-else-if="activeTab.key === 'fee' && column.key === 'amount'">
                  {{formatMoney(document[column.key])}}
                </template>
                <template v-else-if="['sms', 'voice'].includes(activeTab.key) && column.key === 'send_at'">
                  {{formatDateTime(document[column.key])}}
                </template>
                <template v-else-if="['sms', 'voice'].includes(activeTab.key) && column.key === 'status'">
                  {{pretrialSubStatusesMap[`${activeTab.key}_${document[column.key]}`]}}
                </template>
                <template v-else-if="['executionList'].includes(activeTab.key) && column.key.includes('date')">
                  {{formatDbDate(document[column.key])}}
                </template>
                <template v-else>
                  {{document[column.key]}}
                </template>
              </template>
              <span v-else :class="$style.na">Н/Д</span>
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
import {formatDate, formatDateTime, formatDbDate} from "@/new/utils/date";
import Btn from "@/new/components/btn/Btn";
import {downloadFile} from "@/new/utils/file";
import {formatMoney} from "@/new/utils/money";
import Icon from "@/new/components/icon/Icon";
import {useDialog} from "@/new/hooks/useDialog";
import {useFileManager} from "@/new/hooks/useFileManager";
import {useDicts} from "@/new/hooks/useDicts";

export default defineComponent({
  name: "DebtorDocumentsTab",
  components: {Icon, Btn},
  setup() {
    const data = inject('data');
    const productionType = inject('productionType');
    const substatus = inject('substatus');

    const tabs = computed(() => ([
      productionType.value !== 'executive' && {
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
          const response = await axios({
            method: 'get',
            url: `${baseURL}/documents/extract_house_book/`,
            params: {
              debtor_id: data.value.debtor.pk
            }
          });

          return response.data;
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
              active: 1,
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
              active: 1,
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
            url: `${baseURL}/pretrial/debtor/${data.value.debtor.pk}/claim/`,
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
            url: `${baseURL}/pretrial/debtor/${data.value.debtor.pk}/sms/`,
          });

          return response.data.reverse();
        }
      },
      productionType.value === 'pretrial' && {
        key: 'voice',
        label: 'Голосовое оповещение',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/pretrial/debtor/${data.value.debtor.pk}/voice/`,
          });

          return response.data;
        }
      },
      productionType.value === 'executive' && {
        key: 'fns',
        label: 'ФНС',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/enforcements/executive_fns_history/`,
            params: {
              debtor_id: data.value.debtor.pk
            }
          });
          return response.data
        }
      },
      productionType.value === 'executive' && {
        key: 'banks',
        label: 'Банки',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/enforcements/executive_bank_history/`,
            params: {
              debtor_id: data.value.debtor.pk
            }
          });
          return response.data
        }
      },
      productionType.value === 'executive' && {
        key: 'executionList',
        label: 'Исполнительный лист',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/enforcements/writ_of_execution/`,
            params: {
              debtor_id: data.value.debtor.pk
            }
          });
          return response.data.results;
        }
      },
      {
        key: 'myDocuments',
        label: 'Мои документы',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/documents/debtor/`,
            params: {
              debtor_id: data.value.debtor.pk
            }
          })

          return response.data;
        }
      },
    ].filter(Boolean)));

    const activeTab = ref(substatus.value?.startsWith('statement') ? (
      tabs.value.find(({key}) => key === 'egrn')
    ) : tabs.value[0]);
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
          {key: 'created_at', label: 'Дата'},
        ],
        sms: [
          {key: 'phone_number', label: 'Телефон'},
          {key: 'status', label: 'Статус'},
          {key: 'operator', label: 'Оператор'},
          {key: 'send_at', label: 'Отправено'},
          {key: 'status_at', label: 'Статус измненен в'},
          {key: 'cost', label: 'Стоимость'},
          {key: 'message', label: 'Сообщение'},
        ],
        voice: [
          {key: 'phone_number', label: 'Телефон'},
          {key: 'status', label: 'Статус'},
          {key: 'operator', label: 'Оператор'},
          {key: 'send_at', label: 'Отправено'},
          {key: 'status_at', label: 'Статус измненен в'},
          {key: 'cost', label: 'Стоимость'},
          {key: 'payload', label: 'Переданные данные'},
        ],
        homebook: [
          {key: 'id', label: '№'},
          {key: 'file', label: 'Наименование'},
          {key: 'created_at', label: 'Дата создания'},
          {key: 'document_formation_date', label: 'Дата формирования'},
        ],
        egrn: [
          {key: 'id', label: '№'},
          {key: 'status_tracking', label: '№ заказа выписки'},
          {key: 'file', label: 'Наименование'},
          {key: 'created_at', label: 'Дата запроса'},
          // {key: 'tracked_at', label: 'Дата выгрузки'},
          // {key: 'status', label: 'Статус'},
          // {key: 'statuses', label: 'История статусов'},
        ],
        egrnRights: [
          {key: 'id', label: '№'},
          {key: 'status_tracking', label: '№ заказа выписки'},
          {key: 'file', label: 'Наименование'},
          {key: 'created_at', label: 'Дата запроса'},
          // {key: 'tracked_at', label: 'Дата выгрузки'},
          // {key: 'status', label: 'Статус'},
          // {key: 'statuses', label: 'История статусов'},
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
        fns: [
          {key: 'id', label: '№'},
          {key: 'request_id', label: 'Индефикатор запроса'},
          {key: 'document_title', label: 'Наименование'},
          {key: 'request_date', label: 'Дата запроса'},
          {key: 'response_date', label: 'Дата ответа'},
          {key: 'tax_inspector_full_name', label: 'ФИО инспектора'},
          {key: 'status_current', label: 'Статус'},
          {key: 'status_history', label: 'История статусов'},
        ],
        banks: [
          {key: 'id', label: '№'},
          {key: 'request_id', label: 'Индефикатор запроса'},
          {key: 'bank_name', label: 'Название Банка'},
          {key: 'request_date', label: 'Дата запроса'},
          {key: 'response_date', label: 'Дата ответа'},
          {key: 'status_current', label: 'Статус'},
          {key: 'status_history', label: 'История статусов'},
        ],
        executionList: [
          {key: 'id', label: '№'},
          {key: 'case_number', label: '№ дела'},
          {key: 'initiation_date', label: 'Дата возбуждения ИП'},
          {key: 'completion_termination_date', label: 'Дата окончания ИП'},
          {key: 'termination_ground', label: 'Основания прекращения'},
          {key: 'bailiff_full_name', label: 'ФИО судебного пристава'},
          {key: 'bailiff_email', label: 'Контакты пристава'},
          {key: 'status_current', label: 'Статус'},
        ],
        myDocuments: [
          {key: 'id', label: '№'},
          {key: 'file', label: 'Наименование'},
        ],
      }[activeTab.value.key] || []),
      {
        key: 'actions',
        label: ''
      }
    ]));

    const isLoading = ref(false);
    const documents = ref([]);

    const fetch = async () => {
      isLoading.value = true;
      await new Promise(requestAnimationFrame);
      try {
        documents.value = [];
        documents.value = await activeTab.value.fetch()
      } catch (e) {
        //
      }
      isLoading.value = false;
    }

    watch(computed(() => activeTab.value.key), fetch, {
      immediate: true,
    });

    watch(computed(() => data.value.debtor.pk), fetch, {
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

    const listenSound = (document) => {
      const {name = 'Голосовое уведомление', file} = document;
      showDialog({
        component: 'listenFile',
        payload: {
          title: name,
          file,
        }
      })
    }

    const {
      files: housebookDocuments,
      selectFiles: selectHousebookDocuments,
    } = useFileManager({
      multiple: true,
      accept: ['application/pdf']
    })

    watch(housebookDocuments, async files => {
      try {
        await Promise.all(files.map(async file => {
          const payload = new FormData();
          payload.append('file', file);
          payload.append('debtor', data.value.debtor.pk);
          payload.append('production_type', productionType.value);
          payload.append('document_formation_date', (new Date).toISOString());
          payload.append('can_be_attached', 'true');
          await axios({
            method: 'post',
            url: `${baseURL}/documents/extract_house_book/`,
            data: payload,
          })
        }))
      } catch (e) {

      } finally {
        await fetch()
      }
    }, {
      deep: true,
    })

    const {
      files: myDocuments,
      selectFiles: selectMyDocuments,
    } = useFileManager({
      multiple: true,
    })

    watch(myDocuments, async files => {
      try {
        await Promise.all(files.map(async file => {
          const payload = new FormData();
          payload.append('file', file);
          payload.append('debtor', data.value.debtor.pk);
          payload.append('production_type', productionType.value);
          await axios({
            method: 'post',
            url: `${baseURL}/documents/debtor/`,
            data: payload,
          })
        }))
      } catch (e) {

      } finally {
        await fetch()
      }
    }, {
      deep: true,
    });

    const {pretrialSubStatusesMap} = useDicts();

    return {
      selectHousebookDocuments,
      selectMyDocuments,

      activeTab,
      selectTab,
      tabs,

      data,

      isLoading,
      columns,
      documents,

      formatDate,
      formatDateTime,
      formatDbDate,

      formatMoney,

      downloadDocument,
      listenSound,

      pretrialSubStatusesMap,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorDocumentsTab";
</style>
