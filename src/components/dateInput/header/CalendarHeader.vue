<template>
  <div :class="$style.header">
    <Icon
      icon="angle-left"
      :class="[$style.control, $style.previousControl]"
      @click="goTo(-1)"
    />
    <div
      :class="$style.label"
      @click="toggleState"
    >
      <template v-if="state === 'month' || (state === 'days' && !withDays)">
        {{ formatYear(localValue) }}
      </template>
      <template v-else-if="state === 'day'">
        {{ formatMonthAndYear(localValue) }}
      </template>
      <template v-else>
        {{ formatYear(addYears(localValue, -4)) }} - {{ formatYear(addYears(localValue, 7)) }}
      </template>
    </div>
    <Icon
      icon="angle-right"
      :class="[$style.control, $style.nextControl]"
      @click="goTo(1)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Icon from '@/components/icon/Icon.vue';
import { addMonths, addYears } from '@/utils/dateFns';
import { formatMonthAndYear, formatYear } from '@/utils/date';
import { useLocalValue } from '@/hooks/useLocalValue';

export default defineComponent({
  name: 'CalendarHeader',
  components: { Icon },
  props: {
    state: {
      type: String as PropType<'month' | 'day' | 'year'>,
      default: 'day',
    },
    modelValue: {
      type: Date as PropType<Date>,
      required: true,
    },
    withDays: Boolean as PropType<boolean>,
  },
  emits: ['update:modelValue', 'update:state'],
  setup(props, { emit }) {
    const localValue = useLocalValue(props, 'modelValue', emit);

    const goToMap = {
      month: addYears,
      year: (date, to) => addYears(date, to * 12),
      day: addMonths,
    } as {
      [key in 'month' | 'year' | 'day']: ((date: Date, amount: number) => Date)
    };

    const goTo = (to: number) => {
      localValue.value = goToMap[props.state](localValue.value, to);
    };

    const toggleState = () => {
      emit('update:state', props.state === 'month' ? 'year' : 'month');
    };

    return {
      localValue,

      goTo,
      toggleState,

      formatMonthAndYear,
      formatYear,

      addYears,
    };
  },
});
</script>

<style lang="scss" module>
@import "./calendarHeader";
</style>
