<template>
  <div
    :class="[
      $style.dialog,
      $style.default,
      previousId && $style.hasPrevious,
      nextId && $style.hasNext,
    ]"
  >
    <div :class="$style.title">
      {{ t('title', {name: debtor?.debtor_main_profile?.full_name}) }}
    </div>
    <Tabs
      v-model="activeTab"
      :class="$style.tabs"
      :tabs="tabs"
      state="secondary"
    />
    <component
      :is="component"
      :class="$style.content"
      :debtor="debtor"
      :production-type="productionType"
    />
    <button
      v-if="previousId"
      :class="[
        $style.navigate,
        $style.previous
      ]"
      type="button"
      @click="goTo(previousId)"
    >
      <Icon icon="chevron-left" />
    </button>
    <button
      v-if="nextId"
      :class="[
        $style.navigate,
        $style.next
      ]"
      type="button"
      @click="goTo(nextId)"
    >
      <Icon icon="chevron-right" />
    </button>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  PropType,
  provide,
  ref,
  toRefs,
  watch,
} from 'vue';
import { DebtorPayload, useDialogRouteParam } from '@/hooks/useDialog';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { Debtor, useDebtors } from '@/hooks/useDebtors';
import { getAwaitFrame } from '@/utils/window';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import Tabs from '@/components/tabs/Tabs.vue';
import { ITab } from '@/components/tabs/useTabs';
import { ProductionType } from '@/hooks/useConstructor';
import DebtorCommonTab from '@/components/dialog/dialogs/debtor/tabs/common/DebtorCommonTab.vue';
import DebtorDocumentsTab
  from '@/components/dialog/dialogs/debtor/tabs/documents/DebtorDocumentsTab.vue';
import DebtorFinanceTab from '@/components/dialog/dialogs/debtor/tabs/finance/DebtorFinanceTab.vue';
import DebtorNotificationsTab
  from '@/components/dialog/dialogs/debtor/tabs/notifications/DebtorNotificationsTab.vue';
import DebtorCourtsTab from '@/components/dialog/dialogs/debtor/tabs/courts/DebtorCourtsTab.vue';
import DebtorExecutionsTab
  from '@/components/dialog/dialogs/debtor/tabs/executions/DebtorExecutionsTab.vue';
import Icon from '@/components/icon/Icon.vue';
import { SignalType, useSignal } from '@/hooks/useSignal';

export default defineComponent({
  name: 'DebtorDialog',
  components: { Icon, Tabs },
  props: {
    id: {
      type: Number as PropType<DebtorPayload['id']>,
      required: true,
    },
    productionType: {
      type: String as PropType<DebtorPayload['productionType']>,
      required: true,
    },
    isCurrent: Boolean as PropType<boolean>,
  },
  setup(props) {
    const isCurrent = computed(() => !!props.isCurrent);
    const { id, productionType } = toRefs(props);
    const { t } = useLocalI18n('debtor');

    const nextId = ref(false);
    const previousId = ref(false);

    const { companyId } = useDefaultCompany();

    const {
      fetchDebtor,
    } = useDebtors();

    const {
      subscribeToSignal,
      dispatchSignal,
    } = useSignal();

    onBeforeUnmount(
      subscribeToSignal(SignalType.debtorNeighboursFound, (payload) => {
        nextId.value = payload.nextId;
        previousId.value = payload.previousId;
      }),
    );

    const debtor = ref<Debtor>();
    const goTo = async (debtorId: Debtor['pk']) => {
      await dispatchSignal(SignalType.navigateDebtor, {
        debtorId,
      });
    };

    const fetchData = async () => {
      previousId.value = false;
      nextId.value = false;

      const { status, response } = await fetchDebtor({
        id: id.value,
        productionType: productionType.value,
        companyId: companyId.value!,
      });

      if (!status) {
        return;
      }

      debtor.value = response;

      await dispatchSignal(SignalType.findDebtorNeighbours, {
        debtorId: response.debtor.pk,
      });
    };

    provide('fetchData', fetchData);

    watch(id, getAwaitFrame(fetchData), { immediate: true });
    watch(productionType, getAwaitFrame(fetchData));
    watch(companyId, getAwaitFrame(fetchData));

    type ActiveTabKey = 'common' | 'documents' | 'finance' | 'notifications' | 'courts' | 'executions';
    const tabs = computed<Array<ITab<ActiveTabKey>>>(() => (([
      {
        key: 'common',
        label: t('common.tab'),
        icon: 'info',
      },
      {
        key: 'documents',
        label: t('documents.tab'),
        icon: 'documents',
      },
      {
        key: 'finance',
        label: t('finance.tab'),
        icon: 'wallet',
      },
      productionType.value === ProductionType.pretrial && {
        key: 'notifications',
        label: t('notifications.tab'),
        icon: 'bell',
      },
      productionType.value === ProductionType.judicial && {
        key: 'courts',
        label: t('courts.tab'),
        icon: 'mace',
      },
      productionType.value === ProductionType.executive && {
        key: 'executions',
        label: t('executions.tab'),
        icon: 'guard',
      },
    ] as Array<ITab<ActiveTabKey> | boolean>))
      .filter(Boolean) as Array<ITab<ActiveTabKey>>);

    const [activeTab] = useDialogRouteParam<ActiveTabKey>(
      'tab',
      'common',
      isCurrent,
    );

    const component = computed(() => (({
      common: DebtorCommonTab,
      documents: DebtorDocumentsTab,
      finance: DebtorFinanceTab,
      notifications: DebtorNotificationsTab,
      courts: DebtorCourtsTab,
      executions: DebtorExecutionsTab,
    } as {[key in ActiveTabKey]: any})[activeTab.value]));

    return {
      previousId,
      nextId,
      goTo,

      component,

      t,
      debtor,

      activeTab,
      tabs,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorDialog";
</style>
