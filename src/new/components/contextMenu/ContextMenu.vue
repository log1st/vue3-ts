<template>
  <div :class="$style.menu">
    <div
      :class="[
        $style.action,
        (
          Array.isArray(modelValue)
            ? modelValue.includes(action.key)
            : modelValue === action.key
        ) && $style.isActive,
      ]"
      v-for="(action, index) in actions"
      :key="action.key"
      @click="onClick({...action, index})"
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
    modelValue: [String, Number, Boolean, Array],
  },
  setup(props, {emit}) {
    const close = () => {
      emit('close');
    }

    const onClick = ({onClick, key, index}) => {
      onClick && onClick({key, index});

      if(Array.isArray(props.modelValue)) {
        const localValue = [...props.modelValue];
        const index = localValue.indexOf(key);
        if(index === -1) {
          localValue.push(key)
        } else {
          localValue.splice(index, 1)
        }
        emit('update:modelValue', localValue);
      } else {
        emit('update:modelValue', key);
      }
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
