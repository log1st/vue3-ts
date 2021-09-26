<template>
  <form
    v-outside-click="close"
    :class="$style.container"
    @submit.prevent="submit"
  >
    <div
      :class="$style.form"
    >
      <ActiveField
        v-for="field in localFields"
        :key="field.key"
        v-model.delay:300="value[field.key]"
        :style="{width: `${(field.width || 1) / maxWidth * 100}%`}"
        v-bind="field"
        state="primary"
        :class="$style.field"
        @update:query="query => field.onQuery({query})"
      />
    </div>
    <div :class="$style.actions">
      <Btn
        :state="['tertiary']"
        :label="cancelLabel || t('other.cancel')"
        @click="reset"
      />
      <Btn
        state="primary"
        type="submit"
        :label="submitLabel || t('other.confirm')"
        @click="submit"
      />
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, Prop, PropType, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { ActiveFormField } from '@/hooks/useActiveForm';
import ActiveField from '@/components/activeField/ActiveField.vue';
import Btn from '@/components/btn/Btn.vue';
import { awaitFrame } from '@/utils/window';

export default defineComponent({
  name: 'ActiveForm',
  components: { Btn, ActiveField },
  props: {
    modelValue: Object as PropType<Record<any, any>>,
    fields: Array as PropType<Array<ActiveFormField<any>>>,
    active: Boolean as PropType<boolean>,
    cancelLabel: String as PropType<string>,
    submitLabel: String as PropType<string>,
    excludeInvisible: Boolean as Prop<boolean>,
    emitOnUpdate: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  emits: ['update:modelValue', 'reset', 'update:active'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const computeModel = () => (
      props.fields?.reduce((acc, { field, defaultValue }) => ({
        ...acc,
        [field]: defaultValue || null,
      }), {}) || {}
    );
    const value = ref<Record<any, any>>(
      JSON.parse(JSON.stringify(props.modelValue || computeModel())),
    );
    watch(value, (value) => {
      if (!props.emitOnUpdate) {
        return;
      }
      emit('update:modelValue', value);
    }, {
      deep: true,
    });
    const maxWidth = computed<number>(() => Math.max(
      ...props.fields?.map(({ width }) => width || 1) || [],
    ));

    const submit = async () => {
      emit('update:modelValue', value.value);
    };

    const reset = async () => {
      emit('update:modelValue', computeModel());
      value.value = computeModel();
    };

    const localFields = computed(() => (props.excludeInvisible
      ? props.fields?.filter(({ isVisible }) => isVisible || (typeof isVisible === 'undefined'))
      : props.fields) || []);

    const close = async () => {
      await awaitFrame();
      emit('update:active', false);
    };

    return {
      close,
      value,
      maxWidth,
      submit,
      reset,
      t,
      localFields,
    };
  },
});
</script>

<style lang="scss" module>
@import "./activeForm";
</style>
