<template>
  <div
    :class="[
      $style.container,
      $style[state],
      isDisabled && $style.isDisabled,
      isActive && $style.isActive,
    ]"
    v-outside-click="hide"
  >
    <div
      :class="$style.trigger"
      @click="toggle"
    >
      <input
        v-if="isActive && isSearchable"
        :class="$style.search"
        v-model="query"
        :placeholder="searchPlaceholder"
      />
      <div :class="$style.value" v-else-if="displayValue">
        {{displayValue}}
      </div>
      <div :class="$style.placeholder" v-else-if="placeholder">
        {{placeholder}}
      </div>
      <Icon :class="$style.caret" icon="chevron-down"/>
    </div>
    <ContextMenu
      v-if="isActive"
      :actions="computedOptions"
      :class="$style.options"
      v-model="value"
      @close="hide"
    />
  </div>
</template>

<script>
import {defineComponent, ref, computed} from '@vue/composition-api';
import Icon from "@/new/components/icon/Icon";
import ContextMenu from "@/new/components/contextMenu/ContextMenu";
import {useLocalProp} from "@/new/hooks/useLocalProp";

export default defineComponent({
  name: "SelectInput",
  components: {ContextMenu, Icon},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    state: {
      type: String,
      default: 'primary',
    },
    modelValue: [String, Number],

    placeholder: String,

    isDisabled: Boolean,
    isMultiple: Boolean,

    options: Array,

    isSearchable: Boolean,
    searchPlaceholder: String,
    searchDelay: Number,

    valueProp: {
      type: String,
      default: 'value'
    },
    displayProp: {
      type: String,
      default: 'label',
    }
  },
  setup(props, {emit}) {
    const isActive = ref(false);
    const toggle = () => {
      if(props.isDisabled) {
        return;
      }
      isActive.value = !isActive.value;
    };
    const hide = () => {
      isActive.value = false;
    };

    const value = useLocalProp(props, emit, 'modelValue');

    const optionsMap = computed(() => (
      props.options.reduce((acc, cur) => ({
        ...acc,
        [cur[props.valueProp]]: cur
      }), {})
    ));

    const displayValue = computed(() => (
      props.isMultiple
        ? value.value.map(i => optionsMap.value[i][props.displayProp]).join(', ')
        : optionsMap.value[value.value]?.[props.displayProp]
    ));

    const query = ref('');

    const computedOptions = computed(() => (
      props.options.map(option => ({
        key: option[props.valueProp],
        label: option[props.displayProp],
      }))
    ))

    return {
      isActive,
      toggle,
      hide,

      value,

      displayValue,

      query,

      computedOptions,
    }
  }
});
</script>

<style lang="scss" module>
@import "./selectInput";
</style>
