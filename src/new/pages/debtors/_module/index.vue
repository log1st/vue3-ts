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
    >
      <template #cell(status)="{record, index}">
        <DebtorStatus
          :class="$style.status"
          :status="record.debtor.debtor_status[record.debtor.debtor_status.length - 1]"
          @click="showStatusDialog({ selectedItem: record.debtor.debtor_status[record.debtor.debtor_status.length - 1].id })"
        />
      </template>
      <template #cell(personal_account)="{record, index}">
        <div :class="$style.account">
          <div :class="$style.accountInfo">
            <div :class="$style.accountNumber">{{record.debtor.personal_account}}</div>
            <div :class="$style.accountStars">
              <Rating :model-value="record.tmp.rating"/>
            </div>
          </div>
          <div :class="[
            $style.accountIcons,
            record.debtor.debtor_status[record.debtor.debtor_status.length - 1].length > 1 && $style.accountIconsDense
          ]">
            <TooltipWrapper
              v-for="substatus in record.debtor.debtor_status[record.debtor.debtor_status.length - 1].substatus"
              :key="substatus.substatus"
              :text="{
                fees_paid: 'Пошлина оплачена'
              }[substatus.substatus]"
            >
              <Icon
                :class="[
                  $style.accountIcon,
                  $style[`accountIcon${{
                    fees_paid: 'Green',
                  }[substatus.substatus]}`]
                ]"
                :icon="{
                  fees_paid: 'coins'
                }[substatus.substatus]"
              />
            </TooltipWrapper>
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
      <template #cell(fee)="{record}">
        {{formatMoney(record.fee)}}
      </template>
      <template v-for="field in summariesFields" :slot="`summary(${field})`" slot-scope="{value}">
        {{formatMoney(value)}}
      </template>
      <template #action(settings)="{isActive}">
        <JudicialDebtorsAutomatizingDialog v-if="isActive"/>
      </template>
    </ActiveTable>
  </div>
</template>

<script>
import {computed, defineComponent, ref, watch} from "@vue/composition-api";
import {useActiveTable} from "@/new/components/activeTable/useActiveTable";
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

export default defineComponent({
  name: "index",
  components: {JudicialDebtorsAutomatizingDialog, TooltipWrapper, Tooltip, Icon, Rating, DebtorStatus, ActiveTable},
  props: {
    module: String
  },
  setup(props) {
    const type = computed(() => props.module);

    const summariesFields = ['accrual', 'paid_up', 'debt', 'total_debt', 'penalty', 'fee'];

    const {
      showDialog,
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

    const showDutyFormDialog = async (payload) => {
      await showDialog({
        component: 'dutyForm',
        payload: {
          ...payload,
          type: type.value,
        },
      })
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

    const showDebtorDialog = async ({record: {debtor: {pk}}}) => {
      await showDialog({
        component: 'debtorDialog',
        isWide: true,
        payload: {
          id: pk,
          type: type.value,
        },
      })
    }

    const {
      judicialStatuses,
      judicialEgrnStatuses,
      judicialFeeStatuses,
    } = useDicts();

    const {
      records: magistrateCourts,
      filtersModel: magistrateCourtsFiltersModel,
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
    } = useActiveTable({
      async fetch({
        params,
        cancelToken,
      }) {
        const response = await axios({
          method: 'GET',
          url: `${baseURL}/api/debtors-data/`,
          params: {
            ...params,
            company_id: localStorage.getItem('defaultCompany'),
          },
          cancelToken,
        });
        response.data.results = response.data.results.map((record, index) => ({
          ...record,
          index,
          tmp: {
            rating: Math.floor(Math.random() * 5),
          }
        }));
        response.data.summaries = summariesFields.reduce((acc, cur) => ({
          ...acc,
          [cur]: Math.round(Math.random() * 100000000) / 100,
        }), {});
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
          type: 'select',
          width: 2,
          defaultValue: [],
          props: {
            placeholder: '№ ЛС',
            isFillable: true,
            isMultiple: true,
            displayValueTemplate: '{n, plural, =1{Один номер} one{# номер} few{# номера} other{# номеров}} ЛС'
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
        {
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
        {
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
        {
          field: 'egrn_status',
          type: 'select',
          props: {
            placeholder: 'Статус выписки ЕГРН',
            options: judicialEgrnStatuses.value,
          },
        },
        {
          field: 'fee_status',
          type: 'select',
          props: {
            placeholder: 'Статус оплаты пошлины от',
            options: judicialFeeStatuses.value,
          },
        },
      ])),
      columns: ref([
        {
          field: 'status',
          width: '155px',
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
        {
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
        {
          field: 'debt',
          label: 'Задолженность',
          isSortable: true,
          width: 237,
        },
        {
          field: 'penalty',
          label: 'Пени',
          isSortable: true,
          width: 132,
        },
        {
          field: 'total_debt',
          label: 'Общая задолженность',
          isSortable: true,
          width: 237,
        },
        {
          field: 'fee',
          label: 'Пошлина',
          isSortable: true,
          width: 127,
        },
      ]),
      contextActions: computed(() => ([
        {
          key: 'print',
          label: 'Печать',
          handler: ({allSelected, selectedItems, index}) => {
            showPrintDialog({
              allSelected,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            });
          },
        }
      ])),
      actions: computed(() => ([
        {
          key: 'print',
          label: 'Подача документов',
          icon: 'printer',
          handler: ({allSelected, selectedItems}) => {
            showPrintDialog({
              allSelected,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
            });
          },
          asQuick: true,
        },
        {
          key: 'bill',
          label: 'Свод начислений по ЛС',
          icon: 'bill',
          handler: ({allSelected, selectedItems, index}) => {
            showSetOfChargesDialog({
              allSelected,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            });
          },
          asQuick: true,
        },
        {
          key: 'fee',
          label: 'Бланк пошлины',
          icon: 'clipboard',
          handler: ({allSelected, selectedItems, index}) => {
            showDutyFormDialog({
              allSelected,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            });
          },
          asQuick: true,
        },
        {
          key: 'egrn',
          label: 'Выписка ЕГРН',
          icon: 'egrn',
          handler: ({allSelected, selectedItems, index}) => {
            showExtractFromEgrnDialog({
              allSelected,
              selectedItems: selectedItems.map(index => records.value[index].debtor.pk),
              selectedItem: records.value[index]?.debtor?.pk,
            });
          },
          asQuick: true,
        },
        {
          key: 'status',
          label: 'Изменить статус выбранных должников',
          handler: ({allSelected, selectedItems}) => {
            showStatusDialog({
              allSelected,
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
      ]))
    });

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

      summaries,
      summariesFields,

      total,
      limit,
      page,

      showStatusDialog,

      showDebtorDialog,

      resetSettings,
    }
  }
})
</script>

<style lang="scss" module>
@import "./index";
</style>
