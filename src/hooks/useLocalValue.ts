import {
  computed,
  SetupContext,
  WritableComputedRef,
} from 'vue';

export const useLocalValue = <T, S extends keyof T>(
  props: T,
  field: S,
  emit: SetupContext['emit'] | any,
  serialize = false,
): WritableComputedRef<T[S]> => computed({
    get: () => props[field],
    set: (newValue: T[S]) => {
      emit(`update:${field}`, serialize ? JSON.parse(JSON.stringify(newValue)) : newValue);
    },
  });
