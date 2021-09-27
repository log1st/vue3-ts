<template>
  <div :class="$style.months">
    <div
      v-for="month in monthsArray"
      :key="month.key"
      :class="[
        $style.month,
        month.value.getMonth() === modelValue.getMonth() && $style.activeMonth
      ]"
      @click="selectMonth(month.value)"
    >
      {{ formatMonth(month.value) }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { setMonth } from '@/utils/dateFns';
import { formatMonth } from '@/utils/date';
import { useLocalValue } from '@/hooks/useLocalValue';

export default defineComponent({
  name: 'CalendarMonths',
  props: {
    modelValue: {
      type: Date as PropType<Date>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const localValue = useLocalValue(props, 'modelValue', emit);

    const monthsArray = computed(() => (
      Array(12).fill(null).map((_, index) => ({
        key: index,
        value: setMonth(localValue.value, index),
      }))
    ));

    const selectMonth = (value: Date) => {
      localValue.value = value;
    };

    return {
      localValue,

      formatMonth,
      selectMonth,
      monthsArray,
    };
  },
});
</script>

<style lang="scss" module>
@import "./calendarMonths";
</style>
