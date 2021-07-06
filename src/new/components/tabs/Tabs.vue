<template>
  <div :class="[
    $style.tabs,
    $style[state]
  ]">
    <router-link
      v-for="tab in tabs"
      :key="tab.key"
      :to="tab.url"
      :class="$style.tab"
      :active-class="!tab.exact ? $style.active : null"
      :exact-active-class="tab.exact ? $style.active : null"
    >
      <Icon :icon="tab.icon" v-if="tab.icon" :class="$style.icon"/>
      <div :class="$style.label">
        {{tab.label}}
      </div>
    </router-link>
  </div>
</template>

<script>
import {defineComponent} from "@vue/composition-api";
import Icon from "@/new/components/icon/Icon";

export default defineComponent({
  name: "Tabs",
  components: {Icon},
  props: {
    tabs: Array,
    state: {
      type: String,
      default: 'primary',
    }
  }
})
</script>

<style lang="scss" module>
@import "./tabs";
</style>
