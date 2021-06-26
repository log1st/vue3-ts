import { computed } from '@vue/composition-api';

export const useModifiers = (source) => computed(
  () => (Object.keys(source.value || {}).map((modifier) => {
    const parts = modifier.split(':');
    return {
      name: parts[0],
      params: parts.slice(1),
    };
  }).reduce((acc, cur) => ({
    ...acc,
    [cur.name]: cur.params,
  }), {})),
);
