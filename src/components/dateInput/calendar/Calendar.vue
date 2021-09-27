<template>
  <div :class="$style.calendar">
    <CalendarHeader
      v-model="currentDate"
      v-model:state="headerState"
      :class="$style.header"
      :with-days="withDays"
    />
    <div :class="$style.body">
      <CalendarMonths
        v-if="headerState === 'month' || (headerState === 'day' && !withDays)"
        v-model="currentDate"
        @update:modelValue="setState('day')"
      />
      <CalendarYears
        v-else-if="headerState === 'year'"
        v-model="currentDate"
        @update:modelValue="setState('month')"
      />
      <CalendarDays
        v-else-if="withDays"
        v-model="localValue"
        :current-date="currentDate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, watch,
} from 'vue';
import { formatMonthAndYear } from '@/utils/date';
import CalendarHeader from '@/components/dateInput/header/CalendarHeader.vue';
import CalendarMonths from '@/components/dateInput/months/CalendarMonths.vue';
import CalendarYears from '@/components/dateInput/years/CalendarYears.vue';
import CalendarDays from '@/components/dateInput/days/CalendarDays.vue';
import { setDate, addMonths, addDays } from '@/utils/dateFns';

export default defineComponent({
  name: 'Calendar',
  components: {
    CalendarDays, CalendarYears, CalendarMonths, CalendarHeader,
  },
  props: {
    modelValue: [Date, Array] as PropType<Date | Array<Date>>,
    withDays: Boolean as PropType<boolean>,
    autoDay: [String, Number] as PropType<string | number>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const localValue = ref(Array.isArray(props.modelValue) ? (
      props.modelValue.map((i) => i || new Date())
    ) : props.modelValue || new Date());

    watch(computed(() => props.modelValue), (newValue) => {
      const newVal = Array.isArray(newValue) ? (
        newValue.map((i) => i || new Date())
      ) : newValue || new Date();

      if (
        Array.isArray(localValue.value) && Array.isArray(newVal) ? (
          localValue.value[0] === newVal[0] && localValue.value[1] === newVal[1]
        ) : localValue.value === newVal
      ) {
        return;
      }
      emit('update:modelValue', newVal);
    }, {
      deep: true,
    });

    watch(localValue, (newValue) => {
      emit('update:modelValue', newValue);
    }, {
      deep: true,
    });

    const isRange = computed(() => Array.isArray(localValue.value));

    const currentDate = ref<Date>(
      (Array.isArray(localValue.value)
        ? localValue.value[0]
        : localValue.value || new Date()) as Date,
    );

    watch(currentDate, (d) => {
      if (!props.withDays) {
        let newDate = d;
        if (props.autoDay === 'first') {
          newDate = setDate(newDate as Date, 1);
        } else if (props.autoDay === 'last') {
          newDate = addDays(setDate(addMonths(newDate as Date, 1), 1), -1);
        } else if (typeof props.autoDay === 'number') {
          newDate = setDate(newDate as Date, props.autoDay);
        }
        localValue.value = newDate;
      }
    });

    const headerState = ref('day');

    const setState = async (state: any) => {
      await new Promise(requestAnimationFrame);
      headerState.value = state;
    };

    return {
      isRange,
      localValue,
      currentDate,

      headerState,
      setState,

      formatMonthAndYear,
    };
  },
});
</script>

<style lang="scss" module>
@import "./calendar";
</style>
