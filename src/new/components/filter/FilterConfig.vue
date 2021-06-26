<template>
  <div :class="$style.filter">
    <SelectInput
      v-if="type === 'select'"
      :state="['primary', 'dark']"
      v-model="value"
      v-bind="(({onQuery, ...newProps}) => newProps)(props)"
      v-on="{
        ...(props.onQuery ? {
          query: props.onQuery
        } : {})
      }"
    />
    <TextInput
      v-else-if="type === 'text'"
      :state="['primary', 'dark']"
      v-model="value"
      :modelValueModifiers="{
        'delay:500': true,
      }"
      v-bind="props"
    />
  </div>
</template>

<script>
import {defineComponent} from '@vue/composition-api';
import {useLocalProp} from "@/new/hooks/useLocalProp";
import SelectInput from "@/new/components/selectInput/SelectInput";
import TextInput from "@/new/components/textInput/TextInput";

export default defineComponent({
  name: "FilterConfig",
  components: {TextInput, SelectInput},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    type: String,
    modelValue: [String, Number, Object, Array, Boolean],
    props: Object,
  },
  setup(props, {emit}) {
    const value = useLocalProp(props, emit, 'modelValue');

    return {
      value,
    }
  }
});
</script>

<style lang="scss" module>
@import "filterConfig";
</style>
