<template>
  <div
    :class="[
      $style.field,
      ...(arrayFrom(state).map(s => $style[s]))
    ]"
  >
    <div
      v-if="label"
      :class="$style.label"
      data-role="label"
    >
      {{ label }}
    </div>
    <div
      v-if="isReadonly"
      :class="$style.value"
    >
      <slot>
        <template v-if="value">
          <template v-if="format === 'phone'">
            {{ formatPhone(value) }}
          </template>
          <template v-else>
            {{ value }}
          </template>
        </template>
        <NA v-else />
      </slot>
    </div>
    <component
      :is="component"
      v-else
      v-model="value"
      :model-modifiers="{[`delay:${delay}`]: true}"
      v-bind="options"
      :state="state"
      :errors="errors"
      :class="$style.input"
      @update:query="$emit('update:query', $event)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import TextInput from '@/components/textInput/TextInput.vue';
import { useLocalValue } from '@/hooks/useLocalValue';
import { arrayFrom } from '@/utils/object';
import NA from '@/components/na/NA.vue';
import SelectInput from '@/components/selectInput/SelectInput.vue';
import { formatPhone } from '@/utils/string';
import DateInput from '@/components/dateInput/DateInput.vue';

export default defineComponent({
  name: 'ActiveField',
  components: { NA },
  props: {
    type: String as PropType<ActiveFormField<any>['type']>,
    options: Object as PropType<ActiveFormField<any>['options']>,
    modelValue: [String, Object, Boolean, Number, Array] as PropType<any>,
    state: [String, Array] as PropType<string | string[]>,
    errors: Array as PropType<string[]>,
    label: String as PropType<string>,
    isReadonly: Boolean,
    delay: {
      type: Number as PropType<number>,
      default: 250,
    },
    format: String as PropType<'string' | 'phone'>,
  },
  emits: ['update:modelValue', 'update:query'],
  setup(props, { emit }) {
    const component = computed(() => ({
      [ActiveFormFieldType.input]: TextInput,
      [ActiveFormFieldType.select]: SelectInput,
      [ActiveFormFieldType.date]: DateInput,
    }[props.type!]));

    const value = useLocalValue(props, 'modelValue', emit);

    return {
      component,
      value,

      arrayFrom,

      formatPhone,
    };
  },
});
</script>

<style lang="scss" module>
@import "./activeField";
</style>
