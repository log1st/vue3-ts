<template>
  <div :class="$style.courts">
    <div :class="$style.header">
      <div :class="$style.title">
        Карточка истории ИП в ФССП
      </div>
      <div :class="$style.actions">
        <Btn state="secondary" label="Банковские счета" @click="showBankAccounts" :class="$style.action"/>
        <Btn state="secondary" label="Реквизиты участка ФССП" @click="showRequisites" :class="$style.action"/>
      </div>
    </div>
    <div :class="$style.content">
      <Icon v-if="isLoading" icon="loader" spin :class="$style.loader"/>

      <table :class="$style.table">
        <tbody>
        <template  v-for="(document, index) in documents">
          <tr :key="`${document.id}-header`" v-if="index === 0">
            <td :colspan="columns.length">
              <div :class="$style.fields">
                <div :class="$style.field">
                  <div :class="$style.fieldLabel">Период</div>
                  <div :class="$style.fieldValue">
                    <template v-if="!document.end_date && document.start_date">с</template>
                    <template v-if="document.start_date">
                      {{formatDbDate(document.start_date)}}
                    </template>
                    <template v-if="document.end_date">
                      {{ document.start_date ? '-' : 'по' }} {{formatDbDate(document.end_date)}}
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
import {computed, inject, ref, watch} from "@vue/composition-api";
import {baseURL} from "@/settings/config";
import {formatDate, formatDbDate} from "@/new/utils/date";
import {formatMoney} from "@/new/utils/money";
import Btn from "@/new/components/btn/Btn";
import {useDialog} from "@/new/hooks/useDialog";
import {useStore} from "@/new/hooks/useStore";
export default {
  name: "DebtorExecutionsTab",
  components: {Btn, Icon},
  setup() {
    const data = inject('data');

    const tabs = computed(() => ([
      {
        key: 'main',
        async fetch() {
          const response = await axios({
            url: `${baseURL}/executive/debtor/${data.value.debtor.pk}/fssp/`,

          })

          return response.data.results;
        }
      },
    ]));

    const activeTab = ref(tabs.value[0]);
    const selectTab = tab => {
      activeTab.value = tab;
    }

    const columns = computed(() => ([
      ...([
        {key: '__index', label: '№'},
        {key: 'production_number', label: '№ ИП'},
        {key: 'docnum', label: 'Номер исполнительного документа'},
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

    const {showDialog} = useDialog();

    const showRequisites = async () => {
      await showDialog({
        component: 'editModel',
        payload: {
          model: {
            name: 'Пример имени',
            address: 'Пример адреса',
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

    const showBankAccounts = async () => {
      await showDialog({
        component: 'fsspBankAccounts',
        isWide: true,
        payload: {
          type: activeTab.value.key,
          id: data.value.debtor.pk,
        }
      })
    }

    return {
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
      showBankAccounts,
    }
  }
}
</script>

<style lang="scss" module>
@import "./debtorExecutionsTab";
</style>
