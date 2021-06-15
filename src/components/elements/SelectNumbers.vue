<template>
<div class="select-numbers__wrapper">
  <div v-if="$slots.default" class="select-numbers__title">
    <slot></slot>
  </div>
  <div class="select-numbers">
    <div class="select-numbers__head" :class="{ 'is-open' : isOpen }" @click="isOpen = !isOpen">
      <span v-html="items[current]"></span>
    </div>
    <transition name="fade">
      <div v-if="isOpen" class="select-numbers__body">
        <div v-for="(item, i) in items"
          class="select-numbers__item"
          @click="isOpen = !isOpen; current = i; $emit('changeDataTo', item)"
          :key="'slct-nmbr' + i"
        >
          <span>{{ item }}</span>
        </div>
      </div>
    </transition>
  </div>
</div>
</template>

<script>
import { listener } from '@/mixins/listener'
export default {
  props: {
    items: Array
  },
  mixins: [listener],
  data () {
    return {
      current: 0,
      isOpen: false,
      listenerElement: '.select-numbers',
      listenerValue: 'isOpen'
    }
  }
}
</script>
