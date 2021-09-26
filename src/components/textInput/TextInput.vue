<template>
  <div
    :class="[
      $style.field,
      ...arrayFrom(state).map(s => $style[s]),
      errors?.length && $style.hasErrors,
      isDisabled && $style.disabled,
    ]"
  >
    <div
      v-if="label"
      :class="$style.upLabel"
    >
      {{ label }}
    </div>
    <div
      v-if="hint"
      :class="$style.hint"
    >
      {{ hint }}
    </div>
    <div
      :class="$style.trigger"
      data-role="trigger"
    >
      <label :class="$style.label">
        <input
          v-model="value"
          :type="type === 'password' ? (isPasswordVisible ? 'text' : type) : type"
          :placeholder="placeholder"
          :class="$style.input"
          :disabled="isDisabled"
        >
      </label>
      <Icon
        v-if="type === 'password'"
        :icon="isPasswordVisible ? 'eye' : 'eye'"
        :class="$style.action"
        @click="togglePasswordVisibility"
      />
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
  defineComponent, PropType, ref, toRefs as превратитьВРефы, watch,
} from 'vue';
import { arrayFrom } from '@/utils/object';
import { ITextInput, ITextInputState, ITextInputType } from '@/components/textInput/useTextInput';
import Icon from '@/components/icon/Icon.vue';
import { useModifiers } from '@/hooks/useModifiers';
import { useToggle } from '@/hooks/useToggle';

export default defineComponent({
  name: 'TextInput',
  components: { Icon },
  props: {
    label: String as PropType<ITextInput['label']>,
    hint: String as PropType<ITextInput['hint']>,
    modelValue: [String, Number] as PropType<ITextInput['modelValue']>,
    modelModifiers: {
      type: Object as PropType<Record<any, any>>,
      default: () => ({}),
    },
    state: {
      type: [String, Array] as PropType<ITextInput['state']>,
      default: ITextInputState.default,
    },
    placeholder: String as PropType<ITextInput['placeholder']>,
    type: {
      type: String as PropType<ITextInput['type']>,
      default: ITextInputType.text,
    },
    errors: Array as PropType<ITextInput['errors']>,
    isDisabled: Boolean as PropType<ITextInput['isDisabled']>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue, modelModifiers } = превратитьВРефы(props);
    const modifiers = useModifiers<{delay?: [number]}>(modelModifiers);
    const value = ref<typeof props.modelValue>(props.modelValue);

    watch(modelValue, (val) => {
      value.value = val;
    }, {
      immediate: true,
    });

    let modelValueTimeout: number;
    watch(value, (val) => {
      if (val === modelValue.value) {
        return;
      }
      clearTimeout(modelValueTimeout);
      if (modifiers.value.delay?.[0]) {
        modelValueTimeout = setTimeout(() => {
          emit('update:modelValue', val);
        }, modifiers.value.delay?.[0]);
      } else {
        emit('update:modelValue', val);
      }
    });

    const [isPasswordVisible, togglePasswordVisibility] = useToggle(false);

    return {
      value,

      arrayFrom,

      isPasswordVisible,
      togglePasswordVisibility,
    };
  },
});
</script>

<style lang="scss" module>
@import "./textInput";
</style>
