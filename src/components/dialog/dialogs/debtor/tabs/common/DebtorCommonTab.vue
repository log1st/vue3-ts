<template>
  <div :class="$style.content">
    <Tabs
      v-model="activeTab"
      :class="$style.tabs"
      :state="['tertiary', 'tiny']"
      :tabs="tabs"
    />
    <component
      :is="component"
      v-if="component"
      :class="$style.body"
      :debtor="debtor"
      :production-type="productionType"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref,
} from 'vue';
import { Debtor } from '@/hooks/useDebtors';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import Tabs from '@/components/tabs/Tabs.vue';
import { ITab } from '@/components/tabs/useTabs';
import { DebtorPayload, useDialogRouteParam } from '@/hooks/useDialog';
import DebtorCommonMainTab
  from './tabs/main/DebtorCommonMainTab.vue';
import DebtorCommonTenantsTab
  from './tabs/tenants/DebtorCommonTenantsTab.vue';
import DebtorCommonOwnersTab
  from './tabs/owners/DebtorCommonOwnersTab.vue';

export default defineComponent({
  name: 'DebtorCommonTab',
  components: { Tabs },
  props: {
    debtor: Object as PropType<Debtor>,
    productionType: {
      type: String as PropType<DebtorPayload['productionType']>,
      required: true,
    },
  },
  setup() {
    const { t } = useLocalI18n('debtor.common');

    type ActiveTabKey = 'main' | 'tenants' | 'owners';
    const tabs = computed<Array<ITab<ActiveTabKey>>>(() => (([
      {
        key: 'main',
        label: t('main.tab'),
      },
      {
        key: 'tenants',
        label: t('tenants.tab'),
      },
      {
        key: 'owners',
        label: t('owners.tab'),
      },
    ] as Array<ITab<ActiveTabKey> | boolean>))
      .filter(Boolean) as Array<ITab<ActiveTabKey>>);

    const [activeTab] = useDialogRouteParam<ActiveTabKey>(
      'common-tab',
      'main',
      ref(true),
    );

    const component = computed(() => (({
      main: DebtorCommonMainTab,
      tenants: DebtorCommonTenantsTab,
      owners: DebtorCommonOwnersTab,
    } as {[key in ActiveTabKey]: any})[activeTab.value]));

    return {
      t,
      activeTab,
      tabs,
      component,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorCommonTab";
</style>
