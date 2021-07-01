<template>
  <div :class="$style.courts">
    <div :class="$style.tabs">
      <div :class="[
        $style.tab,
        activeTab.key === tab.key && $style.activeTab
      ]" v-for="tab in tabs" :key="tab.key" @click="selectTab(tab)">
        {{tab.label}}
      </div>
    </div>
    <div :class="$style.header">
      <div :class="$style.title">
        Карточка истории судебных дел
      </div>
      <Btn state="secondary" :label="{
        magistrate: 'Реквизиты участка мирового судьи',
        regional: 'Реквизиты участка регионального суда',
      }[activeTab.key]" @click="showRequisites" :class="$style.action" v-if="requisitesAvailable"/>
    </div>
    <div :class="$style.content">
      <Icon v-if="isLoading" icon="loader" spin :class="$style.loader"/>

      <table :class="$style.table">
        <tbody>
        <template  v-for="document in documents">
          <tr :key="`${document.id}-header`">
            <td :colspan="columns.length">
              <div :class="$style.fields">
                <div :class="$style.field">
                  <div :class="$style.fieldLabel">Перод</div>
                  <div :class="$style.fieldValue">{{[document.start_date, document.end_date].filter(Boolean).join(' - ')}}</div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th v-for="column in columns" :key="column.key">
              {{column.label}}
            </th>
          </tr>
          <tr :key="`${document.id}-data`">
            <td v-for="column in columns" :key="column.key">
              <template v-if="document[column.key]">
                <template v-if="column.key === 'ownership_registration_date'">
                  {{formatDate(document[column.key])}}
                </template>
                <template v-else>
                  {{document[column.key]}}
                </template>
              </template>
              <span v-else :class="$style.na">
            N/A
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
import {formatDate} from "@/new/utils/date";
import {formatMoney} from "@/new/utils/money";
import Btn from "@/new/components/btn/Btn";
import {useDialog} from "@/new/hooks/useDialog";
export default {
  name: "DebtorCourtsTab",
  components: {Btn, Icon},
  setup() {
    const data = inject('data');

    const store = useStore();

    const tabs = computed(() => ([
      {
        key: 'magistrate',
        label: 'Участок мирового судьи',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/reference_books/court_cases_history/`,
            params: {
              company_id: store.getters['getDefaultCompanyId'],
              debtor: data.value.debtor.pk,
              id: data.value.debtor_main_profile.magistrate_court_place,
            }
          });

          return response.data;
        }
      },
      {
        key: 'regional',
        label: 'Участок районного суда',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/reference_books/court_cases_history/`,
            params: {
              company_id: store.getters['getDefaultCompanyId'],
              debtor: data.value.debtor.pk,
              id: data.value.debtor_main_profile.regional_court_place,
            }
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
      ...([
        {key: 'pk', label: '№'},
        {key: 'id', label: 'Идентификатор дела'},
        {key: 'number', label: '№ дела'},
        {key: 'created_date', label: 'Дата поступления'},
        {key: 'view_date', label: 'Дата рассмотрения'},
        {key: 'effected_date', label: 'Дата вступления решения в силу'},
        {key: 'judge_full_name', label: 'ФИО судьи'},
        {key: 'status', label: 'Статус оплаты'},
        {key: 'statuses', label: 'История статусов'},
      ]),
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

    const {showDialog} = useDialog();

    const showRequisites = async () => {
      await showDialog({
        component: 'court',
        payload: {
          type: activeTab.value.key,
          id: {
            magistrate: data.value.debtor_main_profile.magistrate_court_place,
            regional: data.value.debtor_main_profile.regional_court_place,
          }[activeTab.value.key]
        }
      })
    }

    const requisitesAvailable = computed(() => !!({
      magistrate: data.value.debtor_main_profile.magistrate_court_place,
      regional: data.value.debtor_main_profile.regional_court_place,
    }[activeTab.value.key]))

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

      showRequisites,
      requisitesAvailable,
    }
  }
}
</script>

<style lang="scss" module>
@import "./debtorCourtsTab";
</style>
