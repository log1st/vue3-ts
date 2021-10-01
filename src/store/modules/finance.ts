import { Module } from 'vuex';
import { StoreState } from '@/store';
import {
  FetchActiveServicesModel,
  FetchAvailableServicesModel,
  FetchCompanyBalanceModel, FinanceService,
} from '@/hooks/useFinance';
import {
  ApiCommand, ApiRequest, ApiResponse, ListingResponse,
} from '@/store/modules/api';
import { formatListingRequest } from '@/hooks/useActiveTable';
import { ProductionType } from '@/hooks/useConstructor';

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
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchAvailableServices,
      params: formatListingRequest(request),
    } as ApiRequest, { root: true })) as ApiResponse<ListingResponse<FinanceService>>;

    return {
      status,
      response: {
        ...response,
        results: response.results.map((item, i) => ({
          ...item,
          production_type: [
            ProductionType.pretrial,
            ProductionType.judicial,
            ProductionType.executive,
          ][i % 3],
        })),
      },
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
