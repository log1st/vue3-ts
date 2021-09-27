import { useStore } from 'vuex';
import {
  computed, Ref, ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Company } from '@/hooks/useCompanies';
import { IBtn, IBtnState } from '@/components/btn/useBtn';
import { ActiveTableAction, ActiveTableColumn } from '@/hooks/useActiveTable';
import { ActiveFormField } from '@/hooks/useActiveForm';
import { Employee } from '@/hooks/useEmployees';
import { Debtor } from '@/hooks/useDebtors';
import { ProductionType } from '@/hooks/useConstructor';

export enum IDialogComponent {
  addCompany = 'addCompany',
  company = 'company',
  addEmployee = 'addEmployee',
  confirm = 'confirm',
  tableDisplaySettings = 'tableDisplaySettings',
  actionsSelector = 'actionsSelector',
  model = 'model',
  debtorStatus = 'debtorStatus',
  print = 'print',
  file = 'file',
  egrn = 'egrn',
  debtor = 'debtor',
  listenFile = 'listenFile',
}

export type ConfirmDialogButton = {
  key: string;
  label?: IBtn['label'];
  state?: IBtn['state'];
  onClick?: (() => void);
  icon?: string;
  isVisible?: boolean;
}

export type ConfirmDialogPayload = {
  title?: string;
  message?: string;
  cancelButton?: string;
  buttons?: Array<ConfirmDialogButton>;
}

export type ModelPayload = {
  record?: Record<any, any>;
  fields: Array<ActiveFormField<any>>;
  isEditable?: boolean;
  signal?: string;
  wide?: boolean;
  isToggleable?: boolean;
}

export type TableDisplaySettingsPayload = {
  columns: Array<Pick<ActiveTableColumn<any>, 'key' | 'label' | 'isRequired'>>;
  limit: number;
  visibleColumns: Array<ActiveTableColumn<any>['key']>;
  tableKey: string;
}

export type ActionsSelectorPayload = {
  tableKey: string;
  actions: Array<ActiveTableAction<any, any>>;
  visibleActions: Array<ActiveTableAction<any, any>['key']>;
}

export type DebtorStatusPayload = {
  debtorIds: Array<Debtor['pk']>;
  productionType: ProductionType.pretrial | ProductionType.judicial;
}

export type PrintPayload = {
  debtorIds: Array<Debtor['pk']>;
  productionType: ProductionType;
}

export type EgrnPayload = {
  debtorIds: Array<Debtor['pk']>;
  productionType: ProductionType;
}

export type DebtorPayload = {
  id: Debtor['pk'];
  productionType: ProductionType;
}

export type FilePayload = {
  title: string;
  url: string;
  withPreview?: boolean;
  withCopy?: boolean;
}

export type ListenPayload = {
  name: string;
  file: string;
}

export type IDialog = {
  id?: string;
  component: IDialogComponent;
  payload?: Record<any, any>;
  addInRoute?: boolean;
  params?: Record<any, any>;
} & ({
  component: IDialogComponent.addCompany;
} | {
  component: IDialogComponent.company;
  payload: {
    id: Company['id'];
    isInitiallyEditing?: boolean;
  };
} | {
  component: IDialogComponent.addEmployee;
  payload: {
    companyId?: Company['id'];
    employeeId?: Employee['id'];
  };
} | {
  component: IDialogComponent.confirm;
  payload: ConfirmDialogPayload;
} | {
  component: IDialogComponent.tableDisplaySettings;
  payload: TableDisplaySettingsPayload;
} | {
  component: IDialogComponent.model;
  payload: ModelPayload;
} | {
  component: IDialogComponent.actionsSelector;
  payload: ActionsSelectorPayload;
} | {
  component: IDialogComponent.debtorStatus;
  payload: DebtorStatusPayload;
} | {
  component: IDialogComponent.print;
  payload: PrintPayload;
} | {
  component: IDialogComponent.file;
  payload: FilePayload;
} | {
  component: IDialogComponent.egrn;
  payload: EgrnPayload;
} | {
  component: IDialogComponent.debtor;
  payload: DebtorPayload;
} | {
  component: IDialogComponent.listenFile;
  payload: ListenPayload;
})

export const useDialog = () => {
  const store = useStore();
  const { t } = useI18n();

  const dialogs = computed<Array<IDialog>>(() => (
    store.getters['layout/dialogs']
  ));

  const showDialog = async (dialog: IDialog): Promise<() => void> => store.dispatch('layout/showDialog', dialog);
  const closeDialogById = async (dialog: IDialog['id']) => store.dispatch('layout/closeDialogById', dialog);
  const closeDialogByComponent = async (component: IDialogComponent) => store.dispatch('layout/closeDialogByComponent', component);

  const confirmDialog = ({
    title,
    buttons,
    message,
    cancelButton = 'cancel',
    withConfirmation = true,
    withCancel = true,
    cancelLabel,
    confirmLabel,
    confirmMixin,
    cancelMixin,
  }: Partial<ConfirmDialogPayload & {
    cancelLabel?: string;
    confirmLabel?: string;
    withConfirmation?: boolean;
    withCancel?: boolean;
    confirmMixin?: Partial<ConfirmDialogButton>;
    cancelMixin?: Partial<ConfirmDialogButton>;
  }>) => new Promise<{
    result: boolean;
    closeDialog:(() => void);
      }>(async (resolve) => {
        const closeDialog = await showDialog({
          component: IDialogComponent.confirm,
          addInRoute: false,
          payload: {
            title,
            message,
            cancelButton,
            buttons: buttons || ([
              withCancel && {
                key: 'cancel',
                label: cancelLabel || t('other.cancel'),
                onClick: () => {
                  resolve({ result: false, closeDialog });
                },
                state: IBtnState.tertiary,
                ...cancelMixin,
              },
              withConfirmation && {
                key: 'confirm',
                label: confirmLabel || t('other.confirm'),
                onClick: () => {
                  resolve({ result: true, closeDialog });
                },
                state: IBtnState.primary,
                ...(confirmMixin || {}),
              },
            ] as Array<ConfirmDialogButton | boolean>)
              .filter(Boolean) as Array<ConfirmDialogButton>,
          },
        });
      });

  return {
    dialogs,

    showDialog,
    closeDialogById,
    closeDialogByComponent,

    confirmDialog,
  };
};

export const useDialogRouteParam = <T extends string | null>(
  field: string,
  defaultValue: T,
  isActive: Ref<boolean>,
) => {
  const router = useRouter();
  const value = ref<T>(defaultValue);
  watch(computed(() => router.currentRoute.value?.hash.substr(1)), (hash) => {
    if (!isActive.value) {
      return;
    }
    if (hash) {
      value.value = JSON.parse(hash)[field] || defaultValue;
    }
  }, {
    immediate: true,
  });
  const computedValue = computed<T>({
    get: () => (value.value) as T,
    set: async (val) => {
      if (!isActive.value) {
        return;
      }
      try {
        await router.push({
          hash: `#${JSON.stringify({
            ...JSON.parse(router.currentRoute.value.hash.substr(1)),
            [field]: val,
          })}`,
        });
      } catch (e) {
        value.value = val as typeof value.value;
      }
    },
  });
  return [computedValue];
};
