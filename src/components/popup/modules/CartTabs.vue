<template>
  <div class="cart__body">
    <div class="cart__tabs">
      <div v-for="(item, i) in tabs"
        class="cart__tab"
        :class="{ 'is-active' : active == i}"
        @click="active = i"
        :key="'tbsitm' + i"
      >
        <div class="cart__tab-decor is-left">
          <icon-base
            width="14"
            height="8"
            :iconColor="active == i ? '#495cff' : '#F2F6FC'"
            ><icon-decor />
          </icon-base>
        </div>
        <span v-html="item"></span>
        <div class="cart__tab-decor is-right">
          <icon-base
            width="14"
            height="8"
            :iconColor="active == i ? '#495cff' : '#F2F6FC'"
            ><icon-decor />
          </icon-base>
        </div>
      </div>
      <transition name="fade">
        <div v-if="buttons" class="cart__tabs-btn">
          <div v-for="(item, i) in buttons.array" class="btn btn-icon" :key="'crdfh' + i">
            <icon-base
              :width="item.width"
              :height="item.height"
              iconColor="#000"
              ><component :is="'icon-' + item.icon" />
            </icon-base>
          </div>
        </div>
      </transition>
    </div>
    <div class="cart__content" :key="active">
      <!-- <baseScrollWrapper :height="'50vh'"> -->
      <div style="overflow-y: scroll; height: 50vh"> 
        <template v-for="j in tabs.length">
          <div v-if="active == j - 1" class="cart__content-item" :key="'crttbs' + j">
            <slot :name="'tab-' + j">вкладка {{ j }}</slot>
          </div>
        </template>
      </div>
      <!-- </baseScrollWrapper> -->
    </div>
    </div>
</template>

<script>
import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
export default {
  props: {
    tabs: Array,
    scrollHeight: {
      type: Number,
      required: false
    },
    buttons: {
      type: Object,
      required: false
    }
  },
  components: { baseScrollWrapper },
  data () {
    return {
      active: 0
    }
  }
}
</script>
