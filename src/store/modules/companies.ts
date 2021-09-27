import { Module } from 'vuex';
import {
  AddCompanyModel,
  Company,
  FetchCompaniesResponse,
  FetchCompanyModel, FetchCompanySettingsModel, FetchCompanySettingsResponse,
  FetchDefaultCompanyIdModel,
  FetchDefaultCompanyIdResponse, FetchRegionsModel,
  FetchRegionsResponse,
  Region,
  RemoveCompanyModel,
  RemoveCompanyResponse,
  SetDefaultCompanyIdModel,
  SetDefaultCompanyIdResponse,
  UpdateCompanyModel,
  UpdateCompanyResponse, UpdateCompanySettingsModel, UpdateCompanySettingsResponse,
} from '@/hooks/useCompanies';
import { StoreState } from '@/store';
import {
  ApiCommand,
  ApiRequest,
  ApiResponse,
  ListingRequest,
} from '@/store/modules/api';
import {
  formatListingRequest, formatListingResponse,
  getDefaultListingRequestSource,
} from '@/hooks/useActiveTable';
import { SignalType } from '@/hooks/useSignal';

export type CompaniesState = {
  companies: Array<Company>;
  defaultCompanyId: Company['id'] | null;
}

type CompaniesModule = Module<CompaniesState, StoreState>;

export const namespaced = true;

export const state: CompaniesModule['state'] = () => ({
  companies: [],
  defaultCompanyId: null,
});

export const getters: CompaniesModule['getters'] = {
  companies: (state) => state.companies,
  defaultCompanyId: (state) => state.defaultCompanyId,
  defaultCompany: (state) => state.companies.find(
    ({ id }) => id === state.defaultCompanyId,
  ),
};

export const mutations: CompaniesModule['mutations'] = {
  setCompanies: (state, companies: Array<Company>) => {
    state.companies = companies;
  },
  setDefaultCompanyId: (state, companyId: Company['id']) => {
    state.defaultCompanyId = companyId;
  },
};

export const actions: CompaniesModule['actions'] = {
  async fetchCompanies({ dispatch }, request = getDefaultListingRequestSource<Company>('id')) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchCompanies,
      params: formatListingRequest<ListingRequest<Company>>(request),
      signal: request.signal,
    } as ApiRequest, { root: true })) as ApiResponse<FetchCompaniesResponse>;

    return {
      status,
      response: formatListingResponse(response),
    } as ApiResponse<FetchCompaniesResponse>;
  },
  async fetchRegions({ dispatch }, request = getDefaultListingRequestSource<Region>('id')) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchRegions,
      params: formatListingRequest<FetchRegionsModel>(request),
      signal: request.signal,
    } as ApiRequest, { root: true })) as ApiResponse<Array<Region>>;

    return {
      status,
      response: formatListingResponse<Region>({
        count: response.length,
        results: response,
      }),
    } as ApiResponse<FetchRegionsResponse>;
  },
  async fetchCompany({ dispatch }, { id }: FetchCompanyModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchCompany,
      params: {
        id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<FetchCompaniesResponse>;

    return {
      status,
      response,
    } as ApiResponse<FetchCompaniesResponse>;
  },
  async fetchCompanySettings({ dispatch }, { id }: FetchCompanySettingsModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchCompanySettings,
      params: {
        id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<FetchCompanySettingsResponse>;

    return {
      status,
      response,
    } as ApiResponse<FetchCompanySettingsResponse>;
  },
  async updateCompanySettings({ commit, dispatch }, { id, payload }: UpdateCompanySettingsModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.updateCompanySettings,
      params: {
        id,
      },
      data: payload,
    } as ApiRequest<UpdateCompanySettingsModel>, {
      root: true,
    })) as ApiResponse<UpdateCompanySettingsResponse>;

    if (status) {
      commit('layout/signal', {
        signalType: SignalType.companySettingsUpdated,
        payload: {
          id,
          payload,
        },
      }, { root: true });
    }

    return {
      status,
      response,
    } as ApiResponse<UpdateCompanySettingsResponse>;
  },
  async removeCompany({ commit, dispatch }, { id }: RemoveCompanyModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.removeCompany,
      params: {
        id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<RemoveCompanyResponse>;

    if (status) {
      commit('layout/signal', {
        signalType: SignalType.companyDeleted,
        payload: {
          id,
        },
      }, { root: true });
    }

    return {
      status,
      response,
    } as ApiResponse<RemoveCompanyResponse>;
  },
  async fetchDefaultCompanyId({ commit, rootGetters, dispatch }) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchDefaultCompanyId,
      params: {
        id: rootGetters['user/data']?.id,
      },
    } as ApiRequest<FetchDefaultCompanyIdModel>, {
      root: true,
    })) as ApiResponse<FetchDefaultCompanyIdResponse>;

    if (status) {
      commit('setDefaultCompanyId', response.default_company);
    }

    return {
      status,
      response,
    } as ApiResponse<FetchDefaultCompanyIdResponse>;
  },
  async setDefaultCompanyId({ commit, dispatch, rootGetters }, companyId: Company['id']) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.setDefaultCompanyId,
      params: {
        id: rootGetters['user/data']?.id,
      },
      data: {
        companyId,
      },
    } as ApiRequest<SetDefaultCompanyIdModel>, {
      root: true,
    })) as ApiResponse<SetDefaultCompanyIdResponse>;

    if (status) {
      commit('setDefaultCompanyId', response.default_company);
    }

    return {
      status,
      response,
    } as ApiResponse<SetDefaultCompanyIdResponse>;
  },
  async updateCompany({ commit, dispatch }, { id, payload }: UpdateCompanyModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.updateCompany,
      params: {
        id,
      },
      data: payload,
    } as ApiRequest<UpdateCompanyModel>, {
      root: true,
    })) as ApiResponse<UpdateCompanyResponse>;

    if (status) {
      commit('layout/signal', {
        signalType: SignalType.companyUpdated,
        payload: {
          id,
          payload,
        },
      }, { root: true });
    }

    return {
      status,
      response,
    } as ApiResponse<UpdateCompanyResponse>;
  },
  async addCompany({ commit, dispatch }, { inn }: AddCompanyModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.addCompany,
      params: {
      },
      data: {
        inn,
      },
    } as ApiRequest<SetDefaultCompanyIdModel>, {
      root: true,
    })) as ApiResponse<SetDefaultCompanyIdResponse>;

    if (status) {
      commit('layout/signal', {
        signalType: SignalType.companyAdded,
      }, { root: true });
    }

    return {
      status,
      response,
    } as ApiResponse<SetDefaultCompanyIdResponse>;
  },
};
