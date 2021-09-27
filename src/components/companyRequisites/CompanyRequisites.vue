<template>
  <form
    :class="$style.container"
    @submit.prevent="submit"
  >
    <div
      :class="[
        $style.header,
        isExpanded && $style.expanded
      ]"
      @click="toggle"
    >
      <div :class="$style.title">
        {{ t('title') }}
      </div>
      <Icon
        icon="chevron-down"
        :class="$style.toggle"
      />
    </div>
    <div :class="$style.header">
      <div :class="$style.subTitle">
        {{ t('subTitle') }}
      </div>
      <Icon
        v-if="isExpanded"
        :class="$style.edit"
        icon="pencil"
        @click="toggleEditing"
      />
    </div>
    <div :class="$style.fields">
      <div
        v-for="field in (!isExpanded ? fields.slice(0, 2) : fields)"
        :key="field.key"
        :class="$style.field"
      >
        <div :class="$style.label">
          {{ field.label }}
        </div>
        <div
          v-if="!isEditing"
          :class="$style.value"
        >
          <template v-if="model?.[field.field]">
            <template v-if="field.type === 'date'">
              {{ formatDate(model[field.field], 'ru') }}
            </template>
            <template v-else>
              {{ model[field.field] }}
            </template>
          </template>
          <NA v-else />
        </div>
        <ActiveField
          v-else-if="model"
          v-model="model[field.field]"
          :errors="errorsMap[field.field]"
          :type="field.type"
          :options="field.options"
          state="primary"
          :class="$style.input"
        />
      </div>
    </div>
    <Btn
      v-if="isEditing"
      type="submit"
      state="primary"
      :label="t('submit')"
      :class="$style.submit"
    />
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, inject, PropType, ref, watch,
} from 'vue';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { Company, UpdateCompanyResponse, useCompanies } from '@/hooks/useCompanies';
import Icon from '@/components/icon/Icon.vue';
import { useToggle } from '@/hooks/useToggle';
import { getDeepField } from '@/utils/object';
import ActiveField from '@/components/activeField/ActiveField.vue';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import NA from '@/components/na/NA.vue';
import { ActiveFormFieldType } from '@/hooks/useActiveForm';
import { formatDate } from '@/utils/date';
import Btn from '@/components/btn/Btn.vue';

export default defineComponent({
  name: 'CompanyRequisites',
  components: {
    Btn, NA, ActiveField, Icon,
  },
  props: {
    company: Object as PropType<Company>,
  },
  setup(props) {
    const { t } = useLocalI18n('panel.index.requisites');

    const [isExpanded, toggle] = useToggle();

    const fields = computed(() => (([
      { key: 'ogrn_data_reg', type: ActiveFormFieldType.date },
      { key: 'name_full' },
      { key: 'name_short' },
      { key: 'inn' },
      { key: 'kpp' },
      { key: 'ogrn' },
      { key: 'legal_address' },
      { key: 'physical_address' },
      { key: 'postal_address_zip_code' },
      { key: 'bic' },
      { key: 'full_name_bank' },
      { key: 'kor_schet' },
      { key: 'ras_schet' },
      { key: 'email_buh' },
    ] as Array<{ key: keyof Company; type?: ActiveFormFieldType }>).map((item) => ({
      label: t(`field.${item.key}`),
      field: item.key,
      type: ActiveFormFieldType.input,
      options: {
        placeholder: t(`field.${item.key}`),
      },
      ...item,
    }))));

    const [isEditing, toggleEditing] = useToggle();

    const model = ref<Company>();

    const {
      updateCompany,
    } = useCompanies();

    const reset = async () => {
      model.value = {
        ...JSON.parse(JSON.stringify(props.company)),
        ogrn_data_reg: props.company?.ogrn_data_reg
          ? new Date(props.company.ogrn_data_reg)
          : null,
      };
    };

    const fetchData = inject<() => Promise<void>>('fetchData');

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors<keyof UpdateCompanyResponse>();

    const submit = async () => {
      clearErrors();

      const { status, response } = await updateCompany({
        id: props.company!.id,
        payload: model.value!,
      });

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof UpdateCompanyResponse>);
      } else {
        fetchData?.();
        isEditing.value = false;
      }
    };

    watch(computed(() => props.company), (newCompany) => {
      if (!newCompany) {
        return;
      }
      model.value = {
        ...JSON.parse(JSON.stringify(newCompany)),
        ogrn_data_reg: newCompany?.ogrn_data_reg
          ? new Date(newCompany.ogrn_data_reg)
          : null,
      };
    }, {
      immediate: true,
    });

    watch(isExpanded, (value) => {
      if (value) {
        return;
      }
      isEditing.value = false;
    });
    watch(isEditing, async (value) => {
      if (!value) {
        return;
      }

      await reset();
    });

    return {
      t,
      fields,

      isExpanded,
      toggle,

      isEditing,
      toggleEditing,

      formatDate,
      getDeepField,

      submit,
      errorsMap,
      model,
    };
  },
});
</script>

<style lang="scss" module>
@import "./companyRequisites";
</style>
