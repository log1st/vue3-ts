import { useStore } from 'vuex';
import { ProductionType } from '@/hooks/useConstructor';
import { ApiResponse, ListingRequestSource } from '@/store/modules/api';
import {
  FetchDebtorModel,
  FetchDebtorResponse,
  FetchDebtorsModel,
  FetchDebtorsResponse,
} from '@/hooks/useDebtorsQuery';
import { Company } from '@/hooks/useCompanies';

export type DebtorSubstatus = {
  substatus: string | null;
  updated_at: string | null;
  data: string | null;
}

export type DebtorStatus = {
  id: number;
  status: string;
  updated_at: string;
  substatus: Array<DebtorSubstatus>;
}

export type Writoe = {
  id: number;
  debtor: number;
  serial_number: string;
  case_number: string;
  case_date: string;
  end_date: string;
  termination_ground: string;
  bailiff_full_name: string;
  bailiff_phone_number: string;
  court: string;
  amount: string;
  executive_amount: string;
  default: boolean;
}

export type Bailiff = {
  pk: number;
  name: string;
  lead_FIO: string;
  address: string;
  district: number;
  fax: string;
  phone: string;
  phone_info: string;
  schedule: string;
}

export type IFNS = {
  code: string;
  created_at: string;
  updated_at: string;
  name: string;
  address: string;
  inn: string;
  kpp: string;
  payee: string;
  bank: string;
  bik: string;
  rs: string;
  ks: string;
  reg_code: string;
  phone: string;
  description: string;
}

export type DebtorMainProfile = {
  id: number;
  debtor_id: number;
  address: string;
  bailiff: Bailiff;
  ifns: IFNS;
  created_at: string;
  updated_at: string;
  production_type: ProductionType;
  full_name_orig: string;
  full_name: string;
  registration_address: string;
  phone_number: string;
  email: string;
  debtor: number;
  regional_court_place: number;
  magistrate_court_place: number;
}

export type TenantRelationship = string;

export type Tenant = {
  id: number;
  relationships: Array<TenantRelationship>;
  created_at: string;
  updated_at: string;
  production_type: ProductionType;
  full_name_orig: string;
  full_name: string;
  birth_date: string | Date | null;
  birth_place: string;
  num_of_passport: string | null;
  passport_issued_by: string;
  date_of_passport_issue: string | Date | null;
  passport_is_valid: boolean;
  passport_is_invalid: boolean;
  inn: string;
  registration_date: string | Date | null;
  citizenship: string;
  registration: number | null;
  verified: boolean;
  debtor: number;
}

export type DebtData = {
  id: number;
  production_type: ProductionType;
  start_date: string;
  end_date: string;
  value: string;
  prev_value: string;
  is_paid_up: boolean;
  debtor_data: number;
}

export type PenaltyData = {
  pk: number;
  start_date: string;
  value: string;
}

export type Debtor = {
  pk: number;
  debtor: {
    pk: number;
    company_id: string;
    personal_account: string;
    debtor_status: Array<DebtorStatus>;
    pretrial_status: Array<DebtorStatus>;
    pretrial_state: number;
    writs_of_execution: Array<Writoe>;
  };
  debtor_main_profile: DebtorMainProfile;
  debtor_tenant_profiles: Array<Tenant>;
  created_at: string;
  status: string;
  accruals_data: Array<any>;
  accrual_columns: Array<string>;
  paid_ups_data: Array<any>;
  paid_up_columns: Array<string>;
  debts_data: Array<DebtData>;
  penalties_data: Array<PenaltyData>;
  debt: string;
  penalty: string;
  accrual: string;
  paid_up: string;
  fee: string;
  clean_address: string;
  total_debt: string;
  total_recalculations: string;
  'debtor.pk': string;
}

export type FetchDebtorStatusEntriesModel = {
  debtorId: Debtor['pk'];
  productionType: ProductionType;
}
export type FetchDebtorStatusEntriesResponse = {
  entries: Array<DebtorStatus>;
  activeEntryKey: DebtorStatus['status'];
}

export type UpdateDebtorStatusEntriesModel = {
  id: Debtor['pk'];
  productionType: ProductionType;
  companyId?: Company['id'];
  entries: Array<DebtorStatus>;
  activeEntryKey?: DebtorStatus['status'];
}

// @TODO уточнить
export type UpdateDebtorStatusEntriesResponse = any;

export type UpdateDebtorMainProfileModel = {
  id: DebtorMainProfile['id'];
  productionType: ProductionType;
  debtorId: Debtor['pk'];
  model: Pick<
    DebtorMainProfile,
    'full_name' | 'address' | 'registration_address' | 'phone_number' | 'email'
    >;
}

export type UpdateDebtorMainProfileResponse = any;

export type CreateTenantModel = {
  model: Tenant;
  productionType: ProductionType;
  debtor: Debtor['pk'];
}
export type CreateTenantResponse = any;

export type UpdateTenantModel = {
  id: Tenant['id'];
  model: Tenant;
  productionType: ProductionType;
}
export type UpdateTenantResponse = any;

export type RemoveTenantModel = {
  id: Tenant['id'];
}
export type RemoveTenantResponse = any;

export type UpdateInnModel = {
  production_type: ProductionType;
  payload: Array<Debtor['pk']>;
  company: Company['id'];
}

export type UpdateInnResponse = {
  task_uuid: string;
}

export type CreateWritoeModel = {
  id: Debtor['pk'];
  case_number: string;
  serial_number: string;
}

export type CreateWritoeResponse = any;

export type RefreshWritoeModel = {
  id: number;
}

export type RefreshWritoeResponse = any;

export type FetchFsspModel = ListingRequestSource<{
  id: Debtor['pk'];
  debt_nature: string;
}>

export type FetchFsspResponse = any;

export type UpdateDefaultWritoeModel = {
  id: number;
}

export type UpdateDefaultWritoeResponse = any;

export const useDebtors = () => {
  const store = useStore();
  const fetchDebtors = async (
    model: FetchDebtorsModel,
  ): Promise<ApiResponse<FetchDebtorsResponse>> => {
    const { status, response } = await store.dispatch('debtors/fetchDebtors', model);

    return { status, response };
  };

  const fetchDebtor = async (
    model: FetchDebtorModel,
  ): Promise<ApiResponse<FetchDebtorResponse>> => {
    const { status, response } = await store.dispatch('debtors/fetchDebtor', model);

    return { status, response };
  };

  const fetchDebtorStatusEntries = async (
    payload: FetchDebtorStatusEntriesModel,
  ): Promise<ApiResponse<FetchDebtorStatusEntriesResponse>> => {
    const { status, response } = await store.dispatch('debtors/fetchDebtorStatusEntries', payload);

    return { status, response };
  };

  const updateDebtorStatusEntries = async (
    payload: UpdateDebtorStatusEntriesModel,
  ): Promise<ApiResponse<UpdateDebtorStatusEntriesResponse>> => {
    const { status, response } = await store.dispatch('debtors/updateDebtorStatusEntries', payload);

    return { status, response };
  };

  const updateDebtorMainProfile = async (
    payload: UpdateDebtorMainProfileModel,
  ): Promise<ApiResponse<UpdateDebtorMainProfileResponse>> => {
    const { status, response } = await store.dispatch('debtors/updateDebtorMainProfile', payload);

    return { status, response };
  };

  const createTenant = async (
    payload: CreateTenantModel,
  ): Promise<ApiResponse<CreateTenantResponse>> => {
    const { status, response } = await store.dispatch('debtors/createTenant', payload);

    return { status, response };
  };

  const updateTenant = async (
    payload: UpdateTenantModel,
  ): Promise<ApiResponse<UpdateTenantResponse>> => {
    const { status, response } = await store.dispatch('debtors/updateTenant', payload);

    return { status, response };
  };

  const removeTenant = async (
    payload: RemoveTenantModel,
  ): Promise<ApiResponse<RemoveTenantResponse>> => {
    const { status, response } = await store.dispatch('debtors/removeTenant', payload);

    return { status, response };
  };

  const updateInn = async (
    model: UpdateInnModel,
  ): Promise<ApiResponse<UpdateInnResponse>> => {
    const { status, response } = await store.dispatch('debtors/updateInn', model);

    return { status, response };
  };

  const createWritoe = async (
    model: CreateWritoeModel,
  ): Promise<ApiResponse<CreateWritoeModel>> => {
    const { status, response } = await store.dispatch('debtors/createWritoe', model);

    return { status, response };
  };

  const refreshWritoe = async (
    model: RefreshWritoeModel,
  ): Promise<ApiResponse<RefreshWritoeResponse>> => {
    const { status, response } = await store.dispatch('debtors/refreshWritoe', model);

    return { status, response };
  };

  const fetchFssp = async (
    model: FetchFsspModel,
  ): Promise<ApiResponse<FetchFsspResponse>> => {
    const { status, response } = await store.dispatch('debtors/fetchFssp', model);

    return { status, response };
  };

  const setDefaultWritoe = async (
    model: UpdateDefaultWritoeModel,
  ): Promise<ApiResponse<UpdateDefaultWritoeResponse>> => {
    const { status, response } = await store.dispatch('debtors/setDefaultWritoe', model);

    return { status, response };
  };

  return {
    updateInn,
    createTenant,
    updateTenant,
    removeTenant,
    fetchDebtors,
    fetchDebtorStatusEntries,
    updateDebtorStatusEntries,
    fetchDebtor,
    updateDebtorMainProfile,
    createWritoe,
    refreshWritoe,
    fetchFssp,
    setDefaultWritoe,
  };
};
