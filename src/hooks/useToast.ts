import { useStore } from 'vuex';
import { computed, Ref } from 'vue';

export enum IToastLevel {
  danger = 'danger',
  info = 'info',
  warning = 'warning',
  success = 'success'
}

export type IToastProgressbar = {
  key: string;
  label?: string;
  max: number;
  current: number;
}

export type IToast = {
  id?: string;
  label?: string;
  message?: string;
  params?: Record<string, any>;
  duration?: number | null;
  isCloseable?: boolean;
  level?: IToastLevel;
  progressbars: Ref<Array<IToastProgressbar>>;
}

export const useToast = () => {
  const store = useStore();

  const toasts = computed<Array<IToast>>(() => (
    store.getters['layout/toasts']
  ));

  const showToast = async (toast: Partial<IToast>) => (
    store.dispatch('layout/showToast', toast)
  );

  const closeToastById = async (toastId: IToast['id']) => (
    store.dispatch('layout/closeToastById', toastId)
  );

  return {
    toasts,
    showToast,
    closeToastById,
  };
};
