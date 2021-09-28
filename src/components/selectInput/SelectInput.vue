<template>
  <div
    v-outside-click="hide"
    :class="[
      $style.field,
      ...arrayFrom(state).map(s => $style[s]),
      errors?.length && $style.hasErrors,
      isVisible && !isDisabled && $style.visible,
      options?.length && $style.hasOptions,
      isDisabled && $style.disabled,
    ]"
  >
    <div
      v-if="label"
      :class="$style.upLabel"
      data-role="up-label"
    >
      {{ label }}
    </div>
    <div
      :class="$style.trigger"
      data-role="trigger"
      @click="toggleVisibility"
    >
      <input
        v-if="isSearchable && isVisible && !isDisabled"
        ref="searchRef"
        v-model="localQuery"
        :class="[$style.label, $style.search]"
        :placeholder="placeholder"
        @click.stop
      >
      <template v-else>
        <div
          v-if="displayValue"
          data-role="label"
          :class="[$style.label, $style.value]"
        >
          {{ displayValue }}
        </div>
        <div
          v-else
          data-role="label"
          :class="[$style.label, $style.placeholder]"
        >
          {{ placeholder }}
        </div>
      </template>
      <Icon
        icon="chevron"
        :class="[
          $style.action,
          $style.caret
        ]"
      />
    </div>
    <div
      v-if="isVisible && !isDisabled"
      :class="$style.options"
    >
      <div
        v-for="(option, index) in options"
        :key="option[valueField]"
        :class="[
          $style.option,
          arrayFrom(value).includes(option[valueField]) && $style.active
        ]"
        data-role="label"
        @click="selectOption(option[valueField])"
      >
        <slot
          name="option"
          :option="option"
          :index="index"
        >
          {{ arrayFrom(displayField).map(i => option[i]).join(' ') }}
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
  computed,
  defineComponent, PropType, ref, toRefs, watch,
} from 'vue';
import { arrayFrom } from '@/utils/object';
import { ISelectInput, ISelectInputState } from '@/components/selectInput/useSelectInput';
import Icon from '@/components/icon/Icon.vue';
import { useModifiers } from '@/hooks/useModifiers';
import { useToggle } from '@/hooks/useToggle';
import { awaitFrame } from '@/utils/window';

export default defineComponent({
  name: 'SelectInput',
  components: { Icon },
  props: {
    isSearchable: Boolean as PropType<ISelectInput['isSearchable']>,
    query: String as PropType<ISelectInput['query']>,
    queryModifiers: {
      type: Object as PropType<Record<any, any>>,
      default: () => ({}),
    },
    label: String as PropType<ISelectInput['label']>,
    modelValue: [String, Number, Array] as PropType<ISelectInput['modelValue']>,
    modelModifiers: {
      type: Object as PropType<Record<any, any>>,
      default: () => ({}),
    },
    options: {
      type: Array as PropType<ISelectInput['options']>,
      default: () => ([]),
    },
    state: {
      type: [String, Array] as PropType<ISelectInput['state']>,
      default: ISelectInputState.default,
    },
    placeholder: String as PropType<ISelectInput['placeholder']>,
    errors: Array as PropType<ISelectInput['errors']>,
    valueField: {
      type: String as PropType<ISelectInput['valueField']>,
      default: 'value',
    },
    displayField: {
      type: [String, Array] as PropType<ISelectInput['displayField']>,
      default: 'label',
    },
    multiple: Boolean as PropType<ISelectInput['multiple']>,
    allowEmpty: {
      type: Boolean as PropType<ISelectInput['allowEmpty']>,
      default: true,
    },
    emptyValue: {
      type: [Object, String, Number] as PropType<ISelectInput['emptyValue']>,
      default: null,
    },
    isDisabled: Boolean as PropType<ISelectInput['isDisabled']>,
  },
  emits: ['update:modelValue', 'update:query'],
  setup(props, { emit }) {
    const {
      modelValue,
      modelModifiers: sourceModelModifiers,
      query,
      queryModifiers: sourceQueryModifiers,
    } = toRefs(props);
    const modelModifiers = useModifiers<{delay?: [number]}>(sourceModelModifiers);
    const queryModifiers = useModifiers<{delay?: [number]}>(sourceQueryModifiers);
    const value = ref <any | Array<any>>(props.modelValue);

    watch(modelValue, (val) => {
      value.value = val;
    }, {
      immediate: true,
    });

    let modelValueTimeout: number;
    watch(value, (val) => {
      if (val === modelValue.value) {
        return;
      }
      clearTimeout(modelValueTimeout);
      if (modelModifiers.value.delay?.[0]) {
        modelValueTimeout = setTimeout(() => {
          emit('update:modelValue', val);
        }, modelModifiers.value.delay?.[0]);
      } else {
        emit('update:modelValue', val);
      }
    });

    const localQuery = ref <string>(query.value!);

    watch(query, (val) => {
      localQuery.value = val!;
    }, {
      immediate: true,
    });

    let queryTimeout: number;
    watch(localQuery, (val) => {
      if (val === query.value) {
        return;
      }
      clearTimeout(queryTimeout);
      if (queryModifiers.value.delay?.[0]) {
        queryTimeout = setTimeout(() => {
          emit('update:query', val);
        }, queryModifiers.value.delay?.[0]);
      } else {
        emit('update:query', val);
      }
    });

    const [isVisible, toggleVisibility, setVisibility] = useToggle(false);
    const hide = async () => {
      await awaitFrame();
      setVisibility(false);
    };

    const displayValue = computed(() => (
      arrayFrom(
        value.value,
      ).map(
        (val) => {
          const option = props.options?.find(
            (option) => option[props.valueField] === val,
          );

          return arrayFrom(props.displayField!).map((i) => option?.[i]).join(' ').trim();
        },
      ).filter(Boolean).join(', ')
    ));

    const selectOption = (option: any) => {
      if (!(value.value instanceof Array)) {
        value.value = value.value === option ? (
          props.allowEmpty ? (props.emptyValue ?? null) : option
        ) : option;
        hide();
      } else if (value.value instanceof Array) {
        const index = value.value.indexOf(option);
        if (index === -1) {
          value.value.push(option);
        } else {
          value.value.splice(index, 1);
        }
      }
    };

    const searchRef = ref<HTMLInputElement>();
    watch(isVisible, async (value) => {
      if (value && !props.isDisabled) {
        await awaitFrame();
        searchRef.value?.focus();
      }
    }, {
      immediate: true,
    });

    return {
      value,

      arrayFrom,

      isVisible,
      toggleVisibility,

      displayValue,

      hide,

      selectOption,

      searchRef,
      localQuery,
    };
  },
});
</script>

<style lang="scss" module>
@import "./selectInput";
</style>
