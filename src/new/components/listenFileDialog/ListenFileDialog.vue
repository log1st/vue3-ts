<template>
  <div :class="$style.dialog">
    <div :class="$style.title" v-if="title">{{title}}</div>
    <div :class="$style.duration" v-if="duration">{{computedDuration}}</div>
    <audio :class="$style.player" controls ref="audioRef" :src="file" @canplaythrough="onLoad"/>
  </div>
</template>

<script>
import Btn from "@/new/components/btn/Btn";
import {computed, ref} from '@vue/composition-api';

export default {
  name: "ConfirmDialog",
  components: {Btn},
  props: {
    title: String,
    file: String,
  },
  setup(props, {emit}) {
    const duration = ref(0);

    const computedDuration = computed(() => (
      [Math.floor(duration.value / 60), duration.value % 60].join(':')
    ));

    const onLoadStart = () => {
      duration.value = 0;
    }

    const audioRef = ref();
    const onLoad = async () => {
      console.log('blya');
      await new Promise(requestAnimationFrame)
      duration.value = Math.floor(audioRef.value.duration);
    }

    return {
      duration,
      computedDuration,
      audioRef,

      onLoad,
      onLoadStart
    }
  }
}
</script>

<style lang="scss" module>
@import "./listenFileDialog";
</style>
