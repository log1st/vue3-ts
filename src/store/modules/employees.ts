import { Module } from 'vuex';
import {
  CreateEmployeeModel, CreateEmployeeResponse,
  Employee, FetchEmployeeModel, FetchEmployeeResponse,
  FetchEmployeesResponse,
  RemoveEmployeeModel,
  RemoveEmployeeResponse,
  UpdateEmployeeModel,
  UpdateEmployeeResponse,
} from '@/hooks/useEmployees';
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

export type EmployeesState = {
}

type EmployeesModule = Module<EmployeesState, StoreState>;

export const namespaced = true;

export const state: EmployeesModule['state'] = () => ({
});

export const getters: EmployeesModule['getters'] = {
};

export const mutations: EmployeesModule['mutations'] = {
};

export const actions: EmployeesModule['actions'] = {
  async fetchEmployees({ dispatch }, request = getDefaultListingRequestSource<Employee>('id')) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchEmployees,
      params: formatListingRequest<ListingRequest<Employee>>(request),
      signal: request.signal,
    } as ApiRequest, { root: true })) as ApiResponse<FetchEmployeesResponse>;

    return {
      status,
      response: formatListingResponse(response),
    } as ApiResponse<FetchEmployeesResponse>;
  },
  async removeEmployee({ commit, dispatch }, { id, companyId }: RemoveEmployeeModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.removeEmployee,
      params: {
        id,
        company_id: companyId,
      },
    } as ApiRequest, { root: true })) as ApiResponse<RemoveEmployeeResponse>;

    if (status) {
      commit('layout/signal', {
        signalType: SignalType.employeeDeleted,
        payload: {
          id,
        },
      }, { root: true });
    }

    return {
      status,
      response,
    } as ApiResponse<RemoveEmployeeResponse>;
  },
  async updateEmployee({ commit, dispatch }, { id, payload, companyId }: UpdateEmployeeModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.updateEmployee,
      params: {
        id,
        company_id: companyId,
      },
      data: payload,
    } as ApiRequest<UpdateEmployeeModel>, {
      root: true,
    })) as ApiResponse<UpdateEmployeeResponse>;

    if (status) {
      commit('layout/signal', {
        signalType: SignalType.employeeUpdated,
        payload: {
          id,
          payload: response,
        },
      }, { root: true });
    }

    return {
      status,
      response,
    } as ApiResponse<UpdateEmployeeResponse>;
  },
  async fetchEmployee({ dispatch }, { id, companyId }: FetchEmployeeModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchEmployee,
      params: {
        id,
        company_id: companyId,
      },
    } as ApiRequest<FetchEmployeeModel>, {
      root: true,
    })) as ApiResponse<FetchEmployeeResponse>;

    return {
      status,
      response,
    } as ApiResponse<UpdateEmployeeResponse>;
  },
  async createEmployee({ commit, dispatch }, model: CreateEmployeeModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.createEmployee,
      data: model,
      params: {
        company_id: model.company_id,
      },
    } as ApiRequest<CreateEmployeeModel>, {
      root: true,
    })) as ApiResponse<CreateEmployeeResponse>;

    if (status) {
      commit('layout/signal', {
        signalType: SignalType.employeeCreated,
        payload: response,
      }, { root: true });
    }

    return {
      status,
      response,
    } as ApiResponse<CreateEmployeeResponse>;
  },
};
