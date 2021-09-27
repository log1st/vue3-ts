import { useStore } from 'vuex';
import { Company } from '@/hooks/useCompanies';
import { ApiResponse, ListingRequestSource, ListingResponse } from '@/store/modules/api';
import { ProductionType } from '@/hooks/useConstructor';

export enum AccountDocumentClass {
  default = 'default',
  attorney = 'attorney'
}

export type AccountDocument = {
  id: number | null;
  name: string;
  file: string;
  description: string;
  yandex_url: string;
  can_be_attached: boolean;
  klass: AccountDocumentClass;
  signer: string;
  signer_name: string;
  company: Company['id'];
  readable_path: boolean;
  production_type: ProductionType;
}

export type FetchAccountDocumentsModel = ListingRequestSource<AccountDocument>;

export type FetchAccountDocumentsResponse = ListingResponse<AccountDocument>;

export type CreateAccountDocumentModel = AccountDocument;
export type CreateAccountDocumentResponse = AccountDocument;

export type UpdateAccountDocumentModel = {
  id: AccountDocument['id'];
  payload: AccountDocument;
};
export type UpdateAccountDocumentResponse = AccountDocument;

export type RemoveAccountDocumentModel = {
  id: AccountDocument['id'];
};
export type RemoveAccountDocumentResponse = null;

export const useAccountDocuments = () => {
  const store = useStore();

  const fetchAccountDocuments = async (
    request?: FetchAccountDocumentsModel,
  ): Promise<ApiResponse<FetchAccountDocumentsResponse>> => {
    const { status, response } = await store.dispatch('accountDocuments/fetchAccountDocuments', request);

    return { status, response };
  };

  const createAccountDocument = async (
    request: CreateAccountDocumentModel,
  ): Promise<ApiResponse<CreateAccountDocumentResponse>> => {
    const { status, response } = await store.dispatch('accountDocuments/createAccountDocument', request);

    return { status, response };
  };

  const updateAccountDocument = async (
    request: UpdateAccountDocumentModel,
  ): Promise<ApiResponse<UpdateAccountDocumentResponse>> => {
    const { status, response } = await store.dispatch('accountDocuments/updateAccountDocument', request);

    return { status, response };
  };

  const removeAccountDocument = async (
    request: RemoveAccountDocumentModel,
  ): Promise<ApiResponse<RemoveAccountDocumentResponse>> => {
    const { status, response } = await store.dispatch('accountDocuments/removeAccountDocument', request);

    return { status, response };
  };

  return {
    fetchAccountDocuments,
    createAccountDocument,
    updateAccountDocument,
    removeAccountDocument,
  };
};

export const getEmptyAccountDocument = (
  companyId: Company['id'],
  documentClass: AccountDocumentClass = AccountDocumentClass.default,
): AccountDocument => ({
  id: null,
  name: '',
  file: '',
  description: '',
  yandex_url: '',
  can_be_attached: documentClass !== AccountDocumentClass.attorney,
  klass: documentClass,
  signer: '',
  signer_name: '',
  company: companyId,
  readable_path: false,
  production_type: ProductionType.judicial,
});
