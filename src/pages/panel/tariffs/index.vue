<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <div :class="$style.title">
        {{ t('content.title') }}
      </div>
    </div>
    <div :class="$style.tariffs">
      <div :class="$style.title">
        {{ t('tariffs.title') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { FinanceService, useFinance } from '@/hooks/useFinance';
import { useActiveTable } from '@/hooks/useActiveTable';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { ActiveFormFieldType } from '@/hooks/useActiveForm';

export default defineComponent({
  name: 'Index',
  setup() {
    const { t } = useLocalI18n('panel.tariffs');

    const {
      companyId,
    } = useDefaultCompany();

    const {
      fetchAvailableServices,
    } = useFinance();

    const {
      records: availableServices,
    } = useActiveTable<FinanceService, FinanceService, 'id'>({
      defaultLimit: ref(1000),
      keyField: 'id',
      async fetch({ params, signal }) {
        const { response } = await fetchAvailableServices({
          ...params,
          signal,
        });

        return response;
      },
      filters: computed(() => ([
        {
          key: 'company_id',
          field: 'company_id',
          type: ActiveFormFieldType.input,
          defaultValue: companyId.value,
        },
      ])),
    });

    return {
      t,
      availableServices,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
