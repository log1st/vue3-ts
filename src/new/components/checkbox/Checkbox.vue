<template>
  <div
    :class="[
      $style.checkbox,
      isSelected && $style.isSelected
    ]"
    @click="onClick"
  >
    <div :class="$style.preLabel" v-if="preLabel">
      {{preLabel}}
    </div>
    <div :class="$style.check"/>
    <div :class="$style.label" v-if="label">
      {{label}}
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
  },
  setup(props, {emit}) {
    const isSelected = computed(() => props.modelValue === props.trueValue);

    const onClick = () => {
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
