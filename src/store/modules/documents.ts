import { Module } from 'vuex';
import { StoreState } from '@/store';
import {
  ApiCommand, ApiRequest,
} from '@/store/modules/api';
import { formatListingRequest, formatListingResponse } from '@/hooks/useActiveTable';
import {
  FetchBankHistoryModel,
  FetchBankHistoryResponse,
  FetchEgrnDataModel,
  FetchEgrnDataResponse,
  FetchEgrnRightsModel,
  FetchEgrnRightsResponse,
  FetchFeePaymentsModel,
  FetchFeePaymentsResponse,
  FetchFnsHistoryModel,
  FetchFnsHistoryResponse,
  FetchGeneralDocumentFlowModel,
  FetchGeneralDocumentFlowResponse,
  FetchHousebookModel,
  FetchHousebookResponse,
  FetchJudgmentsModel,
  FetchJudgmentsResponse,
  FetchMyDocumentsModel,
  FetchMyDocumentsResponse,
  FetchSmsModel,
  FetchSmsResponse,
  FetchVoiceModel,
  FetchVoiceResponse,
  FetchWritsOfExecutionModel,
  FetchWritsOfExecutionResponse, RemoveMyDocumentsModel, RemoveMyDocumentsResponse,
  UploadHousebookDocumentsModel, UploadHousebookDocumentsResponse,
  UploadMyDocumentsModel,
  UploadMyDocumentsResponse,
} from '@/hooks/useDocuments';

// eslint-disable-next-line @typescript-eslint/ban-types
export type DocumentsState = {};

type DocumentsModule = Module<DocumentsState, StoreState>;

export const namespaced = true;

export const actions: DocumentsModule['actions'] = {
  async fetchGeneralDocumentsFlow({ dispatch }, payload: FetchGeneralDocumentFlowModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchGeneralDocumentsFlow,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchGeneralDocumentFlowResponse>, { root: true });

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          document_formation_date:
            item.document_formation_date
              ? new Date(item.document_formation_date)
              : null,
        })),
      }),
    };
  },
  async fetchHousebook({ dispatch }, payload: FetchHousebookModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchHousebook,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchHousebookResponse>, { root: true });

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          document_formation_date:
            item.document_formation_date
              ? new Date(item.document_formation_date)
              : null,
          created_at:
            item.created_at
              ? new Date(item.created_at)
              : null,
        })),
      }),
    };
  },
  async fetchEgrnData({ dispatch }, payload: FetchEgrnDataModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchEgrnData,
      params: {
        ...formatListingRequest(payload),
        fetch_reason_list: 'true',
      },
    } as ApiRequest<FetchEgrnDataResponse>, { root: true });

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          document_formation_date:
            item.document_formation_date
              ? new Date(item.document_formation_date)
              : null,
          created_at:
            item.created_at
              ? new Date(item.created_at)
              : null,
        })),
      }),
    };
  },
  async fetchEgrnRights({ dispatch }, payload: FetchEgrnRightsModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchEgrnRights,
      params: {
        ...formatListingRequest(payload),
        fetch_reason_list: 'true',
      },
    } as ApiRequest<FetchEgrnRightsResponse>, { root: true });

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          document_formation_date:
            item.document_formation_date
              ? new Date(item.document_formation_date)
              : null,
          created_at:
            item.created_at
              ? new Date(item.created_at)
              : null,
        })),
      }),
    };
  },
  async fetchFeePayments({ dispatch }, payload: FetchFeePaymentsModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchFeePayments,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchFeePaymentsResponse>, { root: true });

    return {
      status,
      response: formatListingResponse(response),
    };
  },
  async fetchJudgments({ dispatch }, payload: FetchJudgmentsModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchJudgments,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchJudgmentsResponse>, { root: true });

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          effected_at:
            item.effected_at
              ? new Date(item.effected_at)
              : null,
          considerated_at:
            item.considerated_at
              ? new Date(item.considerated_at)
              : null,
          created_at:
            item.created_at
              ? new Date(item.created_at)
              : null,
        })),
      }),
    };
  },
  async fetchMyDocuments({ dispatch }, payload: FetchMyDocumentsModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchMyDocuments,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchMyDocumentsResponse>, { root: true });

    return {
      status,
      response: formatListingResponse(response),
    };
  },
  async fetchSms({ dispatch }, payload: FetchSmsModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchSms,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchSmsResponse>, { root: true });

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          send_at:
            item.send_at
              ? new Date(item.send_at)
              : null,
          status_at:
            item.status_at
              ? new Date(item.status_at)
              : null,
          created_at:
            item.created_at
              ? new Date(item.created_at)
              : null,
        })),
      }),
    };
  },
  async fetchVoice({ dispatch }, payload: FetchVoiceModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchVoice,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchVoiceResponse>, { root: true });

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          send_at:
            item.send_at
              ? new Date(item.send_at)
              : null,
          status_at:
            item.status_at
              ? new Date(item.status_at)
              : null,
        })),
      }),
    };
  },
  async fetchBankHistory({ dispatch }, payload: FetchBankHistoryModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchBankHistory,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchBankHistoryResponse>, { root: true });

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          request_date:
            item.request_date
              ? new Date(item.request_date)
              : null,
          response_date:
            item.response_date
              ? new Date(item.response_date)
              : null,
        })),
      }),
    };
  },
  async fetchFnsHistory({ dispatch }, payload: FetchFnsHistoryModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchFnsHistory,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchFnsHistoryResponse>, { root: true });

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          request_date:
            item.request_date
              ? new Date(item.request_date)
              : null,
          response_date:
            item.response_date
              ? new Date(item.response_date)
              : null,
        })),
      }),
    };
  },
  async fetchWritsOfExecution({ dispatch }, payload: FetchWritsOfExecutionModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchWritsOfExecution,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchWritsOfExecutionResponse>, { root: true });

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          initiation_date:
            item.initiation_date
              ? new Date(item.initiation_date)
              : null,
          completion_termination_date:
            item.completion_termination_date
              ? new Date(item.completion_termination_date)
              : null,
        })),
      }),
    };
  },
  async uploadMyDocument({ dispatch }, payload: UploadMyDocumentsModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.uploadMyDocument,
      data: payload,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } as ApiRequest<UploadMyDocumentsResponse>, { root: true });

    return {
      status,
      response,
    };
  },
  async uploadHousebookDocument({ dispatch }, payload: UploadHousebookDocumentsModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.uploadHousebookDocument,
      data: payload,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } as ApiRequest<UploadHousebookDocumentsResponse>, { root: true });

    return {
      status,
      response,
    };
  },
  async removeMyDocument({ dispatch }, payload: RemoveMyDocumentsModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.removeMyDocument,
      params: payload,
    } as ApiRequest<RemoveMyDocumentsResponse>, { root: true });

    return {
      status,
      response,
    };
  },
};
