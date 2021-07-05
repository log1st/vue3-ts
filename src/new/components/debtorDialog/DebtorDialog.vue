<template>
  <div :class="$style.dialog">
    <Icon icon="loader" spin v-if="isLoading" :class="$style.loader"></Icon>
    <div :class="$style.title" v-if="!data">
      Данные должника
    </div>
    <template v-else>
      <div :class="$style.title">
        Данные должника {{data.debtor_main_profile.full_name}}
      </div>
      <Rating :model-value="data.rating" :class="$style.rating" v-if="false"/>
      <div :class="$style.tabs">
        <div
          :class="[
            $style.tab,
            activeTab.key === tab.key && $style.activeTab
          ]"
          v-for="tab in tabs"
          :key="tab.key"
          @click="selectTab(tab)"
        >
          <div :class="$style.tabLabel">
            {{tab.label}}
          </div>
          <Icon :icon="tab.icon" :class="$style.tabIcon"/>
        </div>
      </div>
      <div :class="$style.content">
        <Icon @click="switchDebtor(-1)" v-if="isPreviousAvailable.value" :class="[$style.control, $style.previous]" icon="chevron-left"/>
        <component :is="activeTab.component"/>
        <Icon @click="switchDebtor(1)" v-if="isNextAvailable.value" :class="[$style.control, $style.next]" icon="chevron-right"/>
      </div>
    </template>
  </div>
</template>

<script>
import {ref, watch, computed, defineComponent, provide} from "@vue/composition-api";
import {baseURL} from "@/settings/config";
import Rating from "@/new/components/rating/Rating";
import Icon from "@/new/components/icon/Icon";
import DebtorCommonTab from "@/new/components/debtorDialog/tabs/common/DebtorCommonTab";
import DebtorDocumentsTab from "@/new/components/debtorDialog/tabs/documents/DebtorDocumentsTab";
import DebtorFinanceTab from "@/new/components/debtorDialog/tabs/finance/DebtorFinanceTab";
import DebtorCourtsTab from "@/new/components/debtorDialog/tabs/courts/DebtorCourtsTab";
import DebtorNotificationsTab from "@/new/components/debtorDialog/tabs/notifications/DebtorNotificationsTab";

export default defineComponent({
  name: "DebtorDialog",
  components: {Icon, Rating},
  props: {
    id: Object,
    type: String,
    isNextAvailable: Object,
    onPrevious: [Function, Boolean],
    isPreviousAvailable: Object,
    onNext: [Function, Boolean],
  },
  setup(props, {emit}) {
    const data = ref();
    const type = computed(() => props.type);
    const onSave = async () => {
      await fetchData()
    }

    provide('data', data);
    provide('productionType', type);
    provide('onSave', onSave);

    const isLoading = ref(false);

    const fetchData = async () => {
      if(isLoading.value) {
        return;
      }
      isLoading.value = true;
      const response = await axios({
        method: 'get',
        url: `${baseURL}/api/debtors-data/${props.id.value}`,
        params: {
          production_type: props.type,
        }
      });
      data.value = {
        ...response.data,
        rating: Math.floor(Math.random() * 5),
      };
      isLoading.value = false;
    };

    watch(props.id, async () => {
      await new Promise(requestAnimationFrame);
      await fetchData()
    }, {
      immediate: true,
    });

    const tabs = computed(() => ([
      {
        key: 'common',
        label: 'Общая информация',
        icon: 'info',
        component: DebtorCommonTab,
      },
      {
        key: 'documents',
        label: 'Документооборот',
        icon: 'documents',
        component: DebtorDocumentsTab,
      },
      {
        key: 'finance',
        label: 'Финансовые данные',
        icon: 'wallet',
        component: DebtorFinanceTab,
      },
      type.value === 'judicial' && {
        key: 'court',
        label: 'Справочник суда и судебных дел',
        icon: 'mace',
        component: DebtorCourtsTab,
      },
      type.value === 'pretrial' && {
        key: 'notificaitons',
        label: 'Карточка уведомлений',
        icon: 'bell',
        component: DebtorNotificationsTab,
      },
      /*{
        key: 'history',
        label: 'История',
        icon: 'clock'
      },*/
    ].filter(Boolean)));

    const activeTab = ref(tabs.value[0]);
    const selectTab = tab => {
      activeTab.value = tab;
    }

    const switchDebtor = (direction) => {
      if(direction > 0 && props.onNext) {
        requestAnimationFrame(props.onNext)
      } else if (direction < 0 && props.onPrevious) {
        requestAnimationFrame(props.onPrevious)
      }
    }

    return {
      switchDebtor,

      isLoading,
      data,

      activeTab,
      selectTab,
      tabs,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorDialog";
</style>
