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

<script>
import { computed, defineComponent } from '@vue/composition-api';
import Icon from '@/new/components/icon/Icon.vue';
import { addMonths, addYears } from '@/new/utils/dateFns';
import { formatMonthAndYear, formatYear } from '@/new/utils/date';

export default defineComponent({
  name: 'CalendarHeader',
  components: { Icon },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    state: String,
    modelValue: Date,
    withDays: Boolean,
  },
  emits: ['update:modelValue', 'update:state'],
  setup(props, { emit }) {
    const localValue = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      },
    });

    const goToMap = {
      month: addYears,
      year: (date, to) => addYears(date, to * 12),
      day: addMonths,
    };

    const goTo = (to) => {
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
