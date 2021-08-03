<template>
  <div :class="$style.courts">
    <div :class="$style.header">
      <div :class="$style.title">
        Карточка истории ИП в ФССП
      </div>
      <div :class="$style.actions">
        <Btn v-if="false" state="secondary" label="Банковские счета" @click="showBankAccounts" :class="$style.action"/>
        <Btn state="secondary" label="Реквизиты участка ФССП" @click="showRequisites" :class="$style.action"/>
        <Btn state="secondary" label="Реквизиты ФНС по адресу" @click="showFns" :class="$style.action"/>
      </div>
      <div :class="$style.filter">
        <SelectInput :class="$style.type" v-model="filter.type" :options="typeOptions" v-if="isFilterAvailable"/>
        <Btn :class="$style.add" @click="showAddDialog" label="Добавить дело"/>
      </div>
    </div>
    <div :class="$style.content">
      <Icon v-if="isLoading" icon="loader" spin :class="$style.loader"/>

      <table :class="$style.table">
        <tbody>
        <template  v-for="(document, index) in documents">
          <tr :key="`${document.id}-header`">
            <td :colspan="columns.length">
              <div :class="$style.fields">
                <div :class="$style.field">
                  <div :class="$style.fieldLabel">Период</div>
                  <div :class="$style.fieldValue">
                    <template v-if="!document.end_date && document.production_date">с</template>
                    <template v-if="document.production_date">
                      {{formatDbDate(document.production_date)}}
                    </template>
                    <template v-if="document.end_date">
                      {{ document.production_date ? '-' : 'по' }} {{formatDbDate(document.end_date)}}
                    </template>
                    <template v-else>по настоящее время</template>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="index === 0" :key="`${document.id}-cells`">
          <th v-for="column in columns" :key="column.key">
            {{column.label}}
          </th>
          </tr>
          <tr :key="`${document.id}-data`">
            <td v-for="column in columns" :key="column.key">
              <template v-if="document[column.key]">
                <template v-if="column.key.includes('date') && document[column.key]">
                  {{formatDbDate(document[column.key])}}
                </template>
                <template v-else-if="column.key === 'end_reason1'">
                  {{[`ст. ${document.end_reason1}`, `ч. ${document.end_reason2}`, `п. ${document.end_reason3}`].join(' ')}}
                </template>
                <template v-else>
                  {{document[column.key]}}
                </template>
              </template>
              <span v-else :class="$style.na">
            Н/Д
          </span>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Icon from "@/new/components/icon/Icon";
import {computed, inject, onMounted, ref, watch} from "@vue/composition-api";
import {baseURL} from "@/settings/config";
import {formatDate, formatDbDate} from "@/new/utils/date";
import {formatMoney} from "@/new/utils/money";
import Btn from "@/new/components/btn/Btn";
import {useDialog} from "@/new/hooks/useDialog";
import {useStore} from "@/new/hooks/useStore";
import SelectInput from "@/new/components/selectInput/SelectInput";
import {useErrors} from "@/new/hooks/useErrors";
export default {
  name: "DebtorExecutionsTab",
  components: {SelectInput, Btn, Icon},
  setup() {
    const data = inject('data');

    const typeOptions = ref([
      {
        value: 'communal',
        label: 'Коммунальные услуги',
      }, {
        value: 'credit',
        label: 'Кредиты',
      }, {
        value: 'tax',
        label: 'Налоги',
      }, {
        value: 'other',
        label: 'Штрафы и пр.'
      }
    ]);

    const filter = ref({
      type: 'communal'
    });

    const tabs = computed(() => ([
      {
        key: 'main',
        async fetch() {
          const response = await axios({
            url: `${baseURL}/executive/debtor/${data.value.debtor.pk}/fssp/`,
            params: {
              ordering: '-production_date',
              debt_nature: filter.value.type,
            }
          })

          return [...response.data].reverse().filter(({id}, index, self) => self.findIndex((r) => r.id === id) === index).reverse().map((i, index) => ({
            ...i,
            __index: index + 1,
          }));
        }
      },
    ]));

    const isFilterAvailable = ref(false);
    const fetchFilterAvailability = async () => {
      isFilterAvailable.value = false;
      isFilterAvailable.value = (await axios({
        url: `${baseURL}/executive/debtor/${data.value.debtor.pk}/fssp/`,
      })).data.length > 0
    }

    const activeTab = ref(tabs.value[0]);
    const selectTab = tab => {
      activeTab.value = tab;
    }

    const columns = computed(() => ([
      ...([
        {key: '__index', label: '№'},
        {key: 'production_number', label: '№ ИП'},

        {key: 'doctype', label: 'Вид документа'},
        {key: 'docnum', label: '№ дела'},
        {key: 'docdate', label: 'Дата дела'},
        {key: 'court', label: 'Судебный участок'},

        {key: 'production_date', label: 'Дата возбуждения ИП'},
        {key: 'end_date', label: 'Дата прекращения ИП'},
        {key: 'end_reason1', label: 'Основания прекращения ИП'},
        {key: 'amount', label: 'Сумма'},
        {key: 'bailiff', label: 'ФИО пристава'},
      ]),
    ]));

    const isLoading = ref(false);
    const documents = ref([]);

    watch(computed(() => activeTab.value.key), async () => {
      isLoading.value = true;
      await new Promise(requestAnimationFrame);
      await fetchFilterAvailability();
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

    watch(computed(() => data.value.debtor.pk), async () => {
      isLoading.value = true;
      await new Promise(requestAnimationFrame);
      await fetchFilterAvailability();
      try {
        documents.value = [];
        documents.value = await activeTab.value.fetch()
      } catch (e) {
        //
      }
      isLoading.value = false;
    });

    watch(filter, async () => {
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
      deep: true,
    });

    const {showDialog} = useDialog();

    const showRequisites = async () => {
      await showDialog({
        component: 'editModel',
        payload: {
          isEditable: false,
          model: {
            name: data.value.debtor_main_profile.bailiff?.name,
            address: data.value.debtor_main_profile.bailiff?.address,
          },
          fields: [
            {key: 'name', label: 'Наименование'},
            {key: 'address', label: 'Адрес'},
          ],
          onSave: (model) => {
            console.log(model)
          }
        }
      })
    }

    const {
      errorsMap: addErrorsMap,
      clearErrors: clearAddErrors,
      setErrors: setAddErrors,
    } = useErrors();

    const showAddDialog = async () => {
      await showDialog({
        component: 'editModel',
        payload: {
          isEditable: true,
          model: {
            name: '',
            case_number: '',
          },
          fields: [
            {key: 'serial_number', label: 'Номер ИП', blockedBy: ['case_number']},
            {key: 'case_number', label: 'Номер судебного решения', blockedBy: ['serial_number']},
          ],
          errors: addErrorsMap,
          isInitiallyEditing: true,
          onSave: async (model) => {
            try {
              clearAddErrors();
              const {data: res} = await axios({
                method: 'post',
                url: `${baseURL}/executive/debtor/${data.value.debtor.pk}/writoe/`,
                data: Object.entries(model).filter(([, field]) => !!field).reduce((acc, [key, field]) => ({
                  ...acc,
                  [key]: field
                }), {}),
              });
              documents.value = [];
              activeTab.value.fetch().then(res => {
                document.value = res;
              })
              axios({
                method: 'patch',
                url: `${baseURL}/executive/writoe/${res.id}/writoe_refresh/`
              })
              return {status: true}
            } catch (e) {
              if(e?.response?.data) {
                setAddErrors(Object.entries(e.response.data).reduce((acc, [key, errors]) => ([
                  ...acc,
                  ...errors.map(error => ([key === 'non_field_errors' ? 'common' : key, error]))
                ]), []))
              } else {
                setAddErrors([['common', 'Не удалось добавить дело']])
              }
              return {
                status: false,
                errors: addErrorsMap,
              }
            }
          }
        }
      })
    }

    const showFns = async () => {
      await showDialog({
        component: 'editModel',
        payload: {
          isEditable: false,
          model: data.value.debtor_main_profile.ifns || {},
          fields: [
            ['code', 'Код ИФНС'],
            ['name', 'Наименование'],
            ['address', 'Адрес'],
            ['inn', 'ИНН'],
            ['kpp', 'КПП'],
            ['payee', 'Получатель платежа'],
            ['bank', 'Банк'],
            ['bik', 'БИК'],
            ['rs', 'р/с'],
            ['ks', 'к/с'],
            ['reg_code', 'Регистрирующий орган'],
            ['phone', 'Номер телефона'],
            ['description', 'дополнительная информация'],
          ].map(([key, label]) => ({
            key,
            label,
          })),
          onSave: (model) => {
            console.log(model)
          }
        }
      })
    }

    const showBankAccounts = async () => {
      await showDialog({
        component: 'fsspBankAccounts',
        isWide: true,
        payload: {
          type: activeTab.value.key,
          id: data.value.debtor.pk,
        }
      })
    };

    return {
      filter,
      typeOptions,

      activeTab,
      selectTab,
      tabs,

      data,

      isLoading,
      columns,
      documents,

      formatDate,
      formatDbDate,

      formatMoney,

      showRequisites,
      showFns,
      showBankAccounts,
      isFilterAvailable,

      showAddDialog,
    }
  }
}
</script>

<style lang="scss" module>
@import "./debtorExecutionsTab";
</style>
