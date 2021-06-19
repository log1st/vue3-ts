import {computed, watch, ref} from "@vue/composition-api";

export const useLocalProp = (props, emit, propName, asRef = false) => {
  if(asRef) {
    const localValue = ref((typeof props[propName] === 'object' && props[propName] !== null) ? (
      Array.isArray(props[propName]) ? [...props[propName]] : {...props[propName]}
    ) : props[propName]);
    watch(computed(() => props[propName]), newValue => {
      // localValue.value = newValue
    }, {
      immediate: true,
      deep: true,
    });
    return localValue;
  }

  return computed({
    get() {
      return props[propName]
    },
    set(value) {
      emit(`update:${propName}`, value)
    }
  })
}
