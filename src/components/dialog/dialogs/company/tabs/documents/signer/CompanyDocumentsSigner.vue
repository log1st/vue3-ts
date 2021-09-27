<template>
  <div :class="$style.signer">
    <div :class="$style.fields">
      <ActiveField
        v-for="field in fields"
        :key="field.key"
        v-model="value[field.field]"
        :label="field.label"
        :type="field.type"
        :options="field.options"
        :state="['primary', 'horizontal', 'tiny']"
        :class="$style.field"
        :is-readonly="!isEditing"
      />
    </div>
    <FileField
      v-model:file="value.file"
      v-model:name="value.name"
      :class="$style.file"
      :is-editing="isEditing"
      :accept="['application/pdf']"
      @remove="$emit('remove', $event)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import ActiveField from '@/components/activeField/ActiveField.vue';
import { AccountDocument } from '@/hooks/useAccountDocuments';
import { useLocalValue } from '@/hooks/useLocalValue';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import FileField from '@/components/documentField/DocumentField.vue';

export default defineComponent({
  name: 'CompanyDocumentsSigner',
  components: { FileField, ActiveField },
  props: {
    modelValue: {
      type: Object as PropType<AccountDocument>,
      required: true,
    },
    isEditing: Boolean as PropType<boolean>,
  },
  emits: ['update:modelValue', 'remove'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const value = useLocalValue(props, 'modelValue', emit);

    const fields = computed<Array<ActiveFormField<AccountDocument>>>(() => ([
      {
        key: 'signer',
        field: 'signer',
        defaultField: props.modelValue.signer,
        label: t('company.documents.signer.signer'),
        type: ActiveFormFieldType.input,
      },
      {
        key: 'signer_name',
        field: 'signer_name',
        defaultField: props.modelValue.signer_name,
        label: t('company.documents.signer.signer_name'),
        type: ActiveFormFieldType.input,
      },
    ]));

    return {
      value,
      fields,
    };
  },
});
</script>

<style lang="scss" module>
@import "./companyDocumentsSigner";
</style>
