<template>
  <div
    :class="[
      $style.actions,
      actions.length <= 1 && $style.oneAction,
    ]"
    v-outside-click="hide"
  >
    <TooltipWrapper
      :class="$style.actionWrapper"
      :position="action.position || 'bottom'"
      :align="action.align || 'start'"
      trigger="click"
      v-for="action in actions"
      :key="action.key"
    >
      <TooltipWrapper
        :class="[
          $style.action,
          model === action.key && $style.isActive,
        ]"
        :text="action.label"
        @click="onClick(action)"
        align="center"
      >
        <Icon :icon="action.icon" :class="$style.icon"/>
      </TooltipWrapper>
      <template #tooltip>
        <div :class="$style.content">
          <slot :name="action.key" :is-active="modelValue === action.key"/>
        </div>
      </template>
    </TooltipWrapper>
  </div>
</template>

<script>
import TooltipWrapper from "@/new/components/tooltip/TooltipWrapper";
import Icon from "@/new/components/icon/Icon";
import {computed} from "@vue/composition-api";
export default {
  name: "Actions",
  components: {Icon, TooltipWrapper},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    actions: Array,
    modelValue: [String, Number],
  },
  setup(props, {emit}) {
    const model = computed({
      get() {
        return props.modelValue;
      },
      set(val) {
        emit('update:modelValue', val === model.value ? null : val);
      }
    });

    const onClick = (action) => {
      action.onClick && action.onClick();
      model.value = action.key;
    };

    const hide = () => {
      model.value = null;
    }

    return {
      model,
      onClick,
      hide,
    }
  }
}
</script>

<style lang="scss" module>
@import "./actions";
</style>
