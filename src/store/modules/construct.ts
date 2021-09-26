import { Module } from 'vuex';
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
import {
  ConstructorRenderDebtorsDataModel, ConstructorRenderDebtorsDataResponse,
  ConstructorRenderModel, ConstructorRenderResponse,
  ConstructorTemplate, ConstructorVariableGroup, CreateConstructorConstructorTemplateResponse,
  CreateConstructorTemplateModel,
  CreateConstructorTemplateResponse,
  CreateConstructorTemplateTypesModel,
  CreateConstructorTemplateTypesResponse,
  FetchConstructorConstructorTemplateModel,
  FetchConstructorConstructorTemplateResponse,
  FetchConstructorTemplatesModel,
  FetchConstructorTemplatesResponse,
  FetchConstructorVariablesModel,
  FetchConstructorVariablesResponse,
  FetchTemplatesModel,
  FetchTemplatesResponse,
  FetchTemplateTypesModel,
  FetchTemplateTypesResponse, ProductionType,
  RemoveConstructorConstructorTemplateModel,
  RemoveConstructorConstructorTemplateResponse,
  RemoveConstructorTemplateModel,
  RemoveConstructorTemplateResponse,
  Template,
  TemplateType,
  UpdateConstructorConstructorTemplateModel,
  UpdateConstructorConstructorTemplateResponse,
  UpdateConstructorTemplateModel,
  UpdateConstructorTemplateResponse,
} from '@/hooks/useConstructor';

export type ConstructorState = {
}

type ConstructorModule = Module<ConstructorState, StoreState>;

export const namespaced = true;

export const actions: ConstructorModule['actions'] = {
  async fetchTemplateTypes({ dispatch }, request = getDefaultListingRequestSource<TemplateType>('id')) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchConstructorTemplateTypes,
      params: formatListingRequest<FetchTemplateTypesModel>(request),
      signal: request.signal,
    } as ApiRequest, { root: true })) as ApiResponse<any>;

    return {
      status,
      response: formatListingResponse({
        count: response.length,
        results: response,
      }),
    } as ApiResponse<FetchTemplateTypesResponse>;
  },
  async fetchTemplates({ dispatch }, request = getDefaultListingRequestSource<Template>('id')) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchConstructorTemplates,
      params: formatListingRequest<FetchTemplatesModel>(request),
      signal: request.signal,
    } as ApiRequest, { root: true })) as ApiResponse<any>;

    return {
      status,
      response: formatListingResponse({
        count: response.length,
        results: response,
      }),
    } as ApiResponse<FetchTemplatesResponse>;
  },
  async removeTemplate({ dispatch }, id: RemoveConstructorTemplateModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.removeConstructorTemplate,
      params: {
        id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<RemoveConstructorTemplateResponse>;

    return {
      status,
      response,
    } as ApiResponse<RemoveConstructorTemplateResponse>;
  },
  async updateTemplate({ dispatch }, { id, model }: UpdateConstructorTemplateModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.updateConstructorTemplate,
      params: {
        id,
      },
      data: model,
    } as ApiRequest, { root: true })) as ApiResponse<UpdateConstructorTemplateResponse>;

    return {
      status,
      response,
    } as ApiResponse<UpdateConstructorTemplateResponse>;
  },
  async createTemplate({ dispatch }, data: CreateConstructorTemplateModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.createConstructorTemplate,
      data,
    } as ApiRequest, { root: true })) as ApiResponse<CreateConstructorTemplateResponse>;

    return {
      status,
      response,
    } as ApiResponse<CreateConstructorTemplateResponse>;
  },
  async createTemplateType({ dispatch }, data: CreateConstructorTemplateTypesModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.createConstructorTemplateType,
      data,
    } as ApiRequest, { root: true })) as ApiResponse<CreateConstructorTemplateTypesResponse>;

    return {
      status,
      response,
    } as ApiResponse<CreateConstructorTemplateTypesResponse>;
  },
  async fetchConstructorTemplates({ dispatch }, request = getDefaultListingRequestSource<ConstructorTemplate>('id')) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchConstructorConstructorTemplates,
      params: formatListingRequest<FetchConstructorTemplatesModel>(request),
      signal: request.signal,
    } as ApiRequest, { root: true })) as ApiResponse<any>;

    return {
      status,
      response: formatListingResponse({
        count: response.length,
        results: response,
      }),
    } as ApiResponse<FetchConstructorTemplatesResponse>;
  },
  async fetchConstructorTemplate({ dispatch }, id: FetchConstructorConstructorTemplateModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchConstructorConstructorTemplate,
      params: {
        id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<FetchConstructorConstructorTemplateResponse>;

    return {
      status,
      response,
    } as ApiResponse<FetchConstructorConstructorTemplateResponse>;
  },
  async removeConstructorTemplate({ dispatch }, id: RemoveConstructorConstructorTemplateModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.removeConstructorConstructorTemplate,
      params: {
        id,
      },
    } as ApiRequest, { root: true })) as ApiResponse<RemoveConstructorConstructorTemplateResponse>;

    return {
      status,
      response,
    } as ApiResponse<RemoveConstructorTemplateResponse>;
  },
  async updateConstructorTemplate({ dispatch }, {
    id,
    model,
  }: UpdateConstructorConstructorTemplateModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.updateConstructorConstructorTemplate,
      params: {
        id,
      },
      data: model,
    } as ApiRequest, { root: true })) as ApiResponse<UpdateConstructorConstructorTemplateResponse>;

    return {
      status,
      response,
    } as ApiResponse<UpdateConstructorConstructorTemplateResponse>;
  },
  async createConstructorTemplate({
    dispatch,
  }, model: CreateConstructorConstructorTemplateResponse) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.createConstructorConstructorTemplate,
      data: model,
    } as ApiRequest, { root: true })) as ApiResponse<CreateConstructorConstructorTemplateResponse>;

    return {
      status,
      response,
    } as ApiResponse<CreateConstructorConstructorTemplateResponse>;
  },
  async fetchConstructorVariables({ dispatch }, request = getDefaultListingRequestSource<ConstructorVariableGroup>('id')) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchConstructorVariables,
      params: formatListingRequest<FetchConstructorVariablesModel>(request),
      signal: request.signal,
    } as ApiRequest, { root: true })) as ApiResponse<{
      production_type: ProductionType;
      groups: Array<ConstructorVariableGroup>;
    }>;

    return {
      status,
      response: formatListingResponse({
        count: response.groups.length,
        results: response.groups,
      }),
    } as ApiResponse<FetchConstructorVariablesResponse>;
  },
  async render({ dispatch }, request: ConstructorRenderModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.constructorRender,
      data: request,
    } as ApiRequest, { root: true })) as ApiResponse<ConstructorRenderResponse>;

    return {
      status,
      response,
    } as ApiResponse<ConstructorRenderResponse>;
  },
  async renderDebtorsData({ dispatch }, request: ConstructorRenderDebtorsDataModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.constructorRenderDebtorsData,
      data: request,
    } as ApiRequest, { root: true })) as ApiResponse<ConstructorRenderDebtorsDataResponse>;

    return {
      status,
      response,
    } as ApiResponse<ConstructorRenderDebtorsDataResponse>;
  },
};
