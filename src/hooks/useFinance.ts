import { useStore } from 'vuex';
import { Company } from '@/hooks/useCompanies';
import { ApiResponse, ListingRequestSource, ListingResponse } from '@/store/modules/api';
import { ProductionType } from '@/hooks/useConstructor';

export type CompanyBalance = {
  balance: number;
  id: number;
  income: number;
  outcome: number;
  name_full: string;
}

export type FetchCompanyBalanceModel = {
  id: Company['id'];
}

export type FetchCompanyBalanceResponse = ApiResponse<CompanyBalance>;

export type FinanceService = {
  id: number;
  company_id: Company['id'];
  production_type: ProductionType;
}

export type FetchAvailableServicesModel = ListingRequestSource<FinanceService>

export type FetchAvailableServicesResponse = ApiResponse<ListingResponse<FinanceService>>;

export type FetchActiveServicesModel = ListingRequestSource<FinanceService>

export type FetchActiveServicesResponse = ApiResponse<ListingResponse<FinanceService>>

export const useFinance = () => {
  const store = useStore();

  const fetchCompanyBalance = async (
    payload: FetchCompanyBalanceModel,
  ): Promise<FetchCompanyBalanceResponse> => {
    const { status, response } = await store.dispatch('finance/fetchCompanyBalance', payload);

    return {
      status,
      response,
    };
  };

  const fetchAvailableServices = async (
    payload: FetchAvailableServicesModel,
  ): Promise<FetchAvailableServicesResponse> => {
    const { status, response } = await store.dispatch('finance/fetchAvailableServices', payload);

    return {
      status,
      response,
    };
  };

  const fetchActiveServices = async (
    payload: FetchActiveServicesModel,
  ): Promise<FetchActiveServicesResponse> => {
    const { status, response } = await store.dispatch('finance/fetchActiveServices', payload);

    return {
      status,
      response,
    };
  };

  return {
    fetchCompanyBalance,
    fetchAvailableServices,
    fetchActiveServices,
  };
};
