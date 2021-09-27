<template>
  <div :class="$style.container">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      style="display: none;"
    >
      <symbol id="wave">
        <!-- eslint-disable -->
        <path d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z" />
        <path
          d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"
        />
        <path
          d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"
        />
        <path
          d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z"
        />
        <!-- eslint-enable -->
      </symbol>
    </svg>
    <div :class="$style.content">
      <div
        :class="[
          $style.box,
          isLoaded && $style.loaded,
        ]"
      >
        <div
          :class="$style.percent"
          :style="{'--percentage': percentage}"
        />
        <div
          id="water"
          :class="$style.water"
          :style="{
            transform: `translateY(${100 - percentage}%)`
          }"
        >
          <svg
            viewBox="0 0 560 20"
            :class="[$style.wave, $style.back]"
          >
            <use xlink:href="#wave" />
          </svg>
          <svg
            viewBox="0 0 560 20"
            :class="[$style.wave, $style.front]"
          >
            <use xlink:href="#wave" />
          </svg>
        </div>
      </div>
      <Logo
        :class="[
          $style.logo,
          isLoaded && $style.loaded,
        ]"
      />
    </div>
    <div :class="$style.labelWrapper">
      <transition
        :enter-from-class="$style.enter"
        :enter-active-class="$style.enterActive"
        :leave-to-class="$style.leave"
        :leave-active-class="$style.leaveActive"
      >
        <div
          :key="label"
          :class="[
            $style.label,
            isLoaded && $style.loaded
          ]"
        >
          {{ label }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, ref, watch,
} from 'vue';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { getRandomNumber } from '@/utils/number';
import Logo from '@/components/logo/Logo.vue';
import { isDev } from '@/utils/env';

type LoadingPart = {
  key: string;
  label: string;
  checker: () => Promise<true>;
  size: number;
}

export default defineComponent({
  name: 'GlobalLoader',
  components: { Logo },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useLocalI18n('globalLoader');

    const getPseudoChecker: (from: number, to: number) => () => Promise<true> = (
      from,
      to,
    ) => () => new Promise<true>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, getRandomNumber(from, to));
    });

    const parts = computed<Array<LoadingPart>>(() => ([
      {
        key: 'html',
        label: t('html'),
        checker: getPseudoChecker(1000, 2000),
        size: getRandomNumber(20, 30),
      },
      {
        key: 'express',
        label: t('express'),
        checker: getPseudoChecker(500, 1500),
        size: getRandomNumber(10, 15),
      },
      {
        key: 'data',
        label: t('data'),
        checker: getPseudoChecker(700, 1000),
        size: getRandomNumber(25, 35),
      },
      {
        key: 'objects',
        label: t('objects'),
        checker: getPseudoChecker(2000, 3000),
        size: getRandomNumber(45, 60),
      },
      {
        key: 'interpolation',
        label: t('interpolation'),
        checker: getPseudoChecker(500, 1000),
        size: getRandomNumber(20, 30),
      },
      {
        key: 'state',
        label: t('state'),
        checker: getPseudoChecker(500, 600),
        size: getRandomNumber(5, 15),
      },
    ]));

    const total = computed<number>(() => (parts.value.reduce((acc, { size }) => acc + size, 0)));
    const done = ref(0);
    const percentage = computed(() => Math.ceil((done.value / total.value) * 100));

    const currentPart = ref('html');

    const isLoaded = ref(false);
    watch(percentage, (newPercentage) => {
      if (newPercentage === 100) {
        setTimeout(() => {
          isLoaded.value = true;
        }, 1000);
      }
    });
    watch(isLoaded, (value) => {
      if (value) {
        setTimeout(() => {
          emit('update:modelValue', false);
        }, 5000);
      }
    });

    const label = computed(() => (isLoaded.value ? t('loaded') : parts.value.find(
      ({ key }) => key === currentPart.value,
    )?.label));

    onMounted(() => {
      if (isDev) {
        emit('update:modelValue', false);
        return;
      }
      parts.value.reduce(async (acc, part) => {
        await acc;
        currentPart.value = part.key;
        await part.checker();
        done.value += part.size;
      }, Promise.resolve as any);
    });

    return {
      percentage,
      label,
      total,
      done,
      isLoaded,
      currentPart,
    };
  },
});
</script>

<style lang="scss" module>
@import "./globalLoader";
</style>
