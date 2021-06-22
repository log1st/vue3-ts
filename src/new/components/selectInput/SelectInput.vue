<template>
  <div
    :class="[
      $style.container,
      ...(Array.isArray(state) ? state : [state]).map(i => $style[i]),
      isDisabled && $style.isDisabled,
      isActive && $style.isActive,
      !!error && $style.hasError,
    ]"
    v-outside-click="hide"
  >
    <div :class="$style.label" v-if="label">
      {{label}}
    </div>
    <div
      :class="$style.trigger"
      @click="toggle"
    >
      <input
        v-if="isActive && isSearchable"
        :class="$style.search"
        v-model="query"
        :placeholder="searchPlaceholder"
        ref="queryRef"
      />
      <input
        v-else-if="isActive && isFillable"
        :class="$style.search"
        v-model="fill"
        :placeholder="placeholder"
        @keypress.enter.prevent="addFill"
        ref="fillRef"
      />
      <div :class="$style.value" v-else-if="displayValue">
        <span>
          <slot name="displayValue" :value="value">
            {{displayValue}}
          </slot>
        </span>
      </div>
      <div :class="$style.placeholder" v-else>
        {{placeholder}}
      </div>
      <Icon :class="$style.caret" icon="chevron-down"/>
    </div>
    <div v-if="error" :class="$style.error">
      {{error}}
    </div>
    <ContextMenu
        v-if="isActive && isFillable && value.length"
        :actions="computedValueOptions"
        :class="$style.options"
    />
    <ContextMenu
      v-else-if="isActive && computedOptions.length"
      :actions="computedOptions"
      :class="$style.options"
      v-model="value"
      @close="hideOptions"
    />
  </div>
</template>

<script>
import {defineComponent, ref, computed, watch} from '@vue/composition-api';
import Icon from "@/new/components/icon/Icon";
import ContextMenu from "@/new/components/contextMenu/ContextMenu";
import {useLocalProp} from "@/new/hooks/useLocalProp";
import {formatMessage} from "@/new/utils/messageFormat";
import {arrayFrom} from "@/new/utils/object";

export default defineComponent({
  name: "SelectInput",
  components: {ContextMenu, Icon},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    state: {
      type: [String, Array],
      default: 'primary',
    },
    modelValue: [String, Number, Array, Boolean],

    placeholder: String,
    label: String,

    isDisabled: Boolean,
    isMultiple: Boolean,

    options: {
      type: Array,
      default: () => ([]),
    },

    isFillable: Boolean,

    isSearchable: Boolean,
    searchPlaceholder: String,
    searchDelay: {
      type: Number,
      default: 250,
    },

    valueProp: {
      type: String,
      default: 'value'
    },
    displayProp: {
      type: [String, Array],
      default: 'label',
    },

    displayValueTemplate: String,

    error: String,
  },
  setup(props, {emit}) {
    const queryRef = ref();
    const fillRef = ref();

    const isActive = ref(false);
    const toggle = async ({target}) => {
      if(props.isDisabled) {
        return;
      }
      if([queryRef.value, fillRef].includes(target)) {
        return;
      }
      await new Promise(requestAnimationFrame);
      isActive.value = !isActive.value;
      if(isActive.value) {
        await new Promise(requestAnimationFrame);
        queryRef.value?.focus();
        fillRef.value?.focus();
      }
    };
    const hide = () => {
      isActive.value = false;
    };
    const hideOptions = () => {
      if(props.isMultiple) {
        return;
      }
      hide();
    };

    const value = useLocalProp(props, emit, 'modelValue');

    const optionsMap = computed(() => (
      props.options.reduce((acc, cur) => ({
        ...acc,
        [cur[props.valueProp]]: cur
      }), {})
    ));

    const displayValue = computed(() => (
      props.displayValueTemplate ? (
        (props.isMultiple ? value.value.length : !!value.value)
          ? formatMessage(props.displayValueTemplate, {n: value.value.length, value: value.value})
          : null
      ) : (
        props.isMultiple
          ? (
            props.isFillable ? value.value.join(', ') : (
              value.value.map(i => arrayFrom(props.displayProp).map(f => optionsMap.value[i][f]).join(' ')).join(', ')
            )
          )
          : arrayFrom(props.displayProp).map(i => optionsMap.value[value.value]?.[i]).join(' ')
      )
    ));

    const query = ref('');
    const fill = ref('');
    const addFill = () => {
      if(!value.value) {
        return;
      }
      if(value.value.includes(fill.value)) {
        return;
      }
      value.value.push(fill.value);
    }
    const removeFill = async (index) => {
      await new Promise(requestAnimationFrame);
      value.value.splice(index, 1);
    }

    watch(value, () => {
      query.value = '';
      fill.value = '';
    }, {
      deep: true,
    })

    let queryTimeout;
    watch(query, newQuery => {
      clearTimeout(queryTimeout);
      if(!newQuery) {
        return;
      }
      queryTimeout = setTimeout(() => {
        emit('query', {query: newQuery});
      }, props.searchDelay);
    })

    const computedOptions = computed(() => (
      props.options.map(option => ({
        key: option[props.valueProp],
        label: arrayFrom(props.displayProp).map(i => option[i]).join(' '),
      }))
    ))

    const computedValueOptions = computed(() => (
      arrayFrom(value.value).map(i => ({
        key: i,
        label: i,
        onClick: (index) => {
          removeFill(index)
        }
      }))
    ))

    return {
      isActive,
      toggle,
      hide,

      hideOptions,

      value,

      displayValue,

      queryRef,
      query,

      fillRef,
      fill,
      addFill,
      removeFill,

      computedValueOptions,
      computedOptions,

    }
  }
});
</script>

<style lang="scss" module>
@import "./selectInput";
</style>
