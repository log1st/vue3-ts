<template>
  <div class="checkbox-big" @click="$emit('changeCheckbox', checked)">
    <transition name="fade">
      <div class="checkbox-big__inner" :class="{ checked: checked }">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  }
}
</script>
