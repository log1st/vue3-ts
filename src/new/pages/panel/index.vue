<template>
  <div :class="$style.page">
    <div :class="$style.tabs">
      <Tabs :tabs="tabs"/>
    </div>
    <div :class="$style.content">
      <router-view :class="$style.view"/>
    </div>
  </div>
</template>

<script>
import Tabs from "../../components/tabs/Tabs.vue";
import {computed, defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: 'index',
  components: {Tabs},
  setup() {
    const tabs = computed(() => ([
      {
        key: 'data',
        label: 'Общие\nданные',
        url: {
          name: 'panel-data',
        }
      },
      {
        key: 'financial',
        label: 'Транзакции,\nакты, счета',
        url: {
          name: 'panel-financial',
        }
      },
      {
        key: 'services',
        label: 'Услуги',
        url: {
          name: 'panel-services',
        }
      },
      {
        key: 'construct',
        label: 'Конструктор\nдокументов',
        url: {
          name: 'panel-constructor',
        }
      },
    ]));

    return {
      tabs,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
