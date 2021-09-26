<template>
  <div
    :class="[
      $style.toast,
      $style[level]
    ]"
    @click="onClose"
  >
    <div
      v-if="label"
      :class="$style.label"
    >
      {{ t(label, params) }}
    </div>
    <div
      v-if="message"
      :class="$style.message"
    >
      {{ t(message, params) }}
    </div>
    <div
      v-if="progressbars?.length"
      :class="$style.bars"
    >
      <div
        v-for="({key, label: barLabel, max, current}) in progressbars"
        :key="key"
        :class="$style.bar"
      >
        <div
          v-if="max"
          :class="$style.barLabel"
        >
          {{ t(barLabel, {max, current}) }}
        </div>
        <div :class="$style.barBody">
          <div :class="$style.barLine">
            <div
              :class="$style.barProgress"
              :style="{width: `${(current / max * 100) || 0}%`}"
            />
          </div>
          <div
            v-if="max"
            :class="$style.barHint"
          >
            {{ (current / max * 100).toFixed(2) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, toRefs, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { IToast } from '@/hooks/useToast';

export default defineComponent({
  name: 'Toast',
  props: {
    label: String as PropType<IToast['label']>,
    message: String as PropType<IToast['message']>,
    params: Object as PropType<IToast['params']>,
    duration: Number as PropType<IToast['duration']>,
    isCloseable: Boolean as PropType<IToast['isCloseable']>,
    level: String as PropType<IToast['level']>,
    progressbars: Object as PropType<IToast['progressbars']['value']>,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { duration } = toRefs(props);
    const { t } = useI18n();

    const close = () => {
      emit('close');
    };

    const onClose = () => {
      if (!props.isCloseable) {
        return;
      }
      close();
    };

    let closeTimeout: number;
    watch(duration, (durationValue) => {
      clearTimeout(closeTimeout);
      if (durationValue) {
        closeTimeout = setTimeout(close, durationValue);
      }
    }, {
      immediate: true,
    });

    return {
      t,
      onClose,
    };
  },
});
</script>

<style lang="scss" module>
@import "./toast";
</style>
