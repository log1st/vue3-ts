<template>
  <div :class="$style.page">
    <div :class="$style.title">
      {{ t('companies.title') }}
    </div>
    <div :class="$style.content">
      <ActiveTable
        v-model:sort="sort"
        v-model:filters-model="filtersModel"
        table-key="organizations"
        :class="$style.table"
        :key-field="keyField"
        :columns="columns"
        :filters="filters"
        :records="records"
        :actions="actions"
        state="default"
        is-selectable
        with-unique-selection
        :initially-selected-items="[companyId]"
        selectable-column="index"
        @rowClick="onRowClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onBeforeUnmount, onMounted, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ActionType,
  ActiveTableAction,
  ActiveTableColumn,
  useActiveTable,
} from '@/hooks/useActiveTable';
import { Company, useCompanies } from '@/hooks/useCompanies';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { IActiveForm, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { IDialogComponent, useDialog } from '@/hooks/useDialog';
import { SignalType, useSignal } from '@/hooks/useSignal';

export default defineComponent({
  name: 'Index',
  components: { ActiveTable },
  setup() {
    const { t } = useI18n();

    const {
      fetchCompanies,
      setDefaultCompanyId,
      removeCompany,
    } = useCompanies();

    const {
      showDialog,
      confirmDialog,
    } = useDialog();

    const {
      subscribeToSignal,
    } = useSignal();

    const unsubs: Array<() => void> = [];
    onBeforeUnmount(() => {
      unsubs.forEach((unsub) => unsub());
      unsubs.splice(0, unsubs.length);
    });

    const {
      keyField,
      columns,
      filters,
      filtersModel,
      records,
      sort,
      actions,
      fetchData,
    } = useActiveTable<Company, Company, 'id'>({
      keyField: 'id',
      fetch: async ({ params, signal }) => {
        const { response } = await fetchCompanies({ ...params, signal });

        return response;
      },
      // @TODO Удалить после апдейта бэка
      defaultLimit: ref(10000),
      actions: computed<Array<ActiveTableAction<Company, 'id'>>>(() => ([
        {
          key: 'add',
          label: t('companies.table.action.add'),
          handler: async () => {
            unsubs.push(await showDialog({
              component: IDialogComponent.addCompany,
            }));
          },
          types: [ActionType.side],
        },
        {
          key: 'setDefault',
          label: t('companies.table.action.setDefault.label'),
          handler: async ({ selectedItems: [companyId] }) => {
            const { closeDialog, result } = await confirmDialog({
              title: t('companies.table.action.setDefault.title'),
              message: t('companies.table.action.setDefault.message', {
                name: records.value.find(({ id }) => id === companyId)?.name_full,
              }),
            });
            if (result) {
              await setDefaultCompanyId(companyId);
            }
            closeDialog();
          },
          types: [ActionType.side],
          active: true,
        },
        {
          key: 'view',
          icon: 'eye',
          handler: async ({ selectedItems: [companyId] }) => {
            await showDialog({
              component: IDialogComponent.company,
              payload: {
                id: companyId,
              },
            });
          },
          types: [ActionType.record],
        },
        {
          key: 'edit',
          icon: 'pencil',
          handler: async ({ selectedItems: [companyId] }) => {
            await showDialog({
              component: IDialogComponent.company,
              payload: {
                id: companyId,
                isInitiallyEditing: true,
              },
            });
          },
          types: [ActionType.record],
        },
        {
          key: 'delete',
          icon: 'close',
          handler: async ({ selectedItems: [companyId] }) => {
            const { result, closeDialog } = await confirmDialog({
              title: t('companies.table.action.remove.title'),
              message: t('companies.table.action.remove.message', {
                name: records.value.find(({ id }) => id === companyId)?.name_full,
              }),
              confirmLabel: t('other.yes'),
            });
            if (result) {
              await removeCompany(companyId);
            }
            closeDialog();
          },
          types: [ActionType.record],
        },
      ])),
      columns: ref<Array<ActiveTableColumn<Company>>>(
        ([
          {
            key: 'index',
            field: 'index',
            width: 0.6,
            isRequired: true,
          },
          {
            key: 'name_full',
            field: 'name_full',
            width: 3,
            isSortable: true,
            label: t('companies.table.column.name_full'),
          },
          {
            key: 'name_short',
            field: 'name_short',
            width: 2,
            isSortable: true,
            label: t('companies.table.column.name_short'),
          },
          {
            key: 'inn',
            field: 'inn',
            width: 1,
            isSortable: true,
            label: t('companies.table.column.inn'),
          },
          {
            key: 'legal_address',
            field: 'legal_address',
            width: 3,
            isSortable: true,
            label: t('companies.table.column.legal_address'),
          },
        ]),
      ),
      filters: ref<IActiveForm<Company>['fields']>([
        {
          key: 'name_full',
          field: 'name_full',
          type: ActiveFormFieldType.input,
          options: {
            placeholder: t('companies.table.filter.placeholder'),
          },
        },
        {
          key: 'name_short',
          field: 'name_short',
          type: ActiveFormFieldType.input,
          options: {
            placeholder: t('companies.table.filter.placeholder'),
          },
        },
        {
          key: 'inn',
          field: 'inn',
          type: ActiveFormFieldType.input,
          options: {
            placeholder: t('companies.table.filter.placeholder'),
          },
        },
        {
          key: 'legal_address',
          field: 'legal_address',
          type: ActiveFormFieldType.input,
          options: {
            placeholder: t('companies.table.filter.placeholder'),
          },
        },
      ]),
    });

    onMounted(async () => {
      unsubs.push(
        subscribeToSignal([
          SignalType.companyAdded,
          SignalType.companyUpdated,
          SignalType.companyDeleted,
        ], fetchData),
      );
    });

    const {
      company,
    } = useDefaultCompany();
    const companyId = computed(() => company.value?.id);

    const onRowClick = ({ record }: {record: Company}) => {
      showDialog({
        component: IDialogComponent.company,
        payload: {
          id: record.id,
        },
      });
    };

    return {
      t,

      keyField,
      columns,
      filters,
      filtersModel,
      records,
      sort,

      companyId,
      actions,

      onRowClick,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
