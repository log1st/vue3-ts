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
    >
      <template #cell(status)="{record, index}">
        <DebtorStatus
          :class="$style.status"
          @click="showStatusDialog({ selectedItem: records[index] })"
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
            [
              record.tmp.documentReady,
              record.tmp.egrnExcerpt,
              record.tmp.feePaid,
            ].filter(Boolean).length > 1 && $style.accountIconsDense,
          ]">
            <TooltipWrapper text="Документ готов к подаче">
              <Icon :class="[$style.accountIcon, $style.accountIconGreen]" v-if="record.tmp.documentReady" icon="file-check"/>
            </TooltipWrapper>
            <TooltipWrapper text="Выписка из ЕГРН заказана">
              <Icon :class="[$style.accountIcon, $style.accountIconBlue]" v-if="record.tmp.egrnExcerpt" icon="egrn-excerpt"/>
            </TooltipWrapper>
            <TooltipWrapper text="Пошлина оплачена">
              <Icon :class="[$style.accountIcon, $style.accountIconGreen]" v-if="record.tmp.feePaid" icon="coins"/>
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
      <template #cell(penalty)="{record}">
        {{formatMoney(record.penalty)}}
      </template>
      <template #cell(fee)="{record}">
        {{formatMoney(record.fee)}}
      </template>
      <template v-for="field in summariesFields" :slot="`summary(${field})`" slot-scope="{value}">
        {{formatMoney(value)}}
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

export default defineComponent({
  name: "index",
  components: {TooltipWrapper, Tooltip, Icon, Rating, DebtorStatus, ActiveTable},
  props: {
    module: String
  },
  setup(props) {
    const type = computed(() => props.module);

    const summariesFields = ['accrual', 'paid_up', 'debt', 'penalty', 'fee'];

    const {
      showDialog,
    } = useDialog();

    const showStatusDialog = async (payload) => {
      await showDialog({
        component: 'debtorsStatus',
        payload,
      })
    }

    const {
      judicialStatuses,
      judicialEgrnStatuses,
      judicialFeeStatuses,
    } = useDicts();

    const {
      records: judicialSectors,
      filtersModel: judicialSectorsFiltersModel,
    } = useActiveTable({
      isImmediate: false,
      filters: ref([{
        field: 'query',
        type: 'text',
        isHidden: true,
      }]),
      async fetch() {
        return new Promise(resolve => {
          resolve({
            data: {
              count: 10,
              results: Array(10).fill(null).map((_, index ) => ({
                value: index + 1,
                label: `Суд #${index + 1}`
              }))
            }
          })
        })
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
    } = useActiveTable({
      async fetch({
        params,
        cancelToken,
      }) {
        const response = await axios({
          method: 'GET',
          url: `${baseURL}/api/debtors-data/`,
          params,
          cancelToken,
        });
        response.data.results = response.data.results.map((record, index) => ({
          ...record,
          index,
          tmp: {
            rating: Math.floor(Math.random() * 5),
            documentReady: Math.floor(Math.random() * 3) % 3 === 0,
            egrnExcerpt: Math.floor(Math.random() * 3) % 3 === 0,
            feePaid: Math.floor(Math.random() * 3) % 3 === 0,
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
          type: 'text',
          width: 2,
          props: {
            placeholder: '№ ЛС'
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
          field: 'status',
          type: 'select',
          props: {
            placeholder: 'Статус',
            options: judicialStatuses.value,
          },
        },
        {
          field: 'judicial_sector',
          type: 'select',
          props: {
            placeholder: 'Выбор судебного участка',
            isSearchable: true,
            searchPlaceholder: 'Начните ввод',
            options: judicialSectors.value,
            async onQuery({query}) {
              judicialSectorsFiltersModel.value.query = query;
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
        },
        {
          field: 'personal_account',
          label: '№ ЛС',
          width: '164px',
        },
        {
          field: 'full_name',
          label: 'ФИО',
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
          handler(payload) {
            alert(`print ${payload.index}`)
          }
        }
      ])),
      actions: computed(() => ([
        {
          key: 'print',
          label: 'Подача документов',
          icon: 'printer',
          handler: () => {
            alert('print');
          },
          asQuick: true,
        },
        {
          key: 'bill',
          label: 'Свод начислений по ЛС',
          icon: 'bill',
          handler: () => {
            alert('bill');
          },
          asQuick: true,
        },
        {
          key: 'fee',
          label: 'Бланк пошлины',
          icon: 'clipboard',
          handler: () => {
            alert('fee blank');
          },
          asQuick: true,
        },
        {
          key: 'egrn',
          label: 'Выписка ЕГРН',
          icon: 'egrn',
          handler: () => {
            alert('egrn');
          },
          asQuick: true,
        },
        {
          key: 'status',
          label: 'Изменить статус выбранных должников',
          handler: ({allSelected, selectedItems}) => {
            showStatusDialog({
              allSelected,
              selectedItems: selectedItems.map(index => records.value[index].pk),
            });
          },
          asLined: true,
        },
        {
          key: 'gears',
          label: 'Настройки',
          icon: 'gears',
          handler: () => {
            alert('settings');
          },
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
    }
  }
})
</script>

<style lang="scss" module>
@import "./index";
</style>
