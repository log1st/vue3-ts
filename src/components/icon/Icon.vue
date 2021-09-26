<template>
  <div
    :class="[
      $style.icon,
      spin && $style.spin
    ]"
    @click="onClick"
  >
    <component
      :is="render"
      v-if="inline"
      data-role="source"
      :class="$style.source"
    />
    <svg
      v-else
      data-role="source"
      :class="$style.source"
    >
      <use :xlink:href="customIcon || `#icon-${icon}`" />
    </svg>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'Icon',
  props: {
    icon: String,
    customIcon: String,
    spin: Boolean,
    inline: Boolean,
  },
  emits: ['click'],
  setup(props, { emit }) {
    const onClick = (e: PointerEvent) => {
      emit('click', e);
    };

    const render = computed(() => (
      require(`./assets/${props.icon}.inline.svg`).default
    ));

    return {
      onClick,
      render,
    };
  },
});
</script>

<style lang="scss" module>
@import "./icon";
</style>
