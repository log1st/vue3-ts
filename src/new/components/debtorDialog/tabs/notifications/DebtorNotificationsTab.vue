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
        Карточка уведомлений
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
              <template v-if="getDeepField(document, column.key)">
                <template v-if="['created_at', 'send_at'].includes(column.key)">
                  {{formatDate(getDeepField(document, column.key))}}
                </template>
                <template v-else>
                  {{getDeepField(document, column.key)}}
                </template>
              </template>
              <div :class="$style.actions" v-else-if="column.key === 'actions'">
                <Btn :class="$style.action" prepend-icon="megaphone" state="quinary" @click="listenSound(document)" v-if="activeTab.key === 'voice'"/>
              </div>
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
import {getDeepField} from "@/new/utils/object";
export default {
  name: "DebtorNotificationsTab",
  components: {Btn, Icon},
  setup() {
    const data = inject('data');

    const tabs = computed(() => ([
      {
        key: 'sms',
        label: 'SMS',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/pretrial/debtor/${data.value.debtor.pk}/sms/`,
          });

          return response.data;
        }
      },
      {
        key: 'voice',
        label: 'Голосовые',
        async fetch() {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/pretrial/debtor/${data.value.debtor.pk}/voice/`,
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
      {key: 'id', label: '№'},
      {key: 'operator.name', label: 'Оператор'},
      {key: 'created_at', label: 'Создано'},
      {key: 'phone_number', label: 'Номер телефон'},
      (activeTab.value.key === 'sms') && {key: 'message', label: 'Сообщение'},
      {key: 'send_at', label: 'Отправлено'},
      {key: 'status', label: 'Статус'},
      {key: 'cost', label: 'Цена'},
      {key: 'actions', label: ''},
    ].filter(Boolean)));

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

      getDeepField,

      listenSound,
    }
  }
}
</script>

<style lang="scss" module>
@import "./debtorNotificationsTab";
</style>
