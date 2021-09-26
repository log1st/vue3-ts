import { Module } from 'vuex';
import { StoreState } from '@/store';
import {
  formatListingRequest,
  formatListingResponse,
  getDefaultListingRequestSource,
} from '@/hooks/useActiveTable';
import {
  DebtorQuery,
  FetchDebtorModel,
  FetchDebtorResponse,
  FetchDebtorsResponse,
} from '@/hooks/useDebtorsQuery';
import {
  ApiCommand, ApiRequest, ApiResponse, ListingRequest,
} from '@/store/modules/api';
import {
  CreateTenantModel,
  CreateTenantResponse,
  CreateWritoeModel,
  CreateWritoeResponse,
  DebtorStatus,
  FetchDebtorStatusEntriesModel,
  FetchDebtorStatusEntriesResponse,
  FetchFsspModel,
  FetchFsspResponse,
  RefreshWritoeModel,
  RefreshWritoeResponse,
  RemoveTenantModel,
  RemoveTenantResponse,
  UpdateDebtorMainProfileModel,
  UpdateDebtorStatusEntriesModel, UpdateDefaultWritoeModel,
  UpdateInnModel,
  UpdateInnResponse,
  UpdateTenantModel,
  UpdateTenantResponse,
} from '@/hooks/useDebtors';
import { ProductionType } from '@/hooks/useConstructor';
import { Dict, DictType } from '@/hooks/useDicts';
import { parseDate } from '@/utils/dateFns';

export type DebtorsState = {

}

type DebtorsModule = Module<DebtorsState, StoreState>;

export const namespaced = true;

export const actions: DebtorsModule['actions'] = {
  async fetchDebtors({ dispatch }, request = getDefaultListingRequestSource<DebtorQuery>()) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchDebtors,
      params: formatListingRequest<ListingRequest<DebtorQuery>>(request),
      signal: request.signal,
    } as ApiRequest, { root: true })) as ApiResponse<FetchDebtorsResponse>;

    return {
      status,
      response: formatListingResponse(response),
    } as ApiResponse<FetchDebtorsResponse>;
  },
  async fetchDebtor({ dispatch }, request: FetchDebtorModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchDebtor,
      params: {
        id: request.id,
        production_type: request.productionType,
        company_id: request.companyId,
      },
    } as ApiRequest, { root: true })) as ApiResponse<FetchDebtorResponse>;

    return {
      status,
      response,
    } as ApiResponse<FetchDebtorResponse>;
  },
  async updateDebtorMainProfile({ dispatch }, request: UpdateDebtorMainProfileModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.updateDebtorMainInfo,
      params: {
        id: request.id,
      },
      data: {
        ...request.model,
        production_type: request.productionType,
        debtor: request.id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<FetchDebtorResponse>;

    return {
      status,
      response,
    } as ApiResponse<FetchDebtorResponse>;
  },
  async updateTenant({ dispatch }, request: UpdateTenantModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.updateTenant,
      params: {
        id: request.id,
      },
      data: {
        ...request.model,
        production_type: request.productionType,
      },
    } as ApiRequest, { root: true })) as ApiResponse<UpdateTenantResponse>;

    return {
      status,
      response,
    } as ApiResponse<UpdateTenantResponse>;
  },
  async createTenant({ dispatch }, request: CreateTenantModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.createTenant,
      data: {
        ...request.model,
        production_type: request.productionType,
        debtor: request.debtor,
      },
    } as ApiRequest, { root: true })) as ApiResponse<CreateTenantResponse>;

    return {
      status,
      response,
    } as ApiResponse<CreateTenantResponse>;
  },
  async removeTenant({ dispatch }, request: RemoveTenantModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.removeTenant,
      params: {
        id: request.id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<RemoveTenantResponse>;

    return {
      status,
      response,
    } as ApiResponse<RemoveTenantResponse>;
  },
  async updateInn({ dispatch }, request: UpdateInnModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.updateInn,
      data: request,
    } as ApiRequest, { root: true })) as ApiResponse<UpdateInnResponse>;

    return {
      status,
      response,
    } as ApiResponse<UpdateInnResponse>;
  },
  async createWritoe({ dispatch }, request: CreateWritoeModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.createWritoe,
      params: { id: request.id },
      data: {
        case_number: request.case_number,
        serial_number: request.serial_number,
      },
    } as ApiRequest, { root: true })) as ApiResponse<CreateWritoeResponse>;

    return {
      status,
      response,
    } as ApiResponse<CreateWritoeResponse>;
  },
  async refreshWritoe({ dispatch }, request: RefreshWritoeModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.refreshWritoe,
      params: request,
    } as ApiRequest, { root: true })) as ApiResponse<RefreshWritoeResponse>;

    return {
      status,
      response,
    } as ApiResponse<RefreshWritoeResponse>;
  },
  async fetchFssp({ dispatch }, request: FetchFsspModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchFssp,
      params: formatListingRequest(request),
    } as ApiRequest, { root: true })) as ApiResponse<FetchFsspResponse>;

    return {
      status,
      response: formatListingResponse({
        ...response,
        results: response.results.map((item: any) => ({
          ...item,
          production_date: item.production_date
            ? parseDate(item.production_date)
            : null,
          end_date: item.end_date
            ? parseDate(item.end_date)
            : null,
          docdate: item.docdate
            ? parseDate(item.docdate)
            : null,
        })),
      }),
    } as ApiResponse<FetchFsspResponse>;
  },
  async fetchDebtorStatusEntries({
    dispatch,
    rootGetters,
  }, request: FetchDebtorStatusEntriesModel) {
    // @TODO упразднить условие и костыли после апдейта бэка
    if (request.productionType === ProductionType.judicial) {
      const statuses = rootGetters['dicts/getDict'](DictType.debtorStatuses) as Dict<{
        value: DebtorStatus['status'];
        label: string;
      }>;
      const { status, response } = (await dispatch('api/request', {
        command: ApiCommand.fetchDebtorStatus,
        params: {
          id: request.debtorId,
        },
      } as ApiRequest, { root: true })) as ApiResponse<Array<DebtorStatus>>;

      if (status) {
        const entries = [
          ...response,
          ...statuses
            .filter(({ value }) => !response.some(({ status: s }) => s === value))
            .map(({ value }) => ({
              status: value,
              production_type: request.productionType,
              substatus: [],
              updated_at: (new Date()).toISOString(),
            })),
        ];
        entries.sort((a, b) => (
          statuses.findIndex(({ value }) => value === a.status)
          > statuses.findIndex(({ value }) => value === b.status) ? 1 : -1
        ));

        return {
          status,
          response: {
            entries,
            activeEntryKey: response[0]?.status || null,
          },
        };
      }

      return {
        status,
        response,
      } as any as ApiResponse<FetchDebtorStatusEntriesResponse>;
    } if (request.productionType === ProductionType.pretrial) {
      const statuses = rootGetters['dicts/getDict'](DictType.debtorPretrialStatuses) as Dict<{
        value: DebtorStatus['status'];
        label: string;
      }>;
      const { status, response } = (await dispatch('fetchDebtor', {
        id: request.debtorId,
        productionType: request.productionType,
        companyId: rootGetters['companies/defaultCompanyId'],
      })) as ApiResponse<FetchDebtorResponse>;

      if (status) {
        const entries = [
          ...(response.debtor.pretrial_status || [])
            .map((status) => ({
              ...status,
              substatus: status.substatus?.map((substatus) => ({
                ...substatus,
                data: substatus.data ? (typeof substatus.data === 'string' ? substatus.data : JSON.stringify(substatus.data)) : '',
              })) || [],
            })),
          ...statuses
            .filter(
              ({ value }) => !response.debtor.pretrial_status.some(
                ({ status }) => status === value,
              ),
            )
            .map(({ value }) => ({
              status: value,
              production_type: request.productionType,
              substatus: [],
              updated_at: (new Date()).toISOString(),
            })),
        ];
        entries.sort((a, b) => (
          statuses.findIndex(({ value }) => value === a.status)
          > statuses.findIndex(({ value }) => value === b.status) ? 1 : -1
        ));

        return {
          status,
          response: {
            entries,
            activeEntryKey: response.debtor.pretrial_status[0]?.status || null,
          },
        };
      }

      return {
        status,
        response,
      } as any as ApiResponse<FetchDebtorStatusEntriesResponse>;
    }

    return {
      status: false,
      response: {
        entries: [],
        activeEntryKey: null,
      },
    };
  },
  async updateDebtorStatusEntries({
    dispatch,
    rootGetters,
  }, request: UpdateDebtorStatusEntriesModel) {
    // @TODO упразднить условие и костыли после апдейта бэка
    if (request.productionType === ProductionType.judicial) {
      const responses: Array<{status: boolean}> = await Promise.all(
        (request.activeEntryKey === 'other' ? (
          request.entries.find(({ status }) => status === request.activeEntryKey)?.substatus
            .filter(({ updated_at }) => !updated_at)
            .map(({ substatus, data }) => ({
              new_substatus: substatus,
              new_substatus_label: data,
            })) || []
        ) as any[] : [{}])
          .map(async (payload: any) => dispatch('api/request', {
            command: ApiCommand.createDebtorStatus,
            data: {
              ...payload,
              company_id: rootGetters['companies/defaultCompanyId'],
              production_type: ProductionType.judicial,
              debtor: request.id,
              status: request.activeEntryKey,
            },
          } as ApiRequest, { root: true })),
      );

      return {
        status: !responses.some(({ status }) => !status),
        response: null,
      };
    } if (request.productionType === ProductionType.pretrial) {
      const activeEntry = request.entries.find(
        ({ status }) => status === request.activeEntryKey,
      ) as DebtorStatus;
      const { status, response } = await dispatch('api/request', {
        command: ApiCommand.updatePretrialStatus,
        params: {
          id: request.entries.find(({ id }) => id)?.id,
        },
        data: {
          ...activeEntry,
          substatus: request.activeEntryKey === 'other' ? (
            activeEntry.substatus.map((substatus) => ({
              ...substatus,
              updated_at: substatus.updated_at || (new Date()).toISOString(),
            }))
          ) : activeEntry.substatus,
        },
      }, { root: true });

      return {
        status,
        response,
      };
    }
    return {
      status: false,
      response: null,
    };
  },
  async setDefaultWritoe({ dispatch }, request: UpdateDefaultWritoeModel) {
    const { status, response } = await dispatch('api/request', {
      command: ApiCommand.setDefaultWritoe,
      params: {
        id: request.id,
      },
    }, { root: true });

    return {
      status,
      response,
    };
  },
};
