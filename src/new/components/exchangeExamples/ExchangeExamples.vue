<template>
  <div :class="$style.examples">
    <a download target="_blank" :href="example.file" :class="$style.example" v-for="example in examples" :key="example.type">
      <div :class="$style.type">{{example.type}}</div>
      <div :class="$style.label">файл</div>
    </a>
  </div>
</template>

<script>
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: "ExchangeExamples",
  props: {
    examples: Array,
  }
})
</script>

<style lang="scss" module>
@import "./exchangeExamples";
</style>
