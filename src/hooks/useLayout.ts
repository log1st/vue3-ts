import { useStore } from 'vuex';
import { computed } from 'vue';
import { LayoutState } from '@/store/modules/layout';

export enum Theme {
  light = 'light',
  dark = 'dark'
}

export const useLayout = () => {
  const store = useStore();

  const theme = computed({
    get: () => store.getters['layout/theme'],
    set: (theme: Theme) => store.commit('layout/setTheme', theme),
  });

  const settings = computed<LayoutState['settings']>(() => (
    store.getters['layout/settings']
  ));

  const isPreloaderVisible = computed({
    get() {
      return store.getters['layout/isPreloaderVisible'];
    },
    async set(value: boolean) {
      await store.dispatch(`layout/${value ? 'show' : 'hide'}Preloader`);
    },
  });

  return {
    theme,
    settings,
    isPreloaderVisible,
  };
};
