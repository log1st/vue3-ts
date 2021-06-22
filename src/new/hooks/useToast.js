import {computed} from "@vue/composition-api";
import {useStore} from "@/new/hooks/useStore";

export const useToast = () => {
  const store = useStore();

  const toasts = computed(() => (
    store.getters['toasts/toasts']
  ));

  const showToast = async (toast) => {
    const { id } = await store.dispatch('toasts/showToast', toast);

    return id;
  };

  const hideToastById = async (id) => {
    await store.dispatch('toasts/hideToastById', id);
  };

  return {
    toasts,
    showToast,
    hideToastById,
  };
}
