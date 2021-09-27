import {
  computed, onBeforeUnmount, ref, watch,
} from 'vue';
import { arrayFrom } from '@/utils/object';
import { IToastLevel, useToast } from '@/hooks/useToast';

export type SourceErrors<T extends string> = Array<[key: keyof T, errors: string[] | string]>

export type ErrorsMap<T extends string> = {
  [key in T]: string[];
}

export const useErrors = <T extends string>(withToast = true) => {
  const sourceErrors = ref<SourceErrors<T>>([]);
  const errorsMap = computed<ErrorsMap<T>>(() => (
    sourceErrors.value.reduce((acc, [key, errors]) => ({
      ...acc,
      [key]: arrayFrom(errors),
    }), {} as ErrorsMap<T>)
  ));

  const setErrors = (errors: SourceErrors<T>) => {
    // @TODO что-то не так с типизацией параметра из рефа
    sourceErrors.value.push(...errors as any);
  };

  const clearErrors = () => {
    sourceErrors.value = [];
  };

  const { showToast } = useToast();

  if (withToast) {
    const unsubs: Array<() => void> = [];
    onBeforeUnmount(() => {
      unsubs.forEach((unsub) => unsub());
    });
    watch(computed(() => [
      // sourceErrors.value[0]?.[0],
      arrayFrom(sourceErrors.value[0]?.[1])[0],
    ].filter(Boolean).join(': ')), async (error) => {
      if (!error) {
        return;
      }
      unsubs.push(
        await showToast({
          message: 'pure',
          params: {
            message: error,
          },
          level: IToastLevel.danger,
        }),
      );
    }, {
      immediate: true,
    });
  }

  return {
    errorsMap,
    setErrors,
    clearErrors,
  };
};
