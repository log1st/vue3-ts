<template>
  <div class="companies__actions" :class="elClass">
    <div v-for="(item, j) in icons" class="companies__actions-item" @click.stop="$emit('setRowHoverAction', j)" :key="'cmpactns' + j">
      <icon-base
        :width="elIcons[item].width"
        :height="elIcons[item].height"
        iconColor="#8e9baf"
        ><component :is="'icon-' + item" />
      </icon-base>
    </div>
  </div>
</template>

<script>
import iconView from '@/components/icons-svg/icons/IconView'
export default {
  props: {
    elClass: {
      type: String,
      required: false
    },
    icons: Array
  },
  components: { iconView },
  data () {
    return {
      elIcons: {
        view: { width: 14, height: 10 },
        check: { width: 14, height: 10 },
        edit: { width: 11, height: 11 },
        close: { width: 9, height: 9 },
        download: { width: 12, height: 13 },
      }
    }
  }
}
</script>
