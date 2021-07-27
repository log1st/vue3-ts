<template>
  <div :class="$style.page"  v-if="company">
    <div :class="$style.tabs">
      <Tabs :tabs="tabs"/>
    </div>
    <router-view :class="$style.body"/>
  </div>
</template>

<script>
import {computed, defineComponent} from '@vue/composition-api';
import Tabs from "@/new/components/tabs/Tabs";
import {useStore} from "@/new/hooks/useStore";
import {isDev} from "@/entry-server";
import {baseURL} from "@/settings/config";

export default defineComponent({
  name: 'index',
  components: {Tabs},
  setup() {
    const tabs = computed(() => ([
      {
        key: 'pretrial',
        label: 'Досудебное\nпроизводство',
        url: {
          name: 'debtors-module',
          params: {
            module: 'pretrial'
          }
        }
      },
      {
        key: 'judicial',
        label: 'Судебное\nпроизводство',
        url: {
          name: 'debtors-module',
          params: {
            module: 'judicial'
          }
        }
      },
      {
        key: 'executive',
        label: 'Исполнительное\nпроизводство',
        url: {
          name: 'debtors-module',
          params: {
            module: 'executive'
          }
        }
      },
    ].filter(Boolean)));

    const store = useStore();
    const company = computed(() => store.getters['getDefaultCompany']);

    return {
      tabs,
      company,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
