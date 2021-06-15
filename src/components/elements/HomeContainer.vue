<template>
  <div class="home__container">
    <div class="home__container-head">
      <div class="home__container-title" v-html="title"></div>
    </div>
    <div class="home__container-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeContainer',
  props: {
    title: String
  }
}
</script>
