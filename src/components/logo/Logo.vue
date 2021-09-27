<template>
  <div
    :class="[
      $style.logo,
      $style[state]
    ]"
    data-role="logo"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ILogo, ILogoState } from '@/components/logo/useLogo';

export default defineComponent({
  name: 'Logo',
  props: {
    state: {
      type: String as PropType<ILogo['state']>,
      default: ILogoState.default,
    },
  },
});
</script>

<style lang="scss" module>
@import "./logo";
</style>
