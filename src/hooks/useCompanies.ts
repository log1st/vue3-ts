import { useStore } from 'vuex';
import { computed } from 'vue';
import { ApiResponse, ListingRequestSource, ListingResponse } from '@/store/modules/api';
import { UserData } from '@/hooks/useUser';
import { Dict, DictType } from '@/hooks/useDicts';

export type CompanyService = {
  name: string;
}

export type Company = {
  id: number;
  services: Array<CompanyService>;
  total_debtors: string;
  fin_services: string;
  balance: number;
  name_full: string;
  name_short: string;
  okopf: string;
  inn: string;
  kpp: string;
  ogrn: string;
  ogrn_data_reg: string;
  director: string;
  type: string;
  physical_address: string;
  legal_address: string;
  email: string;
  email_buh: string;
  phone: string;
  fax: string;
  site: string;
  okpo: string;
  postal_address_zip_code: string;
  timezone: number;
  type_peni_calculation: number;
  taxation_system: string;
  representative_power_attorney: string;
  ras_schet: string;
  kor_schet: string;
  bic: string;
  full_name_bank: string;
  fns_full_info: Record<any, any>;
  dadata_raw: Record<any, any>;
  owner: number;
}

export type Region = {
  id: number;
  code: string;
  name: string;
}

export enum CompanySettingsDischargeType {
  first = 'first'
}

export enum CompanySettingsSendType {
  send_to_court = 'send_to_court'
}

export type CompanySettings = {
  id: number;
  debt_threshold: number;
  court_threshold: number;
  wait_days_before_court: number;
  wait_days_before_notify: number;
  notification_period: number;
  sms_enabled: boolean;
  voice_enabled: boolean;
  sms_priority: number;
  failed_attempts: number;
  notification_shedule_days: Record<any, any>;
  notification_shedule_wdays: Record<any, any>;
  sms_operator_uuid: string;
  voice_operator_uuid: string;
  kvint_id: number;
  automation_enabled: boolean;
  timezone: number;
  sms_attempts: number;
  call_attempts: number;
  retries_count: number;
  auto_discharge: boolean;
  discharge_type: CompanySettingsDischargeType;
  discharge_periodic_month: number;
  max_discharges_per_day: number;
  amount_from: string;
  amount_to: string;
  notify_emails: string[];
  send_type: CompanySettingsSendType;
  need_rosreestr_discharge: true;
  amount_setting: true;
  payment_of_duties: true;
  auto_filing_claim: true;
  auto_change_status: true;
  auto_transfer: true;
  debtor_data_registry_receiver_name: string;
  debtor_data_registry_payment_name: string;
  debtor_data_registry_columns_order: string[];
  company: number;
  default_region: number;
}

export type FetchCompaniesModel = {
}

export type FetchCompaniesResponse = ListingResponse<Company>;

export type FetchRegionsModel = ListingRequestSource<Region>

export type FetchRegionsResponse = ListingResponse<Region>;

export type FetchDefaultCompanyIdModel = {
  id: UserData['id'];
}

export type FetchDefaultCompanyIdResponse = {
  default_company: Company['id'];
}

export type SetDefaultCompanyIdModel = {
  id: UserData['id'];
  companyId: Company['id'];
}

export type SetDefaultCompanyIdResponse = {
  default_company: Company['id'];
}

export type FetchCompanyModel = {
  id: Company['id'];
}

export type FetchCompanyResponse = Company;

export type FetchCompanySettingsModel = {
  id: Company['id'];
}

export type FetchCompanySettingsResponse = CompanySettings;

export type UpdateCompanySettingsModel = {
  id: Company['id'];
  payload: Partial<CompanySettings>;
}

export type UpdateCompanySettingsResponse = CompanySettings;

export type RemoveCompanyModel = {
  id: Company['id'];
}

export type RemoveCompanyResponse = null;

export type UpdateCompanyModel = {
  id: Company['id'];
  payload: Company;
}

export type UpdateCompanyResponse = Company;

export type AddCompanyModel = {
  inn: Company['inn'];
}

export type AddCompanyResponse = {
  inn: string;
}

export const useCompanies = () => {
  const store = useStore();

  const companies = computed<Array<Company>>(() => (
    store.getters['companies/companies']
  ));

  const fetchCompanies = async (
    request: ListingRequestSource<Company>,
  ): Promise<ApiResponse<ListingResponse<Company>>> => {
    const { status, response } = await store.dispatch('companies/fetchCompanies', request);

    return { status, response };
  };

  const fetchCompany = async (
    id: FetchCompanyModel['id'],
  ): Promise<ApiResponse<FetchCompanyResponse>> => {
    const { status, response } = await store.dispatch('companies/fetchCompany', { id });

    return { status, response };
  };

  const fetchCompanySettings = async (
    id: FetchCompanySettingsModel['id'],
  ): Promise<ApiResponse<FetchCompanySettingsResponse>> => {
    const { status, response } = await store.dispatch('companies/fetchCompanySettings', { id });

    return { status, response };
  };

  const updateCompanySettings = async (
    model: UpdateCompanySettingsModel,
  ): Promise<ApiResponse<UpdateCompanySettingsResponse>> => {
    const { status, response } = await store.dispatch('companies/updateCompanySettings', model);

    return { status, response };
  };

  const removeCompany = async (
    id: RemoveCompanyModel['id'],
  ): Promise<ApiResponse<RemoveCompanyResponse>> => {
    const { status, response } = await store.dispatch('companies/removeCompany', { id });

    return { status, response };
  };

  const updateCompany = async (
    model: UpdateCompanyModel,
  ): Promise<ApiResponse<UpdateCompanyResponse>> => {
    const { status, response } = await store.dispatch('companies/updateCompany', model);

    return { status, response };
  };

  const setDefaultCompanyId = async (
    companyId: Company['id'],
  ): Promise<ApiResponse<SetDefaultCompanyIdResponse>> => {
    const { status, response } = await store.dispatch('companies/setDefaultCompanyId', companyId);

    return { status, response };
  };

  const addCompany = async (payload: AddCompanyModel): Promise<ApiResponse<AddCompanyResponse>> => {
    const { status, response } = await store.dispatch('companies/addCompany', payload);

    return { status, response };
  };

  const fetchPositions = async (
    model: Company['id'],
  ): Promise<ApiResponse<Dict<DictType.employeePositions>>> => {
    const { status, response } = await store.dispatch('dicts/fetchEmployeePositions', model);

    return { status, response };
  };

  const fetchRegions = async (
    request: ListingRequestSource<Region>,
  ): Promise<ApiResponse<ListingResponse<Region>>> => {
    const { status, response } = await store.dispatch('companies/fetchRegions', request);

    return { status, response };
  };

  const fetchInns = async (
    model: ListingRequestSource<{ query: string; inn: string }>,
  ): Promise<ApiResponse<ListingResponse<{
    inn: string;
    name: string;
    query: string;
  }>>> => {
    const { status, response } = await store.dispatch('dicts/fetchInns', model);

    return { status, response };
  };

  return {
    companies,
    fetchCompanies,
    setDefaultCompanyId,
    addCompany,
    fetchCompany,
    updateCompany,
    removeCompany,
    fetchPositions,
    fetchRegions,
    fetchCompanySettings,
    updateCompanySettings,
    fetchInns,
  };
};
