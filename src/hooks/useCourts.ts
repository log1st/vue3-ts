import { useStore } from 'vuex';
import {
  ApiResponse, ListingRequestSource, ListingResponse,
} from '@/store/modules/api';
import { Bailiff, Debtor } from '@/hooks/useDebtors';
import { Company } from '@/hooks/useCompanies';

export enum CourtType {
  magistrate = 'm',
  regional = 'c'
}

export type Court = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  type: CourtType;
  address: string;
  name_declination: string;
  name_instrumental: string;
  phone_number_secretary: string;
  phone_number_assistant: string;
  phone_number_head_of_dep: string;
  email: string;
  payment_recipient_name: string;
  bic: string;
  payment_recipient_account: string;
  inn: string;
  kpp: string;
  oktmo: string;
  okato: string;
  payment_recipient_bank: string;
  kbk: string;
  link: string;
  magistrate: string;
  chairman: string;
  company_id: string;
}

export type FetchCourtsRequest = ListingRequestSource<Court>;
export type FetchCourtsResponse = ListingResponse<Court>;

export type FetchBailiffsRequest = ListingRequestSource<Bailiff>;
export type FetchBailiffsResponse = ListingResponse<Bailiff>;

export type FetchCasesModel = ListingRequestSource<{
  id: Court['id'];
  company_id: Company['id'];
  debtor: Debtor['pk'];
}>

export type FetchCasesResponse = ListingResponse<any>;

export type FetchCourtRequisitesModel = {
  type: 'magistrate' | 'regional';
  id: Court['id'];
}

export type FetchCourtRequisitesResponse = any;

export type UpdateCourtRequisitesModel = {
  id: Court['id'];
  type: 'magistrate' | 'regional';
  model: Partial<Court>;
};

export type UpdateCourtRequisitesResponse = any;

export const useCourts = () => {
  const store = useStore();

  const fetchMagistrateCourts = async (
    model: FetchCourtsRequest,
  ): Promise<ApiResponse<FetchCourtsResponse>> => {
    const { status, response } = await store.dispatch('courts/fetchMagistrateCourts', model);

    return {
      status,
      response,
    };
  };

  const fetchRegionalCourts = async (
    model: FetchCourtsRequest,
  ): Promise<ApiResponse<FetchCourtsResponse>> => {
    const { status, response } = await store.dispatch('courts/fetchRegionalCourts', model);

    return {
      status,
      response,
    };
  };

  const fetchBailiffs = async (
    model: FetchBailiffsRequest,
  ): Promise<ApiResponse<FetchBailiffsResponse>> => {
    const { status, response } = await store.dispatch('courts/fetchBailiffs', model);

    return {
      status,
      response,
    };
  };

  const fetchCourtCases = async (
    model: FetchCasesModel,
  ): Promise<ApiResponse<FetchCasesResponse>> => {
    const { status, response } = await store.dispatch('courts/fetchCourtCases', model);

    return {
      status,
      response,
    };
  };

  const fetchCourtRequisites = async (
    model: FetchCourtRequisitesModel,
  ): Promise<ApiResponse<FetchCourtRequisitesResponse>> => {
    const { status, response } = await store.dispatch('courts/fetchCourtRequisites', model);

    return {
      status,
      response,
    };
  };

  const updateCourtRequisites = async (
    model: UpdateCourtRequisitesModel,
  ): Promise<ApiResponse<UpdateCourtRequisitesResponse>> => {
    const { status, response } = await store.dispatch('courts/updateCourtRequisites', model);

    return {
      status,
      response,
    };
  };

  return {
    fetchMagistrateCourts,
    fetchRegionalCourts,
    fetchBailiffs,
    fetchCourtCases,
    fetchCourtRequisites,
    updateCourtRequisites,
  };
};
