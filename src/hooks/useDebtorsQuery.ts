import { computed, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ProductionType, useConstructor } from '@/hooks/useConstructor';
import { Court, useCourts } from '@/hooks/useCourts';
import { Company } from '@/hooks/useCompanies';
import { ListingRequestSource, ListingResponse } from '@/store/modules/api';
import {
  Bailiff,
  Debtor,
  DebtorMainProfile,
  DebtorStatus,
  DebtorSubstatus,
} from '@/hooks/useDebtors';
import {
  ActionType,
  ActiveTableAction, ActiveTableActionPayload,
  ActiveTableColumn,
  ActiveTableColumnFormat,
  useActiveTable,
} from '@/hooks/useActiveTable';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { IDialogComponent, useDialog } from '@/hooks/useDialog';
import { IBtnState } from '@/components/btn/useBtn';
import { IToastLevel, IToastProgressbar, useToast } from '@/hooks/useToast';
import { DictType, useDicts } from '@/hooks/useDicts';
import { usePretrial } from '@/hooks/usePretrial';
import { SocketSubscriber } from '@/store/modules/socket';
import { useSocket } from '@/hooks/useSocket';
import { SignalType, useSignal } from '@/hooks/useSignal';

export type SmsStatus = string;
export type VoiceStatus = string;

export type DebtorQuery = {
  pk: string;
  full_name: string;
  production_type: ProductionType;
  production_type_not: ProductionType;
  address: string;
  personal_account: string;
  debtor_ids: Array<DebtorMainProfile['id']>;
  has_writ_of_execution: boolean;
  has_sms: boolean;
  sms_status: SmsStatus;
  sms_status_not: SmsStatus;
  has_voice: boolean;
  voice_status: VoiceStatus;
  voice_status_not: VoiceStatus;
  status_name: DebtorStatus['status'];
  status_name_not: DebtorStatus['status'];
  substatus_name: DebtorSubstatus['substatus'];
  substatus_name_not: DebtorSubstatus['substatus'];
  phone_number: string;
  debtor_debt_min: number;
  debtor_debt_max: number;
  penalty_min: number;
  accrual_min: number;
  paid_up_min: number;
  regional_court: string;
  regional_court_id: Court['id'];
  magistrate_court: string;
  magistrate_court_id: Court['id'];
  bailiff_id: Bailiff['pk'];
  bailiffs: string;
  serial_number: string;
  case_number: string;
  writs_null: boolean;
  debtor_fees: number;
  company_id: Company['id'];
  juicial_status: DebtorStatus['status'];
  fee_status: string;
  o: string;
}

export type FetchDebtorsModel = ListingRequestSource<DebtorQuery>;
export type FetchDebtorsResponse = ListingResponse<Debtor>;

export type FetchDebtorModel = {
  id: Debtor['pk'];
  companyId: Company['id'];
  productionType: ProductionType;
};
export type FetchDebtorResponse = Debtor;

export const useDebtorsQuery = ({
  module,
}: {module: Ref<ProductionType>}) => {
  const { t } = useLocalI18n('debtors');
  const { t: rootT } = useI18n();
  const {
    showDialog,
    confirmDialog,
  } = useDialog();
  const columns = computed<Array<ActiveTableColumn<DebtorQuery>>>(() => (([
    {
      key: 'status',
      field: module.value !== ProductionType.executive ? 'debtor.debtor_status.0.status' : undefined,
      width: module.value !== ProductionType.executive ? '200px' : '120px',
      isRequired: true,
      allowEmpty: true,
    },
    {
      key: 'personal_account',
      field: 'debtor.personal_account',
      isSortable: true,
      width: '220px',
      isRequired: true,
    },
    module.value === ProductionType.pretrial && {
      key: 'phone_number',
      field: 'debtor_main_profile.phone_number',
      width: 214,
      isSortable: true,
      format: ActiveTableColumnFormat.phone,
    },
    {
      key: 'full_name',
      field: 'debtor_main_profile.full_name',
      isSortable: true,
      width: 200,
    },
    {
      key: 'address',
      field: 'debtor_main_profile.address',
      width: 320,
    },
    module.value === ProductionType.executive && {
      key: 'case_number',
      field: 'debtor.writs_of_execution.0.case_number',
      width: 281,
    },
    module.value === ProductionType.executive && {
      key: 'serial_number',
      field: 'debtor.writs_of_execution.0.serial_number',
      width: 281,
    },
    module.value === ProductionType.executive && {
      key: 'end_date',
      field: 'debtor.writs_of_execution.0.end_date',
      width: 281,
    },
    module.value === ProductionType.executive && {
      key: 'bailiff_full_name',
      field: 'debtor.writs_of_execution.0.bailiff_full_name',
      width: 281,
    },
    [ProductionType.pretrial, ProductionType.judicial].includes(module.value) && {
      key: 'accrual',
      field: 'accrual',
      isSortable: true,
      width: 'minmax(80px, 200fr)',
      format: ActiveTableColumnFormat.money,
    },
    {
      key: 'paid_up',
      field: 'paid_up',
      isSortable: true,
      width: 'minmax(80px, 200fr)',
      format: ActiveTableColumnFormat.money,
    },
    [ProductionType.pretrial, ProductionType.judicial].includes(module.value) && {
      key: 'debt',
      field: 'debt',
      isSortable: true,
      width: 'minmax(80px, 200fr)',
      format: ActiveTableColumnFormat.money,
    },
    [ProductionType.pretrial, ProductionType.judicial].includes(module.value) && {
      key: 'penalty',
      field: 'penalty',
      isSortable: true,
      width: 'minmax(80px, 200fr)',
      format: ActiveTableColumnFormat.money,
    },
    {
      key: 'total_debt',
      field: 'total_debt',
      width: 'minmax(80px, 200fr)',
      format: ActiveTableColumnFormat.money,
    },
    module.value === ProductionType.executive && {
      key: 'debt_entrepreneur',
      field: 'debtor.writs_of_execution.0.amount',
      width: 'minmax(80px, 200fr)',
      format: ActiveTableColumnFormat.money,
    },
    module.value === ProductionType.judicial && {
      key: 'fee',
      field: 'fee',
      isSortable: true,
      width: 'minmax(80px, 200fr)',
      format: ActiveTableColumnFormat.money,
    },
  ] as Array<ActiveTableColumn<DebtorQuery> | boolean>)
    .filter(Boolean) as Array<ActiveTableColumn<DebtorQuery>>).map((column) => ({
    ...column,
    ...(['status'].includes(column.key!) ? {} : {
      label: t(`column.${column.key || column.field}`),
    }),
  })));

  const { company } = useDefaultCompany();

  const {
    awaitSignalResponse,
  } = useSignal();

  const {
    getDict,
  } = useDicts();

  const {
    fetchMagistrateCourts,
    fetchRegionalCourts,
    fetchBailiffs,
  } = useCourts();

  const {
    records: regionalCourts,
    filtersModel: regionalCourtsFiltersModel,
  } = useActiveTable<Court, Court, 'id'>({
    keyField: 'id',
    async fetch({ params, signal }) {
      const { response } = await fetchRegionalCourts({ ...params, signal });

      return response;
    },
    defaultLimit: ref(100),
    filters: computed<Array<ActiveFormField<Court>>>(() => ([
      {
        key: 'name',
        field: 'name',
        type: ActiveFormFieldType.input,
      },
      {
        key: 'company_id',
        field: 'company_id',
        type: ActiveFormFieldType.input,
        defaultValue: company.value?.id,
      },
      {
        key: 'production_type',
        field: 'production_type',
        type: ActiveFormFieldType.input,
        defaultValue: module.value,
      },
    ])),
  });

  const {
    records: magistrateCourts,
    filtersModel: magistrateCourtsFiltersModel,
  } = useActiveTable<Court, Court, 'id'>({
    keyField: 'id',
    async fetch({ params, signal }) {
      const { response } = await fetchMagistrateCourts({ ...params, signal });

      return response;
    },
    defaultLimit: ref(100),
    filters: computed<Array<ActiveFormField<Court>>>(() => ([
      {
        key: 'name',
        field: 'name',
        type: ActiveFormFieldType.input,
      },
      {
        key: 'company_id',
        field: 'company_id',
        type: ActiveFormFieldType.input,
        defaultValue: company.value?.id,
      },
      {
        key: 'production_type',
        field: 'production_type',
        type: ActiveFormFieldType.input,
        defaultValue: module.value,
      },
    ])),
  });

  const {
    records: bailiffs,
    filtersModel: bailiffsFiltersModel,
  } = useActiveTable<Bailiff, Bailiff, 'pk'>({
    keyField: 'pk',
    async fetch({ params, signal }) {
      const { response } = await fetchBailiffs({ ...params, signal });

      return response;
    },
    defaultLimit: ref(10),
    filters: computed<Array<ActiveFormField<Court>>>(() => ([
      {
        key: 'name',
        field: 'name',
        type: ActiveFormFieldType.input,
      },
      {
        key: 'company_id',
        field: 'company_id',
        type: ActiveFormFieldType.input,
        defaultValue: company.value?.id,
      },
    ])),
  });

  const filters = computed<Array<ActiveFormField<DebtorQuery>>>(() => (([
    {
      key: 'company_id',
      field: 'company_id',
      type: ActiveFormFieldType.input,
      defaultValue: company.value?.id,
      isVisible: false,
    },
    {
      key: 'production_type',
      field: 'production_type',
      type: ActiveFormFieldType.input,
      defaultValue: module.value,
      isVisible: false,
    },
    {
      key: 'full_name',
      field: 'full_name',
      type: ActiveFormFieldType.input,
      width: 2,
      options: {
        placeholder: t('filters.full_name'),
      },
    },
    {
      key: 'address',
      field: 'address',
      type: ActiveFormFieldType.input,
      width: 2,
      options: {
        placeholder: t('filters.address'),
      },
    },
    {
      key: 'phone_number',
      field: 'phone_number',
      type: ActiveFormFieldType.input,
      width: 2,
      options: {
        placeholder: t('filters.phone_number'),
      },
    },
    {
      key: 'personal_account',
      field: 'personal_account',
      type: ActiveFormFieldType.input,
      width: 2,
      options: {
        placeholder: t('filters.personal_account'),
      },
    },
    {
      key: 'debtor_debt_min',
      field: 'debtor_debt_min',
      type: ActiveFormFieldType.input,
      options: {
        placeholder: t('filters.debtor_debt_min'),
      },
    },
    {
      key: 'debtor_debt_max',
      field: 'debtor_debt_max',
      type: ActiveFormFieldType.input,
      options: {
        placeholder: t('filters.debtor_debt_max'),
      },
    },
    module.value === ProductionType.executive && {
      key: 'case_number',
      field: 'case_number',
      type: ActiveFormFieldType.input,
      options: {
        placeholder: t('filters.case_number'),
      },
    },
    module.value === ProductionType.executive && {
      key: 'serial_number',
      field: 'serial_number',
      type: ActiveFormFieldType.input,
      options: {
        placeholder: t('filters.serial_number'),
      },
    },
    module.value !== ProductionType.executive && {
      key: 'status_name',
      field: 'status_name',
      type: ActiveFormFieldType.select,
      width: 2,
      options: {
        placeholder: t('filters.status_name'),
        options: {
          [ProductionType.pretrial]: getDict(DictType.debtorPretrialStatuses).value,
          [ProductionType.judicial]: getDict(DictType.debtorStatuses).value,
          [ProductionType.executive]: [],
        }[module.value],
      },
    },
    module.value === ProductionType.pretrial && {
      key: 'has_sms',
      field: 'has_sms',
      type: ActiveFormFieldType.select,
      options: {
        placeholder: t('filters.has_sms'),
        options: [
          { key: 'true', label: rootT('pretrial.sms.sent') },
          { key: 'true', label: rootT('pretrial.sms.notSent') },
        ],
      },
    },
    module.value === ProductionType.pretrial && {
      key: 'has_voice',
      field: 'has_voice',
      type: ActiveFormFieldType.select,
      options: {
        placeholder: t('filters.has_voice'),
        options: [
          { key: 'true', label: rootT('pretrial.voice.sent') },
          { key: 'true', label: rootT('pretrial.voice.notSent') },
        ],
      },
    },
    module.value === ProductionType.judicial && {
      key: 'magistrate_court_id',
      field: 'magistrate_court_id',
      type: ActiveFormFieldType.select,
      async onQuery({ query }) {
        magistrateCourtsFiltersModel.value.name = query;
      },
      options: {
        placeholder: t('filters.magistrate_court_id'),
        isSearchable: true,
        valueField: 'id',
        displayField: 'name',
        options: magistrateCourts.value,
      },
    },
    module.value === ProductionType.judicial && {
      key: 'regional_court_id',
      field: 'regional_court_id',
      type: ActiveFormFieldType.select,
      async onQuery({ query }) {
        regionalCourtsFiltersModel.value.name = query;
      },
      options: {
        placeholder: t('filters.regional_court_id'),
        isSearchable: true,
        valueField: 'id',
        displayField: 'name',
        options: regionalCourts.value,
      },
    },
    module.value === ProductionType.judicial && {
      key: 'substatus_name',
      field: 'substatus_name',
      type: ActiveFormFieldType.select,
      width: 2,
      options: {
        placeholder: t('filters.substatus_name.placeholder'),
        options: [
          {
            value: 'statement_ordered',
            label: t('filters.substatus_name.statement_ordered'),
          },
          {
            value: '!statement_ordered',
            label: t('filters.substatus_name.!statement_ordered'),
          },
        ],
      },
    },
    module.value === ProductionType.executive && {
      key: 'has_writ_of_execution',
      field: 'has_writ_of_execution',
      type: ActiveFormFieldType.select,
      width: 2,
      options: {
        placeholder: t('filters.has_writ_of_execution'),
        options: [
          {
            value: 'true',
            label: rootT('other.yes'),
          },
          {
            value: 'false',
            label: rootT('other.no'),
          },
        ],
      },
    },
    module.value === ProductionType.executive && {
      key: 'bailiff_id',
      field: 'bailiff_id',
      type: ActiveFormFieldType.select,
      width: 2,
      async onQuery({ query }) {
        bailiffsFiltersModel.value.name = query;
      },
      options: {
        placeholder: t('filters.bailiff_id'),
        isSearchable: true,
        valueField: 'id',
        displayField: 'name',
        options: bailiffs.value,
      },
    },
    module.value === ProductionType.judicial && {
      key: 'fee_status',
      field: 'fee_status',
      type: ActiveFormFieldType.select,
      width: 2,
      options: {
        placeholder: t('filters.fee_status.fees_paid'),
        options: [
          {
            value: 'statement_ordered',
            label: t('filters.fee_status.!fees_paid'),
          },
          {
            value: '!statement_ordered',
            label: t('filters.fee_status.!fees_paid'),
          },
          {
            value: 'fees_await_paid',
            label: t('filters.fee_status.fees_await_paid'),
          },
        ],
      },
    },
  ] as Array<ActiveFormField<DebtorQuery> | boolean>)
    .filter(Boolean) as Array<ActiveFormField<DebtorQuery>>));

  const showNonSelectedItemsDialog = async (title: string) => {
    const { closeDialog } = await confirmDialog({
      title,
      cancelLabel: rootT('other.ok'),
      withConfirmation: false,
    });
    closeDialog();
  };

  const {
    showToast,
  } = useToast();

  const {
    render,
    renderDebtorsData,
  } = useConstructor();

  const {
    companyId,
  } = useDefaultCompany();

  const {
    sendVoice,
    sendSms,
    sendEmail,
  } = usePretrial();

  type NotificationType = 'sms' | 'email' | 'voice'
  const progressMap: {
    [key in NotificationType]: Ref<Array<IToastProgressbar>>;
  } = {
    sms: ref([{
      key: 'progress',
      label: 'notification.toast.progress',
      current: 0,
      max: 0,
    }]),
    voice: ref([{
      key: 'progress',
      label: 'notification.toast.progress',
      current: 0,
      max: 0,
    }]),
    email: ref([{
      key: 'progress',
      label: 'notification.toast.progress',
      current: 0,
      max: 0,
    }]),
  };

  const {
    subscribe,
  } = useSocket();

  const unsubs: Array<(() => void)> = [];

  const showNotificationDialog = async (
    type: NotificationType,
    { selectedItems, allSelected }: ActiveTableActionPayload<any, any>,
  ) => {
    if (!allSelected && !selectedItems.length) {
      await showNonSelectedItemsDialog(rootT('notification.notSelected'));
      return;
    }

    const { result, closeDialog } = await confirmDialog({
      confirmLabel: rootT('notification.confirm'),
      message: rootT(`notification.${type}`),
      withCancel: false,
    });

    if (result) {
      const hideToast = await showToast({
        message: 'notification.toast.message',
        level: IToastLevel.info,
        duration: null,
        progressbars: progressMap[type],
      });

      progressMap[type].value[0].current = 0;
      progressMap[type].value[0].max = 0;

      const localFilters = await awaitSignalResponse<Record<any, any>
        >(
          SignalType.getDebtorFilters,
          SignalType.debtorFilters,
        );

      const { status, response } = await ({
        sms: sendSms,
        voice: sendVoice,
        email: sendEmail,
      }[type])({
        ...selectedItems.length ? {
          payload: selectedItems.map(Number),
        } : {
          filters: localFilters || {},
        },
        productionType: module.value,
        company: companyId.value!,
      });

      if (status) {
        const unsub = await subscribe({
          condition: (payload) => (
            payload.action === 'model_event'
              && payload.data.model === 'datafile/status/update'
              && payload.data.obj.task_uuid === response.task_uuid
          ),
          async handler(payload) {
            if (![3, 4].includes(payload.data.obj.state)) {
              progressMap[type].value[0].max = payload.data.obj.total;

              if (progressMap[type].value[0].current !== progressMap[type].value[0].max) {
                progressMap[type].value[0].current = payload.data.obj.step;
              }
            } else {
              progressMap[type].value[0].max = payload.data.obj.total;
              progressMap[type].value[0].current = progressMap[type].value[0].max;

              if (payload?.data?.obj?.state === 3) {
                await showToast({
                  message: 'notification.toast.success',
                  level: IToastLevel.success,
                });
              } else {
                await showToast({
                  message: 'notification.toast.failure',
                  level: IToastLevel.danger,
                });
              }

              const timeout = setTimeout(() => {
                hideToast();
                unsubs.splice(unsubs.findIndex((i) => i === hideToast), 1);
              }, 2000);
              unsubs.push(() => {
                clearTimeout(timeout);
              });
              unsub();
              unsubs.splice(unsubs.findIndex((i) => i === unsub), 1);
            }
          },
        } as SocketSubscriber);
        unsubs.push(unsub);
      } else {
        await hideToast();
        await showToast({
          message: t('notification.toast.failure'),
          level: IToastLevel.danger,
        });
      }
    }

    closeDialog();
  };

  const isSettingsDialogVisible = ref(false);
  const actions = computed<Array<ActiveTableAction<DebtorQuery, 'pk'>>>(() => (
    (
      [
        {
          key: 'print',
          hint: t('action.print'),
          types: [ActionType.default, ActionType.context],
          icon: 'printer',
          group: 1,
          async handler({ selectedItems, allSelected }) {
            if (!allSelected && !selectedItems.length) {
              await showNonSelectedItemsDialog(rootT('print.notSelected'));
              return;
            }
            await showDialog({
              component: IDialogComponent.print,
              addInRoute: false,
              payload: {
                productionType: module.value,
                debtorIds: selectedItems.map(Number),
              },
            });
          },
        },
        module.value === ProductionType.judicial && {
          key: 'setOfCharges',
          hint: t('action.setOfCharges'),
          types: [ActionType.default],
          icon: 'bill',
          group: 1,
          async handler({ selectedItems, allSelected }) {
            if (!allSelected && !selectedItems.length) {
              await showNonSelectedItemsDialog(rootT('setOfCharges.notSelected'));
              return;
            }
            const {
              result,
              closeDialog,
            } = await confirmDialog({
              title: rootT('setOfCharges.title'),
              cancelMixin: {
                isVisible: false,
              },
              confirmMixin: {
                label: rootT('setOfCharges.submit'),
                icon: 'eye',
                state: [IBtnState.tertiary, IBtnState.vertical],
              },
            });
            closeDialog();

            if (!result) {
              return;
            }

            await showToast({
              message: 'setOfCharges.toast.message',
              level: IToastLevel.info,
            });

            const localFilters = await awaitSignalResponse<Record<any, any>
              >(
                SignalType.getDebtorFilters,
                SignalType.debtorFilters,
              );

            const { status, response } = await render({
              company_id: companyId.value!,
              production_type: module.value,
              template_type_id: 3,
              ...selectedItems.length ? {
                debtor_ids: selectedItems.map(Number),
              } : {
                filters: localFilters || {},
              },
            });

            if (status) {
              await showDialog({
                component: IDialogComponent.file,
                addInRoute: false,
                payload: {
                  title: rootT('setOfCharges.dialog.title'),
                  url: response.document.file,
                },
              });
              await showToast({
                message: 'setOfCharges.toast.success',
                level: IToastLevel.success,
              });
            } else {
              await showToast({
                message: 'setOfCharges.toast.failure',
                level: IToastLevel.danger,
              });
            }
          },
        },
        module.value === ProductionType.judicial && {
          key: 'fee',
          hint: t('action.fee'),
          types: [ActionType.default],
          icon: 'clipboard',
          group: 1,
          async handler({ selectedItems, allSelected }) {
            if (!allSelected && !selectedItems.length) {
              await showNonSelectedItemsDialog(rootT('dutyForm.notSelected'));
              return;
            }
            const {
              result,
              closeDialog,
            } = await confirmDialog({
              title: rootT('dutyForm.title'),
              cancelMixin: {
                isVisible: false,
              },
              confirmMixin: {
                label: rootT('dutyForm.submit'),
                icon: 'eye',
                state: [IBtnState.tertiary, IBtnState.vertical],
              },
            });
            closeDialog();

            if (!result) {
              return;
            }

            await showToast({
              message: 'dutyForm.toast.message',
              level: IToastLevel.info,
            });
            const localFilters = await awaitSignalResponse<Record<any, any>
              >(
                SignalType.getDebtorFilters,
                SignalType.debtorFilters,
              );

            const { status, response } = await renderDebtorsData({
              company_id: companyId.value!,
              production_type: module.value,
              ...selectedItems.length ? {
                debtor_ids: selectedItems.map(Number),
              } : {
                filters: localFilters || {},
              },
            });

            if (status) {
              await showDialog({
                component: IDialogComponent.file,
                addInRoute: false,
                payload: {
                  title: rootT('dutyForm.dialog.title'),
                  url: response.link,
                },
              });
              await showToast({
                message: 'dutyForm.toast.success',
                level: IToastLevel.success,
              });
            } else {
              await showToast({
                message: 'dutyForm.toast.failure',
                level: IToastLevel.danger,
              });
            }
          },
        },
        module.value === ProductionType.judicial && {
          key: 'egrn',
          hint: t('action.egrn'),
          types: [ActionType.default],
          icon: 'egrn',
          group: 1,
          async handler({ selectedItems, allSelected }) {
            if (!allSelected && !selectedItems.length) {
              await showNonSelectedItemsDialog(rootT('egrn.notSelected'));
              return;
            }
            await showDialog({
              component: IDialogComponent.egrn,
              addInRoute: false,
              payload: {
                productionType: module.value,
                debtorIds: selectedItems.map(Number),
              },
            });
          },
        },
        module.value === ProductionType.pretrial && {
          key: 'sms',
          hint: t('action.sms'),
          types: [ActionType.default],
          icon: 'sms',
          group: 1,
          async handler(payload) {
            await showNotificationDialog('sms', payload);
          },
        },
        module.value === ProductionType.pretrial && {
          key: 'voice',
          hint: t('action.voice'),
          types: [ActionType.default],
          icon: 'microphone',
          group: 1,
          async handler(payload) {
            await showNotificationDialog('voice', payload);
          },
        },
        module.value === ProductionType.pretrial && {
          key: 'email',
          hint: t('action.email'),
          types: [ActionType.default],
          icon: 'envelope',
          group: 1,
          async handler(payload) {
            await showNotificationDialog('email', payload);
          },
        },
        false && (module.value !== ProductionType.executive) && {
          key: 'settings',
          label: t('action.settings'),
          types: [ActionType.default],
          icon: 'gears',
          active: isSettingsDialogVisible.value,
          group: 2,
          async handler() {
            isSettingsDialogVisible.value = !isSettingsDialogVisible.value;
          },
        },
        module.value === ProductionType.judicial && {
          key: 'status',
          label: t('action.status'),
          types: [ActionType.line],
          async handler({ selectedItems, allSelected }) {
            if (!allSelected && !selectedItems.length) {
              await showNonSelectedItemsDialog(rootT('debtorStatus.notSelected'));
              return;
            }

            await showDialog({
              component: IDialogComponent.debtorStatus,
              payload: {
                productionType: module.value as ProductionType.judicial,
                debtorIds: selectedItems.map((i) => +i),
              },
            });
          },
        },
      ] as Array<ActiveTableAction<DebtorQuery, 'pk'> | boolean>
    ).filter(Boolean) as Array<ActiveTableAction<DebtorQuery, 'pk'>>));

  const summaries = computed(() => (
    [
      'accrual',
      'paid_up',
      'debt',
      'total_debt',
      'penalty',
      module.value === ProductionType.judicial && 'fee',
      module.value === ProductionType.executive && 'debt_entrepreneur',
    ].filter(Boolean) as Array<keyof Debtor>
  ));

  return {
    columns,
    filters,
    actions,
    summaries,
  };
};
