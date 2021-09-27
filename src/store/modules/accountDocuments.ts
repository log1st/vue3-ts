import { Module } from 'vuex';
import {
  AccountDocument, CreateAccountDocumentModel, CreateAccountDocumentResponse,
  FetchAccountDocumentsModel,
  FetchAccountDocumentsResponse,
  RemoveAccountDocumentModel,
  RemoveAccountDocumentResponse,
  UpdateAccountDocumentModel,
  UpdateAccountDocumentResponse,
} from '@/hooks/useAccountDocuments';
import { StoreState } from '@/store';
import {
  ApiCommand,
  ApiRequest,
  ApiResponse,
} from '@/store/modules/api';
import {
  formatListingRequest, formatListingResponse,
  getDefaultListingRequestSource,
} from '@/hooks/useActiveTable';
import { SignalType } from '@/hooks/useSignal';
import {
  CreateBulkAttachmentsModel,
  CreateBulkAttachmentsResponse,
  DocumentAttachment,
  FetchCompanyAttachmentsModel,
  FetchCompanyAttachmentsResponse,
  FetchDefaultAttachmentsResponse,
  GenerateMergedAttachmentsModel,
  GenerateMergedAttachmentsResponse,
} from '@/hooks/usePrint';

export type AccountDocumentsState = {
}

type AccountDocumentsModule = Module<AccountDocumentsState, StoreState>;

export const namespaced = true;

export const state: AccountDocumentsModule['state'] = () => ({
});

export const getters: AccountDocumentsModule['getters'] = {
};

export const mutations: AccountDocumentsModule['mutations'] = {
};

export const actions: AccountDocumentsModule['actions'] = {
  async fetchCompanyAttachments({ dispatch }, request: FetchCompanyAttachmentsModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchCompanyAttachments,
      params: request,
    } as ApiRequest, { root: true })) as ApiResponse<Array<DocumentAttachment>>;

    return {
      status,
      response: formatListingResponse({
        count: response.length,
        results: response,
      }),
    } as ApiResponse<FetchCompanyAttachmentsResponse>;
  },
  async fetchDefaultAttachments({ dispatch }) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchDefaultAttachments,
    } as ApiRequest, { root: true })) as ApiResponse<FetchDefaultAttachmentsResponse>;

    return {
      status,
      response,
    } as ApiResponse<FetchDefaultAttachmentsResponse>;
  },
  async generateMergedAttachments({ dispatch }, request: GenerateMergedAttachmentsModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.generateMergedAttachments,
      data: request,
    } as ApiRequest, { root: true })) as ApiResponse<GenerateMergedAttachmentsResponse>;

    return {
      status,
      response,
    } as ApiResponse<GenerateMergedAttachmentsResponse>;
  },
  async createBulkAttachments({ dispatch }, request: CreateBulkAttachmentsModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.createBulkAttachments,
      data: request,
    } as ApiRequest, { root: true })) as ApiResponse<CreateBulkAttachmentsResponse>;

    return {
      status,
      response,
    } as ApiResponse<CreateBulkAttachmentsResponse>;
  },
  async fetchAccountDocuments({ dispatch }, request = getDefaultListingRequestSource<AccountDocument>('id')) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchAccountDocuments,
      params: formatListingRequest<FetchAccountDocumentsModel>(request),
      signal: request.signal,
    } as ApiRequest, { root: true })) as ApiResponse<FetchAccountDocumentsResponse>;

    return {
      status,
      response: formatListingResponse(response),
    } as ApiResponse<FetchAccountDocumentsResponse>;
  },
  async removeAccountDocument({ commit, dispatch }, { id }: RemoveAccountDocumentModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.removeAccountDocument,
      params: {
        id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<RemoveAccountDocumentResponse>;

    if (status) {
      commit('layout/signal', {
        signalType: SignalType.accountDocumentDeleted,
        payload: {
          id,
        },
      }, { root: true });
    }

    return {
      status,
      response,
    } as ApiResponse<RemoveAccountDocumentResponse>;
  },
  async updateAccountDocument({
    commit, dispatch,
  }, { id, payload }: UpdateAccountDocumentModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.updateAccountDocument,
      params: {
        id,
      },
      data: {
        ...payload,
        file: payload.file.startsWith('data:') ? payload.file : undefined,
      },
    } as ApiRequest<UpdateAccountDocumentModel>, {
      root: true,
    })) as ApiResponse<UpdateAccountDocumentResponse>;

    if (status) {
      commit('layout/signal', {
        signalType: SignalType.accountDocumentUpdated,
        payload: {
          id,
          payload,
        },
      }, { root: true });
    }

    return {
      status,
      response,
    } as ApiResponse<UpdateAccountDocumentResponse>;
  },
  async createAccountDocument({ commit, dispatch }, model: CreateAccountDocumentModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.createAccountDocument,
      data: model,
    } as ApiRequest<CreateAccountDocumentModel>, {
      root: true,
    })) as ApiResponse<CreateAccountDocumentResponse>;

    if (status) {
      commit('layout/signal', {
        signalType: SignalType.accountDocumentCreated,
        payload: response,
      }, { root: true });
    }

    return {
      status,
      response,
    } as ApiResponse<CreateAccountDocumentResponse>;
  },
};
