import { Ref, ref, UnwrapRef } from 'vue';
import { awaitFrame } from '@/utils/window';

export const useToggle = <T extends boolean | any = boolean>(
  defaultValue: T = false as T,
  trueValue: T = true as T,
  falseValue: T = false as T,
): [
  state: Ref<UnwrapRef<T>>,
  toggleState: () => void,
  setState: (value: T) => void,
] => {
  const state = ref<T>(defaultValue);

  const setState = async (value: T) => {
    await awaitFrame();
    state.value = value as typeof state.value;
  };

  const toggleState = async () => {
    await setState(
      state.value === trueValue ? falseValue : trueValue,
    );
  };

  return [
    state,
    toggleState,
    setState,
  ];
};
