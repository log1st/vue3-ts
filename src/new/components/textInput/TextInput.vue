<template>
  <div
    :class="[
      $style.container,
      ...(Array.isArray(state) ? state : [state]).map(i => $style[i]),
      isDisabled && $style.isDisabled,
      !!error && $style.hasError,
    ]"
  >
    <div :class="$style.label" v-if="label">
      {{label}}
    </div>
    <label :class="$style.trigger">
      <span :class="$style.prepend" v-if="('prepend' in $scopedSlots || 'prepend' in $slots)">
        <slot name="prepend"/>
      </span>
      <input
        :class="$style.input"
        v-model="value"
        :placeholder="placeholder"
      />
    </label>
    <div v-if="error" :class="$style.error">
      {{error}}
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

    modelValueModifiers: {
      type: Object,
      default: () => ({})
    },

    error: String,
  },
  setup(props, {emit}) {
    const value = useLocalProp(props, emit, 'modelValue', true);
    const valueModifiers = useModifiers(computed(() => props.modelValueModifiers));

    console.log(valueModifiers.value);

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
