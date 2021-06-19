<template>
  <div :class="$style.filters">

  </div>
</template>

<script>
import {defineComponent} from "@vue/composition-api";
import {useLocalProp} from "@/new/hooks/useLocalProp";

export default defineComponent({
  name: "Filters",
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: Object,
    filters: Array,
  },
  setup(props, {emit}) {
    const value = useLocalProp(props, emit, 'modelValue');

    return {
      value
    }
  }
})
</script>

<style lang="scss" module>
@import "./filters";
</style>
