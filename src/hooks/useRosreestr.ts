import { useStore } from 'vuex';
import { Company } from '@/hooks/useCompanies';
import { ProductionType } from '@/hooks/useConstructor';
import { Debtor } from '@/hooks/useDebtors';
import { ApiResponse, ListingRequestSource, ListingResponse } from '@/store/modules/api';

export enum RosreestrStatusModelType {
  data = 'data',
  rights = 'rights'
}

export type RosreestrStatusModel = {
  type: Array<RosreestrStatusModelType>;
  company_id: Company['id'];
  production_type: ProductionType;
  force: boolean;
  debtor_ids?: Array<Debtor['pk']>;
  filters?: Record<any, any>;
}

export type RosreestrStatusResponse = {
  id: number;
}

export type RosreestrStatusLocalModel = Omit<RosreestrStatusModel, 'company_id' | 'type' | 'debtor_ids' | 'production_type'> & {
  data: boolean;
  rights: boolean;
};

export type RosreestrEstateObjectCharacteristic = {
  id: number;
  debtor_data: string;
  registered_ownership_type: string;
  owner_name: string;
  cadastral_number: string | null;
  fraction_in_ownership: string;
  ownership_type: string;
  ownership_name: string;
  ownership_registration_date: string | Date;
  ownership_registration_number: string;
  request_date: string | Date;
  last_request_date: string | Date;
  ownership_termination_info: string;
  debtor: Debtor['pk'];
  status_tracking: number;
}

export type FetchRosreestrEstateObjectCharacteristicModel = ListingRequestSource<
  RosreestrEstateObjectCharacteristic
>

export type FetchRosreestrEstateObjectCharacteristicResponse = ListingResponse<
  RosreestrEstateObjectCharacteristic
>

export type RosreestrEstateObjectMovement = {
  id: number;
  debtor_data: string;
  registered_ownership_type: string;
  owner_name: string;
  cadastral_number: string;
  fraction_in_ownership: string;
  ownership_type: string;
  ownership_name: string;
  ownership_registration_date: string | Date;
  ownership_registration_number: string;
  end_date: string;
  debtor: Debtor['pk'];
  status_tracking: number;
  date_from?: Date | null;
  date_to?: Date | null;
}

export type FetchRosreestrEstateObjectMovementModel = ListingRequestSource<
  RosreestrEstateObjectMovement
>

export type FetchRosreestrEstateObjectMovementResponse = ListingResponse<
  RosreestrEstateObjectMovement
>

export type FetchRosreestrEstateObjectMovementGrouppedResponse = Array<{
  date_from: string | null;
  date_to: string | null;
  data: Array<RosreestrEstateObjectMovement>;
}>

export type StandardizedDebtorAddress = {
  id: number;
  cadnum: string;
  address: string;

  area: string;
  object_name: string;
  land_category: string;
  cad_cost: string;
}

export type FetchStandardizedDebtorAddressesModel = {
  id: Debtor['pk'];
}

export type FetchStandardizedDebtorAddressesResponse = {
  suggests: Array<StandardizedDebtorAddress> | null;
}

export type UpdateStandardizedDebtorAddressesModel = {
  id: number;
  cad_num: string;
}

export type UpdateStandardizedDebtorAddressesResponse = any;

export const useRosreestr = () => {
  const store = useStore();

  const extractFromEgrn = async (
    payload: RosreestrStatusModel,
  ): Promise<ApiResponse<RosreestrStatusResponse>> => {
    const { status, response } = await store.dispatch('rosreestr/extractFromEgrn', payload);

    return { status, response };
  };

  const fetchEstateObjectCharacteristics = async (
    payload: FetchRosreestrEstateObjectCharacteristicModel,
  ): Promise<ApiResponse<FetchRosreestrEstateObjectCharacteristicResponse>> => {
    const { status, response } = await store.dispatch('rosreestr/fetchEstateObjectCharacteristics', payload);

    return { status, response };
  };

  const fetchEstateObjectMovements = async (
    payload: FetchRosreestrEstateObjectMovementModel,
  ): Promise<ApiResponse<FetchRosreestrEstateObjectMovementResponse>> => {
    const { status, response } = await store.dispatch('rosreestr/fetchEstateObjectMovements', payload);

    return { status, response };
  };

  const fetchStandardizedDebtorAddresses = async (
    payload: FetchStandardizedDebtorAddressesModel,
  ): Promise<ApiResponse<FetchStandardizedDebtorAddressesResponse>> => {
    const { status, response } = await store.dispatch('rosreestr/fetchStandardizedDebtorAddresses', payload);

    return { status, response };
  };

  const updateStandardizedDebtorAddress = async (
    payload: UpdateStandardizedDebtorAddressesModel,
  ): Promise<ApiResponse<UpdateStandardizedDebtorAddressesResponse>> => {
    const { status, response } = await store.dispatch('rosreestr/updateStandardizedDebtorAddress', payload);

    return { status, response };
  };

  return {
    extractFromEgrn,
    fetchEstateObjectCharacteristics,
    fetchEstateObjectMovements,
    fetchStandardizedDebtorAddresses,
    updateStandardizedDebtorAddress,
  };
};
