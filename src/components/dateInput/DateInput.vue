<template>
  <div
    v-outside-click="hide"
    :class="[
      $style.container,
      ...(Array.isArray(state) ? state : [state]).map(i => $style[i]),
      isDisabled && $style.isDisabled,
      isActive && $style.isActive,
      errors?.length && $style.hasErrors,
    ]"
  >
    <div
      v-if="label"
      :class="$style.label"
    >
      {{ label }}
    </div>
    <div
      :class="$style.trigger"
      @click="toggle"
    >
      <div
        v-if="displayValue"
        :class="$style.value"
      >
        {{ displayValue }}
      </div>
      <div
        v-else
        :class="$style.placeholder"
      >
        {{ placeholder }}
      </div>
      <Icon
        :class="$style.caret"
        icon="chevron-down"
      />
    </div>
    <div
      v-if="errors"
      :class="$style.errors"
    >
      <div
        v-for="error in errors || []"
        :key="error"
        :class="$style.error"
      >
        {{ error }}
      </div>
    </div>
    <Calendar
      v-if="isActive"
      v-model="value"
      :class="$style.picker"
      :with-days="withDays"
      :auto-day="autoDay"
      @close="hide"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, PropType,
} from 'vue';
import Icon from '@/components/icon/Icon.vue';
import Calendar from './calendar/Calendar.vue';
import { formatDate, formatMonthAndYear } from '@/utils/date';
import { useLocalValue } from '@/hooks/useLocalValue';

export default defineComponent({
  name: 'DateInput',
  components: { Icon, Calendar },
  props: {
    state: {
      type: [String, Array],
      default: 'primary',
    },
    modelValue: {
      type: [Date, Array, null] as PropType<Date | Array<Date> | null>,
      required: true,
    },

    placeholder: String,
    label: String,

    isDisabled: Boolean,

    withDays: {
      type: Boolean,
      default: true,
    },
    autoDay: {
      type: [String, Number],
      default: 'first',
    },
    errors: Array as PropType<string[]>,
  },
  setup(props, { emit }) {
    const isActive = ref(false);
    const toggle = async () => {
      if (props.isDisabled) {
        return;
      }
      await new Promise(requestAnimationFrame);
      isActive.value = !isActive.value;
      if (isActive.value) {
        await new Promise(requestAnimationFrame);
      }
    };

    const hide = () => {
      isActive.value = false;
    };

    const value = useLocalValue(props, 'modelValue', emit);

    const displayValue = computed(() => {
      const formatFunction = props.withDays ? formatDate : formatMonthAndYear;
      return (
        Array.isArray(value.value)
          ? value.value.filter(Boolean).map((i) => formatFunction(i)).join(' - ')
          : (value.value ? formatFunction(value.value) : null)
      );
    });

    return {
      isActive,
      toggle,
      hide,

      value,

      displayValue,
    };
  },
});
</script>

<style lang="scss" module>
@import "dateInput";
</style>
