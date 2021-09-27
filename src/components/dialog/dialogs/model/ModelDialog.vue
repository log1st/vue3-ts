<template>
  <form
    :class="[
      $style.dialog,
      $style.default
    ]"
    @submit.prevent="submit"
  >
    <template
      v-for="field in fields || []"
      :key="field.key"
    >
      <div :class="$style.field">
        <div :class="$style.label">
          {{ field.options?.label }}
        </div>
        <div
          v-if="!isEditing || field.isReadonly"
          :class="$style.value"
        >
          <template v-if="model[field.key]">
            {{ model[field.key] }}
          </template>
          <NA v-else />
        </div>
        <ActiveField
          v-else
          v-model="model[field.key]"
          :type="field.type"
          :options="{
            ...(({label, ...options}) => options)(field.options || {}),
            isDisabled: field.blockedBy?.length && field.blockedBy?.some(key => !!model[key])
          }"
          :class="$style.input"
          state="primary"
          :errors="errorsMap?.[field.key]"
        />
      </div>
    </template>
    <div
      v-if="isEditing"
      :class="$style.actions"
    >
      <Btn
        state="tertiary"
        :label="$i18n.t('other.cancel')"
        :class="$style.action"
        @click="cancel"
      />
      <Btn
        state="primary"
        type="submit"
        :label="$i18n.t('other.confirm')"
        :class="$style.action"
      />
    </div>
    <Btn
      v-else-if="isToggleable"
      state="primary"
      :label="$i18n.t('other.edit')"
      :class="$style.edit"
      @click="toggleIsEditing"
    />
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, onBeforeUnmount, PropType, ref, toRefs, watch,
} from 'vue';
import { ModelPayload } from '@/hooks/useDialog';
import { awaitFrame } from '@/utils/window';
import ActiveField from '@/components/activeField/ActiveField.vue';
import Btn from '@/components/btn/Btn.vue';
import { SignalType, useSignal } from '@/hooks/useSignal';
import { ErrorsMap } from '@/hooks/useErrors';
import NA from '@/components/na/NA.vue';
import { useToggle } from '@/hooks/useToggle';

export default defineComponent({
  name: 'ModelDialog',
  components: { NA, Btn, ActiveField },
  props: {
    record: Object as PropType<ModelPayload['record']>,
    fields: Array as PropType<ModelPayload['fields']>,
    isEditable: Boolean as PropType<ModelPayload['isEditable']>,
    signal: String as PropType<ModelPayload['signal']>,
    isToggleable: Boolean as PropType<ModelPayload['isToggleable']>,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { record, fields, isEditable } = toRefs(props);
    const model = ref<ModelPayload['record']>({});

    const [isEditing, toggleIsEditing, setIsEditing] = useToggle(isEditable.value || false);
    watch(isEditable, (newValue) => {
      setIsEditing(newValue || false);
    }, { immediate: true });

    watch(computed(() => [record.value, fields.value]), async () => {
      await awaitFrame();
      model.value = record.value || (fields.value || []).reduce((acc, field) => ({
        ...acc,
        [field.key]: field.defaultValue || null,
      }), {});
    }, {
      immediate: true,
      deep: true,
    });

    const {
      dispatchSignal,
      subscribeToSignal,
    } = useSignal();

    const errorsMap = ref<ErrorsMap<any>>();
    onBeforeUnmount(subscribeToSignal(SignalType.modelErrors, ({ id, errors }: {
      id: string;
      errors: ErrorsMap<any>;
    }) => {
      if (id === props.signal) {
        errorsMap.value = errors;
      }
    }));

    const submit = async () => {
      await dispatchSignal(SignalType.model, {
        id: props.signal,
        model: model.value,
      });
    };

    const cancel = () => {
      emit('close');
    };

    return {
      isEditing,
      model,
      submit,
      cancel,
      errorsMap,
      toggleIsEditing,
    };
  },
});
</script>

<style lang="scss" module>
@import "./modelDialog";
</style>
