<template>
  <div :class="$style.common">
    <div :class="$style.tabs">
      <div :class="[
        $style.tab,
        activeTab.key === tab.key && $style.activeTab
      ]" v-for="tab in tabs" :key="tab.key" @click="selectTab(tab)">
        {{tab.label}}
      </div>
    </div>
    <div :class="$style.content">
      <component :is="activeTab.component"/>
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, inject, ref} from "@vue/composition-api";
import DebtorCommonMainTab from "./tabs/main/DebtorCommonMainTab";
import DebtorCommonResidentsTab from "./tabs/residents/DebtorCommonResidentsTab";
import DebtorCommonOwnersTab from "@/new/components/debtorDialog/tabs/common/tabs/owners/DebtorCommonOwnersTab";

export default defineComponent({
  name: "DebtorCommonTab",
  setup() {
    const data = inject('data');

    const tabs = computed(() => ([
      {
        key: 'main',
        label: 'Главная',
        component: DebtorCommonMainTab,
      },
      {
        key: 'residents',
        label: 'Список жильцов',
        component: DebtorCommonResidentsTab,
      },
      {
        key: 'owners',
        label: 'Собственники',
        component: DebtorCommonOwnersTab,
      },
    ]));

    const activeTab = ref(tabs.value[0]);
    const selectTab = tab => {
      activeTab.value = tab;
    }

    return {
      activeTab,
      selectTab,
      tabs,

      data,
    }
  }
})
</script>

<style lang="scss" module>
  @import "./debtorCommonTab";
</style>
