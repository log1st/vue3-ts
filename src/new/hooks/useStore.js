import {inject} from "@vue/composition-api";

export const useStore = () => {
  return inject('store');
}
