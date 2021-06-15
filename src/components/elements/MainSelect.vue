<template>
  <div class="select">
    <div class="select__head" :class="{ 'is-open' : isOpen }" @click="isOpen = !isOpen">
      <span>Действия к должникам</span>
    </div>
    <transition name="fade">
      <div v-if="isOpen" class="select__body">
        <div v-for="(item, i) in items" 
          v-show="item.show"
          class="select__item"
          @click="isOpen = !isOpen; $emit('selectAction', { action: item.action, data: item.name })"
          :key="'slct' + i"
        >
           <icon-base
            :hasStroke="item.icon ? item.icon.stroke : false"
            :width="item.icon ? item.icon.w : 16"
            :height="item.icon ? item.icon.h : 16"
            iconColor="#fff"
            :viewBox="item.icon ? item.icon.viewBox : '0 0 20 20'"
            ><component v-if="item.icon" :is="'icon-' + item.icon.name" />
          </icon-base>
          <span>{{ item.name }}</span>
        </div>
      </div>
    </transition>
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
      isOpen: false,
      listenerElement: '.select',
      listenerValue: 'isOpen'
    }
  }
  // computed: {
  //   filteredItems () {
  //     return this.items.filter(item => item.visible)
  //   }
  // }
}
</script>
