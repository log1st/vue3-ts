<template>
  <div
    :class="[
      $style.container,
      ...(Array.isArray(state) ? state : [state]).map(i => $style[i]),
      isDisabled && $style.isDisabled,
    ]"
  >
    <div :class="$style.label" v-if="label">
      {{label}}
    </div>
    <div :class="$style.trigger">
      <input
        :class="$style.input"
        v-model="value"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, computed, watch} from '@vue/composition-api';
import {useLocalProp} from "@/new/hooks/useLocalProp";
import {useModifiers} from "@/new/hooks/useModifiers";

export default defineComponent({
  name: "TextInput",
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    state: {
      type: [String, Array],
      default: 'primary',
    },
    modelValue: [String, Number],

    placeholder: String,
    label: String,

    isDisabled: Boolean,

    modelValueModifiers: String,
  },
  setup(props, {emit}) {
    const value = useLocalProp(props, emit, 'modelValue', true);
    const valueModifiers = useModifiers(computed(() => props.modelValueModifiers));

    let valueTimeout;
    watch(value, (value) => {
      if (props.isDisabled) {
        return;
      }
      clearTimeout(valueTimeout);
      if (valueModifiers.value.delay?.[0]) {
        valueTimeout = setTimeout(() => {
          emit('update:modelValue', value);
        }, valueModifiers.value.delay[0]);
      } else {
        emit('update:modelValue', value);
      }
    });

    return {
      value,
    }
  }
});
</script>

<style lang="scss" module>
@import "textInput";
</style>
