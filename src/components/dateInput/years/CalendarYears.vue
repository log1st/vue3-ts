<template>
  <div :class="$style.years">
    <div
      v-for="year in years"
      :key="year.key"
      :class="[
        $style.year,
        year.value.getFullYear() === modelValue.getFullYear() && $style.activeYear
      ]"
      @click="selectYear(year.value)"
    >
      {{ formatYear(year.value) }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { setYear } from '@/utils/dateFns';
import { formatYear } from '@/utils/date';
import { useLocalValue } from '@/hooks/useLocalValue';

export default defineComponent({
  name: 'CalendarYears',
  props: {
    modelValue: {
      type: Date as PropType<Date>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const localValue = useLocalValue(props, 'modelValue', emit);

    const years = computed(() => (
      Array(12).fill(null).map((_, index) => ({
        key: localValue.value.getFullYear() - 4 + index,
        value: setYear(localValue.value, localValue.value.getFullYear() - 4 + index),
      }))
    ));

    const selectYear = (value: Date) => {
      localValue.value = value;
    };

    return {
      localValue,

      formatYear,
      selectYear,
      years,
    };
  },
});
</script>

<style lang="scss" module>
@import "./calendarYears";
</style>
