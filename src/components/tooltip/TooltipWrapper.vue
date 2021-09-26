<template>
  <div :class="$style.wrapper">
    <div :class="$style.tooltip">
      <slot name="tooltip">
        {{ label }}
      </slot>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

// @TODO реализовать поппер
export default defineComponent({
  name: 'TooltipWrapper',
  props: {
    label: String as PropType<string>,
  },
});
</script>

<style lang="scss" module>
@import "./tooltipWrapper";
</style>
