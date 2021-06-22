<template>
  <div :class="$style.container">
    <div
      v-for="weekday in weekdays"
      :key="`weekday-${weekday.key}`"
      :class="$style.weekday"
    >
      {{ formatWeekday(weekday.value) }}
    </div>
    <div
      v-for="(day, index) in days"
      :key="day.key"
      :class="[
        $style.day,
        $style[`n${(index + 1) % 7}`],
        day.isToday && $style.today,
        day.isSelected && $style.selectedDay,
        day.isFrom && $style.fromDay,
        day.isTo && $style.toDay,
        day.isBetween && $style.betweenDay,
        day.isDisabled && $style.disabledDay,
      ]"
      @click="selectDay(day.value)"
    >
      <span>
        {{ formatDay(day.value) }}
      </span>
    </div>
  </div>
</template>

<script>
import {
  computed, defineComponent, ref, watch,
} from '@vue/composition-api';
import {
  addDays,
  daysInMonth, endOfMonth,
  isAfter,
  isBefore,
  isSameDate,
  setDate,
  setWeekDay,
  startOfMonth,
} from '@/new/utils/dateFns';
import { formatDay, formatWeekday } from '@/new/utils/date';
import {useLocalProp} from "@/new/hooks/useLocalProp";

export default defineComponent({
  name: 'CalendarDays',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    currentDate: Date,
    modelValue: [Date, Array],
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const localValue = useLocalProp(props, emit, 'modelValue')

    const weekdays = ref(
      Array(7).fill(null).map((_, index) => ({
        key: index,
        value: setWeekDay(props.currentDate, index + 1),
      })),
    );

    const monthStart = computed(() => (
      startOfMonth(props.currentDate)
    ));

    const monthEnd = computed(() => (
      endOfMonth(props.currentDate)
    ));

    const isRange = computed(() => (
      Array.isArray(localValue.value)
    ));

    const today = ref(new Date());

    const days = computed(() => (
      Array(daysInMonth(monthStart.value)).fill(null).map((_, index) => {
        const value = setDate(monthStart.value, index + 1);

        return ({
          key: index + 1,
          value,
          isToday: isSameDate(value, today.value),
          isDisabled: false,
        });
      })
    ));

    const daysBefore = computed(() => monthStart.value.getDay() - 1);

    const daysAfter = computed(() => 7 - ((days.value.length + daysBefore.value) % 7));

    const computedDays = computed(() => ([
      ...Array(daysBefore.value).fill(null).map((_, index) => ({
        key: index - daysBefore.value,
        value: addDays(monthStart.value, -daysBefore.value + index),
        isDisabled: true,
      })),
      ...days.value,
      ...Array(daysAfter.value).fill(null).map((_, index) => ({
        key: days.value.length + daysBefore.value + index + 1,
        value: addDays(monthEnd.value, index + 1),
        isDisabled: true,
      })),
    ].map((day) => {
      const isSelected = isRange.value ? (
        isSameDate(day.value, (localValue.value)[0])
        && isSameDate(day.value, (localValue.value)[1])
      ) : isSameDate(day.value, localValue.value);

      return ({
        ...day,
        isSelected,
        isBetween: isRange.value
          && isAfter(day.value, (localValue.value)[0])
          && isBefore(day.value, (localValue.value)[1]),
        isFrom: !day.isSelected
          && isRange.value && isSameDate(day.value, (localValue.value)[0]),
        isTo: !day.isSelected
          && isRange.value && isSameDate(day.value, (localValue.value)[1]),
      });
    })));

    const selectDay = (date) => {
      if (isRange.value) {
        const newValue = [...localValue.value];
        if (newValue[1]) {
          newValue[0] = date;
          newValue[1] = null;
        } else if (isAfter(newValue[0], date)) {
          newValue[1] = newValue[0];
          newValue[0] = date;
        } else {
          newValue[1] = date;
        }
        localValue.value = newValue;
      } else {
        localValue.value = date;
      }
    };

    return {
      weekdays,
      days: computedDays,
      formatWeekday,
      formatDay,

      selectDay,
    };
  },
});
</script>

<style lang="scss" module>
@import "./calendarDays";
</style>
