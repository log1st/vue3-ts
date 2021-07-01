<template>
  <div
    :class="[$style.toast, $style[type]]"
    @click="hideOnClick"
  >
    <div :class="$style.title" v-if="title">
      {{title}}
    </div>
    <div :class="$style.message" v-if="message">
      {{ message }}
    </div>
  </div>
</template>

<script>
import {
  computed, defineComponent, PropType, watch,
} from '@vue/composition-api';

export default defineComponent({
  name: 'Toast',
  props: {
    type: String,
    title: String,
    message: String,
    duration: Number,
    isCloseable: Boolean,
  },
  emits: ['hide'],
  setup(props, { emit }) {
    let hideTimeout;

    const hide = () => {
      emit('hide');
    };

    const hideOnClick = () => {
      if(!props.isCloseable) {
        return;
      }
      hide();
    }

    watch(computed(() => props.duration), (duration) => {
      clearTimeout(hideTimeout);
      if (duration) {
        hideTimeout = setTimeout(hide, duration);
      }
    }, {
      immediate: true,
    });

    return {
      hide,

      hideOnClick,
    };
  },
});
</script>

<style lang="scss" module>
@import "toast";
</style>
