import { useStore } from 'vuex';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiResponse, ListingRequestSource, ListingResponse } from '@/store/modules/api';
import { Company } from '@/hooks/useCompanies';
import { Court } from '@/hooks/useCourts';
import { Debtor } from '@/hooks/useDebtors';

export enum ProductionType {
  pretrial = 'pretrial',
  judicial = 'judicial',
  executive = 'executive'
}

export type TemplateType = {
  id: number;
  name: string;
  description: string;
}

export type FetchTemplateTypesModel = ListingRequestSource<TemplateType>;
export type FetchTemplateTypesResponse = ListingResponse<TemplateType>;

export type CreateConstructorTemplateTypesModel = Omit<TemplateType, 'id'>;
export type CreateConstructorTemplateTypesResponse = TemplateType;

export type Template = {
  id: number;
  template_obj: any;
  production_type: ProductionType;
  company: Company['id'];
  template: TemplateType['id'];
  court: Court['id'];
  regional_court: Court['id'];
  content: string;
  name?: string;
}

export type FetchTemplatesModel = ListingRequestSource<Template>;
export type FetchTemplatesResponse = ListingResponse<Template>;

export type ConstructorTemplate = {
  id: number;
  template_type_obj: any;
  production_type: ProductionType;
  name: string;
  template_type: Template['id'] | null;
  company_owner: Company['id'];
  content: string;
  is_editable: boolean;
}

export type FetchConstructorTemplatesModel = ListingRequestSource<ConstructorTemplate>;
export type FetchConstructorTemplatesResponse = ListingResponse<ConstructorTemplate>;

export type RemoveConstructorTemplateModel = ConstructorTemplate['id'];
export type RemoveConstructorTemplateResponse = null;

export type UpdateConstructorTemplateModel = {
  id: ConstructorTemplate['id'];
  model: Partial<Template>;
};
export type UpdateConstructorTemplateResponse = ConstructorTemplate;

export type CreateConstructorTemplateModel = Partial<Template>;
export type CreateConstructorTemplateResponse = ConstructorTemplate;

export type RemoveConstructorConstructorTemplateModel = Template['id'];
export type RemoveConstructorConstructorTemplateResponse = null;

export type FetchConstructorConstructorTemplateModel = Template['id'];
export type FetchConstructorConstructorTemplateResponse = Template;

export type UpdateConstructorConstructorTemplateModel = {
  id: ConstructorTemplate['id'];
  model: Partial<ConstructorTemplate>;
};
export type UpdateConstructorConstructorTemplateResponse = ConstructorTemplate;

export type CreateConstructorConstructorTemplateModel = Partial<ConstructorTemplate>;
export type CreateConstructorConstructorTemplateResponse = ConstructorTemplate;

export type ConstructorRenderModel = {
  company_id: Company['id'];
  production_type: ProductionType;
  template_type_id: number;
  debtor_ids?: Array<Debtor['pk']>;
  filters?: Record<any, any>;
}
export type ConstructorRenderResponse = {
  document: {
    company: number;
    file: string;
    id: number;
    name: string;
    template: number;
  };
}

export type ConstructorRenderDebtorsDataModel = {
  company_id: Company['id'];
  production_type: ProductionType;
  debtor_ids?: Array<Debtor['pk']>;
  filters?: Record<any, any>;
}
export type ConstructorRenderDebtorsDataResponse = {
  link: string;
}

export type ConstructorVariableGroup = {
  id: number;
  name: string;
  // eslint-disable-next-line no-use-before-define
  vars: Array<ConstructorVariable>;
}

export type ConstructorVariable = {
  id: number;
  production_type: ProductionType;
  name: string;
  description: string;
  var: string;
  is_func: boolean;
  group: ConstructorVariableGroup['id'];
}

export type FetchConstructorVariablesModel = ListingRequestSource<ConstructorVariableGroup>;

export type FetchConstructorVariablesResponse = ListingResponse<ConstructorVariableGroup>;

export const useConstructor = () => {
  const store = useStore();

  const fetchTemplateTypes = async (
    model: FetchTemplateTypesModel,
  ): Promise<ApiResponse<FetchTemplateTypesResponse>> => {
    const { status, response } = await store.dispatch('construct/fetchTemplateTypes', model);

    return { status, response };
  };

  const createTemplateType = async (
    model: CreateConstructorTemplateTypesModel,
  ): Promise<ApiResponse<CreateConstructorTemplateTypesResponse>> => {
    const { status, response } = await store.dispatch('construct/createTemplateType', model);

    return { status, response };
  };

  const fetchTemplates = async (
    model: FetchTemplatesModel,
  ): Promise<ApiResponse<FetchTemplatesResponse>> => {
    const { status, response } = await store.dispatch('construct/fetchTemplates', model);

    return { status, response };
  };

  const removeTemplate = async (
    id: RemoveConstructorTemplateModel,
  ): Promise<ApiResponse<FetchConstructorTemplatesResponse>> => {
    const { status, response } = await store.dispatch('construct/removeTemplate', id);

    return { status, response };
  };

  const updateTemplate = async (
    template: UpdateConstructorTemplateModel,
  ): Promise<ApiResponse<UpdateConstructorTemplateResponse>> => {
    const { status, response } = await store.dispatch('construct/updateTemplate', template);

    return { status, response };
  };

  const createTemplate = async (
    template: CreateConstructorTemplateModel,
  ): Promise<ApiResponse<CreateConstructorTemplateResponse>> => {
    const { status, response } = await store.dispatch('construct/createTemplate', template);

    return { status, response };
  };

  const fetchConstructorTemplates = async (
    model: FetchConstructorTemplatesModel,
  ): Promise<ApiResponse<FetchConstructorTemplatesResponse>> => {
    const { status, response } = await store.dispatch('construct/fetchConstructorTemplates', model);

    return { status, response };
  };

  const removeConstructorTemplate = async (
    id: RemoveConstructorConstructorTemplateModel,
  ): Promise<ApiResponse<FetchConstructorTemplatesResponse>> => {
    const { status, response } = await store.dispatch('construct/removeConstructorTemplate', id);

    return { status, response };
  };

  const fetchConstructorTemplate = async (
    id: FetchConstructorConstructorTemplateModel,
  ): Promise<ApiResponse<FetchConstructorConstructorTemplateResponse>> => {
    const { status, response } = await store.dispatch('construct/fetchConstructorTemplate', id);

    return { status, response };
  };

  const updateConstructorTemplate = async (
    model: UpdateConstructorConstructorTemplateModel,
  ): Promise<ApiResponse<UpdateConstructorConstructorTemplateResponse>> => {
    const { status, response } = await store.dispatch('construct/updateConstructorTemplate', model);

    return { status, response };
  };

  const createConstructorTemplate = async (
    model: CreateConstructorConstructorTemplateModel,
  ): Promise<ApiResponse<CreateConstructorConstructorTemplateResponse>> => {
    const { status, response } = await store.dispatch('construct/createConstructorTemplate', model);

    return { status, response };
  };

  const fetchConstructorVariables = async (
    model: FetchConstructorVariablesModel,
  ): Promise<ApiResponse<FetchConstructorVariablesResponse>> => {
    const { status, response } = await store.dispatch('construct/fetchConstructorVariables', model);

    return { status, response };
  };

  const render = async (
    model: ConstructorRenderModel,
  ) : Promise<ApiResponse<ConstructorRenderResponse>> => {
    const { status, response } = await store.dispatch('construct/render', model);

    return { status, response };
  };

  const renderDebtorsData = async (
    model: ConstructorRenderDebtorsDataModel,
  ) : Promise<ApiResponse<ConstructorRenderDebtorsDataResponse>> => {
    const { status, response } = await store.dispatch('construct/renderDebtorsData', model);

    return { status, response };
  };

  const { t } = useI18n();
  const productionTypes = computed(() => ([
    ProductionType.pretrial,
    ProductionType.judicial,
    ProductionType.executive,
  ].map((value) => ({
    value,
    label: t(`productionType.${value}`),
  }))));

  return {
    createTemplateType,
    fetchTemplateTypes,

    fetchTemplates,
    removeTemplate,
    updateTemplate,
    createTemplate,

    fetchConstructorTemplates,
    removeConstructorTemplate,
    fetchConstructorTemplate,
    updateConstructorTemplate,
    createConstructorTemplate,

    fetchConstructorVariables,

    productionTypes,

    render,
    renderDebtorsData,
  };
};
