<template>
  <div class="btngroup">
    <template v-for="(item, i) in buttons">
      <div v-if="item.status !== false"
        class="btngroup__item"
        :class="{ active : i == activeBtn, 'is-modified' : modified }"
        @click="clickHandler(i)"
        :key="'btngr' + i"
      >
        <icon-base v-if="item.icon" 
        :width="item.width"
        :height="item.height"
        :viewBox="item.viewBox">
          <component :is="item.icon"/>
        </icon-base>

        <span>{{ item.name }}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    buttons: Array,
    active: {
      type: Number,
      required: false,
      default: 0
    },
    modified: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      activeBtn: 0
    }
  },
  methods: {
    clickHandler (i) {
      this.activeBtn = i; 
      this.$emit('currentActive', i);
      this.$emit('change', i);
    }
  },
  mounted () {
    this.activeBtn = this.active
  }
}
</script>
