<template>
  <div class="checkbox" @click.stop="handler">
    <transition name="fade">
      <template>
        <div v-if="checked" class="checkbox__inner">
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
  export default {
    props: {
      checked: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handler () {
        this.$emit('change', this.checked);
      }
    }
  }
</script>
