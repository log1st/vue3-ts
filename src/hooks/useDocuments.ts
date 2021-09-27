import { useStore } from 'vuex';
import { ProductionType } from '@/hooks/useConstructor';
import { Debtor } from '@/hooks/useDebtors';
import { ApiResponse, ListingRequestSource, ListingResponse } from '@/store/modules/api';

export type FetchGeneralDocumentFlowModel = ListingRequestSource<{
  production_type: ProductionType;
  debtor_id: Debtor['pk'];
}>

export type FetchGeneralDocumentFlowResponse = Array<any>

export type FetchHousebookModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchHousebookResponse = ListingResponse<any>

export type FetchEgrnDataModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchEgrnDataResponse = ListingResponse<any>

export type FetchEgrnRightsModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchEgrnRightsResponse = ListingResponse<any>

export type FetchFeePaymentsModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchFeePaymentsResponse = ListingResponse<any>

export type FetchJudgmentsModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchJudgmentsResponse = ListingResponse<any>

export type FetchSmsModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchSmsResponse = ListingResponse<any>

export type FetchVoiceModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchVoiceResponse = ListingResponse<any>

export type FetchFnsHistoryModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchFnsHistoryResponse = ListingResponse<any>

export type FetchBankHistoryModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchBankHistoryResponse = ListingResponse<any>

export type FetchWritsOfExecutionModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchWritsOfExecutionResponse = ListingResponse<any>

export type FetchMyDocumentsModel = ListingRequestSource<{
  debtor_id: Debtor['pk'];
}>

export type FetchMyDocumentsResponse = ListingResponse<any>

export type UploadMyDocumentsModel = {
  debtor: Debtor['pk'];
  production_type: ProductionType;
  file: File;
}

export type UploadMyDocumentsResponse = any;

export type UploadHousebookDocumentsModel = {
  debtor: Debtor['pk'];
  production_type: ProductionType;
  file: File;
  document_formation_date: string;
  can_be_attached: 'true' | 'false';
}

export type UploadHousebookDocumentsResponse = any;

export type RemoveMyDocumentsModel = {
  id: number;
}

export type RemoveMyDocumentsResponse = any;

export const useDocuments = () => {
  const store = useStore();

  const fetchGeneralDocumentsFlow = async (
    model: FetchGeneralDocumentFlowModel,
  ): Promise<ApiResponse<FetchGeneralDocumentFlowResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchGeneralDocumentsFlow', model);

    return { status, response };
  };

  const fetchHousebook = async (
    model: FetchHousebookModel,
  ): Promise<ApiResponse<FetchHousebookResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchHousebook', model);

    return { status, response };
  };

  const fetchEgrnData = async (
    model: FetchEgrnDataModel,
  ): Promise<ApiResponse<FetchEgrnDataResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchEgrnData', model);

    return { status, response };
  };

  const fetchEgrnRights = async (
    model: FetchEgrnRightsModel,
  ): Promise<ApiResponse<FetchEgrnRightsResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchEgrnRights', model);

    return { status, response };
  };

  const fetchFeePayments = async (
    model: FetchFeePaymentsModel,
  ): Promise<ApiResponse<FetchFeePaymentsResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchFeePayments', model);

    return { status, response };
  };

  const fetchJudgments = async (
    model: FetchJudgmentsModel,
  ): Promise<ApiResponse<FetchJudgmentsResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchJudgments', model);

    return { status, response };
  };

  const fetchSms = async (
    model: FetchSmsModel,
  ): Promise<ApiResponse<FetchSmsResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchSms', model);

    return { status, response };
  };

  const fetchVoice = async (
    model: FetchVoiceModel,
  ): Promise<ApiResponse<FetchVoiceResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchVoice', model);

    return { status, response };
  };

  const fetchFnsHistory = async (
    model: FetchFnsHistoryModel,
  ): Promise<ApiResponse<FetchFnsHistoryResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchFnsHistory', model);

    return { status, response };
  };

  const fetchBankHistory = async (
    model: FetchBankHistoryModel,
  ): Promise<ApiResponse<FetchBankHistoryResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchBankHistory', model);

    return { status, response };
  };

  const fetchWritsOfExecution = async (
    model: FetchWritsOfExecutionModel,
  ): Promise<ApiResponse<FetchWritsOfExecutionResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchWritsOfExecution', model);

    return { status, response };
  };

  const fetchMyDocuments = async (
    model: FetchMyDocumentsModel,
  ): Promise<ApiResponse<FetchMyDocumentsResponse>> => {
    const { status, response } = await store.dispatch('documents/fetchMyDocuments', model);

    return { status, response };
  };

  const uploadMyDocument = async (
    model: UploadMyDocumentsModel,
  ): Promise<ApiResponse<UploadMyDocumentsResponse>> => {
    const { status, response } = await store.dispatch('documents/uploadMyDocument', model);

    return { status, response };
  };

  const uploadHousebookDocument = async (
    model: UploadHousebookDocumentsModel,
  ): Promise<ApiResponse<UploadHousebookDocumentsResponse>> => {
    const { status, response } = await store.dispatch('documents/uploadHousebookDocument', model);

    return { status, response };
  };

  const removeMyDocument = async (
    model: RemoveMyDocumentsModel,
  ): Promise<ApiResponse<RemoveMyDocumentsResponse>> => {
    const { status, response } = await store.dispatch('documents/removeMyDocument', model);

    return { status, response };
  };

  return {
    fetchGeneralDocumentsFlow,
    fetchHousebook,
    fetchEgrnData,
    fetchEgrnRights,
    fetchFeePayments,
    fetchJudgments,
    fetchSms,
    fetchVoice,
    fetchFnsHistory,
    fetchBankHistory,
    fetchWritsOfExecution,
    fetchMyDocuments,
    uploadMyDocument,
    uploadHousebookDocument,
    removeMyDocument,
  };
};
