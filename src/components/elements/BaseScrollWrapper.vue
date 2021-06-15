<template>
  <div class="scroll__wrapper" :style="height ? `--scroll-height: ${height}` : null">
    <div class="scroll__outer" @scroll="setScrollbar" ref="scrollOuter">
      <div class="scroll__inner" :class="{ 'has-scroll' : hasScroll }" ref="scrollInner">
        <slot></slot>
      </div>
    </div>
    <div v-if="hasScroll" class="scroll__bar">
      <div class="scroll__bar-runner" :style="`top: ${scrollPercent}%`"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseScrollWrapper',
  props: {
    height: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      hasScroll: false,
      scrollPercent: 0
    }
  },
  mounted () {
    this.setScrollbar()
  },
  methods: {
    setScrollbar () {
      this.hasScroll = this.$refs.scrollOuter.offsetWidth - this.$refs.scrollOuter.clientWidth > 0
      this.scrollPercent = this.$refs.scrollOuter.scrollTop * 100 / (this.$refs.scrollInner.clientHeight - this.$refs.scrollOuter.clientHeight)
    }
  }
}
</script>
