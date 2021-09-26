<template>
  <div :class="$style.page">
    <Tabs
      :class="$style.tabs"
      :tabs="tabs"
      state="quaternary"
    />
    <div :class="$style.container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { ITabs } from '@/components/tabs/useTabs';
import Tabs from '@/components/tabs/Tabs.vue';

export default defineComponent({
  name: 'Index',
  components: { Tabs },
  setup() {
    const { t } = useI18n();
    const tabs = computed<ITabs['tabs']>(() => ([
      {
        key: 'index',
        label: t('panel.index.title'),
        to: {
          name: 'panel-index',
        },
        exact: true,
      },
      {
        key: 'tariffs',
        label: t('panel.tariffs.title'),
        to: {
          name: 'panel-tariffs',
        },
        exact: true,
      },
      {
        key: 'constructor',
        label: t('panel.constructor.title'),
        to: {
          name: 'panel-constructor',
        },
      },
      {
        key: 'password',
        label: t('panel.password.title'),
        to: {
          name: 'panel-password',
        },
      },
    ]));

    return {
      tabs,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
