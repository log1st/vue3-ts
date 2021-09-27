import { Module, Plugin } from 'vuex';
import { Dict, DictMap, DictType } from '@/hooks/useDicts';
import { StoreState } from '@/store';
import i18n from '@/i18n';
import {
  ApiCommand,
  ApiRequest,
  ApiResponse,
  ListingRequest,
  ListingRequestSource,
} from '@/store/modules/api';
import { Company } from '@/hooks/useCompanies';
import { awaitFrame } from '@/utils/window';
import { EmployeeRole } from '@/hooks/useEmployees';
import { formatListingResponse } from '@/hooks/useActiveTable';

export type DictsState = {
  dicts: {
    [key in DictType]: Dict<any>;
  };
}

type DictModule = Module<DictsState, StoreState>;

export const namespaced = true;
export const state: DictModule['state'] = () => ({
  dicts: {
    [DictType.debtorStatuses]: [],
    [DictType.debtorSubstatuses]: [],
    [DictType.debtorPretrialStatuses]: [],
    [DictType.debtorPretrialSubstatuses]: [],
    [DictType.companyTaxationSystems]: [
      {
        value: 'osn',
      },
      {
        value: 'usn',
      },
    ],
    [DictType.companyPeniCalculationTypes]: [
      {
        value: '155',
      },
      {
        value: '394',
      },
    ],
    [DictType.employeePositions]: [],
    [DictType.employeeRoles]: [
      // EmployeeRole.admin,
      // EmployeeRole.owner,
      EmployeeRole.manager,
      EmployeeRole.employee,
      EmployeeRole.guest,
    ].map((value) => ({
      value,
    })),
    [DictType.files]: [
      {
        value: 'agreement',
        label: '/files/documents/EULA.pdf',
      },
      {
        value: 'policy',
        label: '/files/documents/privacy_policy.pdf',
      },
    ],
    [DictType.tenantRelationships]: [],
  },
});

export const getters: DictModule['getters'] = {
  getDict: (state) => (type: DictType) => state.dicts[type].map((item) => ({
    ...item,
    label: item.label || i18n.global.t(`dict.${type}.${item.value}`),
  })),
  getDictMap: (state, getters) => (
    type: DictType,
    valueField: any = 'value',
    labelField: any = 'label',
  ): DictMap<any, any> => (getters.getDict(type) as Dict<any>).reduce(
    (acc, cur) => ({
      ...acc,
      [cur[valueField]]: cur[labelField],
    }
    ), {},
  ),
};

export const mutations: DictModule['mutations'] = {
  setDict: (state, payload: {type: DictType; dict: Dict<any>}) => {
    state.dicts = {
      ...state.dicts,
      [payload.type]: payload.dict,
    };
  },
};

export const actions: DictModule['actions'] = {
  async fetchDicts({ commit, dispatch, rootGetters }) {
    await Promise.all([
      rootGetters['companies/defaultCompanyId'] && new Promise(async (resolve) => {
        const {
          status,
          response,
        } = await dispatch('fetchEmployeePositions', rootGetters['companies/defaultCompanyId']);
        if (status) {
          commit('setDict', {
            type: DictType.employeePositions,
            dict: response,
          });
        }
        resolve(true);
      }),
      new Promise(async (resolve) => {
        await dispatch('fetchTenantRelationships');
        resolve(true);
      }),
      new Promise(async (resolve) => {
        const {
          status,
          response,
        } = (await dispatch('api/request', {
          command: ApiCommand.fetchDebtorStatuses,
        } as ApiRequest, { root: true })) as ApiResponse<{
          statuses: Array<{ info: string; value: string }>;
          pretrial_statuses: Array<{ info: string; value: string }>;
          substatuses: Array<{ info: string; value: string }>;
          pretrial_substatuses: Array<{ info: string; value: string }>;
        }>;

        if (status) {
          commit('setDict', {
            type: DictType.debtorStatuses,
            dict: [
              ...response.statuses.map((status) => ({
                value: status.value,
                label: status.info,
              })),
              {
                value: 'error',
                label: 'Ошибка',
              },
            ],
          });
          commit('setDict', {
            type: DictType.debtorPretrialStatuses,
            dict: [
              ...response.pretrial_statuses.map((status) => ({
                value: status.value,
                label: status.info,
              })),
              {
                value: 'error',
                label: 'Ошибка',
              },
            ],
          });
          commit('setDict', {
            type: DictType.debtorSubstatuses,
            dict: response.substatuses.map((status) => ({
              value: status.value,
              label: status.info,
            })),
          });
          commit('setDict', {
            type: DictType.debtorPretrialSubstatuses,
            dict: response.pretrial_substatuses.map((status) => ({
              value: status.value,
              label: status.info,
            })),
          });
        }
        resolve(true);
      }),
    ].filter(Boolean));
  },
  async fetchEmployeePositions({ dispatch }, id: Company['id']) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchEmployeePositions,
      params: {
        id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<Array<{name: string; id: number}>>;

    return {
      status,
      response,
    };
  },
  async fetchTenantRelationships({ dispatch, commit }, id: Company['id']) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchTenantRelationships,
      params: {
        id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<Record<string, string>>;

    if (status) {
      commit('setDict', {
        type: DictType.tenantRelationships,
        dict: Object.entries(response).reduce((acc, [value, label]) => ([
          ...acc,
          { value, label },
        ]), [] as Dict<any>),
      });
    }

    return {
      status,
      response,
    };
  },
  // @TODO сделать нормальный GET
  async fetchBanks({ dispatch }, { limit, page, filters }: ListingRequestSource<{ bik: string }>) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.lookupBik,
      params: {
        limit,
        page,
      },
      data: {
        bik: filters?.bik,
      },
    } as ApiRequest<ListingRequest<{bik: string}>>, {
      root: true,
    })) as ApiResponse<Array<{kor_schet: string}>>;

    return {
      status,
      response: formatListingResponse<{kor_schet: string}>({
        count: response.length,
        results: response,
      }),
    };
  },
  // @TODO сделать нормальный GET
  async fetchInns({ dispatch }, { limit, page, filters }: ListingRequestSource<{
    query: string;
    count: number;
  }>) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.lookupInn,
      params: {
        limit,
        page,
      },
      data: {
        query: filters?.query,
        count: filters?.count,
      },
    } as ApiRequest<ListingRequest<{bik: string}>>, {
      root: true,
    })) as ApiResponse<Array<{kor_schet: string}>>;

    return {
      status,
      response: formatListingResponse<{kor_schet: string}>({
        count: response.length,
        results: response,
      }),
    };
  },
};

export const plugins: Array<Plugin<StoreState>> = [
  async (store) => {
    store.watch(((state) => state.companies.defaultCompanyId), async () => {
      await awaitFrame();
      store.commit('dicts/setDict', {
        type: DictType.employeePositions,
        dict: [],
      });
      await store.dispatch('dicts/fetchDicts');
    }, {
      immediate: true,
    });
  },
];
