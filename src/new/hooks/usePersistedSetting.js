import {useStore} from "@/new/hooks/useStore";
import {computed} from '@vue/composition-api';

export const usePersistedSetting = (key, defaultValue) => {
  const store = useStore();

  return computed({
    get() {
      return store.getters['persistence/getItem'](key.value, defaultValue);
    },
    set(value) {
      store.commit('persistence/setItem', {key: key.value, value})
    }
  });
}
