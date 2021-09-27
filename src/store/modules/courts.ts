import { Module } from 'vuex';
import { StoreState } from '@/store';
import {
  ApiCommand, ApiRequest,
} from '@/store/modules/api';
import {
  FetchBailiffsRequest,
  FetchCasesModel, FetchCourtRequisitesModel, FetchCourtRequisitesResponse,
  FetchCourtsRequest,
  FetchCourtsResponse, UpdateCourtRequisitesModel, UpdateCourtRequisitesResponse,
} from '@/hooks/useCourts';
import { formatListingRequest, formatListingResponse } from '@/hooks/useActiveTable';

// eslint-disable-next-line @typescript-eslint/ban-types
export type CourtsState = {};

type CourtsModule = Module<CourtsState, StoreState>;

export const namespaced = true;

export const actions: CourtsModule['actions'] = {
  async fetchMagistrateCourts({ dispatch }, payload: FetchCourtsRequest) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchMagistrateCourts,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchCourtsResponse>, { root: true });

    return {
      status,
      response: formatListingResponse(response),
    };
  },
  async fetchRegionalCourts({ dispatch }, payload: FetchCourtsRequest) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchRegionalCourts,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchCourtsResponse>, { root: true });

    return {
      status,
      response: formatListingResponse(response),
    };
  },
  async fetchBailiffs({ dispatch }, payload: FetchBailiffsRequest) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchBailiffs,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchBailiffsRequest>, { root: true });

    return {
      status,
      response: formatListingResponse({
        count: response.length,
        results: response,
      }),
    };
  },
  async fetchCourtCases({ dispatch }, payload: FetchCasesModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchCourtCases,
      params: formatListingRequest(payload),
    } as ApiRequest<FetchBailiffsRequest>, { root: true });

    return {
      status,
      response: formatListingResponse({
        count: response.length,
        results: response.map((item: any) => ({
          ...item,
          receipt_date: item.receipt_date
            ? new Date(item.receipt_date)
            : null,
          case_consideration_date: item.case_consideration_date
            ? new Date(item.case_consideration_date)
            : null,
          effective_decision_date: item.effective_decision_date
            ? new Date(item.effective_decision_date)
            : null,
        })),
      }),
    };
  },
  async fetchCourtRequisites({ dispatch }, payload: FetchCourtRequisitesModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.fetchCourtRequisites,
      params: payload,
    } as ApiRequest<FetchCourtRequisitesResponse>, { root: true });

    return {
      status,
      response,
    };
  },
  async updateCourtRequisites({ dispatch }, payload: UpdateCourtRequisitesModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.updateCourtRequisites,
      params: {
        type: payload.type,
        id: payload.id,
      },
      data: payload.model,
    } as ApiRequest<UpdateCourtRequisitesResponse>, { root: true });

    return {
      status,
      response,
    };
  },
};
