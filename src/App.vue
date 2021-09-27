<template>
  <div
    :class="[
      $style.app,
      $style[theme]
    ]"
  >
    <RouterView />
    <IconsMap />
    <Toasts />
    <transition
      :enter-active-class="$style.enterActive"
      :leave-active-class="$style.leaveActive"
      :leave-to-class="$style.leave"
      :enter-from-class="$style.enter"
    >
      <GlobalLoader
        v-if="isPreloaderVisible"
        v-model="isPreloaderVisible"
        :class="$style.loader"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import '@/assets/drop.scss';
import '@/assets/root.scss';

import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import IconsMap from '@/components/icon/IconsMap.vue';
import { useLayout } from '@/hooks/useLayout';
import Toasts from '@/components/toasts/Toasts.vue';
import GlobalLoader from '@/components/globalLoader/GlobalLoader.vue';

export default defineComponent({
  components: { GlobalLoader, Toasts, IconsMap },
  setup() {
    const calcVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
    };

    let vhTimeout: number;
    const handleVh = () => {
      clearTimeout(vhTimeout);
      vhTimeout = setTimeout(calcVh, 500);
    };
    onMounted(() => {
      calcVh();
      window.addEventListener('resize', handleVh);
      window.addEventListener('orientationchange', handleVh);
    });
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleVh);
      window.removeEventListener('orientationchange', handleVh);
    });

    const {
      theme,
      isPreloaderVisible,
    } = useLayout();

    return {
      theme,
      isPreloaderVisible,
    };
  },
});
</script>

<style lang="scss" module>
@import "./app";
</style>
