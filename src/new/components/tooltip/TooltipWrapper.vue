<template>
    <div :class="$style.wrapper" @click="$emit('click', $event)">
      <slot/>
      <div :class="[
        $style.tooltip,
        $style[`${position}Position`],
        $style[`${align}Align`],
      ]">
        <Tooltip :text="text" :position="position" :align="align">
          <slot name="tooltip"/>
        </Tooltip>
      </div>
    </div>
</template>

<script>
import Tooltip from "@/new/components/tooltip/Tooltip";
export default {
  name: "TooltipWrapper",
  components: {Tooltip},
  props: {
    position: {
      type: String,
      default: 'top',
    },
    align: {
      type: String,
      default: 'start',
    },
    text: String,
  }
}
</script>

<style lang="scss" module>
@import "./tooltipWrapper";
</style>
