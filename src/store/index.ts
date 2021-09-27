import { createStore } from 'vuex';
import { arrayFrom } from '@/utils/object';
import { UserToken } from '@/hooks/useUser';
import * as user from './modules/user';
import * as api from './modules/api';
import * as thirdParty from './modules/thirdParty';
import * as layout from './modules/layout';
import * as companies from './modules/companies';
import * as employees from './modules/employees';
import * as accountDocuments from './modules/accountDocuments';
import * as dicts from './modules/dicts';
import * as dataFile from './modules/dataFile';
import * as socket from './modules/socket';
import * as courts from './modules/courts';
import * as construct from './modules/construct';
import * as debtors from './modules/debtors';
import * as rosreestr from './modules/rosreestr';
import * as pretrial from './modules/pretrial';
import * as documents from './modules/documents';
import * as finance from './modules/finance';

export type StoreState = {
  user: user.UserState;
  api: api.ApiState;
  thirdParty: thirdParty.ThirdPartyState;
  layout: layout.LayoutState;
  companies: companies.CompaniesState;
  employees: employees.EmployeesState;
  accountDocuments: accountDocuments.AccountDocumentsState;
  dicts: dicts.DictsState;
  dataFile: dataFile.DataFileState;
  socket: socket.SocketState;
  courts: courts.CourtsState;
  construct: construct.ConstructorState;
  debtors: debtors.DebtorsState;
  rosreestr: rosreestr.RosreestrState;
  pretrial: pretrial.PretrialState;
  documents: documents.DocumentsState;
  finance: finance.FinanceState;
}

export default createStore<StoreState>({
  modules: {
    user,
    api,
    thirdParty,
    layout,
    companies,
    employees,
    accountDocuments,
    dicts,
    dataFile,
    socket,
    courts,
    construct,
    debtors,
    rosreestr,
    pretrial,
    documents,
    finance,
  },
  mutations: {
    restoreStoreModule(state, {
      module,
      value,
    }) {
      const split = arrayFrom(module)[0].split('.');
      const last = split.pop();

      if (!last) {
        return;
      }

      (split.length
        ? split.reduce((acc: Record<string, any>, cur: string) => acc[cur], state)
        : state)[last] = value;
    },
  },
  plugins: [
    (store) => {
      const modules = [
        ['user.token', (val: UserToken | null) => (val ? {
          ...val,
          validUntil: new Date(val.validUntil),
        } : val)],
        'user.data',
        'layout.isSidebarExpanded',
        'user.registrationData',
        ['user.codeUntil', (val: Date | null) => (val ? new Date(val) : val)],
        'layout.theme',
        'companies.defaultCompanyId',
        'companies.companies',
      ];

      modules.forEach((module) => {
        const persistedState = JSON.parse(localStorage.getItem('store') || '{}') || {};

        if (!(arrayFrom(module)[0] in persistedState)) {
          return;
        }

        const value = persistedState[arrayFrom(module)[0]];
        store.commit('restoreStoreModule', {
          module,
          value: (arrayFrom(module)[1] || ((s: any) => s))(value) || value,
        });
      });

      modules.forEach((module) => {
        store.watch((state: any) => arrayFrom(module)[0].split('.').reduce(
          (acc: any, cur: string) => acc?.[cur], state as any,
        ), (value) => {
          const payload = JSON.parse(localStorage.getItem('store') || '{}') || {};

          payload[arrayFrom(module)[0]] = value;

          localStorage.setItem('store', JSON.stringify(payload));
        }, {
          immediate: true,
          deep: true,
        });
      });
    },
    ...user.plugins,
    ...dicts.plugins,
    ...socket.plugins,
  ],
});
