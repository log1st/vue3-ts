<template>
  <div :class="$style.tabs">
    <router-link
      v-for="tab in tabs"
      :key="tab.key"
      :to="tab.url"
      :class="$style.tab"
      :active-class="!tab.exact ? $style.active : null"
      :exact-active-class="tab.exact ? $style.active : null"
    >
      {{tab.label}}
    </router-link>
  </div>
</template>

<script>
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: "Tabs",
  props: {
    tabs: Array,
  }
})
</script>

<style lang="scss" module>
@import "./tabs";
</style>
