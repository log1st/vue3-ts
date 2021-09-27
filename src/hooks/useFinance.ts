import { useStore } from 'vuex';
import { Company } from '@/hooks/useCompanies';
import { ApiResponse, ListingRequestSource, ListingResponse } from '@/store/modules/api';

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
}

export type FetchAvailableServicesModel = ListingRequestSource<{
  company_id: Company['id'];
  id: number;
}>

export type FetchAvailableServicesResponse = ApiResponse<ListingResponse<FinanceService>>

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

  return {
    fetchCompanyBalance,
    fetchAvailableServices,
  };
};
