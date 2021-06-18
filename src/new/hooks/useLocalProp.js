import {computed} from "@vue/composition-api";

export const useLocalProp = (props, emit, propName) => {
  return computed({
    get() {
      return props[propName]
    },
    set(value) {
      emit(`update:${propName}`, value)
    }
  })
}
