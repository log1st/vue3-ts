<template>
  <div :class="$style.page">
    <Tabs
      state="quaternary"
      :tabs="tabs"
    />
    <div :class="$style.content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Tabs from '@/components/tabs/Tabs.vue';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { ITabs } from '@/components/tabs/useTabs';
import { ProductionType } from '@/hooks/useConstructor';
import { DataTypeKey } from '@/hooks/useExchange';

export default defineComponent({
  name: 'Index',
  components: { Tabs },
  beforeRouteEnter(to, from, next) {
    if (!to.params.module) {
      next({ ...to, params: { ...to.params, module: DataTypeKey.judicial } });
      return;
    }
    next();
  },
  setup() {
    const { t } = useLocalI18n('debtors');

    const tabs = computed<ITabs['tabs']>(() => ([
      ProductionType.pretrial,
      ProductionType.judicial,
      ProductionType.executive,
    ].map((key) => ({
      key,
      label: t(`${key}.tab`),
      to: {
        name: 'debtors-module',
        params: {
          module: key,
        },
      },
    }))));

    return {
      tabs,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
