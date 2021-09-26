<template>
  <div
    :class="[
      $style.field,
      errors?.length && $style.hasErrors
    ]"
  >
    <div :class="$style.inputs">
      <input
        v-for="i in length"
        :ref="setInputRef"
        :key="i"
        :value="value[i - 1]"
        :maxlength="1"
        :class="$style.input"
        @input="onInput(i - 1, $event)"
        @focus="onFocus(i - 1)"
        @paste.prevent="onPaste"
        @keydown="onKeyPress(i - 1, $event)"
      >
    </div>
    <div
      v-if="errors"
      :class="$style.errors"
    >
      <div
        v-for="error in errors || []"
        :key="error"
        :class="$style.error"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onBeforeUpdate, PropType, ref, toRefs, watch,
} from 'vue';
import { IConfirmationCode } from '@/components/confirmationCode/useConfirmationCode';
import { awaitFrame } from '@/utils/window';

export default defineComponent({
  name: 'ConfirmationCode',
  props: {
    modelValue: String as PropType<IConfirmationCode['modelValue']>,
    length: Number as PropType<IConfirmationCode['length']>,
    errors: Array as PropType<IConfirmationCode['errors']>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const value = ref(modelValue.value);

    watch(modelValue, (val) => {
      value.value = val;
    }, {
      immediate: true,
    });

    watch(value, (val) => {
      emit('update:modelValue', val);
    });

    const inputRefs = ref<Array<HTMLInputElement>>([]);
    onBeforeUpdate(() => {
      inputRefs.value = [];
    });
    const setInputRef = (input?: HTMLInputElement) => {
      if (!input) {
        return;
      }
      inputRefs.value.push(input);
    };

    const onInput = (index: number, { target }: {target: HTMLInputElement}) => {
      value.value = Array(props.length)
        .fill('')
        .map((c, i) => (i === index ? target.value : value.value?.[i])).filter(Boolean)
        .join('');
    };

    const onKeyPress = async (index: number, e: KeyboardEvent) => {
      await awaitFrame();
      inputRefs.value[
        index + ([8, 46].includes(e.keyCode || e.charCode) ? -1 : 1)
      ]?.focus();
    };

    const onFocus = (index: number) => {
      inputRefs.value[index].select();
    };

    const onPaste = async (e: ClipboardEvent) => {
      value.value = e.clipboardData?.getData('text').slice(0, 6) || '';
      inputRefs.value[inputRefs.value.length - 1]?.focus();
      await awaitFrame();
      inputRefs.value[inputRefs.value.length - 1]?.select();
    };

    return {
      value,

      setInputRef,
      inputRefs,

      onInput,
      onFocus,
      onPaste,
      onKeyPress,
    };
  },
});
</script>

<style lang="scss" module>
@import "./confirmationCode";
</style>
