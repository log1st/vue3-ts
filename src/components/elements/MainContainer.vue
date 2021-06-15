<template>
  <div class="main-container">
    <div v-if="title" class="main-container__head">
      <div class="main-container__title" v-html="title"></div>
    </div>
    <div v-if="!$slots.nobody" :class="'main-container__body ' + elemClass">
      <slot></slot>
    </div>
    <slot name="nobody"></slot>
  </div>
</template>

<script>
export default {
  name: 'MainContainer',
  props: {
    title: String,
    elemClass: String
  }
}
</script>
