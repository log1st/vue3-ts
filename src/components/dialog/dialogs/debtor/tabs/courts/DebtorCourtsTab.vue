<template>
  <div :class="$style.container">
    <Tabs
      v-model="activeTab"
      :tabs="tabs"
      :class="$style.tabs"
      :state="['tertiary', 'tiny']"
    />
    <div :class="$style.title">
      {{ t('title') }}
    </div>
    <ActiveTable
      v-model:limit="limit"
      v-model:page="page"
      key-field="id"
      :class="$style.table"
      :table-key="`debtor-documents-${activeTab}`"
      :records="records"
      :columns="columns"
      :actions="actions"
      :total="total"
      :state="[
        'secondary',
        'stripeless',
        activeTab !== 'sms' && 'hoverable',
        'bold'
      ].filter(Boolean)"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onBeforeUnmount, PropType, ref, toRefs, watch,
} from 'vue';
import Tabs from '@/components/tabs/Tabs.vue';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import { Debtor } from '@/hooks/useDebtors';
import { IDialogComponent, useDialog, useDialogRouteParam } from '@/hooks/useDialog';
import { ITab } from '@/components/tabs/useTabs';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import {
  ActionType, ActiveTableAction,
  ActiveTableColumn,
  ActiveTableColumnFormat,
  useActiveTable,
} from '@/hooks/useActiveTable';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { OrderDirection } from '@/store/modules/api';
import { UpdateCourtRequisitesModel, useCourts } from '@/hooks/useCourts';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { SignalType, useSignal } from '@/hooks/useSignal';
import { getRandomString } from '@/utils/string';
import { SourceErrors, useErrors } from '@/hooks/useErrors';

export default defineComponent({
  name: 'DebtorCourtsTab',
  components: { ActiveTable, Tabs },
  props: {
    debtor: Object as PropType<Debtor>,
  },
  setup(props) {
    const { debtor } = toRefs(props);
    const { t } = useLocalI18n('debtor.courts');
    type ActiveTabKey = 'magistrate' | 'regional';
    const tabs = computed<Array<ITab<ActiveTabKey>>>(() => ((([
      {
        key: 'magistrate',
      },
      {
        key: 'regional',
      },
    ] as Array<ITab<ActiveTabKey> | boolean>))
      .filter(Boolean) as Array<ITab<ActiveTabKey>>)
      .map((tab) => ({
        ...tab,
        label: t(`${tab.key}.tab`),
      })));

    const [activeTab] = useDialogRouteParam<ActiveTabKey>(
      'court-tab',
      'magistrate',
      ref(true),
    );

    const {
      fetchCourtCases,
      fetchCourtRequisites,
      updateCourtRequisites,
    } = useCourts();

    const {
      companyId,
    } = useDefaultCompany();

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
    } = useErrors<keyof UpdateCourtRequisitesModel['model']>();
    watch(errorsMap, async (map) => {
      await dispatchSignal(SignalType.modelErrors, { id: signalId, errors: map });
    }, {
      immediate: true,
    });

    let unsubCreateTypeDialog: (() => void) | null = null;
    onBeforeUnmount(() => {
      unsubCreateTypeDialog?.();
    });

    onBeforeUnmount(subscribeToSignal(
      SignalType.model,
      async ({ id, model }:{id: string; model: UpdateCourtRequisitesModel['model']}) => {
        if (id === signalId) {
          clearErrors();
          const { status, response } = await updateCourtRequisites({
            id: (debtor.value?.debtor_main_profile as any)[`${activeTab.value}_court_place`] as any,
            type: activeTab.value,
            model,
          });

          if (!status) {
            setErrors(
              Object.entries(response) as SourceErrors<keyof UpdateCourtRequisitesModel['model']>,
            );
          } else {
            unsubCreateTypeDialog?.();
            unsubCreateTypeDialog = null;
          }
        }
      },
    ));

    const {
      records,
      columns,
      actions,
      limit,
      page,
      total,
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
        const { response } = await fetchCourtCases({
          ...params,
          signal,
        });

        return response;
      },
      defaultSort: computed(() => ([
        {
          key: 'created_at',
          direction: OrderDirection.desc,
        },
        {
          key: 'id',
          direction: OrderDirection.desc,
        },
      ])),
      defaultLimit: ref(15),
      actions: computed(() => (([
        ((debtor.value?.debtor_main_profile as any)?.[`${activeTab.value}_court_place`] as any) && {
          key: 'requisites',
          label: t('actions.requisites'),
          types: [ActionType.side],
          async handler() {
            unsubCreateTypeDialog?.();

            const { status, response } = await fetchCourtRequisites({
              type: activeTab.value,
              id: (debtor.value?.debtor_main_profile as any)[`${activeTab.value}_court_place`] as any,
            });

            if (!status) {
              return;
            }

            unsubCreateTypeDialog = await showDialog({
              component: IDialogComponent.model,
              addInRoute: false,
              payload: {
                isToggleable: true,
                signal: signalId,
                wide: true,
                fields: [
                  { key: 'name', isReadonly: true },
                  { key: 'address', isReadonly: true },
                  { key: 'magistrate' },
                  { key: 'phone_number_secretary' },
                  { key: 'phone_number_assistant' },
                  { key: 'phone_number_head_of_dep' },
                  { key: 'email' },
                  { key: 'payment_recipient_name', isReadonly: true },
                  { key: 'bic', isReadonly: true },
                  { key: 'payment_recipient_account', isReadonly: true },
                  { key: 'inn', isReadonly: true },
                  { key: 'kpp', isReadonly: true },
                  { key: 'oktmo', isReadonly: true },
                  { key: 'payment_recipient_bank', isReadonly: true },
                  { key: 'kbk', isReadonly: true },
                ].map((field) => ({
                  ...field,
                  field: field.key,
                  options: {
                    label: t(`requisites.${field.key}`),
                    placeholder: t(`requisites.${field.key}`),
                  },
                  type: ActiveFormFieldType.input,
                  defaultValue: response[field.key],
                })),
              },
            });
          },
        },
      ] as Array<ActiveTableAction<any, any> | boolean>)
        .filter(Boolean) as Array<ActiveTableAction<any, any>>)),
      filters: computed(() => (([
        {
          key: '__tab',
          field: '__tab',
          type: ActiveFormFieldType.input,
          defaultValue: activeTab.value,
        },
        {
          key: 'debtor',
          field: 'debtor',
          type: ActiveFormFieldType.input,
          defaultValue: debtor.value?.debtor.pk,
        },
        {
          key: 'company_id',
          field: 'company_id',
          type: ActiveFormFieldType.input,
          defaultValue: companyId.value!,
        },
        {
          key: 'id',
          field: 'id',
          type: ActiveFormFieldType.input,
          defaultValue: (debtor.value?.debtor_main_profile as any)?.[`${activeTab.value}_court_place`] as any,
        },
      ] as Array<ActiveFormField<any> | boolean>)
        .filter(Boolean) as Array<ActiveFormField<any>>)),
      columns: computed(() => (([
        { key: 'index' },
        { key: 'id' },
        { key: 'case_number' },
        { key: 'receipt_date', format: ActiveTableColumnFormat.date },
        { key: 'case_consideration_date', format: ActiveTableColumnFormat.date },
        { key: 'effective_decision_date', format: ActiveTableColumnFormat.date },
        { key: 'judge_full_name' },
        { key: 'payment_status' },
        { key: 'status_history' },
      ] as Array<ActiveTableColumn<any> | boolean>)
        .filter(Boolean) as Array<ActiveTableColumn<any>>)
        .map((column) => ({
          ...column,
          field: column.key,
          label: t(`column.${String(column.key).split('.').pop()}`),
        }))),
    });

    return {
      t,

      activeTab,
      tabs,
      records,
      columns,
      actions,
      limit,
      page,
      total,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorCourtsTab";
</style>
