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

<script>
import { computed, defineComponent } from '@vue/composition-api';
import { setYear } from '@/new/utils/dateFns';
import { formatYear } from '@/new/utils/date';

export default defineComponent({
  name: 'CalendarYears',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: Date,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const localValue = computed({
      get() {
        return props.modelValue;
      },
      set(date) {
        emit('update:modelValue', date);
      },
    });

    const years = computed(() => (
      Array(12).fill(null).map((_, index) => ({
        key: localValue.value.getFullYear() - 4 + index,
        value: setYear(localValue.value, localValue.value.getFullYear() - 4 + index),
      }))
    ));

    const selectYear = (value) => {
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
