<template>
  <div>
    <slot/>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'AuthLayout',
  data () {
    return {
      //
    }
  },
  methods: {
    ...mapActions([
      'appLoadingChange',
      'getHotkeyStatuses',
    ]),
    ...mapMutations(['setInitialized']),
    
  }
}
</script>
