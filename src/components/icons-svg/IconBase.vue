<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewbox == null ? '0 0 ' + width + ' ' + height : viewbox"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <!-- <title :id="iconName" lang="en">{{iconName}} icon</title> -->
    <g v-if="!hasStroke" :fill="iconColor"><slot /></g>
    <g v-else :stroke="iconColor"><slot /></g>
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 20
    },
    height: {
      type: [Number, String],
      default: 20
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    },
    hasStroke: {
      type: Boolean,
      default: false
    },
    viewbox: {
      type: String,
      default: null
    }
  }
}
</script>
