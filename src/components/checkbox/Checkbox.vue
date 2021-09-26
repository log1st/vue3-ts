<template>
  <div
    :class="[
      $style.field,
      ...arrayFrom(state).map(s => $style[s]),
      isSelected && $style.selected,
      errors?.length && $style.hasErrors
    ]"
  >
    <button
      ref="submitRef"
      type="submit"
      :tabindex="-1"
      :class="$style.submit"
    />
    <div
      :class="$style.trigger"
      :tabindex="0"
      @click="onClick"
      @keypress.enter="submitRef?.click()"
      @keypress.space="onClick"
    >
      <div :class="$style.check">
        <transition
          :enter-active-class="$style.enterActive"
          :leave-active-class="$style.leaveActive"
          :leave-to-class="$style.leave"
          :enter-from-class="$style.enter"
        >
          <div
            :key="isSelected ? 1 : 0"
            :class="$style.checkContent"
          >
            <slot
              :name="isSelected ? 'checked' : 'unchecked'"
            />
          </div>
        </transition>
      </div>
      <div
        v-if="label || ('label' in $slots)"
        :class="$style.label"
      >
        <slot name="label">
          {{ label }}
        </slot>
      </div>
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
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, toRefs,
} from 'vue';
import { ICheckbox, ICheckboxState } from '@/components/checkbox/useCheckbox';
import { arrayFrom } from '@/utils/object';

export default defineComponent({
  name: 'Checkbox',
  props: {
    modelValue: [String, Number, Boolean] as PropType<ICheckbox['modelValue']>,
    trueValue: {
      type: [String, Number, Boolean] as PropType<ICheckbox['modelValue']>,
      default: true,
    },
    falseValue: {
      type: [String, Number, Boolean] as PropType<ICheckbox['modelValue']>,
      default: false,
    },
    label: String as PropType<ICheckbox['label']>,
    state: {
      type: [String, Array] as PropType<ICheckbox['state']>,
      default: ICheckboxState.default,
    },
    errors: Array as PropType<ICheckbox['errors']>,
  },
  emits: ['update:modelValue', 'click'],
  setup(props, { emit }) {
    const { modelValue, trueValue, falseValue } = toRefs(props);

    const isSelected = computed(() => (
      modelValue.value === trueValue.value
    ));

    const onClick = (e: PointerEvent) => {
      emit('click', e);
      emit('update:modelValue', isSelected.value ? falseValue.value : trueValue.value);
    };

    const submitRef = ref<HTMLButtonElement>();

    return {
      isSelected,
      onClick,
      arrayFrom,

      submitRef,
    };
  },
});
</script>

<style lang="scss" module>
@import "./checkbox";
</style>
