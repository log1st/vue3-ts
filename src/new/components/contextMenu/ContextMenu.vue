<template>
  <div :class="$style.menu">
    <div
      :class="$style.action"
      v-for="action in actions"
      :key="action.key"
      @click="onClick(action.onClick)"
    >
      {{action.label}}
    </div>
  </div>
</template>

<script>
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: "ContextMenu",
  props: {
    actions: Array,
  },
  setup(props, {emit}) {
    const onClick = (handler) => {
      handler && handler();
      emit('close');
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
