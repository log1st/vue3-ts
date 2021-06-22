<template>
  <div :class="$style.field">
    <div :class="$style.label" v-if="label">
      {{label}}
    </div>
    <div :class="$style.options">
      <Checkbox
        v-model="value"
        v-for="option in options"
        :key="option.value"
        :true-value="option.value"
        :label="option.label"
        :class="$style.option"
      />
    </div>
  </div>
</template>

<script>
import {defineComponent} from "@vue/composition-api";
import {useLocalProp} from "@/new/hooks/useLocalProp";
import Checkbox from "@/new/components/checkbox/Checkbox";

export default defineComponent({
  name: "RadioGroup",
  components: {Checkbox},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: [String, Number, Boolean],
    options: Array,
    isDisabled: Boolean,
    label: String,
  },
  setup(props, {emit}) {
    const value = useLocalProp(props, emit, 'modelValue');

    return {
      value,
    }
  }
})
</script>

<style lang="scss" module>
@import "./radioGroup";
</style>
