<template>
  <div :class="$style.courts">
    <div :class="$style.header">
      <div :class="$style.title">
        Карточка истории ИП в ФССП
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
        <template  v-for="(document, index) in documents">
          <tr :key="`${document.id}-data`">
            <td v-for="column in columns" :key="column.key">
              <template v-if="document[column.key]">
                <template v-if="column.key.includes('date') && document[column.key]">
                  {{formatDate(document[column.key])}}
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
import {formatDate} from "@/new/utils/date";
import {formatMoney} from "@/new/utils/money";
import Btn from "@/new/components/btn/Btn";
import {useDialog} from "@/new/hooks/useDialog";
import {useStore} from "@/new/hooks/useStore";
export default {
  name: "DebtorExecutionsTab",
  components: {Btn, Icon},
  setup() {
    const data = inject('data');

    const store = useStore();

    const tabs = computed(() => ([
      {
        key: 'main',
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

          return response.data.map((r, index) => ({
            __index: index + 1,
            ...r
          }));
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
        {key: 'id', label: 'Идентификатор дела'},
        {key: 'start_date', label: 'Дата возбуждения ИП'},
        {key: 'document', label: 'Реквизиты исполнительного документа'},
        {key: 'end_date', label: 'Дата прекращения ИП'},
        {key: 'reason', label: 'Основания прекращения ИП'},
        {key: 'payment_status', label: 'Статус оплаты'},
        {key: 'statuses_history', label: 'История статусов'},
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
    }
  }
}
</script>

<style lang="scss" module>
@import "./debtorExecutionsTab";
</style>
