<template>
  <div :class="$style.rating">
    <Icon
      v-for="i in 5"
      :key="i"
      :icon="i < modelValue ? 'star-filled' : 'star-outline'"
      :class="$style.star"
    />
  </div>
</template>

<script>
import Icon from "@/new/components/icon/Icon";
import {defineComponent} from "@vue/composition-api";
export default defineComponent({
  name: "Rating",
  components: {Icon},
  props: {
    modelValue: Number,
  }
})
</script>

<style lang="scss" module>
@import "./rating";
</style>
