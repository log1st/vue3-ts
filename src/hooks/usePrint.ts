import { useStore } from 'vuex';
import { ApiResponse, ListingResponse } from '@/store/modules/api';
import { ProductionType } from '@/hooks/useConstructor';
import { Company } from '@/hooks/useCompanies';
import { Debtor } from '@/hooks/useDebtors';

export type DocumentAttachment = {
  id: number;
  production_type: ProductionType;
  type: string;
  name: string;
  order_number: number;
  is_active: boolean;
  is_show: boolean;
  company: Company['id'];
  document: null;
  debtor_document_id: number;
}

export type PrintModel = {
  wholePeriod: boolean;
  from: null;
  to: null;
  moratorium: boolean;
  documents: Array<DocumentAttachment>;
}

export type FetchCompanyAttachmentsModel = {
  productionType: ProductionType;
  companyId: Company['id'];
}
export type FetchCompanyAttachmentsResponse = ListingResponse<DocumentAttachment>;

export type FetchDefaultAttachmentsResponse = {
  attachments: {
    [key: string]: {
      name: string;
    };
  };
  productions: {
    [key in ProductionType]: string[]
  };
};

export type GenerateMergedAttachmentsModel = {
  production_type: ProductionType;
  encrypt: boolean;
  company_id: Company['id'];
  debtor_ids?: Array<Debtor['pk']>;
  filters?: Record<any, any>;
  date_from?: string | null;
  date_to?: string | null;
  moratorium_enabled: boolean;
}

export type GenerateMergedAttachmentsResponse = {
  id: number;
};

export type CreateBulkAttachmentsModel = {
  production_type: ProductionType;
  company_id: Company['id'];
  attachments: Array<DocumentAttachment>;
}

export type CreateBulkAttachmentsResponse = any;

export const usePrint = () => {
  const store = useStore();
  const fetchCompanyAttachments = async (
    payload: FetchCompanyAttachmentsModel,
  ): Promise<ApiResponse<FetchCompanyAttachmentsResponse>> => {
    const {
      status,
      response,
    } = await store.dispatch('accountDocuments/fetchCompanyAttachments', payload);

    return { status, response };
  };

  const fetchDefaultAttachments = async (
  ): Promise<ApiResponse<FetchDefaultAttachmentsResponse>> => {
    const { status, response } = await store.dispatch('accountDocuments/fetchDefaultAttachments');

    return { status, response };
  };

  const generateMergedAttachments = async (
    payload: GenerateMergedAttachmentsModel,
  ): Promise<ApiResponse<GenerateMergedAttachmentsResponse>> => {
    const { status, response } = await store.dispatch('accountDocuments/generateMergedAttachments', payload);

    return { status, response };
  };

  const createBulkAttachments = async (
    payload: CreateBulkAttachmentsModel,
  ): Promise<ApiResponse<CreateBulkAttachmentsResponse>> => {
    const { status, response } = await store.dispatch('accountDocuments/createBulkAttachments', payload);

    return { status, response };
  };

  return {
    fetchCompanyAttachments,
    fetchDefaultAttachments,
    generateMergedAttachments,
    createBulkAttachments,
  };
};
