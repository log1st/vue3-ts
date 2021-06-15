<template>
  <div id="app">
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script>
import 'normalize.css'

export default {
  computed: {
    layout () {
      return this.$route.meta.layout || 'cabinet-layout'
    }
  },
  created () {
    if (this.$store.state.user.appTheme == 'day') {
        document.documentElement.setAttribute('data-theme', 'day');
    } else if (this.$store.state.user.appTheme == 'night'){
        document.documentElement.setAttribute('data-theme', 'night');
      }
  },
  
}
</script>

<style lang="scss">
  @import 'src/assets/styles/scss/style.scss';
</style>
