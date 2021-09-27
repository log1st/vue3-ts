import { Module } from 'vuex';
import { Theme } from '@/hooks/useLayout';
import { StoreState } from '@/store';
import { IDialog, IDialogComponent } from '@/hooks/useDialog';
import { getRandomString } from '@/utils/string';
import router from '@/router';
import { Signal, SignalType } from '@/hooks/useSignal';
import { IToast } from '@/hooks/useToast';
import { DataTypeKey, DebtorsDataTypeKey } from '@/hooks/useExchange';

export enum ImportFileTemplate {
  csv = 'csv',
  xls = 'xls',
  xlsx = 'xlsx',
}

export type LayoutState = {
  theme: Theme;
  isSidebarExpanded: boolean;
  dialogs: Array<IDialog>;
  toasts: Array<IToast>;
  isPreloaderVisible: boolean;
  settings: {
    serviceCreationDate: Date;
    serviceVersion: string;
    exchangeImportEmail: string;
    importFilesTemplates: {
      [key in DebtorsDataTypeKey]: {
        [key in 'linear' | 'table']: {
          [key in ImportFileTemplate]: string
        }
      }
    };
  };
}

type LayoutModule = Module<LayoutState, StoreState>;

export const namespaced = true;

export const state: LayoutModule['state'] = () => ({
  theme: Theme.light,
  isSidebarExpanded: false,
  isPreloaderVisible: false,
  dialogs: [],
  toasts: [],

  settings: {
    serviceCreationDate: new Date(Date.UTC(2017, 0, 1)),
    serviceVersion: '1.0.0 (release)',
    exchangeImportEmail: 'loading@urrobot.net',
    importFilesTemplates: {
      [DataTypeKey.pretrial]: {
        linear: {
          xls: require('@/assets/files/import-templates/pretrial/linear/Шаблон файла реестра по загрузке должников в Досудебное производство.xls'),
          xlsx: require('@/assets/files/import-templates/pretrial/linear/Шаблон файла реестра по загрузке должников в Досудебное производство.xlsx'),
          csv: require('@/assets/files/import-templates/pretrial/linear/Шаблон файла реестра по загрузке должников в Досудебное производство.csv'),
        },
        table: {
          xls: require('@/assets/files/import-templates/pretrial/table/Шаблон файла реестра по загрузке должников в Досудебное производство (табличный).xls'),
          xlsx: require('@/assets/files/import-templates/pretrial/table/Шаблон файла реестра по загрузке должников в Досудебное производство (табличный).xlsx'),
          csv: require('@/assets/files/import-templates/pretrial/table/Шаблон файла реестра по загрузке должников в Досудебное производство (табличный).csv'),
        },
      },
      [DataTypeKey.judicial]: {
        linear: {
          xls: require('@/assets/files/import-templates/judicial/linear/Шаблон файла реестра по загрузке должников в Судебное производство.xls'),
          xlsx: require('@/assets/files/import-templates/judicial/linear/Шаблон файла реестра по загрузке должников в Судебное производство.xlsx'),
          csv: require('@/assets/files/import-templates/judicial/linear/Шаблон файла реестра по загрузке должников в Судебное производство.csv'),
        },
        table: {
          xls: require('@/assets/files/import-templates/judicial/table/Шаблон файла реестра по загрузке должников в Судебное производство (табличный).xls'),
          xlsx: require('@/assets/files/import-templates/judicial/table/Шаблон файла реестра по загрузке должников в Судебное производство (табличный).xlsx'),
          csv: require('@/assets/files/import-templates/judicial/table/Шаблон файла реестра по загрузке должников в Судебное производство (табличный).csv'),
        },
      },
      [DataTypeKey.executive]: {
        linear: {
          xls: require('@/assets/files/import-templates/executive/linear/Шаблон файла реестра по загрузке должников в Исполнительное производство.xls'),
          xlsx: require('@/assets/files/import-templates/executive/linear/Шаблон файла реестра по загрузке должников в Исполнительное производство.xlsx'),
          csv: require('@/assets/files/import-templates/executive/linear/Шаблон файла реестра по загрузке должников в Исполнительное производство.csv'),
        },
        table: {
          xls: require('@/assets/files/import-templates/executive/linear/Шаблон файла реестра по загрузке должников в Исполнительное производство.xls'),
          xlsx: require('@/assets/files/import-templates/executive/linear/Шаблон файла реестра по загрузке должников в Исполнительное производство.xlsx'),
          csv: require('@/assets/files/import-templates/executive/linear/Шаблон файла реестра по загрузке должников в Исполнительное производство.csv'),
        },
      },
    },
  },
});

export const getters: LayoutModule['getters'] = {
  theme: (state) => state.theme,
  isSidebarExpanded: (state) => state.isSidebarExpanded,
  isPreloaderVisible: (state) => state.isPreloaderVisible,
  settings: (state) => state.settings,
  dialogs: (state) => state.dialogs,
  toasts: (state) => state.toasts,
};

export const mutations: LayoutModule['mutations'] = {
  setTheme: (state, theme: Theme) => {
    state.theme = theme;
  },
  setSidebarExpansion: (state, isExpanded: boolean) => {
    state.isSidebarExpanded = isExpanded;
  },
  setPreloaderVisibility: (state, isVisible: boolean) => {
    state.isPreloaderVisible = isVisible;
  },
  addDialog: (state, dialog: IDialog) => {
    state.dialogs.push(dialog);
  },
  removeDialogById: (state, dialogId: IDialog['id']) => {
    const index = state.dialogs.findIndex(({ id }) => dialogId === id);
    if (index === -1) {
      return;
    }
    state.dialogs.splice(
      index,
      1,
    );
  },
  removeDialogByComponent: (state, component: IDialogComponent) => {
    state.dialogs = state.dialogs.filter((dialog) => dialog.component !== component);
  },
  addToast: (state, toast: IToast) => {
    state.toasts.push(toast);
  },
  removeToastById: (state, toastId: IToast['id']) => {
    state.toasts.splice(
      state.toasts.findIndex(({ id }) => toastId === id),
      1,
    );
  },
  signal: (state, payload: {signalType: SignalType; payload: Signal['payload']}) => {
    console.log('Signal', payload);
  },
};

export const actions: LayoutModule['actions'] = {
  async setTheme({ commit }, theme: Theme) {
    commit('setTheme', theme);
  },
  async toggleSidebar({ commit, getters }) {
    commit('setSidebarExpansion', !getters.isSidebarExpanded);
  },
  async showDialog({ commit, dispatch }, dialog: IDialog) {
    const id = dialog.id || getRandomString();

    const payload = {
      addInRoute: true,
      ...dialog,
      id,
    } as IDialog;

    if (payload.addInRoute) {
      await router.push({
        hash: `#${JSON.stringify({
          component: payload.component,
          payload: payload.payload,
          ...payload.params,
        })}`,
      });
    } else {
      commit('addDialog', payload);
    }

    const callback = () => {
      dispatch('closeDialogById', id);
    };
    callback.id = id;

    (document.activeElement as any)?.blur?.();

    return callback;
  },
  async closeDialogById({ commit, getters }, dialogId: IDialog['id']) {
    try {
      const dialog = JSON.parse(router.currentRoute.value.hash.substr(1)) as IDialog | undefined;
      if (
        dialog
        && 'component' in dialog
      ) {
        if (dialog.component === (getters.dialogs as Array<IDialog>).find(
          ({ id }) => id === dialogId,
        )?.component) {
          await router.push({ hash: '' });
        }
      }
    } catch (e) {
      //
    }
    commit('removeDialogById', dialogId);
  },
  async closeDialogByComponent({ commit }, component: IDialogComponent) {
    commit('removeDialogByComponent', component);
  },
  async showToast({ commit, dispatch }, toast: IToast) {
    const id = getRandomString();

    const payload = {
      duration: 2000,
      ...toast,
      id,
    } as IToast;

    commit('addToast', payload);

    const callback = () => {
      dispatch('closeToastById', id);
    };
    callback.id = id;

    return callback;
  },
  async closeToastById({ commit }, toastId: IToast['id']) {
    commit('removeToastById', toastId);
  },
  async showPreloader({ commit }) {
    commit('setPreloaderVisibility', true);
  },
  async hidePreloader({ commit }) {
    commit('setPreloaderVisibility', false);
  },
};
