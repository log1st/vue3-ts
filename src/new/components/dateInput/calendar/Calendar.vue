<template>
  <div :class="$style.calendar">
    <CalendarHeader
      v-model="currentDate"
      :state.sync="headerState"
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

<script>
import {
  computed, defineComponent, ref, watch,
} from '@vue/composition-api';
import {formatMonthAndYear} from "@/new/utils/date";
import CalendarHeader from "@/new/components/dateInput/header/CalendarHeader";
import CalendarMonths from "@/new/components/dateInput/months/CalendarMonths";
import CalendarYears from "@/new/components/dateInput/years/CalendarYears";
import CalendarDays from "@/new/components/dateInput/days/CalendarDays";
import {setDate, addMonths, addDays} from "@/new/utils/dateFns";

export default defineComponent({
  name: 'Calendar',
  components: {CalendarDays, CalendarYears, CalendarMonths, CalendarHeader},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: [Date, Array],
    withDays: Boolean,
    autoDay: [String, Number]
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const localValue = ref(Array.isArray(props.modelValue) ? (
      props.modelValue.map(i => i || new Date)
    ) : props.modelValue || new Date);

    watch(computed(() => props.modelValue), newValue => {
      const newVal = Array.isArray(newValue) ? (
        newValue.map(i => i || new Date)
      ) : newValue || new Date;

      if(
        Array.isArray(localValue.value) ? (
          localValue.value[0] === newVal[0] && localValue[1] === localValue[1]
        ) : localValue.value === newVal
      ) {
        return;
      }
      emit('update:modelValue', newVal);
    }, {
      deep: true,
    });

    watch(localValue, newValue => {
      emit('update:modelValue', newValue)
    }, {
      deep: true,
    })

    const isRange = computed(() => Array.isArray(localValue.value));

    const currentDate = ref(Array.isArray(localValue.value) ? localValue.value[0] : localValue.value || new Date());

    watch(currentDate, (d) => {
      if(!props.withDays) {
        let newDate = d;
        if(props.autoDay === 'first') {
          newDate = setDate(newDate, 1);
        } else if(props.autoDay === 'last') {
          newDate = addDays(setDate(addMonths(newDate, 1), 1), -1)
        } else {
          newDate(newDate, props.autoDay)
        }
        localValue.value = newDate;
      }
    })

    const headerState = ref('day');

    const setState = async (state) => {
      await new Promise(requestAnimationFrame)
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
