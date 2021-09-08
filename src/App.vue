<template>
  <div id="app">
    <router-view/>
    <IconsMap :style="{visibility: 'hidden', position: 'fixed', top: '200vh', left: '200vw'}"/>
    <Toasts/>
  </div>
</template>

<script>
import 'normalize.css'
import IconsMap from "@/new/components/icon/IconsMap";
import Toasts from "@/new/components/toasts/Toasts";

export default {
  components: {Toasts, IconsMap},
  created () {
    if (this.$store.state.user.appTheme == 'day') {
        document.documentElement.setAttribute('data-theme', 'day');
    } else if (this.$store.state.user.appTheme == 'night'){
        document.documentElement.setAttribute('data-theme', 'night');
    }

    if (window.location.pathname == '/login') {
      console.log(window.location)
      this.$router.push('/sign/in');
    }
  },
  

}
</script>

<style lang="scss">
  @import 'src/assets/styles/scss/style.scss';
</style>
