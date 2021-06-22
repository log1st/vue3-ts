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

<script>
import { computed, defineComponent } from '@vue/composition-api';
import { setMonth } from '@/new/utils/dateFns';
import { formatMonth } from '@/new/utils/date';


export default defineComponent({
  name: 'CalendarMonths',
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

    const monthsArray = computed(() => (
      Array(12).fill(null).map((_, index) => ({
        key: index,
        value: setMonth(localValue.value, index),
      }))
    ));

    const selectMonth = (value) => {
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
