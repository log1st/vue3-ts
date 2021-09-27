<template>
  <div :class="$style.container">
    <div :class="$style.title">
      {{ t('title') }}
    </div>
    <ActiveTable
      v-model:limit="limit"
      v-model:page="page"
      key-field="id"
      :class="$style.table"
      :table-key="`debtor-executions`"
      :records="records"
      :columns="columns"
      :actions="actions"
      :total="total"
      :initially-selected-items="[defaultRecord].filter(Boolean)"
      is-selectable
      selectable-column="index"
      with-unique-selection
      :state="[
        'secondary',
        'stripeless',
        'bold'
      ].filter(Boolean)"
      @select="onSelect"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, inject, onBeforeUnmount, PropType, ref, toRefs, watch,
} from 'vue';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import {
  Bailiff, CreateWritoeModel, Debtor, IFNS, useDebtors,
} from '@/hooks/useDebtors';
import { IDialogComponent, useDialog } from '@/hooks/useDialog';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import {
  ActionType,
  ActiveTableColumn,
  ActiveTableColumnFormat,
  useActiveTable,
} from '@/hooks/useActiveTable';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { OrderDirection } from '@/store/modules/api';
import { SignalType, useSignal } from '@/hooks/useSignal';
import { getRandomString } from '@/utils/string';
import { SourceErrors, useErrors } from '@/hooks/useErrors';

export default defineComponent({
  name: 'DebtorExecutionsTab',
  components: { ActiveTable },
  props: {
    debtor: Object as PropType<Debtor>,
  },
  setup(props) {
    const { debtor } = toRefs(props);
    const { t } = useLocalI18n('debtor.executions');

    const {
      createWritoe,
      refreshWritoe,
      fetchFssp,
      setDefaultWritoe,
    } = useDebtors();

    const {
      showDialog,
    } = useDialog();

    const {
      dispatchSignal,
      subscribeToSignal,
    } = useSignal();

    const signalId = getRandomString();

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors<keyof CreateWritoeModel>();
    watch(errorsMap, async (map) => {
      await dispatchSignal(SignalType.modelErrors, { id: signalId, errors: map });
    }, {
      immediate: true,
    });

    let unsubCreateTypeDialog: (() => void) | null = null;
    onBeforeUnmount(() => {
      unsubCreateTypeDialog?.();
    });

    const {
      records,
      columns,
      actions,
      limit,
      page,
      total,
      fetchData: refetchFssp,
    } = useActiveTable<any & {id: 'id'}, any, 'id'>({
      keyField: 'id',
      async fetch({ params, signal }) {
        if (!debtor.value) {
          return {
            count: 0,
            results: [],
          };
        }

        if (records?.value?.length) {
          records.value = [];
        }
        const { response } = await fetchFssp({
          ...params,
          signal,
        });

        return response;
      },
      defaultSort: computed(() => ([
        {
          key: 'production_date',
          direction: OrderDirection.desc,
        },
      ])),
      defaultLimit: ref(15),
      actions: computed(() => ([
        {
          key: 'fsspRequisites',
          label: t('actions.fsspRequisites'),
          types: [ActionType.default],
          async handler() {
            await showDialog({
              component: IDialogComponent.model,
              addInRoute: false,
              payload: {
                isEditable: false,
                fields: [
                  { key: 'name' },
                  { key: 'address' },
                ].map((field) => ({
                  ...field,
                  field: field.key,
                  options: {
                    label: t(`fsspRequisites.${field.key}`),
                    placeholder: t(`fsspRequisites.${field.key}`),
                  },
                  type: ActiveFormFieldType.input,
                  defaultValue: debtor.value?.debtor_main_profile?.bailiff?.[
                    field.key as keyof Bailiff
                  ] as string,
                })),
              },
            });
          },
        },
        {
          key: 'fnsRequisites',
          label: t('actions.fnsRequisites'),
          types: [ActionType.default],
          async handler() {
            await showDialog({
              component: IDialogComponent.model,
              addInRoute: false,
              payload: {
                isEditable: false,
                fields: [
                  { key: 'code' },
                  { key: 'name' },
                  { key: 'address' },
                  { key: 'inn' },
                  { key: 'kpp' },
                  { key: 'payee' },
                  { key: 'bank' },
                  { key: 'bik' },
                  { key: 'rs' },
                  { key: 'ks' },
                  { key: 'reg_code' },
                  { key: 'phone' },
                  { key: 'description' },
                ].map((field) => ({
                  ...field,
                  field: field.key,
                  options: {
                    label: t(`fnsRequisites.${field.key}`),
                    placeholder: t(`fnsRequisites.${field.key}`),
                  },
                  type: ActiveFormFieldType.input,
                  defaultValue: debtor.value?.debtor_main_profile?.ifns?.[
                    field.key as keyof IFNS
                  ] as string,
                })),
              },
            });
          },
        },
        {
          key: 'add',
          label: t('actions.add'),
          types: [ActionType.side],
          active: true,
          async handler() {
            unsubCreateTypeDialog = await showDialog({
              component: IDialogComponent.model,
              addInRoute: false,
              payload: {
                isEditable: true,
                signal: signalId,
                fields: [
                  { key: 'serial_number', blockedBy: ['case_number'] },
                  { key: 'case_number', blockedBy: ['serial_number'] },
                ].map((field) => ({
                  ...field,
                  field: field.key,
                  options: {
                    label: t(`add.${field.key}`),
                    placeholder: t(`add.${field.key}`),
                    modelModifiers: {
                      'delay:0': true,
                    },
                  },
                  type: ActiveFormFieldType.input,
                  defaultValue: '',
                })),
              },
            });
          },
        },
      ])),
      filters: computed(() => (([
        {
          key: 'id',
          field: 'id',
          type: ActiveFormFieldType.input,
          defaultValue: debtor.value?.debtor.pk,
          isVisible: false,
        },
        {
          key: 'debt_nature',
          field: 'debt_nature',
          type: ActiveFormFieldType.select,
          defaultValue: 'communal',
          options: {
            label: t('filters.debt_nature'),
            placeholder: t('filters.debt_nature'),
            options: [
              { value: 'communal' },
              { value: 'credit' },
              { value: 'tax' },
              { value: 'other' },
            ].map((item) => ({
              ...item,
              label: t(`debtNatures.${item.value}`),
            })),
          },
        },
      ] as Array<ActiveFormField<any> | boolean>)
        .filter(Boolean) as Array<ActiveFormField<any>>)),
      columns: computed(() => (([
        { key: 'index', width: '100px' },
        { key: 'production_number', width: '130px' },
        { key: 'doctype', width: '120px' },
        { key: 'docnum' },
        { key: 'docdate', format: ActiveTableColumnFormat.date },
        { key: 'court', width: 1.5 },
        { key: 'production_date', format: ActiveTableColumnFormat.date },
        { key: 'end_date', format: ActiveTableColumnFormat.date },
        { key: 'end_reason1' },
        { key: 'amount', format: ActiveTableColumnFormat.money },
        { key: 'bailiff' },
      ] as Array<ActiveTableColumn<any> | boolean>)
        .filter(Boolean) as Array<ActiveTableColumn<any>>)
        .map((column) => ({
          ...column,
          field: column.key,
          label: t(`column.${String(column.key).split('.').pop()}`),
        }))),
    });

    onBeforeUnmount(subscribeToSignal(
      SignalType.model,
      async ({ id, model }:{id: string; model: CreateWritoeModel}) => {
        if (id === signalId) {
          clearErrors();
          const { status, response } = await createWritoe({
            ...Object.entries(model).filter(([, value]) => !!value).reduce((acc, [key, value]) => ({
              [key]: value,
            }), {}) as CreateWritoeModel,
            id: debtor.value!.debtor!.pk,
          });

          if (!status) {
            setErrors(
              Object.entries(response) as SourceErrors<keyof CreateWritoeModel>,
            );
          } else {
            await refreshWritoe({ id: response.id });
            await refetchFssp();
            unsubCreateTypeDialog?.();
            unsubCreateTypeDialog = null;
          }
        }
      },
    ));

    const fetchData = inject<() => void>('fetchData');

    const onSelect = async ([id]: [number]) => {
      if (!id) {
        return;
      }

      const record = records.value.find((record) => record.id === id);
      const writoeId = debtor.value?.debtor.writs_of_execution?.find((writoe) => (
        record.docnum === writoe.case_number
        || record.production_number === writoe.serial_number
      ))?.id;

      if (writoeId) {
        await setDefaultWritoe({ id: writoeId });
        await fetchData?.();
      }

      await refetchFssp();
    };

    const defaultWritoe = computed(() => (
      debtor.value?.debtor.writs_of_execution?.find((writoe) => writoe.default)
    ));

    const defaultRecord = computed(() => (
      defaultWritoe.value
      && records.value.find((record) => (record.docnum === defaultWritoe.value?.case_number)
        || (record.production_number === defaultWritoe.value?.serial_number))?.id
    ));

    return {
      t,

      records,
      columns,
      actions,
      limit,
      page,
      total,

      onSelect,
      defaultRecord,
      defaultWritoe,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorExecutionsTab";
</style>
