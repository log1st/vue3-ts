<template>
  <div :class="$style.page">
    <router-view :class="$style.view"/>
  </div>
</template>

<script>
import {defineComponent} from '@vue/composition-api';

export default defineComponent({
  name: 'index',
  setup() {
    return {
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
