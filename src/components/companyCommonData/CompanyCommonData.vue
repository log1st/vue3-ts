<template>
  <div :class="$style.container">
    <div :class="$style.name">
      {{ company?.name_short }}
    </div>
    <div :class="$style.title">
      {{ t('title') }}
    </div>
    <div :class="$style.fields">
      <div
        v-for="field in fields"
        :key="field.key"
        :class="$style.field"
      >
        <div :class="$style.label">
          {{ field.label }}
        </div>
        <div :class="$style.value">
          <template v-if="field.value">
            {{ field.value }}
          </template>
          <NA v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { getDeepField } from '@/utils/object';
import { Company } from '@/hooks/useCompanies';
import NA from '@/components/na/NA.vue';
import { formatDate } from '@/utils/date';
import { parseDate } from '@/utils/dateFns';

export default defineComponent({
  name: 'CompanyCommonData',
  components: { NA },
  props: {
    company: Object as PropType<Company>,
  },
  setup(props) {
    const { t } = useLocalI18n('panel.index.common');
    const { locale } = useI18n();

    const fields = computed(() => ([
      {
        key: 'contract',
        value: [
          props.company?.ogrn,
          props.company?.ogrn_data_reg
            ? formatDate(parseDate(props.company.ogrn_data_reg) as Date, locale.value)
            : null,
        ].filter(Boolean).join(' / '),
      },
      {
        key: 'name',
        value: props.company?.name_full,
      },
      {
        key: 'address',
        value: props.company?.physical_address,
      },
      {
        key: 'fio',
        value: props.company?.director,
      },
      {
        key: 'email',
        value: props.company?.email,
      },
      {
        key: 'emailBuh',
        value: props.company?.email_buh,
      },
      {
        key: 'registrationDate',
        value: props.company?.ogrn_data_reg
          ? formatDate(parseDate(props.company.ogrn_data_reg) as Date, locale.value)
          : null,
      },
      {
        key: 'timezone',
        value: props.company?.timezone,
      },
    ].map((field) => ({
      ...field,
      label: t(`field.${field.key}`),
    }))));

    return {
      t,
      getDeepField,
      fields,
    };
  },
});
</script>

<style lang="scss" module>
@import "./companyCommonData";
</style>
