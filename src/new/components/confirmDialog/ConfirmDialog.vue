<template>
  <div :class="$style.dialog">
    <div :class="$style.headline" v-if="headline">{{headline}}</div>
    <div :class="$style.title" v-if="title">{{title}}</div>
    <div :class="$style.hint" v-if="hint">{{hint}}</div>
    <div :class="$style.message" v-if="message">{{message}}</div>
    <FilterConfig v-model="model" :class="$style.field" v-if="field" :type="field.type" :props="field.props"/>
    <div :class="$style.actions" v-if="computedActions.length">
      <Btn
        v-for="action in computedActions"
        :key="action.key"
        v-bind="action.props"
        :class="$style.action"
        v-on="action.onClick ? {
          click: action.onClick
        } : {}"
      />
    </div>
  </div>
</template>

<script>
import Btn from "@/new/components/btn/Btn";
import {computed, ref} from '@vue/composition-api';
import TextInput from "@/new/components/textInput/TextInput";
import FilterConfig from "@/new/components/filter/FilterConfig";

export default {
  name: "ConfirmDialog",
  components: {FilterConfig, TextInput, Btn},
  props: {
    headline: String,
    title: String,
    message: [String, Boolean],
    hint: [String, Boolean],
    actions: Array,
    onClose: Function,
    onConfirm: Function,
    field: Object,
    isCancellable: Boolean,
    isConfirmable: {
      type: Boolean,
      default: true,
    },
    cancelLabel: {
      type: String,
      default: 'Отмена',
    },
    confirmLabel: {
      type: String,
      default: 'ОК',
    }
  },
  setup(props, {emit}) {
    const model = ref();

    const computedActions = computed(() => (
      props.actions?.length ? props.actions : [
        props.isCancellable && {
          key: 'cancel',
          onClick: () => {
            props.onClose && props.onClose();
            emit('close');
          },
          props: {
            state: 'secondary',
            label: props.cancelLabel || 'Отмена',
          }
        },
        props.isConfirmable && {
          key: 'confirm',
          onClick: () => {
            props.onConfirm && props.onConfirm({
              result: true,
              model: model.value,
            });
            emit('close');
          },
          props: {
            state: 'primary',
            label: props.confirmLabel || 'ОК',
          }
        },
      ].filter(Boolean)
    ));

    return {
      computedActions,
      model,
    }
  }
}
</script>

<style lang="scss" module>
@import "./confirmDialog";
</style>
