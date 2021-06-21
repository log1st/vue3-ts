import {computed, watch, ref} from "@vue/composition-api";
import {getDeepField} from "@/new/utils/object";
import {cloneDeep} from "lodash";

export const useLocalProp = (props, emit, propName, asRef = false, watchRef = false) => {
  if(asRef) {
    const localValue = ref(
      cloneDeep(getDeepField(props, propName))
    );
    watch(computed(() => getDeepField(props, propName)), newValue => {
      if(watchRef) {
        localValue.value = cloneDeep(newValue)
      }
    }, {
      immediate: true,
      deep: true,
    });
    return localValue;
  }

  return computed({
    get() {
      return getDeepField(props, propName)
    },
    set(value) {
      emit(`update:${propName}`, value)
    }
  })
}
