<template>
  <form
    :class="$style.container"
    @submit.prevent="submit"
  >
    <ActiveTable
      :columns="columns"
      key-field="id"
      table-key="debtor-tenants"
      :records="records"
      :actions="actions"
      :state="['secondary', 'tiny', 'staticActions']"
      :class="$style.table"
    >
      <template
        v-for="column in columns.filter(({key}) => [
          'full_name',
          'birth_place',
          'citizenship',
          'num_of_passport',
          'inn',
          'passport_issued_by'
        ].includes(key))"
        #[`cell(${column.key})`]="{record, index}"
        :key="column.key"
      >
        <TextInput
          v-if="editingItems.includes(record.id)"
          v-model="records[index][column.field]"
          :placeholder="column.label"
          state="primary"
          :class="$style.field"
          :errors="errorsMap[`${record.id}-${column.field}`]"
        />
        <template
          v-else-if="column.key === 'num_of_passport' && !!records[index][column.field]"
        >
          <TooltipWrapper
            :class="[
              $style.passport,
              record.passport_is_invalid && $style.invalid,
              record.passport_is_valid && (!record.passport_is_invalid) && $style.valid,
              (!record.passport_is_invalid && !record.passport_is_valid) && $style.checking
            ]"
            :label="t(`passport.${
              record.passport_is_invalid ? 'invalid' : (
                record.passport_is_valid ? 'valid' : 'checking'
              )
            }`)"
          >
            <Var
              v-bind="/(?<passportSeries>\d{4})(?<passportNumber>\d+)/.exec(
                String(record.num_of_passport)
                  .replace(/[^\d]/g, '')
              )?.groups"
            >
              <template #default="{passportSeries, passportNumber}">
                {{ passportSeries }} {{ passportNumber }}
                <Icon
                  :class="$style.passportIcon"
                  :icon="(
                    record.passport_is_invalid ? 'close-rounded' : (
                      record.passport_is_valid ? 'check-rounded' : 'question-rounded'
                    )
                  )"
                />
              </template>
            </Var>
          </TooltipWrapper>
        </template>
      </template>
      <template
        v-for="column in columns.filter(({key}) => [
          'birth_date',
          'date_of_passport_issue',
          'registration_date'
        ].includes(key))"
        #[`cell(${column.key})`]="{record, index}"
        :key="column.key"
      >
        <DateInput
          v-if="editingItems.includes(record.id)"
          v-model="records[index][column.field]"
          :placeholder="column.label"
          state="primary"
          :class="$style.field"
          :errors="errorsMap[`${record.id}-${column.field}`]"
        />
      </template>
      <template #cell(registration)="{record, index}">
        <SelectInput
          v-model="records[index].registration"
          state="primary"
          :placeholder="t('column.registration')"
          :class="$style.field"
          :options="registrationOptions"
          :errors="errorsMap[`${record.id}-registration`]"
        />
      </template>
      <template #cell(relationships)="{record, index}">
        <SelectInput
          v-model="records[index].relationships"
          state="primary"
          :placeholder="t('column.relationships')"
          :class="$style.field"
          :options="relationshipsOptions"
          :errors="errorsMap[`${record.id}-relationships`]"
        />
      </template>
      <template #footer>
        <Btn
          :class="$style.add"
          prepend-icon="add"
          state="quinary"
          @click="add"
        />
      </template>
    </ActiveTable>
    <div
      :class="$style.actions"
    >
      <template
        v-if="toRemove.length || records.length"
      >
        <Btn
          state="tertiary"
          :label="t('actions.reset')"
          :class="$style.action"
          @click="reset"
        />
        <Btn
          state="primary"
          type="submit"
          :label="t('actions.submit')"
          :class="$style.action"
        />
      </template>
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, inject, onBeforeUnmount, PropType, ref, toRefs,
} from 'vue';
import { Debtor, Tenant, useDebtors } from '@/hooks/useDebtors';
import { ProductionType } from '@/hooks/useConstructor';
import {
  ActionType,
  ActiveTableAction,
  ActiveTableColumnFormat,
  useActiveTable,
} from '@/hooks/useActiveTable';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import { ActiveFormFieldType } from '@/hooks/useActiveForm';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { parseDate } from '@/utils/dateFns';
import TextInput from '@/components/textInput/TextInput.vue';
import DateInput from '@/components/dateInput/DateInput.vue';
import SelectInput from '@/components/selectInput/SelectInput.vue';
import { DictType, useDicts } from '@/hooks/useDicts';
import Icon from '@/components/icon/Icon.vue';
import TooltipWrapper from '@/components/tooltip/TooltipWrapper.vue';
import Btn from '@/components/btn/Btn.vue';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import { dateToApiDate } from '@/utils/date';
import { useSocket } from '@/hooks/useSocket';
import { IToastLevel, useToast } from '@/hooks/useToast';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';

export default defineComponent({
  name: 'DebtorCommonTenantsTab',
  components: {
    Btn,
    TooltipWrapper,
    Icon,
    SelectInput,
    DateInput,
    TextInput,
    ActiveTable,
  },
  props: {
    debtor: {
      type: Object as PropType<Debtor>,
    },
    productionType: {
      type: String as PropType<ProductionType>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useLocalI18n('debtor.common.tenants');
    const { debtor, productionType } = toRefs(props);

    const editingItems = ref<Array<Tenant['id']>>([]);
    const toRemove = ref<Array<Tenant['id']>>([]);

    const { companyId } = useDefaultCompany();

    const {
      createTenant,
      updateTenant,
      removeTenant,
      updateInn,
    } = useDebtors();

    const {
      subscribe,
    } = useSocket();

    const unsubs: Array<(() => void)> = [];
    onBeforeUnmount(() => {
      unsubs.forEach((unsub) => unsub());
      unsubs.splice(0, unsubs.length);
    });

    const fetchData = inject<(() => void)>('fetchData');

    const {
      showToast,
    } = useToast();

    const {
      columns,
      records,
      actions,
      fetchData: refetchTenants,
    } = useActiveTable<Tenant, Tenant, 'id'>({
      keyField: 'id',
      async fetch() {
        editingItems.value = [];
        toRemove.value = [];
        return {
          count: debtor.value?.debtor_tenant_profiles?.length || 0,
          results: ([...debtor.value?.debtor_tenant_profiles || []]).map((tenant) => ({
            ...tenant,
            ...([
              'birth_date',
              'date_of_passport_issue',
              'registration_date',
            ] as Array<keyof Tenant>).reduce((acc, cur) => ({
              ...acc,
              [cur]: parseDate(tenant[cur] as Tenant[keyof Tenant] & Date),
            }), {} as unknown as Tenant),
            relationships: tenant.relationships[0] || null as any,
            num_of_passport: parseInt(tenant.num_of_passport || '', 10) ? tenant.num_of_passport : null,
          })),
        };
      },
      actions: computed(() => ([
        debtor.value && {
          key: 'update',
          label: t('actions.update'),
          types: [ActionType.side],
          async handler() {
            const { status, response } = await updateInn({
              payload: [debtor.value!.debtor.pk],
              production_type: productionType.value,
              company: companyId.value!,
            });

            if (!status) {
              return;
            }

            const hideToast = await showToast({
              message: 'debtor.common.tenants.toast.message',
              duration: null,
              level: IToastLevel.info,
            });
            unsubs.push(hideToast);

            const unsub = await subscribe({
              condition: (payload) => (
                payload.action === 'model_event'
                && payload.data.model === 'datafile/status/update'
                && payload.data.obj.task_uuid === response.task_uuid
              ),
              handler: async (payload) => {
                if (![3, 4].includes(payload.data.obj.state)) {
                  return;
                }
                if (payload.data.obj.state === 3) {
                  await showToast({
                    message: 'debtor.common.tenants.toast.success',
                    level: IToastLevel.success,
                  });
                  await fetchData?.();
                  await refetchTenants();
                  unsub();
                  unsubs.splice(
                    unsubs.findIndex((i) => i === unsub),
                    1,
                  );
                  await hideToast();
                  unsubs.splice(
                    unsubs.findIndex((i) => i === hideToast),
                    1,
                  );
                } else if (payload.data.obj.state === 4) {
                  await showToast({
                    message: 'debtor.common.tenants.toast.failure',
                    level: IToastLevel.danger,
                  });
                }
              },
            });

            unsubs.push(unsub);
          },
        },
        {
          key: 'edit',
          icon: 'pencil',
          types: [ActionType.record],
          async handler({ selectedItems: [itemId] }) {
            editingItems.value.push(itemId);
          },
          check: ({ record: { id } }) => !editingItems.value.includes(id),
        },
        {
          key: 'remove',
          icon: 'close',
          types: [ActionType.record],
          async handler({ selectedItems: [itemId] }) {
            records.value.splice(
              records.value.findIndex(({ id }) => id === itemId),
              1,
            );
            if (itemId > 0) {
              toRemove.value.push(itemId);
            }
          },
          check: ({ record: { id } }) => !editingItems.value.includes(id),
        },
      ] as Array<ActiveTableAction<any, any> | boolean>)
        .filter(Boolean) as Array<ActiveTableAction<any, any>>),
      filters: computed(() => ([{
        key: 'id',
        field: 'id',
        type: ActiveFormFieldType.input,
        defaultValue: debtor.value?.debtor.pk,
      }, {
        key: 'production_type',
        field: 'production_type',
        type: ActiveFormFieldType.input,
        defaultValue: productionType.value,
      }])),
      columns: computed(() => ([
        { key: 'full_name' },
        { key: 'birth_date', format: ActiveTableColumnFormat.date },
        { key: 'birth_place', width: 1.5 },
        { key: 'citizenship' },
        { key: 'num_of_passport' },
        { key: 'inn' },
        { key: 'date_of_passport_issue', format: ActiveTableColumnFormat.date },
        { key: 'passport_issued_by' },
        { key: 'registration' },
        { key: 'registration_date', format: ActiveTableColumnFormat.date, allowEmpty: true },
        { key: 'relationships' },
      ].map((column) => ({
        width: 1,
        ...column,
        field: column.key,
        label: t(`column.${column.key}`),
      })))),
    });

    const registrationOptions = computed(() => (
      [
        { value: 1, label: t('registration.permanent') },
        { value: 2, label: t('registration.temporary') }]
    ));

    const {
      getDict,
    } = useDicts();

    const relationshipsOptions = computed(() => (
      getDict(DictType.tenantRelationships).value
    ));

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors<any>();

    const reset = async () => {
      editingItems.value = [];
      toRemove.value = [];
      await refetchTenants();
    };

    const submit = async () => {
      clearErrors();
      const statuses = await Promise.all([
        ...toRemove.value.map((id) => new Promise(async (resolve) => {
          const { status, response } = await removeTenant({ id });
          if (!status) {
            setErrors(Object.entries(response)
              .map(([key, errors]) => ([`${id}-${key}`, errors])) as unknown as SourceErrors<any>);
          }
          resolve(true);
        })),
        ...records.value.map((model) => new Promise(async (resolve) => {
          const newModel = {
            ...model,
            ...([
              'birth_date',
              'date_of_passport_issue',
              'registration_date',
            ] as Array<keyof Tenant>).reduce((acc, cur) => ({
              ...acc,
              [cur]: model[cur] instanceof Date ? dateToApiDate(model[cur] as Date) : model[cur],
            }), {} as unknown as Tenant),
          };
          const { status, response } = await (model.id > 0 ? (
            updateTenant({
              id: model.id,
              model: {
                ...newModel,
                relationships: ([newModel.relationships] as any || []).filter(Boolean),
              } as Tenant,
              productionType: productionType.value,
            })
          ) : createTenant({
            model: {
              ...newModel,
              relationships: ([newModel.relationships] as any || []).filter(Boolean),
            } as Tenant,
            debtor: debtor.value!.debtor.pk,
            productionType: productionType.value,
          }));

          if (!status) {
            setErrors(Object.entries(response)
              .map(([key, errors]) => ([`${model.id}-${key}`, errors])) as unknown as SourceErrors<any>);
            resolve(false);
          } else {
            resolve(true);
          }
        })),
      ]);
      if (statuses.includes(false)) {
        return;
      }
      await fetchData?.();
      await reset();
    };

    const add = () => {
      records.value.push(({
        full_name: '',
        birth_date: null,
        birth_place: '',
        citizenship: '',
        num_of_passport: '',
        inn: '',
        date_of_passport_issue: null,
        passport_issued_by: '',
        registration: null,
        registration_date: null,
        relationships: null as any,
      } as Pick<Tenant,
        'full_name'
        | 'birth_date'
        | 'birth_place'
        | 'citizenship'
        | 'num_of_passport'
        | 'inn'
        | 'date_of_passport_issue'
        | 'passport_issued_by'
        | 'registration'
        | 'registration_date'
        | 'relationships'
        >) as Tenant);
    };

    return {
      submit,
      reset,
      add,

      t,

      columns,
      records,
      actions,
      editingItems,
      toRemove,
      registrationOptions,
      relationshipsOptions,
      errorsMap,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorCommonTenantsTab";
</style>
