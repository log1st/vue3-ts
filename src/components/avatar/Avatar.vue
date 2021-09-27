<template>
  <div
    :class="$style.avatar"
    :style="{
      background: `url(${url})`
    }"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IAvatar } from '@/components/avatar/useAvatar';

export default defineComponent({
  name: 'Avatar',
  props: {
    url: {
      type: String as PropType<IAvatar['url']>,
      default: require('./assets/defaultAvatar.svg'),
    },
  },
});
</script>

<style lang="scss" module>
@import "./avatar";
</style>
