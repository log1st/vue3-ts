<template>
  <div :class="$style.page">
    <div :class="$style.main">
      <CompanyCommonData :company="company" />
    </div>
    <div :class="$style.balance">
      <CompanyBalance :company="company" />
    </div>
    <div :class="$style.contracts">
      <CompanyContracts :company="company" />
    </div>
    <div :class="$style.data">
      <CompanyRequisites :company="company" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, provide, ref, watch,
} from 'vue';
import CompanyCommonData from '@/components/companyCommonData/CompanyCommonData.vue';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { useCompanies } from '@/hooks/useCompanies';
import { getAwaitFrame } from '@/utils/window';
import CompanyBalance from '@/components/companyBalance/CompanyBalance.vue';
import CompanyContracts from '@/components/companyContracts/CompanyContracts.vue';
import CompanyRequisites from '@/components/companyRequisites/CompanyRequisites.vue';

export default defineComponent({
  name: 'Index',
  components: {
    CompanyRequisites,
    CompanyContracts,
    CompanyBalance,
    CompanyCommonData,
  },
  setup() {
    const {
      companyId,
    } = useDefaultCompany();

    const company = ref<any>();

    const {
      fetchCompany,
    } = useCompanies();

    const fetchData = async () => {
      if (!companyId.value) {
        return;
      }
      const { status, response } = await fetchCompany(companyId.value);

      if (!status) {
        return;
      }

      company.value = {
        ...response,
        ogrn_data_reg: response.ogrn_data_reg
          ? new Date(response.ogrn_data_reg)
          : null,
      };
    };

    provide('fetchData', fetchData);

    watch(companyId, getAwaitFrame(fetchData), {
      immediate: true,
    });

    return {
      company,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
