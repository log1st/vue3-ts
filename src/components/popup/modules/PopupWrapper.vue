<template>
  <div class="popup__inner" :style="`--popup-width: ${popupWidth}px`">
    <div class="popup__header">
      
      <!-- <div class="popup__title">
        {{ title }}
      </div> -->

      <div class="popup__header-content">
        <slot name="header"></slot>
      </div>

      <div class="popup__close" @click="$store.dispatch('setPopupState', false)">
        <div  class="popup__close-icon">
          <icon-base width="13" height="13" iconColor="#8c8ea2">
            <icon-close-big />
          </icon-base>
        </div>
      </div>
    </div>
    <div class="popup__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    popupWidth: {
      type: Number,
      required: false,
      default: 680
    }
  }
}
</script>
