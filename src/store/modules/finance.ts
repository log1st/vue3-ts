import { Module } from 'vuex';
import { StoreState } from '@/store';
import {
  FetchActiveServicesModel,
  FetchAvailableServicesModel,
  FetchCompanyBalanceModel,
} from '@/hooks/useFinance';
import { ApiCommand, ApiRequest } from '@/store/modules/api';
import { formatListingRequest } from '@/hooks/useActiveTable';

export type FinanceState = {

}

type FinanceModule = Module<FinanceState, StoreState>;

export const namespaced = true;

export const actions: FinanceModule['actions'] = {
  async fetchCompanyBalance({ dispatch }, { id }: FetchCompanyBalanceModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchCompanyBalance,
      params: { id },
    } as ApiRequest, { root: true });

    return {
      status,
      response,
    };
  },
  async fetchAvailableServices({ dispatch }, request: FetchAvailableServicesModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchAvailableServices,
      params: formatListingRequest(request),
    } as ApiRequest, { root: true });

    return {
      status,
      response,
    };
  },
  async fetchActiveServices({ dispatch }, request: FetchActiveServicesModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchActiveServices,
      params: formatListingRequest(request),
    } as ApiRequest, { root: true });

    return {
      status,
      response,
    };
  },
};
