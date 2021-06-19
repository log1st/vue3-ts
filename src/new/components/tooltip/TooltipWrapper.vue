<template>
    <div
      :class="[
        $style.wrapper,
        $style[`${trigger}Trigger`],
      ]"
      @click="$emit('click', $event)"
    >
      <slot/>
      <div :class="[
        $style.tooltip,
        $style[`${position}Position`],
        $style[`${align}Align`],
      ]">
        <slot name="tooltip">
          <Tooltip :text="text" :position="position" :align="align">
            <slot name="tooltip-content"/>
          </Tooltip>
        </slot>
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
    trigger: {
      type: String,
      default: 'hover',
    },
    text: String,
  }
}
</script>

<style lang="scss" module>
@import "./tooltipWrapper";
</style>
