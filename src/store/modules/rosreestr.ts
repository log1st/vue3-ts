import { Module } from 'vuex';
import { StoreState } from '@/store';
import { ApiCommand, ApiRequest, ApiResponse } from '@/store/modules/api';
import {
  FetchRosreestrEstateObjectCharacteristicModel,
  FetchRosreestrEstateObjectCharacteristicResponse,
  FetchRosreestrEstateObjectMovementGrouppedResponse,
  FetchRosreestrEstateObjectMovementModel,
  FetchRosreestrEstateObjectMovementResponse,
  FetchStandardizedDebtorAddressesModel,
  FetchStandardizedDebtorAddressesResponse,
  RosreestrEstateObjectCharacteristic,
  RosreestrEstateObjectMovement,
  RosreestrStatusModel,
  RosreestrStatusResponse,
  UpdateStandardizedDebtorAddressesModel,
  UpdateStandardizedDebtorAddressesResponse,
} from '@/hooks/useRosreestr';
import { formatListingRequest } from '@/hooks/useActiveTable';
import { parseDate } from '@/utils/dateFns';

export type RosreestrState = {

}

type RosreestrModule = Module<RosreestrState, StoreState>

export const namespaced = true;

export const actions: RosreestrModule['actions'] = {
  async extractFromEgrn({ dispatch }, request: RosreestrStatusModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.extractFromEgrn,
      data: request,
    } as ApiRequest, { root: true })) as ApiResponse<RosreestrStatusResponse>;

    return {
      status,
      response,
    };
  },
  async fetchEstateObjectMovements({ dispatch }, request: FetchRosreestrEstateObjectMovementModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchEstateObjectMovements,
      params: formatListingRequest(request),
    } as ApiRequest, { root: true })) as ApiResponse<
      FetchRosreestrEstateObjectMovementGrouppedResponse
    >;

    return {
      status,
      response: {
        count: response.length,
        results: response.reduce((acc, { data, date_from, date_to }) => ([
          ...acc,
          ...data.map((item, i) => ({
            ...item,
            ownership_registration_date: new Date(item.ownership_registration_date),
            ...(i === 0 ? {
              date_from: parseDate(date_from),
              date_to: parseDate(date_to),
            } : {}),
          })),
        ]), [] as Array<RosreestrEstateObjectMovement>),
      },
    } as ApiResponse<FetchRosreestrEstateObjectMovementResponse>;
  },
  async fetchEstateObjectCharacteristics({
    dispatch,
  }, request: FetchRosreestrEstateObjectCharacteristicModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchEstateObjectCharachteristics,
      params: formatListingRequest(request),
    } as ApiRequest, { root: true })) as ApiResponse<
        Array<RosreestrEstateObjectCharacteristic>
    >;

    return {
      status,
      response: {
        count: response.length,
        results: response.map((item) => ({
          ...item,
          ownership_registration_date: new Date(item.ownership_registration_date),
          request_date: new Date(item.request_date),
          last_request_date: new Date(item.last_request_date),
        })),
      },
    } as ApiResponse<FetchRosreestrEstateObjectCharacteristicResponse>;
  },
  async fetchStandardizedDebtorAddresses({
    dispatch,
  }, request: FetchStandardizedDebtorAddressesModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchStandardizedDebtorAddresses,
      params: request,
    } as ApiRequest, { root: true })) as ApiResponse<
      FetchStandardizedDebtorAddressesResponse
    >;

    return {
      status,
      response,
    } as ApiResponse<FetchStandardizedDebtorAddressesResponse>;
  },
  async updateStandardizedDebtorAddress({
    dispatch,
  }, request: UpdateStandardizedDebtorAddressesModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.updateStandardizedDebtorAddress,
      params: {
        id: request.id,
      },
      data: {
        cad_num: request.cad_num,
      },
    } as ApiRequest, { root: true })) as ApiResponse<
      UpdateStandardizedDebtorAddressesResponse
    >;

    return {
      status,
      response,
    } as ApiResponse<UpdateStandardizedDebtorAddressesResponse>;
  },
};
