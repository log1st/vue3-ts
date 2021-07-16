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
        <div :class="$style.menu">
          <component
            :is="link.isDisabled ? 'div' : 'router-link'"
            v-for="link in sideLinks"
            :key="link.key"
            :class="[
              $style.link,
              link.isDisabled && $style.disabled,
            ]"
            :active-class="!link.exact ? $style.active : null"
            :exact-active-class="link.exact ? $style.active : null"
            :to="link.to"
          >
            {{link.label}}
          </component>
        </div>
      </div>
      <div :class="$style.content">
        <router-view :class="$style.view"/>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, provide, ref, watch} from '@vue/composition-api';
import Tabs from "@/new/components/tabs/Tabs";
import {useStore} from "@/new/hooks/useStore";
import SelectInput from "@/new/components/selectInput/SelectInput";
import {useActiveTable} from "@/new/components/activeTable/useActiveTable";
import axios from "axios";
import {baseURL} from "@/settings/config";
import FilterConfig from "@/new/components/filter/FilterConfig";
import {useRouter} from "@/new/hooks/useRouter";

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

    watch(computed(() => model.value.company), async id => {
      if(!id) {
        return;
      }

      model.value.region = (await axios({
        method: 'get',
        url: `${baseURL}/api/account/company-settings/${id}`
      })).data.default_region
    }, {
      immediate: true,
    })

    provide('globalModel', model);

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

        const filteredData = data.filter(({name}) => !params.name || name.toLowerCase().indexOf(params.name.toLowerCase()) > -1);

        return {
          data: {
            count: filteredData.length,
            results: filteredData,
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
        forcedQuery: true,
        valueProp: 'id',
        displayProp: 'name',
        state: 'tertiary',
        async onQuery({query}) {
          regionsFilterModel.value.name = query;
        }
      }
    }));

    const {
      currentRouter,
    } = useRouter();

    const module = computed(() => (
      currentRouter.value.name.match(/(exchange-\w+)(-.*|)/)[1]
    ))

    const sideLinks = computed(() => ({
      import: [
        {
          key: 'instruction',
          label: 'Инструкция',
          to: {
            name: `${module.value}-instruction`
          }
        },
        {
          key: 'pretrial',
          label: 'Досудебное производство',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'pretrial',
            }
          }
        },
        {
          key: 'judicial',
          label: 'Судебное производство',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'judicial',
            }
          }
        },
        {
          key: 'executive',
          label: 'Исполнительное производство',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'executive',
            }
          }
        },
        /*
        {
          key: 'bankruptcy',
          label: 'Банкротство',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'bankruptcy',
            }
          }
        },
        {
          key: 'rosreestr',
          label: 'Росреестр',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'rosreestr',
            }
          }
        },
        */
        {
          key: 'payment-order',
          label: 'Платёжное поручение',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'payment-order',
            }
          }
        },
        {
          key: 'judgment',
          label: 'Судебное решение',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'judgment',
            }
          }
        },
        /*
        {
          key: 'housebook',
          label: 'Выписка из домовой книги',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'housebook',
            }
          }
        },
        {
          key: 'fns',
          label: 'Запрос от ФНС по счетам',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'fns',
            }
          }
        },
        {
          key: 'bank',
          label: 'Ответ от банка по счетам',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'bank',
            }
          }
        },
        {
          key: 'performance-list',
          label: 'Исполнительный лист',
          to: {
            name: `${module.value}-type`,
            params: {
              type: 'performance-list',
            }
          }
        },
         */
      ].map(item => ({
        ...item,
      }))
    }[module.value.match(/exchange-(\w+)/)[1]]))

    return {
      tabs,
      sideLinks,

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
