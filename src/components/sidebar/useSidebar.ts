import { useStore } from 'vuex';
import { computed } from 'vue';
import { RouteRecordRaw } from 'vue-router';

export type SidebarMenuItem = {
  key: string;
  label?: string;
  icon: string;
  to: Partial<RouteRecordRaw>;
}

export const useSidebar = () => {
  const store = useStore();

  const isExpanded = computed<boolean>(() => (
    store.getters['layout/isSidebarExpanded']
  ));

  const toggle = async () => {
    await store.dispatch('layout/toggleSidebar');
  };

  return {
    isExpanded,
    toggle,
  };
};
