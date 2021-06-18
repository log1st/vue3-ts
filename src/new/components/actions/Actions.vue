<template>
  <div :class="[
    $style.actions,
    actions.length <= 1 && $style.oneAction,
  ]">
    <TooltipWrapper
      :class="$style.action"
      v-for="action in actions"
      :key="action.key"
      :text="action.label"
      @click="action.onClick"
      align="center"
    >
      <Icon :icon="action.icon" :class="$style.icon"/>
    </TooltipWrapper>
  </div>
</template>

<script>
import TooltipWrapper from "@/new/components/tooltip/TooltipWrapper";
import Icon from "@/new/components/icon/Icon";
export default {
  name: "Actions",
  components: {Icon, TooltipWrapper},
  props: {
    actions: Array,
  }
}
</script>

<style lang="scss" module>
@import "./actions";
</style>
