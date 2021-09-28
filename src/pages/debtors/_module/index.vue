<template>
  <div
    :key="module"
    :class="$style.page"
  >
    <ActiveTable
      v-model:limit="limit"
      v-model:page="page"
      v-model:filtersModel="filtersModel"
      v-model:sort="sort"
      :default-limit="defaultLimit"
      :table-key="`debtors-${module}`"
      :class="$style.table"
      key-field="debtor.pk"
      v-bind="{
        records,
        actions,
        total,
        columns,
        filters,
        keyField,
      }"
      with-summaries
      with-table-actions
      is-selectable
      state="tertiary"
      selectable-column="status"
      :summaries="summaries"
      :summaries-fields="summariesFields"
      @rowClick="onRowClick"
    >
      <template #action(settings)>
        <Automatizing
          v-outside-click="closeSettings"
          :production-type="module"
          @close="closeSettings"
        />
      </template>
      <template
        v-if="['pretrial', 'judicial'].includes(module)"
        #cell(status)="{record}"
      >
        <DebtorStatus
          :key="record.debtor.debtor_status?.[0]?.status"
          :production-type="module"
          :statuses="{
            pretrial: record.debtor.pretrial_status,
            judicial: record.debtor.debtor_status,
          }[module]"
          @click.stop="showDebtorStatusDialog({
            selectedItems: [record.debtor.pk],
          })"
        />
      </template>
      <template
        v-if="['pretrial', 'judicial'].includes(module)"
        #cell(personal_account)="{record, fieldValue}"
      >
        <div :class="$style.personalAccount">
          <DebtorIcons
            :key="record.debtor.debtor_status?.[0]?.status"
            :production-type="module"
            :statuses="{
              pretrial: record.debtor.pretrial_status,
              judicial: record.debtor.debtor_status,
            }[module]"
            :class="$style.personalAccountIcons"
          />
          <div :class="$style.personalAccountValue">
            {{ fieldValue }}
          </div>
        </div>
      </template>
    </ActiveTable>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onBeforeUnmount, PropType, ref, toRefs, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import { useActiveTable } from '@/hooks/useActiveTable';
import { Debtor, useDebtors } from '@/hooks/useDebtors';
import { DebtorQuery, useDebtorsQuery } from '@/hooks/useDebtorsQuery';
import { ProductionType } from '@/hooks/useConstructor';
import DebtorStatus from '@/components/debtorStatus/DebtorStatus.vue';
import { DebtorStatusPayload, IDialogComponent, useDialog } from '@/hooks/useDialog';
import { SignalType, useSignal } from '@/hooks/useSignal';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import DebtorIcons from '@/components/debtorIcons/DebtorIcons.vue';
import { OrderDirection } from '@/store/modules/api';
import Automatizing from '@/components/automatizing/Automatizing.vue';

export default defineComponent({
  name: 'Index',
  components: {
    Automatizing,
    DebtorIcons,
    DebtorStatus,
    ActiveTable,
  },
  props: {
    module: {
      type: String as PropType<ProductionType>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useLocalI18n('debtors');
    const { module } = toRefs(props);
    const { fetchDebtors } = useDebtors();
    const {
      isSettingsDialogVisible,
      ...query
    } = useDebtorsQuery({
      module,
    });
    const {
      fetchData: refetchDebtors,
      records,
      actions,
      page,
      total,
      sort,
      columns,
      filtersModel,
      filters,
      keyField,
      limit,
      defaultLimit,
      summariesFields,
      summaries,
    } = useActiveTable<DebtorQuery, Debtor, 'pk'>({
      // @TODO из-за магии пока нельзя
      keyField: 'debtor.pk' as any,
      summaries: query.summaries,
      defaultLimit: ref(15),
      async fetch({ params, signal }) {
        const { response } = await fetchDebtors({ ...params, signal });

        return response;
      },
      columns: query.columns,
      filters: query.filters,
      actions: query.actions,
    });

    watch(module, () => {
      records.value = [];
      summaries.value = {};
    });

    const {
      showDialog,
      closeDialogByComponent,
    } = useDialog();

    onBeforeUnmount(() => {
      closeDialogByComponent(IDialogComponent.debtor);
    });

    const {
      subscribeToSignal,
      dispatchSignal,
    } = useSignal();

    const router = useRouter();

    const onRowClick = async ({ record: { debtor: { pk } } }: { record: Debtor }) => {
      let currentConfig: any;

      try {
        currentConfig = JSON.parse(
          router.currentRoute.value.hash.substr(1),
        );
        delete currentConfig.payload;
        delete currentConfig.component;
      } catch (e) {
        // no current config
      }

      await closeDialogByComponent(IDialogComponent.debtor);

      await showDialog({
        id: 'debtor',
        component: IDialogComponent.debtor,
        payload: {
          id: pk,
          productionType: module.value,
        },
        params: currentConfig,
      });
    };

    onBeforeUnmount(
      subscribeToSignal(SignalType.getDebtorFilters, async () => {
        await dispatchSignal(SignalType.debtorFilters, filtersModel.value);
      }),
    );

    onBeforeUnmount(
      subscribeToSignal(SignalType.findDebtorNeighbours, async (e) => {
        const nextResponse = await fetchDebtors({
          filters: {
            ...filtersModel.value,
            pk_more: e.debtorId,
          },
          limit: 1,
          page: 1,
        });
        const previousResponse = await fetchDebtors({
          filters: {
            ...filtersModel.value,
            pk_less: e.debtorId,
          },
          limit: 1,
          page: 1,
          ordering: [{ key: 'pk', direction: OrderDirection.desc }],
        });
        await dispatchSignal(SignalType.debtorNeighboursFound, {
          nextId: nextResponse.response.results[0]?.debtor?.pk || null,
          previousId: previousResponse.response.results[0]?.debtor?.pk || null,
        });
      }),
    );

    onBeforeUnmount(
      subscribeToSignal(SignalType.navigateDebtor, (e) => {
        onRowClick({ record: { debtor: { pk: e.debtorId } } } as any);
      }),
    );

    const showDebtorStatusDialog = async ({
      selectedItems,
    }: {selectedItems: Array<Debtor['pk']>}) => {
      if (![
        ProductionType.pretrial,
        ProductionType.judicial,
      ].includes(props.module)) {
        return;
      }
      await showDialog({
        component: IDialogComponent.debtorStatus,
        payload: {
          productionType: props.module as DebtorStatusPayload['productionType'],
          debtorIds: selectedItems,
        },
      });
    };

    onBeforeUnmount(
      subscribeToSignal(SignalType.debtorsUpdated, refetchDebtors),
    );

    const closeSettings = () => {
      isSettingsDialogVisible.value = false;
    };

    return {
      t,
      records,
      actions,
      page,
      total,
      sort,
      columns,
      filtersModel,
      filters,
      keyField,
      limit,
      defaultLimit,
      onRowClick,
      showDebtorStatusDialog,
      summaries,
      summariesFields,
      closeSettings,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
