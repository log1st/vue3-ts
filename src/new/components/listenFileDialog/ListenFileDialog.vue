<template>
  <div :class="$style.dialog">
    <div :class="$style.title" v-if="title">{{title}}</div>
    <div :class="$style.duration" v-if="duration">{{computedDuration}}</div>
    <audio :class="$style.player" controls ref="audioRef" :src="file" @canplaythrough="onLoad" @error="onError" v-if="file"/>
    <div :class="$style.error" v-else>
      {{error || 'Нет файла'}}
    </div>
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
      await new Promise(requestAnimationFrame)
      duration.value = Math.floor(audioRef.value.duration);
    }

    const error = ref();
    const onError = err => {
      error.value = err
    }

    return {
      error,
      onError,

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
