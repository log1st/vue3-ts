<template>
  <div :class="$style.menu">
    <div
      :class="[
        $style.action,
        modelValue === action.key && $style.isActive,
      ]"
      v-for="action in actions"
      :key="action.key"
      @click="onClick(action)"
    >
      {{action.label}}
    </div>
  </div>
</template>

<script>
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: "ContextMenu",
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    actions: Array,
    modelValue: [String, Number],
  },
  setup(props, {emit}) {
    const close = () => {
      emit('close');
    }

    const onClick = ({onClick, key}) => {
      onClick && onClick();
      emit('update:modelValue', key);
      requestAnimationFrame(close);
    }

    return {
      onClick,
    }
  }
})
</script>

<style lang="scss" module>
@import "./contextMenu";
</style>
