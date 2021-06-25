<template>
  <div
    :class="[
      $style.checkbox,
      ...(Array.isArray(state) ? state : [state]).map(s => $style[s]),
      isSelected && $style.isSelected,
      isDisabled && $style.isDisabled,
    ]"
    @click="onClick"
  >
    <div :class="$style.preLabel" v-if="preLabel">
      {{preLabel}}
    </div>
    <div :class="$style.check"/>
    <div :class="$style.label" v-if="label || ('label' in $scopedSlots || 'label' in $slots)">
      <slot name="label">{{label}}</slot>
    </div>
  </div>
</template>

<script>
import {defineComponent, computed} from "@vue/composition-api";

export default defineComponent({
  name: "Checkbox",
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    state: {
      type: [String, Array],
      default: 'radio',
    },
    modelValue: [Boolean, String, Number],
    trueValue: {
      type: [Boolean, String, Number],
      default: true
    },
    falseValue: {
      type: [Boolean, String, Number],
      default: false
    },
    label: String,
    preLabel: String,
    isDisabled: Boolean,
  },
  setup(props, {emit}) {
    const isSelected = computed(() => props.modelValue === props.trueValue);

    const onClick = () => {
      if(props.isDisabled) {
        return;
      }
      emit(
        'update:modelValue',
        isSelected.value ? props.falseValue : props.trueValue,
      )
    }

    return {
      isSelected,
      onClick,
    }
  }
})
</script>

<style lang="scss" module>
@import "./checkbox";
</style>
