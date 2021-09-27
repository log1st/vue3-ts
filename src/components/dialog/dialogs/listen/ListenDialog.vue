<template>
  <div
    :class="[
      $style.dialog,
      $style.default
    ]"
  >
    <div
      v-if="name"
      :class="$style.name"
    >
      {{ name }}
    </div>
    <div
      v-if="duration"
      :class="$style.duration"
    >
      {{ $i18n.t('listen.duration', {duration: computedDuration}) }}
    </div>
    <audio
      v-if="file"
      ref="audioRef"
      :class="$style.player"
      controls
      :src="file"
      @canplaythrough="onLoad"
      @error="onError"
    />
    <div
      v-else
      :class="$style.error"
    >
      {{ error || $i18n.t('listen.noFile') }}
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref,
} from 'vue';
import { ListenPayload } from '@/hooks/useDialog';

export default defineComponent({
  name: 'ListenDialog',
  props: {
    name: String as PropType<ListenPayload['name']>,
    file: String as PropType<ListenPayload['file']>,
  },
  setup() {
    const duration = ref(0);

    const computedDuration = computed(() => (
      [Math.floor(duration.value / 60), duration.value % 60].map(
        (item) => String(item).padStart(2, '0'),
      ).join(':')
    ));

    const onLoadStart = () => {
      duration.value = 0;
    };

    const audioRef = ref<HTMLAudioElement>();
    const onLoad = async () => {
      await new Promise(requestAnimationFrame);
      if (!audioRef.value) {
        return;
      }
      duration.value = Math.floor(audioRef.value?.duration);
    };

    const error = ref<string>();
    const onError = (err: string) => {
      error.value = err;
    };

    return {
      error,
      onError,

      duration,
      computedDuration,
      audioRef,

      onLoad,
      onLoadStart,
    };
  },
});
</script>

<style lang="scss" module>
@import "./listenDialog";
</style>
