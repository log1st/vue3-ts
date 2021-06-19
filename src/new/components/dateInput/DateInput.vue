<template>
  <div
    :class="[
      $style.container,
      ...(Array.isArray(state) ? state : [state]).map(i => $style[i]),
      isDisabled && $style.isDisabled,
      isActive && $style.isActive,
    ]"
    v-outside-click="hide"
  >
    <div :class="$style.label" v-if="label">
      {{label}}
    </div>
    <div
      :class="$style.trigger"
      @click="toggle"
    >
      <div :class="$style.value" v-if="displayValue">
        {{displayValue}}
      </div>
      <div :class="$style.placeholder" v-else-if="placeholder">
        {{placeholder}}
      </div>
      <Icon :class="$style.caret" icon="chevron-down"/>
    </div>
    <Calendar
      v-if="isActive"
      :class="$style.picker"
      v-model="value"
      @close="hide"
    />
  </div>
</template>

<script>
import {defineComponent, ref, computed, watch} from '@vue/composition-api';
import Icon from "@/new/components/icon/Icon";
import ContextMenu from "@/new/components/contextMenu/ContextMenu";
import Calendar from "./calendar/Calendar";
import {useLocalProp} from "@/new/hooks/useLocalProp";
import {formatDate} from "@/new/utils/date";

export default defineComponent({
  name: "DateInput",
  components: {ContextMenu, Icon, Calendar},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    state: {
      type: [String, Array],
      default: 'primary',
    },
    modelValue: [Date, Array],

    placeholder: String,
    label: String,

    isDisabled: Boolean,
    isMultiple: Boolean,
  },
  setup(props, {emit}) {

    const isActive = ref(false);
    const toggle = async () => {
      if(props.isDisabled) {
        return;
      }
      await new Promise(requestAnimationFrame);
      isActive.value = !isActive.value;
      if(isActive.value) {
        await new Promise(requestAnimationFrame);
      }
    };

    const hide = () => {
      isActive.value = false;
    };

    const value = useLocalProp(props, emit, 'modelValue');

    const displayValue = computed(() => (
      Array.isArray(value.value)
        ? value.value.map(i => formatDate(i)).join(' - ')
        : formatDate(value.value)
    ));

    return {
      isActive,
      toggle,
      hide,

      value,

      displayValue,
    }
  }
});
</script>

<style lang="scss" module>
@import "dateInput";
</style>
