<template>
  <div :class="$style.page">
    <div :class="$style.title">
      {{ t('listTitle') }}
    </div>
    <ActiveTable
      table-key="templates"
      key-field="id"
      :columns="columns"
      :records="records"
      :actions="actions"
      :class="$style.table"
      state="secondary"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import {
  ActionType,
  ActiveTableAction,
  ActiveTableColumn,
  useActiveTable,
} from '@/hooks/useActiveTable';
import { ConstructorTemplate, useConstructor } from '@/hooks/useConstructor';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { useDialog } from '@/hooks/useDialog';
import { useErrors } from '@/hooks/useErrors';

export default defineComponent({
  name: 'Index',
  components: { ActiveTable },
  setup() {
    const { t } = useLocalI18n('panel.constructor.templates');
    const {
      company,
    } = useDefaultCompany();

    const {
      fetchConstructorTemplates,
      removeConstructorTemplate,
    } = useConstructor();

    const router = useRouter();

    const {
      confirmDialog,
    } = useDialog();

    const {
      clearErrors,
      setErrors,
    } = useErrors();

    const {
      records,
      columns,
      actions,
      fetchData: refetchConstructorTemplates,
    } = useActiveTable<ConstructorTemplate, ConstructorTemplate, 'id'>({
      keyField: 'id',
      async fetch({ params, signal }) {
        const { response } = await fetchConstructorTemplates({ ...params, signal });

        return response;
      },
      defaultLimit: ref(1000),
      filters: computed<Array<ActiveFormField<ConstructorTemplate>>>(() => ([
        {
          key: 'company_id',
          field: 'company_id',
          type: ActiveFormFieldType.input,
          defaultValue: company.value?.id,
        },
      ])),
      columns: computed<Array<ActiveTableColumn<ConstructorTemplate>>>(() => ([
        {
          key: 'id',
          field: 'id',
          label: t('column.id'),
        },
        {
          key: 'name',
          field: 'name',
          label: t('column.name'),
        },
        {
          key: 'description',
          field: 'template_type_obj.description',
          label: t('column.description'),
        },
      ])),
      actions: computed<Array<ActiveTableAction<ConstructorTemplate, 'id'>>>(() => ([
        {
          key: 'edit',
          icon: 'pencil',
          async handler({ selectedItems: [id] }) {
            await router.push({
              name: 'panel-constructor-template',
              params: {
                id,
              },
            });
          },
          types: [ActionType.record],
        },
        {
          key: 'remove',
          icon: 'close',
          async handler({ selectedItems: [id] }) {
            clearErrors();
            const { result, closeDialog } = await confirmDialog({
              message: t('action.remove.message'),
            });
            if (result) {
              const { status, response } = await removeConstructorTemplate(id);
              if (!status) {
                setErrors(Object.entries(response) as any);
              }
              await refetchConstructorTemplates();
            }
            closeDialog();
          },
          types: [ActionType.record],
        },
      ])),
    });

    return {
      t,
      records,
      columns,
      actions,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
