<template>
  <div :class="$style.page"  v-if="companyId > 0">
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
      /*
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

       */
    ]));

    const store = useStore();
    const companyId = computed(() => store.getters['defaultCompanyId']);

    return {
      tabs,
      companyId,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
