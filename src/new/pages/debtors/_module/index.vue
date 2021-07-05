<template>
  <div :class="$style.module">
    <ActiveTable
      :class="$style.table"
      :columns="columns"
      :is-loading="isFetching"
      is-selectable
      selectable-column="status"
      summaries-label="personal_account"
      :summaries="summaries"
      :summaries-fields="summariesFields"
      :records="records"
      :sort.sync="sort"
      :actions="actions"
      :context-actions="contextActions"
      :total="total"
      :limit.sync="limit"
      :page.sync="page"
      :filters="filters"
      :filters-model.sync="filtersModel"
      @reset="resetSettings"
      @rowClick="showDebtorDialog"
      :table-key="type"
      :key="type"
    >
      <template #cell(status)="{record, index}">
        <template v-if="module === 'judicial'">
          <DebtorStatus
            type="judicial"
            v-if="record.debtor && record.debtor.debtor_status.length"
            :class="$style.status"
            :status="record.debtor.debtor_status[0]"
            @click="showStatusDialog({ selectedItem: record.debtor.debtor_status[0].id })"
          />
        </template>
        <template v-else-if="module === 'pretrial'">
          <DebtorStatus
            type="pretrial"
            v-if="record.debtor && record.debtor.pretrial_status.length"
            :class="$style.status"
            :status="record.debtor.pretrial_status[0]"
            @click="showStatusDialog({ selectedItem: record.debtor.pretrial_status[0].id })"
          />
        </template>
        <span/>
      </template>
      <template #cell(phone_number)="{record, index}">
        {{record.debtor_main_profile.phone_number}}
      </template>
      <template #cell(personal_account)="{record, index}">
        <div :class="$style.account">
          <div :class="$style.accountInfo">
            <div :class="$style.accountNumber">{{record.debtor.personal_account}}</div>
            <div :class="$style.accountStars" v-if="false">
              <Rating :model-value="record.tmp.rating"/>
            </div>
          </div>
          <div v-if="record.debtor.debtor_status && record.debtor.debtor_status.length" :class="[
            $style.accountIcons,
            record.debtor.debtor_status[0].length > 1 && $style.accountIconsDense
          ]">
            <template v-if="module === 'judicial'">
              <TooltipWrapper
                v-for="substatus in record.substatuses"
                :key="substatus"
                :text="judicialSubStatusesMap[substatus]"
                v-if="['fees_paid', 'statement_ordered', 'fees_await_paid'].includes(substatus)"
              >
                <Icon
                  :class="[
                  $style.accountIcon,
                  $style[`accountIcon${{
                    fees_paid: 'Green',
                    statement_ordered: 'Blue',
                    fees_await_paid: 'Green',
                  }[substatus]}`]
                ]"
                  :icon="{
                  fees_paid: 'coins',
                  statement_ordered: 'egrn-excerpt',
                  fees_await_paid: 'coins',
                }[substatus]"
                />
              </TooltipWrapper>
            </template>
            <template v-else-if="module === 'pretrial' && !!record.debtor.pretrial_status">
              <TooltipWrapper
                v-for="substatus in record.pretrial_substatuses"
                :key="substatus"
                :text="pretrialSubStatusesMap[substatus]"
                v-if="['court'].includes(substatus)"
              >
                <Icon
                  :class="[
                  $style.accountIcon,
                  $style[`accountIcon${{
                    court: 'Green',
                  }[substatus]}`]
                ]"
                  :icon="{
                    court: 'court',
                  }[substatus]"
                />
              </TooltipWrapper>
            </template>
          </div>
        </div>
      </template>
      <template #cell(full_name)="{record}">
        {{record.debtor_main_profile.full_name}}
      </template>
      <template #cell(address)="{record}">
        {{record.clean_address || record.debtor_main_profile.address}}
      </template>
      <template #cell(accrual)="{record}">
        {{formatMoney(record.accrual)}}
      </template>
      <template #cell(paid_up)="{record}">
        {{formatMoney(record.paid_up)}}
      </template>
      <template #cell(debt)="{record}">
        {{formatMoney(record.debt)}}
      </template>
      <template #cell(total_debt)="{record}">
        {{formatMoney(record.total_debt)}}
      </template>
      <template #cell(penalty)="{record}">
        {{formatMoney(record.penalty)}}
      </template>
      <template #cell(fee)="{record}" v-if="type === 'judicial'">
        {{formatMoney(record.fee)}}
      </template>
      <template #cell(started_at)="{record}" v-if="type === 'executive'">
        <template v-if="record.started_at">
          {{formatDate(record.started_at)}}
        </template>
        <template v-else>
          <div :class="$style.na">
            N/A
          </div>
        </template>
      </template>
      <template #cell(ended_at)="{record}" v-if="type === 'executive'">
        <template v-if="record.ended_at">
          {{formatDate(record.ended_at)}}
        </template>
        <template v-else>
          <div :class="$style.na">
            N/A
          </div>
        </template>
      </template>
      <template v-for="field in summariesFields" :slot="`summary(${field})`" slot-scope="{value}">
        {{formatMoney(value)}}
      </template>
      <template #action(settings)="{isActive, close}">
        <template v-if="type === 'judicial'">
          <JudicialDebtorsAutomatizingDialog v-if="isActive" @close="close"/>
        </template>
        <template v-if="type === 'pretrial'">
          <PretrialDebtorsAutomatizingDialog v-if="isActive" @close="close"/>
        </template>
      </template>
    </ActiveTable>
  </div>
</template>

<script>
import {computed, defineComponent, onBeforeUnmount, ref, watch} from "@vue/composition-api";
import {formatFiltersModelToRequest, useActiveTable} from "@/new/components/activeTable/useActiveTable";
import ActiveTable from "@/new/components/activeTable/ActiveTable";
import axios from "axios";
import {baseURL} from "@/settings/config";
import {formatMoney} from "@/new/utils/money";
import DebtorStatus from "@/new/components/debtorStatus/DebtorStatus";
import Rating from "@/new/components/rating/Rating";
import Icon from "@/new/components/icon/Icon";
import Tooltip from "@/new/components/tooltip/Tooltip";
import TooltipWrapper from "@/new/components/tooltip/TooltipWrapper";
import {useDialog} from "@/new/hooks/useDialog";
import {useDicts} from "@/new/hooks/useDicts";
import JudicialDebtorsAutomatizingDialog
  from "@/new/components/judicialDebtorsAutomatizingDialog/JudicialDebtorsAutomatizingDialog";
import PretrialDebtorsAutomatizingDialog
  from "@/new/components/pretrialDebtorsAutomatizingDialog/PretrialDebtorsAutomatizingDialog";
import {useToast} from "@/new/hooks/useToast";
import {formatDate} from "@/new/utils/date";
import {usePersistedSetting} from "@/new/hooks/usePersistedSetting";
import {useStore} from "@/new/hooks/useStore";
// @TODO: remove
import qs from "qs";
import {asyncAction} from "@/new/utils/asyncAction";

export default defineComponent({
  name: "index",
  components: {
    PretrialDebtorsAutomatizingDialog,
    JudicialDebtorsAutomatizingDialog, TooltipWrapper, Tooltip, Icon, Rating, DebtorStatus, ActiveTable},
  props: {
    module: String
  },
  setup(props) {
    const store = useStore();

    const type = computed(() => props.module);

    const summariesFields = computed(() => (
      ['accrual', 'paid_up', 'debt', 'total_debt', 'penalty', type.value === 'judicial' && 'fee'].filter(Boolean)
    ));

    const {
      showDialog,
      confirmDialog,
    } = useDialog();

    const showStatusDialog = async (payload) => {
      await showDialog({
        component: 'debtorsStatus',
        payload: {
          ...payload,
          type: type.value,
        },
        closeHandler: fetchData,
      })
    }

    const showPrintDialog = async (payload) => {
      await showDialog({
        component: 'printDebtors',
        payload: {
          ...payload,
          type: type.value,
        },
      })
    }

    const showSetOfChargesDialog = async (payload) => {
      await showDialog({
        component: 'setOfCharges',
        payload: {
          ...payload,
          type: type.value,
        },
      })
    }

    const showDutyFormDialog = async ({
      allSelected,
      filters,
      selectedItems,
      selectedItem,
    }) => {
      await showToast({
        message: 'Формирование бланка пошлины...',
        type: 'warning',
      });

      const {
        data: {
          link,
        }
      } = await axios({
        method: 'post',
        url: `${baseURL}/constructor/debtors-data`,
        params: allSelected ? {...filters, filters: filters} : {},
        data: {
          company_id: store.getters['getDefaultCompanyId'],
          production_type: type.value,
          debtor_ids: selectedItems || [selectedItem],
          ...(allSelected ? {
            filters: filters,
            ...filters,
          } : {}),
        }
      });

      if(link) {
        await showToast({
          message: 'Документ сформирован и отправлен на почту',
          type: 'success',
        });
        await showDialog({
          component: 'downloadFile',
          payload: {
            title: 'Работа с документами',
            url: link,
          },
        });
      } else {
        await showToast({
          message: 'Ошибка формирования документов',
          type: 'error',
        })
      }
    }

    const showExtractFromEgrnDialog = async (payload) => {
      await showDialog({
        component: 'extractFromEgrn',
        payload: {
          ...payload,
          type: type.value,
        },
      })
    }

    const showDebtorDialog = async ({record: {debtor: {pk}}, index}) => {
      await showDialog({
        component: 'debtorDialog',
        isWide: true,
        payload: {
          id: pk,
          type: type.value,
          onNext: index < (records.value.length - 1) && (() => {
            showDebtorDialog({record: records.value[index + 1], index: index + 1})
          }),
          onPrevious: index > 0 && (() => {
            showDebtorDialog({record: records.value[index - 1], index: index - 1})
          }),
        },
      })
    }

    const {
      showToast,
    } = useToast();

    let sendUnsubscribe;
    onBeforeUnmount(() => {
      sendUnsubscribe && sendUnsubscribe()
    });

    const showNotifyDialog = async (notificationType, {allSelected, selectedItems, selectedItem}) => {
      const isActive = allSelected
        || !!selectedItems?.length
        || selectedItem > -1;

      if(
        !(await confirmDialog({
          confirmLabel: 'Отправить уведомление',
          title: {
            sms: 'Отправка сообщения',
            voice: 'Отправка голосового сообщения',
          }[notificationType],
          isCancellable: false,
          isConfirmable: isActive,
          hint: !isActive && 'Выберите должника'
        })).result
      ) {
        return;
      }

      try {
        const {data: {uuid}} = await axios({
          method: 'post',
          url: `${baseURL}/pretrial/${notificationType}/`,
          data: {
            company: store.getters['defaultCompanyId'],

            filters: filtersModel.value,
            payload: selectedItems || [props.selectedItem],
            production_type: type.value,
          }
        });
        await showToast({
          message: 'Запрос отправлен на обработку',
          type: 'success',
        })

        const {promise, unsubscribe} = asyncAction(
          async () => (await axios({
            method: 'get',
            url: `${baseURL}/api/datafile/status/${uuid}/`
          })).data,
          async(data) => {
            const {status_value_max, status_value, status_text, state} = data[0]
            if(state === 2) {
              return {
                status: true,
                error: status_text
              }
            }
            if(status_value === status_value_max) {
              return {
                status: true,
                payload: {
                  text: status_text
                }
              }
            } else {
              return {status: false}
            }
          },
          1000,
        );

        sendUnsubscribe = unsubscribe;
        try {
          const {text} = await promise;
          await showToast({
            message: text,
            type: 'success',
          })
        } catch (e) {
          console.log(e);
          await showToast({
            message: 'Ошибка отправки уведомления',
            type: 'error',
          })
        }
      } catch (e) {
        await showToast({
          message: 'Серверная ошибка',
          type: 'error',
        })
      }
    }

    const showFnsDialog = async ({allSelected, selectedItems, selectedItem, filters}) => {
      const isActive = allSelected
        || !!selectedItems?.length
        || selectedItem > -1;

      if(
        !(await confirmDialog({
          confirmLabel: 'Запросить',
          title: 'Работа с печатными документами',
          isCancellable: false,
          isConfirmable: isActive,
          hint: !isActive && 'Выберите должника',
        })).result
      ) {
        return;
      }

      try {
        throw 'error';
        await showToast({
          message: 'Запрос выполнен',
          type: 'success',
        });
        await fetchData();
      } catch (e) {
        await showToast({
          message: 'Серверная ошибка',
          type: 'error',
        })
      }
    }

    const showBankDialog = async ({allSelected, selectedItems, selectedItem, filters}) => {
      const isActive = allSelected
        || !!selectedItems?.length
        || selectedItem > -1;

      if(
        !(await confirmDialog({
          confirmLabel: 'Запросить',
          title: 'Формирование запроса в банк',
          isCancellable: false,
          isConfirmable: isActive,
          hint: !isActive && 'Выберите должника',
        })).result
      ) {
        return;
      }

      try {
        throw 'error';
        await showToast({
          message: 'Запрос выполнен',
          type: 'success',
        });
        await fetchData();
      } catch (e) {
        await showToast({
          message: 'Серверная ошибка',
          type: 'error',
        })
      }
    }

    const showClaimDialog = async (notificationType, {allSelected, selectedItems, selectedItem}) => {
      const isActive = allSelected
        || !!selectedItems?.length
        || selectedItem > -1;

      if(
        !(await confirmDialog({
          confirmLabel: 'Перевести',
          title: 'Перевод должников в раздел “Судебное производство”',
          isCancellable: isActive,
          isConfirmable: isActive,
          hint: !isActive && 'Выберите должника',
          message: isActive && 'Перевести выбранных должников в раздел “Судебное производство”?'
        })).result
      ) {
        return;
      }

      try {
        await axios({
          method: 'post',
          url: `${baseURL}/api/debtors-data/move/`,
          data: {
            company: +localStorage.getItem('defaultCompany'),

            filters: filtersModel.value,
            ids: selectedItems || [props.selectedItem],
            production_type: 'judicial',
          }
        });
        await showToast({
          message: 'Запрос выполнен',
          type: 'success',
        });
        await fetchData();
      } catch (e) {
        await showToast({
          message: 'Серверная ошибка',
          type: 'error',
        })
      }
    }

    const {
      judicialStatuses,
      judicialSubStatusesMap,
      pretrialSubStatusesMap,
    } = useDicts();

    const smsNotificationStatuses = computed(() => ([
      {value: false, label: 'Не отправлено'},
      {value: true, label: 'Отправлено'},
    ]));

    const voiceNotificationStatuses = computed(() => ([
      {value: false, label: 'Не отправлено'},
      {value: true, label: 'Отправлено'},
    ]));

    const {
      records: magistrateCourts,
      filtersModel: magistrateCourtsFiltersModel,
    } = useActiveTable({
      filters: ref([{
        field: 'name',
        type: 'text',
        isHidden: true,
      }, {
        field: 'company_id',
        type: 'text',
        isHidden: true,
        defaultValue: store.getters['defaultCompanyId']
      }]),
      defaultLimit: ref(10),
      async fetch({
        params,
        cancelToken,
      }) {
        const sectors = await axios({
          method: 'get',
          url: `${baseURL}/reference_books/magistrate_court_place/`,
          params,
          cancelToken,
        });
        return {
          data: {
            count: sectors.data.length,
            results: sectors.data,
          }
        };
      }
    });

    const {
      records: regionalCourts,
      filtersModel: regionalCourtsFiltersModel,
    } = useActiveTable({
      filters: ref([{
        field: 'name',
        type: 'text',
        isHidden: true,
      }, {
        field: 'company_id',
        type: 'text',
        isHidden: true,
        defaultValue: store.getters['defaultCompanyId']
      }]),
      defaultLimit: ref(10),
      async fetch({
        params,
        cancelToken,
      }) {
        const sectors = await axios({
          method: 'get',
          url: `${baseURL}/reference_books/regional_court_place/`,
          params,
          cancelToken,
        });
        return {
          data: {
            count: sectors.data.length,
            results: sectors.data,
          }
        };
      }
    });

    const {
      records: bailiffs,
      filtersModel: bailiffsFilterModel,
    } = useActiveTable({
      filters: ref([{
        field: 'name',
        type: 'text',
        isHidden: true,
      }]),
      defaultLimit: ref(10),
      async fetch({
        params,
        cancelToken,
      }) {
        const sectors = await axios({
          method: 'get',
          url: `${baseURL}/reference_books/regional_court_place/`,
          params,
          cancelToken,
        });
        return {
          data: {
            count: sectors.data.length,
            results: sectors.data,
          }
        };
      }
    });

    const {
      fetchData,
      isFetching,
      columns,
      filtersModel,
      filters,
      records,
      sort,
      actions,
      total,
      limit,
      page,
      contextActions,
      summaries,
      resetSettings,
      dropRecords,
    } = useActiveTable({
      defaultLimit: usePersistedSetting(computed(() => `debtors-${type.value}-limit`), 10),
      async fetch({
        params,
        cancelToken,
      }) {
        const response = await axios({
          method: 'GET',
          url: `${baseURL}/api/debtors-data/`,
          params: {
            ...params,
            company_id: store.getters['getDefaultCompanyId'],
          },
          cancelToken,
          paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat', skipNulls: true})
        });
        response.data.results = response.data.results.map((record, index) => {
          const debtor_status = record.debtor.debtor_status.map(status => {
            try {
              const parsed = JSON.parse(status.status.replace(/'/g, '"'))
              if(Array.isArray(parsed)) {
                return {
                  ...status,
                  status: parsed[0],
                }
              }
            } catch(e) {
            }
            return status;
          });

          debtor_status.sort(({updated_at: a}, {updated_at: b}) => (
            new Date(a).getTime() < new Date(b).getTime() ? 1 : -1
          ))

          return ({
            ...record,
            index,
            debtor: {
              ...record.debtor,
              debtor_status: debtor_status.length ? debtor_status : [
                {
                  status: 'new',
                }
              ],
            },
            substatuses: debtor_status.reduce((acc, {substatus}) => ([
              ...acc,
              ...substatus.map(({substatus: s}) => s),
            ]), []).filter((v, i, s) => s.indexOf(v) === i).filter(Boolean),
            pretrial_substatuses: record.debtor.pretrial_status.reduce((acc, {substatus}) => ([
              ...acc,
              ...substatus.map(({status: s}) => s),
            ]), []).filter((v, i, s) => s.indexOf(v) === i).filter(Boolean),
          });
        });
        response.data.summaries = response.data.total;
        return response;
      },
      filters: computed(() => ([
        {
          field: 'production_type',
          defaultValue: type.value,
          isHidden: true,
        },
        {
          field: 'full_name',
          type: 'text',
          width: 2,
          props: {
            placeholder: 'ФИО',
          }
        },
        {
          field: 'address',
          type: 'text',
          width: 2,
          props: {
            placeholder: 'Адрес',
          },
        },
        {
          field: 'personal_account',
          type: 'text',
          width: 2,
          defaultValue: '',
          props: {
            placeholder: '№ ЛС',
            /*
            isFillable: true,
            isMultiple: true,
            displayValueTemplate: '{n, plural, =1{Один номер} one{# номер} few{# номера} other{# номеров}} ЛС'
             */
          }
        },
        {
          field: 'debtor_debt_min',
          type: 'text',
          props: {
            placeholder: 'Сумма долга от',
            type: 'number',
          },
        },
        {
          field: 'debtor_debt_max',
          type: 'text',
          props: {
            placeholder: 'Сумма долга до',
            type: 'number',
          },
        },
        {
          field: 'status_name',
          type: 'select',
          props: {
            placeholder: 'Статус',
            options: judicialStatuses.value,
          },
          width: 2,
        },
        type.value === 'pretrial' && {
          field: 'sms_status',
          type: 'select',
          props: {
            placeholder: 'SMS-уведомление',
            options: smsNotificationStatuses.value,
          },
        },
        type.value === 'pretrial' && {
          field: 'voice_status',
          type: 'select',
          props: {
            placeholder: 'Голосовое уведомление',
            options: voiceNotificationStatuses.value,
          },
        },
        type.value === 'judicial' && {
          field: 'magistrate_court_id',
          type: 'select',
          props: {
            placeholder: 'Выбор мирового суда',
            isSearchable: true,
            searchPlaceholder: 'Начните ввод',
            options: magistrateCourts.value,
            valueProp: 'id',
            displayProp: 'name',
            async onQuery({query}) {
              magistrateCourtsFiltersModel.value.name = query;
            }
          },
        },
        type.value === 'judicial' && {
          field: 'regional_court_id',
          type: 'select',
          props: {
            placeholder: 'Выбор районного суда',
            isSearchable: true,
            searchPlaceholder: 'Начните ввод',
            options: regionalCourts.value,
            valueProp: 'id',
            displayProp: 'name',
            async onQuery({query}) {
              regionalCourtsFiltersModel.value.name = query;
            }
          },
        },
        type.value === 'judicial' && {
          field: 'substatus_name',
          type: 'select',
          props: {
            placeholder: 'Статус выписки ЕГРН',
            options: [
              {
                value: 'statement_ordered',
                label: 'Заказана',
              },
              {
                value: '!statement_ordered',
                label: 'Не заказана',
              },
            ],
          },
        },
        type.value === 'executive' && {
          field: 'bailiff_id',
          type: 'select',
          props: {
            placeholder: 'По участкам ФССП',
            isSearchable: true,
            searchPlaceholder: 'Начните ввод',
            options: bailiffs.value,
            valueProp: 'id',
            displayProp: 'name',
            async onQuery({query}) {
              bailiffsFilterModel.value.name = query;
            }
          },
          width: 2,
        },
        type.value === 'judicial' && {
          field: 'fee_status',
          type: 'select',
          props: {
            placeholder: 'Статус оплаты пошлины',
            options: [
              {
                value: 'fees_paid',
                label: 'Оплачена',
              },
              {
                value: '!fees_paid',
                label: 'Не оплачена',
              },
            ],
          },
        },
      ].filter(Boolean))),
      columns: computed(() => ([
        {
          field: 'status',
          width: '180px',
          isRequired: true,
          label: 'Статус',
          withTitle: false,
        },
        {
          field: 'personal_account',
          label: '№ ЛС',
          isSortable: true,
          width: '164px',
          isRequired: true,
        },
        type.value === 'pretrial' && {
          field: 'phone_number',
          label: 'Телефон',
          width: 214,
        },
        {
          field: 'full_name',
          label: 'ФИО',
          isSortable: true,
          width: 214,
        },
        {
          field: 'address',
          label: 'Адрес',
          width: 281,
        },
        type.value === 'executive' && {
          field: 'number',
          label: '№ ИП',
          width: 281
        },
        type.value === 'executive' && {
          field: 'started_at',
          label: 'Дата возбуждения ИП',
          width: 281
        },
        type.value === 'executive' && {
          field: 'ended_at',
          label: 'Дата окончания ИП',
          width: 281
        },
        ['pretrial', 'judicial'].includes(type.value) && {
          field: 'accrual',
          label: 'Начислено',
          isSortable: true,
          width: 177,
        },
        {
          field: 'paid_up',
          label: 'Оплачено',
          isSortable: true,
          width: 163,
        },
        ['pretrial', 'judicial'].includes(type.value) && {
          field: 'debt',
          label: 'Задолженность',
          isSortable: true,
          width: 237,
        },
        ['pretrial', 'judicial'].includes(type.value) && {
          field: 'penalty',
          label: 'Пени',
          isSortable: true,
          width: 132,
        },
        {
          field: 'total_debt',
          label: 'Общая задолженность',
          // isSortable: true,
          width: 237,
        },
        type.value === 'judicial' && {
          field: 'fee',
          label: 'Пошлина',
          isSortable: true,
          width: 127,
        },
      ].filter(Boolean))),
      contextActions: computed(() => ([
        {
          key: 'print',
          label: 'Печать',
          handler: ({allSelected, selectedItems, index}) => {
            showPrintDialog({
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            });
          },
        }
      ].filter(Boolean))),
      actions: computed(() => ([
        {
          key: 'print',
          label: 'Подача документов',
          icon: 'printer',
          isFixed: true,
          handler: ({allSelected, selectedItems}) => {
            showPrintDialog({
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
            });
          },
          asQuick: true,
        },
        type.value === 'judicial' && {
          key: 'bill',
          label: 'Свод начислений по ЛС',
          icon: 'bill',
          handler: ({allSelected, selectedItems, index}) => {
            showSetOfChargesDialog({
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            });
          },
          asQuick: true,
        },
        type.value === 'judicial' && {
          key: 'fee',
          label: 'Бланк пошлины',
          icon: 'clipboard',
          handler: ({allSelected, selectedItems, index}) => {
            showDutyFormDialog({
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            });
          },
          asQuick: true,
        },
        type.value === 'judicial' && {
          key: 'egrn',
          label: 'Выписка ЕГРН',
          icon: 'egrn',
          handler: ({allSelected, selectedItems, index}) => {
            showExtractFromEgrnDialog({
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            });
          },
          asQuick: true,
        },
        type.value === 'pretrial' && {
          key: 'sms',
          label: 'Отправка SMS',
          icon: 'sms',
          handler: ({allSelected, selectedItems, index}) => {
            showNotifyDialog('sms', {
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            })
          },
          asQuick: true,
        },
        type.value === 'pretrial' && {
          key: 'voice',
          label: 'Голосовое уведомление',
          icon: 'microphone',
          handler: ({allSelected, selectedItems, index}) => {
            showNotifyDialog('voice', {
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            })
          },
          asQuick: true,
        },
        false && type.value === 'pretrial' && {
          key: 'move',
          label: 'Перенос в судебное производство',
          icon: 'court',
          handler: ({allSelected, selectedItems, index}) => {
            showClaimDialog('voice', {
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].pk),
              selectedItem: records.value[index]?.debtor?.pk,
            })
          },
          asQuick: true,
        },
        type.value === 'executive' && {
          key: 'fns',
          label: 'Выписка из ФНС',
          icon: 'fns',
          handler: ({allSelected, selectedItems, index}) => {
            showFnsDialog({
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            })
          },
          asQuick: true,
        },
        type.value === 'executive' && {
          key: 'bank',
          label: 'Запрос в банк',
          icon: 'bank',
          handler: ({allSelected, selectedItems, index}) => {
            showBankDialog({
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            })
          },
          asQuick: true,
        },
        {
          key: 'status',
          label: 'Изменить статус выбранных должников',
          handler: ({allSelected, selectedItems}) => {
            showStatusDialog({
              allSelected,
              filters: filtersModel.value,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
            });
          },
          asLined: true,
        },
        {
          key: 'settings',
          label: 'Настройки',
          icon: 'gears',
          asControl: true,
        },
      ].filter(Boolean)))
    });

    watch(type, dropRecords);

    return {
      fetchData,
      isFetching,
      columns,
      filtersModel,
      filters,
      records,
      sort,
      actions,
      contextActions,

      formatMoney,
      formatDate,

      summaries,
      summariesFields,

      total,
      limit,
      page,

      showStatusDialog,

      showDebtorDialog,

      resetSettings,

      type,

      judicialSubStatusesMap,
      pretrialSubStatusesMap,
    }
  }
})
</script>

<style lang="scss" module>
@import "./index";
</style>
