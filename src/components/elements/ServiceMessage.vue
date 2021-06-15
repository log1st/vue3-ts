<template>
  <div class="service-message">
    <span v-html="getServiceMessageText"></span>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ServiceMessage',
  data () {
    return {
      timer: null
    }
  },
  mounted () {
    this.timer = setTimeout(() => {
      this.setServiceMessageClose()
    }, 3000)
  },
  methods: mapActions(['setServiceMessageClose']),
  computed: mapGetters(['getServiceMessageText']),
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
