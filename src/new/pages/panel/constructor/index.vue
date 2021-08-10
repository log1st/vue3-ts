<template>
  <router-view :class="$style.page">
    <template #menu>
      <Tabs state="tertiary" :tabs="tabs"/>
    </template>
  </router-view>
</template>

<script>
import {computed, defineComponent} from '@vue/composition-api';
import Tabs from "@/new/components/tabs/Tabs";
import {useRouter} from "@/new/hooks/useRouter";

export default defineComponent({
  name: 'index.vue',
  components: {Tabs},
  setup() {
    const {currentRoute} = useRouter();
    const tabs = computed(() => ([
      {
        key: 'index',
        label: 'Главная',
        url: {
          name: 'panel-constructor',
        },
        exact: true,
      },
      {
        key: 'templates',
        label: 'Шаблоны',
        url: {
          name: 'panel-constructor-templates',
        }
      },
      {
        key: 'create',
        label: (
          currentRoute.value.name === 'panel-constructor-template'
          && currentRoute.value.params.id
        ) ? 'Редактировать шаблон' : 'Создать шаблон',
        url: {
          name: 'panel-constructor-template',
        },
      },
    ]));

    return {
      tabs,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index.scss";
</style>
