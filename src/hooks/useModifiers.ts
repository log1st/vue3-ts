import { computed, ComputedRef, Ref } from 'vue';

export const useModifiers = <T>(source: Ref<Record<any, any>>): ComputedRef<T> => computed(
  () => (Object.keys(source.value || {}).map((modifier) => {
    const parts = modifier.split(':');
    return {
      name: parts[0],
      params: parts.slice(1),
    };
  }).reduce((acc, cur) => ({
    ...acc,
    [cur.name]: cur.params,
  }), {})) as unknown as T,
);
