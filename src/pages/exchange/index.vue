<template>
  <div :class="$style.page">
    <Tabs
      :class="$style.tabs"
      :tabs="tabs"
      state="primary"
    />
    <div :class="$style.container">
      <div
        :class="[
          $style.side,
          $style.shadow
        ]"
      >
        <div :class="$style.controls">
          <SelectInput
            v-model="company"
            :options="companies"
            value-field="id"
            display-field="name_short"
            :placeholder="t('exchange.company')"
            :class="$style.control"
            :state="['primary', 'light']"
          />
          <SelectInput
            v-model:query="regionFilter"
            :model-value="region"
            :options="regions"
            value-field="id"
            display-field="name"
            :class="$style.control"
            :state="['primary', 'light']"
            :placeholder="t('exchange.region')"
            :search-placeholder="t('exchange.region')"
            is-searchable
            :allow-empty="false"
            @update:modelValue="setRegion"
          />
        </div>
        <div :class="$style.dataTypes">
          <router-link
            v-for="type in dataTypes"
            :key="type.key"
            :to="type.to"
            :class="[
              $style.dataType,
              dataType === type.key && $style.active
            ]"
          >
            <div :class="$style.dataTypeLabel">
              {{ type.label }}
            </div>
          </router-link>
        </div>
      </div>
      <div
        :class="[
          $style.content,
          $style.shadow
        ]"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, provide, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { RouteRecordRaw, useRouter } from 'vue-router';
import Tabs from '@/components/tabs/Tabs.vue';
import { ITabs } from '@/components/tabs/useTabs';
import SelectInput from '@/components/selectInput/SelectInput.vue';
import { useActiveTable } from '@/hooks/useActiveTable';
import { Company, Region, useCompanies } from '@/hooks/useCompanies';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { getAwaitFrame } from '@/utils/window';
import { DataType, DataTypeKey } from '@/hooks/useExchange';

export default defineComponent({
  name: 'Index',
  components: { SelectInput, Tabs },
  setup() {
    const { t } = useI18n();
    const tabs = computed<ITabs['tabs']>(() => ([
      {
        key: 'import',
        label: t('exchange.import.title'),
        icon: 'download',
        to: {
          name: 'exchange-import',
        },
      }, /*
      {
        key: 'export',
        label: t('exchange.export.title'),
        icon: 'upload',
        to: {
          name: 'exchange-export',
        },
      },
      {
        key: 'integration',
        label: t('exchange.integration.title'),
        icon: 'integration',
        to: {
          name: 'exchange-integration',
        },
      }, */
    ]));

    const {
      companies,
      fetchRegions,
      fetchCompanySettings,
      updateCompanySettings,
    } = useCompanies();

    const {
      company: defaultCompany,
    } = useDefaultCompany();

    const company = ref<Company['id'] | null>(null);
    provide('companyId', company);
    watch(defaultCompany, (newCompany) => {
      if (!company.value) {
        company.value = newCompany?.id || null;
      }
    }, {
      immediate: true,
    });

    const region = ref<Region['id'] | null>(null);
    provide('regionId', region);
    const fetchDefaultRegion = async (id: Company['id']) => {
      region.value = null;
      if (id) {
        const { status, response } = await fetchCompanySettings(id);

        if (status) {
          region.value = response.default_region;
        }
      }
    };
    watch(company, getAwaitFrame(fetchDefaultRegion), {
      immediate: true,
    });

    const {
      records: regions,
    } = useActiveTable<Region, Region, 'id'>({
      keyField: 'id',
      // @TODO удалить после апдейта бэка
      defaultLimit: ref(10000),
      async fetch({ params, signal }) {
        const { response } = await fetchRegions({ ...params, signal });

        return response;
      },
    });

    const regionFilter = ref<string>();
    const computedRegions = computed(() => (
      regionFilter.value
        ? regions.value.filter(
          (region) => region.name.toLowerCase().includes(regionFilter.value!.toLowerCase()),
        )
        : regions.value
    ));

    const setRegion = async (regionId: Region['id']) => {
      await updateCompanySettings({
        id: company.value!,
        payload: { default_region: regionId },
      });
      region.value = regionId;
      regionFilter.value = '';
    };
    const dataTypes = computed<Array<DataType<DataTypeKey>>>(() => (([
      {
        key: DataTypeKey.instruction,
      },
      {
        key: DataTypeKey.pretrial,
      },
      {
        key: DataTypeKey.judicial,
      },
      {
        key: DataTypeKey.executive,
      },
      {
        key: DataTypeKey.paymentOrder,
      },
      {
        key: DataTypeKey.judgment,
      },
      {
        key: DataTypeKey.housebook,
      },
    ]).map((type) => ({
      ...type,
      label: t(`exchange.dataType.${type.key}`),
      to: {
        params: {
          dataType: type.key,
        },
      } as Partial<RouteRecordRaw>,
    }))));
    const { currentRoute } = useRouter();
    const dataType = computed<DataTypeKey>(() => (
      currentRoute.value.params.dataType as DataTypeKey || 'instruction'
    ));

    const withYear = ref(true);

    return {
      withYear,
      t,

      tabs,
      companies,
      company,
      regionFilter,
      regions: computedRegions,
      setRegion,
      region,

      dataTypes,
      dataType,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
