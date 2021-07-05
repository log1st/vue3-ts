<template>
  <div :class="$style.page">
    <div :class="$style.tabs">
      <Tabs state="secondary" :tabs="tabs"/>
    </div>
    <div :class="$style.body">
      <div :class="$style.side">
        <div :class="$style.controls">
          <FilterConfig
            v-model="model.company"
            v-bind="companyFilter"
            :class="$style.control"
          />
          <FilterConfig
            v-model="model.region"
            v-bind="regionFilter"
            :class="$style.control"
          />
        </div>
      </div>
      <div :class="$style.content">
        <router-view :class="$style.view"/>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, ref} from '@vue/composition-api';
import Tabs from "@/new/components/tabs/Tabs";
import {useStore} from "@/new/hooks/useStore";
import SelectInput from "@/new/components/selectInput/SelectInput";
import {useActiveTable} from "@/new/components/activeTable/useActiveTable";
import axios from "axios";
import {baseURL} from "@/settings/config";
import FilterConfig from "@/new/components/filter/FilterConfig";

export default defineComponent({
  name: 'index',
  components: {FilterConfig, SelectInput, Tabs},
  setup() {
    const tabs = computed(() => ([
      {
        key: 'import',
        label: 'Загрузка данных',
        icon: 'download',
        url: {
          name: 'exchange-import',
        }
      },
      /*
      {
        key: 'export',
        label: 'Выгрузка данных',
        icon: 'upload',
        url: {
          name: 'exchange-export',
        }
      },
      {
        key: 'integration',
        label: 'Интеграция',
        icon: 'integration',
        url: {
          name: 'exchange-integration',
        }
      },
      */
    ]));

    const store = useStore();
    const defaultCompanyId = computed(() => store.getters['defaultCompanyId'])

    const model = ref({
      company: defaultCompanyId.value,
      region: null,
    });

    const {
      records: companies,
      filtersModel: companiesFilterModel,
    } = useActiveTable({
      isImmediate: true,
      filters: ref([{
        field: 'name',
        type: 'text',
        isHidden: true,
      }]),
      defaultLimit: ref(10),
      async fetch({
        params,
        cancelToken,
      }) {
        const {data} = await axios({
          method: 'get',
          url: `${baseURL}/api/account/company/`,
          params,
          cancelToken,
        });
        return {
          data,
        };
      }
    });

    const companyFilter = computed(() => ({
      field: 'company',
      type: 'select',
      props: {
        placeholder: 'Компания',
        isSearchable: true,
        searchPlaceholder: 'Начните ввод',
        options: companies.value,
        valueProp: 'id',
        displayProp: 'name_short',
        state: 'tertiary',
        async onQuery({query}) {
          companiesFilterModel.value.name = query;
        }
      }
    }));

    const {
      records: regions,
      filtersModel: regionsFilterModel,
    } = useActiveTable({
      isImmediate: true,
      filters: ref([{
        field: 'name',
        type: 'text',
        isHidden: true,
      }]),
      defaultLimit: ref(10),
      async fetch({
        params,
        cancelToken,
      }) {
        const {data} = await axios({
          method: 'get',
          url: `${baseURL}/api/common/region/`,
          params,
          cancelToken,
        });
        return {
          data: {
            count: data.length,
            results: data,
          }
        };
      }
    });

    const regionFilter = computed(() => ({
      field: 'region',
      type: 'select',
      props: {
        placeholder: 'Регион',
        isSearchable: true,
        searchPlaceholder: 'Начните ввод',
        options: regions.value,
        valueProp: 'id',
        displayProp: 'name',
        state: 'tertiary',
        async onQuery({query}) {
          regionsFilterModel.value.name = query;
        }
      }
    }));

    return {
      tabs,

      model,

      companyFilter,

      regionFilter,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
