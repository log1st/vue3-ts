<template>
  <div :class="[
    $style.tooltip,
    $style[`${position}Position`],
    $style[`${align}Align`],
  ]">
    <div :class="$style.content">
      <slot>{{text}}</slot>
    </div>
    <svg :class="$style.arrow" viewBox="0 0 8 7" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.86603 6.5C4.48113 7.16667 3.51887 7.16667 3.13397 6.5L0.535899 2C0.150999 1.33333 0.632124 0.5 1.40192 0.5L6.59808 0.500001C7.36788 0.500001 7.849 1.33333 7.4641 2L4.86603 6.5Z"/>
    </svg>
  </div>
</template>

<script>
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: "Tooltip",
  props: {
    text: String,
    position: {
      type: String,
      default: 'top',
    },
    align: {
      type: String,
      default: 'start',
    },
  }
})
</script>

<style lang="scss" module>
@import "./tooltip";
</style>
