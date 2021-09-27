import { Module } from 'vuex';
import { StoreState } from '@/store';
import { ExchangeImportApiRequest, ExchangeImportPartialRequest } from '@/hooks/useExchangeImport';
import { ApiCommand, ApiRequest, ApiResponse } from '@/store/modules/api';
import { DataTypeKey } from '@/hooks/useExchange';

// eslint-disable-next-line @typescript-eslint/ban-types
export type DataFileState = {};

type DataFileModule = Module<DataFileState, StoreState>;

export const namespaced = true;

export const actions: DataFileModule['actions'] = {
  async uploadDataOrDataFile({ dispatch }, payload: ExchangeImportPartialRequest) {
    const isCustom = [
      DataTypeKey.pretrial,
      DataTypeKey.judicial,
      DataTypeKey.executive,
    ].includes(payload.dataType);
    const { status, response } = (await dispatch('api/request', {
      command: isCustom
        ? ApiCommand.uploadData
        : ApiCommand.uploadDataFile,
      data: {
        company: payload.companyId,
        last: true,
        file: payload.file.file,
        name: payload.file.name,
        ...(isCustom ? {
          module: ({
            [DataTypeKey.pretrial]: 1,
            [DataTypeKey.judicial]: 2,
            [DataTypeKey.executive]: 3,
          } as any)[payload.dataType],
          mode: payload.mode,
          region: payload.regionId,
          year: payload.year,
          month: payload.month,
        } : {
          task_uuid: ({
            [DataTypeKey.paymentOrder]: '0574d4db-7cfa-42f0-be4e-0029302e8bf1',
            [DataTypeKey.judgment]: '193ee6a2-f1c7-4437-a804-7f00ee29ae10',
          } as any)[payload.dataType],
        }),
      },
    } as ApiRequest<ExchangeImportApiRequest<(typeof isCustom) extends true ? true : false>>['data'], {
      root: true,
    })) as ApiResponse;

    return {
      status,
      response,
    };
  },
};
