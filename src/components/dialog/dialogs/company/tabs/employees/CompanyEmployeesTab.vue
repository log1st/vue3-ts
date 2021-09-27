<template>
  <ActiveTable
    :class="$style.table"
    key-field="id"
    :records="records"
    :columns="columns"
    :actions="actions"
    state="simple"
    table-key="companyEmployees"
  >
    <template #cell(first_name)="{record}">
      <div
        v-if="record.id in editingMap"
        :class="$style.fields"
      >
        <TextInput
          v-model="records[editingMap[record.id]].first_name"
          state="primary"
          :class="$style.field"
        />
        <TextInput
          v-model="records[editingMap[record.id]].last_name"
          state="primary"
          :class="$style.field"
        />
      </div>
      <template v-else>
        <template v-if="formatFullName(record)">
          {{ formatFullName(record) }}
        </template>
        <NA v-else />
      </template>
    </template>
    <template #cell(user_phone)="{record}">
      <template v-if="record.user_phone">
        {{ formatPhone(record.user_phone) }}
      </template>
      <NA v-else />
    </template>
    <template #cell(position)="{record}">
      <div
        v-if="record.id in editingMap"
        :class="$style.fields"
      >
        <SelectInput
          v-model="records[editingMap[record.id]].position"
          state="primary"
          :options="positions"
          value-field="position_id"
          display-field="name"
          :placeholder="t('company.employees.column.position')"
          :class="$style.field"
        />
      </div>
      <template v-else>
        <template v-if="record.position">
          {{ record.position_name }}
        </template>
        <NA v-else />
      </template>
    </template>
  </ActiveTable>
</template>

<script lang="ts">
import {
  computed, defineComponent, onBeforeUnmount, PropType, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { Company, useCompanies } from '@/hooks/useCompanies';
import {
  ActionType,
  ActiveTableAction,
  ActiveTableColumn,
  useActiveTable,
} from '@/hooks/useActiveTable';
import { Employee, EmployeeRole, useEmployees } from '@/hooks/useEmployees';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import { formatFullName, formatPhone } from '@/utils/string';
import { IDialogComponent, useDialog } from '@/hooks/useDialog';
import TextInput from '@/components/textInput/TextInput.vue';
import NA from '@/components/na/NA.vue';
import { awaitFrame } from '@/utils/window';
import { SignalType, useSignal } from '@/hooks/useSignal';
import SelectInput from '@/components/selectInput/SelectInput.vue';
import { Dict, DictType } from '@/hooks/useDicts';
import { IToastLevel, useToast } from '@/hooks/useToast';

export default defineComponent({
  name: 'CompanyEmployeesTab',
  components: {
    SelectInput, NA, TextInput, ActiveTable,
  },
  props: {
    company: {
      type: Object as PropType<Company>,
      required: true,
    },
    isEditing: Boolean as PropType<boolean>,
  },
  setup(props) {
    const { t } = useI18n();

    const {
      fetchEmployees,
      removeEmployee,
      updateEmployee,
    } = useEmployees();

    const editingItems = ref<Array<Employee['id']>>([]);

    const {
      confirmDialog,
      showDialog,
    } = useDialog();

    const {
      showToast,
    } = useToast();

    const {
      fetchData,
      columns,
      records,
      actions,
    } = useActiveTable<Employee, Employee, 'id'>({
      keyField: 'id',
      fetch: async ({ params, signal }) => {
        const { response } = await fetchEmployees({ ...params, signal });

        return response;
      },
      // @TODO Удалить после апдейта бэка
      defaultLimit: ref(10000),
      filters: computed<Array<ActiveFormField<Employee>>>(() => ([
        {
          key: 'company_id',
          field: 'company_id',
          type: ActiveFormFieldType.input,
          defaultValue: props.company.id,
        },
      ])),
      columns: computed<Array<ActiveTableColumn<Employee>>>(() => ([
        {
          key: 'first_name',
          field: 'first_name',
          label: t('company.employees.column.first_name'),
          width: 4,
        },
        {
          key: 'position',
          field: 'position',
          label: t('company.employees.column.position'),
          width: 4,
        },
        {
          key: 'user_phone',
          field: 'user_phone',
          label: t('company.employees.column.user_phone'),
          width: 3,
        },
        {
          key: 'email',
          field: 'email',
          label: t('company.employees.column.email'),
          width: 3,
        },
      ])),
      actions: computed<Array<ActiveTableAction<Employee, 'id'>>>(() => ([
        {
          key: 'add',
          label: t('company.employees.action.add'),
          icon: 'add',
          active: true,
          handler: async () => {
            await awaitFrame();
            await showDialog({
              component: IDialogComponent.addEmployee,
              payload: {
                companyId: props.company.id,
              },
            });
          },
          types: [ActionType.side],
        },
        ...(props.isEditing ? ([
          {
            key: 'edit',
            icon: 'pencil',
            handler: async ({ selectedItems: [employeeId] }) => {
              await showDialog({
                component: IDialogComponent.addEmployee,
                payload: {
                  companyId: props.company.id,
                  employeeId,
                },
              });
            },
            types: [ActionType.record],
            check: ({ record }) => (!editingItems.value.includes(record.id)) && ![
              EmployeeRole.owner,
              // EmployeeRole.admin,
            ].includes(record.employee_role),
          },
          {
            key: 'remove',
            icon: 'close',
            handler: async ({ selectedItems: [employeeId] }) => {
              const { closeDialog, result } = await confirmDialog({
                message: t('company.employees.action.remove'),
              });
              if (result) {
                const { status, response } = await removeEmployee({
                  id: employeeId,
                  companyId: props.company.id,
                });

                if (status) {
                  await fetchData();
                } else {
                  await showToast({
                    label: 'company.employees.remove.error',
                    message: 'pure',
                    params: 'detail' in (response || {}) ? {
                      message: (response as any).detail,
                    } : (response || {}),
                    level: IToastLevel.danger,
                  });
                }
              }
              closeDialog();
            },
            types: [ActionType.record],
            check: ({ record }) => (
              record.is_deletable
              && !editingItems.value.includes(record.id)
            ),
          },
          {
            key: 'submit',
            icon: 'check',
            handler: async ({ selectedItems: [employeeId] }) => {
              const { status } = await updateEmployee({
                id: employeeId,
                // @TODO решить что-нибудь с очередью декларации
                // eslint-disable-next-line no-use-before-define
                payload: records.value[editingMap.value[employeeId]],
                companyId: props.company.id,
              });

              // @TODO отловить ошибки валидации
              if (status) {
                editingItems.value.splice(
                  editingItems.value.indexOf(employeeId),
                  1,
                );
                await fetchData();
              }
            },
            types: [ActionType.record],
            check: ({ record }) => (editingItems.value.includes(record.id)),
          },
          {
            key: 'cancel',
            icon: 'close',
            handler: async ({ selectedItems: [employeeId] }) => {
              editingItems.value.splice(
                editingItems.value.indexOf(employeeId),
                1,
              );
            },
            types: [ActionType.record],
            check: ({ record }) => (editingItems.value.includes(record.id)),
          },
        ]) : []) as Array<ActiveTableAction<Employee, 'id'>>,
      ])),
    });

    const editingMap = computed<{
      [key in Employee['id']]: number
    }>(() => (
      editingItems.value.reduce((acc, id) => ({
        ...acc,
        [id]: records.value.findIndex((employee) => employee.id === id),
      }), {})
    ));
    watch(computed(() => ([props.company.id, props.isEditing])), () => {
      editingItems.value = [];
    }, {
      deep: true,
    });

    const {
      subscribeToSignal,
    } = useSignal();

    onBeforeUnmount(
      subscribeToSignal([
        SignalType.employeeCreated,
        SignalType.employeeUpdated,
      ], ({ linked_companies, payload }: Employee & {payload: Employee}) => {
        if ((linked_companies || payload.linked_companies || []).includes(props.company.id)) {
          fetchData();
        }
      }),
    );

    const {
      fetchPositions,
    } = useCompanies();
    const positions = ref<Dict<DictType.employeePositions>>([]);
    watch(computed(() => props.company.id), async (id) => {
      const { status, response } = await fetchPositions(id);

      if (status) {
        positions.value = response;
      }
    }, { immediate: true });

    return {
      t,

      columns,
      records,
      actions,
      formatFullName,
      formatPhone,
      editingMap,

      positions,
    };
  },
});
</script>

<style lang="scss" module>
@import "./companyEmployeesTab";
</style>
