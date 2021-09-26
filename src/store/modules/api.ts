import { Module } from 'vuex';
import { StoreState } from '@/store';
import { apiUrl } from '@/utils/env';
import { arrayFrom } from '@/utils/object';
import { Company } from '@/hooks/useCompanies';
import { ActiveFormModel } from '@/hooks/useActiveForm';
import { AccountDocument } from '@/hooks/useAccountDocuments';
import { Court } from '@/hooks/useCourts';
import { DebtorQuery } from '@/hooks/useDebtorsQuery';
import { Bailiff } from '@/hooks/useDebtors';

export const namespaced = true;

export type ApiState = {

}

type ApiModule = Module<ApiState, StoreState>;

// @TODO поделить на домены после заполнения всеми ручками
export enum ApiCommand {
  fetchDebtorStatuses = 'fetchDebtorStatuses',
  signIn = 'signIn',
  signUp = 'signUp',
  doneSignUp = 'doneSignUp',
  signOut = 'signOut',
  fetchAuthData = 'fetchAuthData',
  verify = 'verify',
  restore = 'restore',
  attachmentsList = 'attachmentsList',
  addAttachmentsList = 'addAttachmentsList',
  attachmentsById = 'attachmentsById',
  attachmentsUpdateById = 'attachmentsUpdateById',
  attachmentsDeleteById = 'attachmentsDeleteById',
  getCompanyServices = 'getCompanyServices',
  getCompanyPositions = 'getCompanyPositions',
  addCompanyPositions = 'addCompanyPositions',
  getCompanyPositionsById = 'getCompanyPositionsById',
  updateCompanyPositionById = 'updateCompanyPositionById',
  deleteCompanyPosition = 'deleteCompanyPosition',
  getCompanyServicesByCompanyId = 'getCompanyServicesByCompanyId',
  addCompanyServicesByCompanyId = 'addCompanyServicesByCompanyId',
  getCompanyServicesByServicesId = 'getCompanyServicesByServicesId',
  updateCompanyServicesByServicesId = 'updateCompanyServicesByServicesId',
  deleteCompanyServicesByServicesId = 'deleteCompanyServicesByServicesId',
  getAccountLog = 'getAccountLog',
  deleteAccountLog = 'deleteAccountLog',
  getAccountLogById = 'getAccountLogById',
  getUsersList = 'getUsersList',
  getAccountPosition = 'getAccountPosition',
  addUser = 'addUser',
  getUserCompanyList = 'getUserCompanyList',
  assignCompanyToUser = 'assignCompanyToUser',
  getUserInterfaceSettings = 'getUserInterfaceSettings',
  updateUserInterfaceSettings = 'updateUserInterfaceSettings',
  getUserData = 'getUserData',
  updateUserData= 'updateUserData',
  deleteUser = 'deleteUser',
  getAllUsers = 'getAllUsers',
  dadataBankInfo = 'dadataBankInfo',
  dadataBankInfoInn = 'dadataBankInfoInn',
  getDataFileList = 'getDataFileList',
  getDataFileStatus = 'getDataFileStatus',
  getDataFileStatusByUUID = 'getDataFileStatusByUUID',
  addJudicialStatus = 'addJudicialStatus',
  applyMoveDebtor = 'applyMoveDebtor',
  moveDebtor = 'moveDebtor',
  doneRestore = 'doneRestore',
  changePassword = 'changePassword',
  fetchCompanies = 'fetchCompanies',
  fetchCompany = 'fetchCompany',
  fetchDefaultCompanyId = 'fetchDefaultCompanyId',
  setDefaultCompanyId = 'setDefaultCompanyId',
  addCompany = 'addCompany',
  updateCompany = 'updateCompany',
  fetchEmployees = 'fetchEmployees',
  fetchEmployee = 'fetchEmployee',
  removeCompany = 'removeCompany',
  removeEmployee = 'removeEmployee',
  updateEmployee = 'updateEmployee',
  createEmployee = 'createEmployee',
  fetchAccountDocuments = 'fetchAccountDocuments',
  removeAccountDocument = 'removeAccountDocument',
  updateAccountDocument = 'updateAccountDocument',
  createAccountDocument = 'createAccountDocument',
  fetchEmployeePositions = 'fetchEmployeePositions',
  lookupBik = 'lookupBik',
  lookupInn = 'lookupInn',
  fetchRegions = 'fetchRegions',
  fetchCompanySettings = 'fetchCompanySettings',
  updateCompanySettings = 'updateCompanySettings',
  uploadDataFile = 'uploadDataFile',
  uploadData = 'uploadData',
  fetchMagistrateCourts = 'fetchMagistrateCourts',
  fetchRegionalCourts = 'fetchRegionalCourts',
  fetchBailiffs = 'fetchBailiffs',
  fetchConstructorTemplateTypes = 'fetchConstructorTemplateTypes',
  createConstructorTemplateType = 'createConstructorTemplateType',
  fetchConstructorTemplates = 'fetchConstructorTemplates',
  removeConstructorTemplate = 'removeConstructorTemplate',
  updateConstructorTemplate = 'updateConstructorTemplate',
  createConstructorTemplate = 'createConstructorTemplate',
  fetchConstructorConstructorTemplates = 'fetchConstructorConstructorTemplates',
  fetchConstructorConstructorTemplate = 'fetchConstructorConstructorTemplate',
  removeConstructorConstructorTemplate = 'removeConstructorConstructorTemplate',
  createConstructorConstructorTemplate = 'createConstructorConstructorTemplate',
  updateConstructorConstructorTemplate = 'updateConstructorConstructorTemplate',
  fetchConstructorVariables = 'fetchConstructorVariables',
  fetchDebtors = 'fetchDebtors',
  fetchDebtor = 'fetchDebtor',
  fetchDebtorStatus = 'fetchDebtorStatus',
  createDebtorStatus = 'createDebtorStatus',
  updatePretrialStatus = 'updatePretrialStatus',
  fetchCompanyAttachments = 'fetchCompanyAttachments',
  fetchDefaultAttachments = 'fetchDefaultAttachments',
  generateMergedAttachments = 'generateMergedAttachments',
  createBulkAttachments = 'createBulkAttachments',
  constructorRender = 'constructorRender',
  constructorRenderDebtorsData = 'constructorRenderDebtorsData',
  extractFromEgrn = 'extractFromEgrn',
  sendVoice = 'sendVoice',
  sendSms = 'sendSms',
  sendEmail = 'sendEmail',
  updateDebtorMainInfo = 'updateDebtorMainInfo',
  fetchTenantRelationships = 'fetchTenantRelationships',
  updateTenant = 'updateTenant',
  createTenant = 'createTenant',
  removeTenant = 'removeTenant',
  updateInn = 'updateInn',
  fetchEstateObjectMovements = 'fetchEstateObjectMovements',
  fetchEstateObjectCharachteristics = 'fetchEstateObjectCharachteristics',
  fetchGeneralDocumentsFlow = 'fetchGeneralDocumentsFlow',
  fetchHousebook = 'fetchHousebook',
  fetchEgrnData = 'fetchEgrnData',
  fetchEgrnRights = 'fetchEgrnRights',
  fetchFeePayments = 'fetchFeePayments',
  fetchJudgments = 'fetchJudgments',
  fetchSms = 'fetchSms',
  fetchVoice = 'fetchVoice',
  fetchFnsHistory = 'fetchFnsHistory',
  fetchBankHistory = 'fetchBankHistory',
  fetchWritsOfExecution = 'fetchWritsOfExecution',
  fetchMyDocuments = 'fetchMyDocuments',
  uploadMyDocument = 'uploadMyDocument',
  uploadHousebookDocument = 'uploadHousebookDocument',
  removeMyDocument = 'removeMyDocument',
  fetchCourtCases = 'fetchCourtCases',
  fetchCourtRequisites = 'fetchCourtRequisites',
  updateCourtRequisites = 'updateCourtRequisites',
  refreshWritoe = 'refreshWritoe',
  createWritoe = 'createWritoe',
  fetchFssp = 'fetchFssp',
  fetchStandardizedDebtorAddresses = 'fetchStandardizedDebtorAddresses',
  updateStandardizedDebtorAddress = 'updateStandardizedDebtorAddress',
  setDefaultWritoe = 'setDefaultWritoe',
  fetchCompanyBalance = 'fetchCompanyBalance',
  fetchAvailableServices = 'fetchAvailableServices',
}

export type ApiRequest<T extends Record<any, any> = Record<any, any>> = {
  command: ApiCommand;
  data?: T | Record<string, any>;
  params?: T |Record<string, any>;
  headers?: Record<string, any>;
  signal?: AbortSignal;
  raw?: boolean;
}

export type ApiResponse<T extends any = any> = {
  status: boolean;
  response: T;
}

enum ApiMethod {
  get = 'get',
  post = 'post',
  patch = 'patch',
  put = 'put',
  delete = 'delete',
  options = 'options',
  head = 'head',
}

type ApiCommandsMap = {
  [key in ApiCommand]: {
    method: ApiMethod;
    url: string;
    dataMap?: Record<string, string>;
    paramsMap?: Record<string, string>;
  }
}

export enum OrderDirection {
  asc = 'asc',
  desc = 'desc'
}

export type OrderMap<T extends Record<any, any>> = {
  [key in keyof T]: {
    order: number;
    direction: OrderDirection;
  }
}

export type Order<T extends Record<any, any>> = {
  key: keyof T;
  direction: OrderDirection;
}

export type ListingRequestSource<T extends Record<any, any>> = {
  ordering?: Array<Order<T>>;
  limit: number;
  page: number;
  filters?: ActiveFormModel<T>;
  signal?: AbortSignal;
}

export type ListingRequest<T extends Record<any, any> = Record<any, any>> = {
  ordering: string;
  limit: number;
  offset: number;
} & Partial<{
  [key in keyof T]: string | number;
}>

export type ListingResponse<T extends Record<any, any>> = {
  count: number;
  results: Array<T>;
  total?: Record<Partial<keyof T>, number>;
}

export type ListingParamsMap<T extends Record<any, any>> = (
  Pick<ListingRequest<T>, 'ordering' | 'limit' | 'offset'> & Partial<T>
) & Record<string, string>

const apiCommands: ApiCommandsMap = {
  [ApiCommand.signIn]: {
    method: ApiMethod.post,
    url: '/auth/login/',
    dataMap: {
      user_login: 'login',
      password: 'password',
      demo_role: 'demoRole',
      g_captcha_response: 'captcha',
    },
  },
  [ApiCommand.signUp]: {
    method: ApiMethod.post,
    url: '/api/account/register/',
    dataMap: {
      user_inn: 'intInn',
      inn: 'inn',
      user_phone: 'phone',
      email: 'email',
      password: 'password',
      verification_code: 'code',
      g_captcha_response: 'captcha',
    },
  },
  [ApiCommand.doneSignUp]: {
    method: ApiMethod.put,
    url: '/api/account/register/',
    dataMap: {
      user_inn: 'intInn',
      inn: 'inn',
      user_phone: 'phone',
      email: 'email',
      password: 'password',
      verification_code: 'code',
      user_role: 'role',
    },
  },
  [ApiCommand.signOut]: {
    method: ApiMethod.delete,
    url: '/auth/logout/',
  },
  [ApiCommand.fetchAuthData]: {
    method: ApiMethod.get,
    url: '/api/account/users/{id}/',
  },
  [ApiCommand.verify]: {
    method: ApiMethod.post,
    url: '/api/account/verificate/',
    dataMap: {
      inn: 'inn',
      user_phone: 'phone',
      email: 'email',
      verification_code: 'code',
    },
  },
  [ApiCommand.restore]: {
    method: ApiMethod.post,
    url: '/api/account/restore/',
    dataMap: {
      user_phone: 'phone',
      email: 'email',
      g_captcha_response: 'captcha',
    },
  },
  [ApiCommand.doneRestore]: {
    method: ApiMethod.put,
    url: '/api/account/restore/',
    dataMap: {
      user_phone: 'phone',
      email: 'email',
      verification_code: 'code',
      password: 'password',
    },
  },
  [ApiCommand.changePassword]: {
    method: ApiMethod.patch,
    url: '/api/account/user/password/{id}/',
    dataMap: {
      password: 'password',
      old_password: 'oldPassword',
    },
  },
  [ApiCommand.fetchCompanies]: {
    method: ApiMethod.get,
    url: '/api/account/company/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
      name_full: 'name_full',
      name_short: 'name_short',
      inn: 'inn',
      legal_address: 'legal_address',
    } as {
      [key in keyof ListingParamsMap<Company>]: string
    },
  },
  [ApiCommand.fetchRegions]: {
    method: ApiMethod.get,
    url: '/api/common/region/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.fetchEmployees]: {
    method: ApiMethod.get,
    url: '/api/account/employee/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
      company_id: 'company_id',
    } as {
      [key in keyof ListingParamsMap<Company>]: string
    },
  },
  [ApiCommand.fetchEmployee]: {
    method: ApiMethod.get,
    url: '/api/account/employee/{id}/',
    paramsMap: {
      company_id: 'company_id',
    },
  },
  [ApiCommand.fetchDefaultCompanyId]: {
    method: ApiMethod.get,
    url: '/api/account/user/active-company/{id}/',
  },
  [ApiCommand.updateCompany]: {
    method: ApiMethod.patch,
    url: '/api/account/company/{id}/',
    dataMap: {
      email: 'email',
      representative_power_attorney: 'representative_power_attorney',
      email_buh: 'email_buh',
      postal_address_zip_code: 'postal_address_zip_code',
      site: 'site',
      type_peni_calculation: 'type_peni_calculation',
      ras_schet: 'ras_schet',
      taxation_system: 'taxation_system',
      kor_schet: 'kor_schet',
      bic: 'bic',
      phone: 'phone',
      timezone: 'timezone',
      fax: 'fax',
      physical_address: 'physical_address',
      full_name_bank: 'full_name_bank',
    },
  },
  [ApiCommand.updateEmployee]: {
    method: ApiMethod.patch,
    url: '/api/account/employee/{id}/',
    dataMap: {
      email: 'email',
      user_phone: 'user_phone',
      first_name: 'first_name',
      last_name: 'last_name',
      linked_companies: 'linked_companies',
      user_role: 'user_role',
      employee_role: 'employee_role',
      position: 'position',
    },
    paramsMap: {
      company_id: 'company_id',
    },
  },
  [ApiCommand.updateCompanySettings]: {
    method: ApiMethod.patch,
    url: '/api/account/company-settings/{id}/',
    dataMap: {
      debt_threshold: 'debt_threshold',
      court_threshold: 'court_threshold',
      wait_days_before_court: 'wait_days_before_court',
      wait_days_before_notify: 'wait_days_before_notify',
      notification_period: 'notification_period',
      sms_enabled: 'sms_enabled',
      voice_enabled: 'voice_enabled',
      sms_priority: 'sms_priority',
      failed_attempts: 'failed_attempts',
      notification_shedule_days: 'notification_shedule_days',
      notification_shedule_wdays: 'notification_shedule_wdays',
      sms_operator_uuid: 'sms_operator_uuid',
      voice_operator_uuid: 'voice_operator_uuid',
      kvint_id: 'kvint_id',
      automation_enabled: 'automation_enabled',
      timezone: 'timezone',
      sms_attempts: 'sms_attempts',
      call_attempts: 'call_attempts',
      retries_count: 'retries_count',
      auto_discharge: 'auto_discharge',
      discharge_type: 'discharge_type',
      discharge_periodic_month: 'discharge_periodic_month',
      max_discharges_per_day: 'max_discharges_per_day',
      amount_from: 'amount_from',
      amount_to: 'amount_to',
      notify_emails: 'notify_emails',
      send_type: 'send_type',
      need_rosreestr_discharge: 'need_rosreestr_discharge',
      amount_setting: 'amount_setting',
      payment_of_duties: 'payment_of_duties',
      auto_filing_claim: 'auto_filing_claim',
      auto_change_status: 'auto_change_status',
      debtor_data_registry_receiver_name: 'debtor_data_registry_receiver_name',
      debtor_data_registry_payment_name: 'debtor_data_registry_payment_name',
      debtor_data_registry_columns_order: 'debtor_data_registry_columns_order',
      company: 'company',
      default_region: 'default_region',
    },
  },
  [ApiCommand.setDefaultCompanyId]: {
    method: ApiMethod.patch,
    url: '/api/account/user/active-company/{id}/',
    dataMap: {
      default_company: 'companyId',
    },
  },
  [ApiCommand.addCompany]: {
    method: ApiMethod.post,
    url: '/api/account/company/',
    dataMap: {
      inn: 'inn',
    },
  },
  [ApiCommand.fetchCompany]: {
    method: ApiMethod.get,
    url: '/api/account/company/{id}/',
  },
  [ApiCommand.fetchCompanySettings]: {
    method: ApiMethod.get,
    url: '/api/account/company-settings/{id}/',
  },
  [ApiCommand.removeCompany]: {
    method: ApiMethod.delete,
    url: '/api/account/company/{id}/',
  },
  [ApiCommand.removeEmployee]: {
    method: ApiMethod.delete,
    url: '/api/account/employee/{id}/',
    paramsMap: {
      company_id: 'company_id',
    },
  },
  [ApiCommand.createEmployee]: {
    method: ApiMethod.post,
    url: '/api/account/employee/',
    dataMap: {
      email: 'email',
      user_phone: 'user_phone',
      first_name: 'first_name',
      last_name: 'last_name',
      linked_companies: 'linked_companies',
      user_role: 'user_role',
      employee_role: 'employee_role',
      position: 'position',
    },
  },
  [ApiCommand.fetchAccountDocuments]: {
    method: ApiMethod.get,
    url: '/api/account/document/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
      company_id: 'company_id',
      klass_not: 'klass_not',
      klass: 'klass',
      production_type: 'production_type',
    } as {
      [key in keyof ListingParamsMap<AccountDocument>]: string
    },
  },
  [ApiCommand.removeAccountDocument]: {
    method: ApiMethod.delete,
    url: '/api/account/document/{id}/',
  },
  [ApiCommand.createAccountDocument]: {
    method: ApiMethod.post,
    url: '/api/account/document/',
    dataMap: {
      name: 'name',
      description: 'description',
      yandex_url: 'yandex_url',
      can_be_attached: 'can_be_attached',
      klass: 'klass',
      signer: 'signer',
      signer_name: 'signer_name',
      company: 'company',
      readable_path: 'readable_path',
      file: 'file',
    },
  },
  [ApiCommand.updateAccountDocument]: {
    method: ApiMethod.patch,
    url: '/api/account/document/{id}/',
    dataMap: {
      name: 'name',
      description: 'description',
      yandex_url: 'yandex_url',
      can_be_attached: 'can_be_attached',
      klass: 'klass',
      signer: 'signer',
      signer_name: 'signer_name',
    },
  },
  [ApiCommand.fetchEmployeePositions]: {
    method: ApiMethod.get,
    url: '/api/account/company/{id}/positions/',
  },
  [ApiCommand.lookupBik]: {
    method: ApiMethod.post,
    url: '/lookup/bik/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
    dataMap: {
      bik: 'bik',
    },
  },
  [ApiCommand.lookupInn]: {
    method: ApiMethod.post,
    url: '/lookup/inn/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
    dataMap: {
      query: 'query',
      count: 'count',
    },
  },
  [ApiCommand.uploadData]: {
    method: ApiMethod.post,
    url: '/api/datafile/upload/',
    dataMap: {
      uuid: 'uuid',
      company: 'company',
      name: 'name',
      last: 'last',
      year: 'year',
      month: 'month',
      region: 'region',
      module: 'module',
      mode: 'mode',
      demo: 'demo',
      file: 'file',
    },
  },
  [ApiCommand.uploadDataFile]: {
    method: ApiMethod.post,
    url: '/api/datafile/file/',
    dataMap: {
      uuid: 'uuid',
      task_uuid: 'task_uuid',
      company: 'company',
      name: 'name',
      last: 'last',
      demo: 'demo',
      payload: 'payload',
      file: 'file',
    },
  },
  [ApiCommand.fetchMagistrateCourts]: {
    method: ApiMethod.get,
    url: '/reference_books/magistrate_court_place/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
      company_id: 'company_id',
      name: 'name',
      production_type: 'production_type',
    } as {
      [key in keyof ListingParamsMap<Court>]: string
    },
  },
  [ApiCommand.fetchRegionalCourts]: {
    method: ApiMethod.get,
    url: '/reference_books/regional_court_place/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
      company_id: 'company_id',
      name: 'name',
      production_type: 'production_type',
    } as {
      [key in keyof ListingParamsMap<Court>]: string
    },
  },
  [ApiCommand.fetchBailiffs]: {
    method: ApiMethod.get,
    url: '/reference_books/bailiff_place/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
      company_id: 'company_id',
      name: 'name',
    } as {
      [key in keyof ListingParamsMap<Bailiff>]: string
    },
  },
  [ApiCommand.fetchConstructorTemplateTypes]: {
    method: ApiMethod.get,
    url: '/constructor/template_type/',
    paramsMap: {
      template: 'template',
      name: 'name',
      o: 'o', // так указано в свагере
    },
  },
  [ApiCommand.fetchConstructorTemplates]: {
    method: ApiMethod.get,
    url: '/constructor/company/template/',
    paramsMap: {
      company_id: 'company_id',
      production_type: 'production_type',
      template: 'template',
      name: 'name',
      template_company_owner_id: 'template_company_owner_id',
      o: 'o',
    },
  },
  [ApiCommand.removeConstructorTemplate]: {
    method: ApiMethod.delete,
    url: '/constructor/company/template/{id}/',
  },
  [ApiCommand.updateConstructorTemplate]: {
    method: ApiMethod.patch,
    url: '/constructor/company/template/{id}/',
    dataMap: {
      template: 'template',
      production_type: 'production_type',
      court: 'court',
      regional_court: 'regional_court',
    },
  },
  [ApiCommand.createConstructorTemplate]: {
    method: ApiMethod.post,
    url: '/constructor/company/template/',
    dataMap: {
      production_type: 'production_type',
      template: 'template',
      court: 'court',
      regional_court: 'regional_court',
    },
  },
  [ApiCommand.createConstructorTemplateType]: {
    method: ApiMethod.post,
    url: '/constructor/template_type/',
    dataMap: {
      name: 'name',
      description: 'description',
    },
  },
  [ApiCommand.fetchConstructorConstructorTemplates]: {
    method: ApiMethod.get,
    url: '/constructor/template/',
    paramsMap: {
      template_type: 'template_type',
      company_owner: 'company_owner',
      production_type: 'production_type',
      company_id: 'company_id',
      name: 'name',
      o: 'o',
    },
  },
  [ApiCommand.fetchConstructorConstructorTemplate]: {
    method: ApiMethod.get,
    url: '/constructor/template/{id}/',
  },
  [ApiCommand.removeConstructorConstructorTemplate]: {
    method: ApiMethod.delete,
    url: '/constructor/template/{id}/',
  },
  [ApiCommand.createConstructorConstructorTemplate]: {
    method: ApiMethod.post,
    url: '/constructor/template/',
    dataMap: {
      production_type: 'production_type',
      name: 'name',
      content: 'content',
      template_type: 'template_type',
    },
  },
  [ApiCommand.updateConstructorConstructorTemplate]: {
    method: ApiMethod.patch,
    url: '/constructor/template/{id}/',
    dataMap: {
      production_type: 'production_type',
      name: 'name',
      content: 'content',
      template_type: 'template_type',
    },
  },
  [ApiCommand.fetchConstructorVariables]: {
    method: ApiMethod.get,
    url: '/constructor/vars',
    paramsMap: {
      production_type: 'production_type',
    },
  },
  [ApiCommand.fetchDebtors]: {
    method: ApiMethod.get,
    url: '/api/debtors-data/',
    paramsMap: {
      pk_more: 'pk_more',
      pk_less: 'pk_less',
      o: 'ordering',
      limit: 'limit',
      offset: 'offset',
      production_type: 'production_type',
      company_id: 'company_id',
      full_name: 'full_name',
      address: 'address',
      phone_number: 'phone_number',
      personal_account: 'personal_account',
      debtor_debt_min: 'debtor_debt_min',
      debtor_debt_max: 'debtor_debt_max',
      case_number: 'case_number',
      serial_number: 'serial_number',
      status_name: 'status_name',
      has_sms: 'has_sms',
      has_voice: 'has_voice',
      magistrate_court_id: 'magistrate_court_id',
      regional_court_id: 'regional_court_id',
      substatus_name: 'substatus_name',
      has_writ_of_execution: 'has_writ_of_execution',
      bailiff_id: 'bailiff_id',
      fee_status: 'fee_status',
    } as {
      [key in keyof Partial<ListingParamsMap<DebtorQuery>>]: string
    },
  },
  [ApiCommand.fetchDebtor]: {
    method: ApiMethod.get,
    url: '/api/debtors-data/{id}/',
    paramsMap: {
      company_id: 'company_id',
      production_type: 'production_type',
    } as {
      [key in keyof DebtorQuery]: string
    },
  },
  [ApiCommand.fetchDebtorStatuses]: {
    method: ApiMethod.get,
    url: '/debtor_status/consts',
  },
  [ApiCommand.fetchDebtorStatus]: {
    method: ApiMethod.get,
    url: '/debtor_status/',
    paramsMap: {
      debtor_id: 'id',
    },
  },
  [ApiCommand.createDebtorStatus]: {
    method: ApiMethod.post,
    url: '/debtor_status/',
    dataMap: {
      new_substatus: 'new_substatus',
      new_substatus_label: 'new_substatus_label',
      production_type: 'production_type',
      status: 'status',
      debtor: 'debtor',
    },
  },
  [ApiCommand.updatePretrialStatus]: {
    method: ApiMethod.post,
    url: '/pretrial/debtor/{id}/debtor_status/',
    dataMap: {
      status: 'status',
      substatus: 'substatus',
    },
  },
  [ApiCommand.attachmentsList]: {
    method: ApiMethod.get,
    url: '/api/account/attachment/',
  },
  [ApiCommand.addAttachmentsList]: {
    method: ApiMethod.post,
    url: '/api/account/attachment/',
    dataMap: {
      name: 'name',
      company: 'company',
      document: 'document',
    },
  },
  [ApiCommand.attachmentsById]: {
    method: ApiMethod.get,
    url: '/api/account/attachment/{id}/',
  },
  [ApiCommand.attachmentsUpdateById]: {
    method: ApiMethod.patch,
    url: '/api/account/attachment/{id}/',
    dataMap: {
      name: 'name',
      document: 'document',
    },
  },
  [ApiCommand.attachmentsDeleteById]: {
    method: ApiMethod.delete,
    url: '/api/account/attachment/{id}/',
  },
  [ApiCommand.getCompanyServices]: {
    method: ApiMethod.get,
    url: '/api/account/company-services/',
    paramsMap: {
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.getCompanyPositions]: {
    method: ApiMethod.get,
    url: '/api/account/company/{company_id}/positions/',
  },
  [ApiCommand.addCompanyPositions]: {
    method: ApiMethod.post,
    url: '/api/account/company/{company_id}/positions/',
    dataMap: {
      name: 'name',
      sort_order: 'sort_order',
    },
  },
  [ApiCommand.getCompanyPositionsById]: {
    method: ApiMethod.get,
    url: '/api/account/company/{company_id}/positions/{id}/',
  },
  [ApiCommand.updateCompanyPositionById]: {
    method: ApiMethod.patch,
    url: '/api/account/company/{company_id}/positions/{id}/',
    dataMap: {
      name: 'name',
      sort_order: 'sort_order',
    },
  },
  [ApiCommand.deleteCompanyPosition]: {
    method: ApiMethod.delete,
    url: '/api/account/company/{company_id}/positions/{id}/',
  },
  [ApiCommand.getCompanyServicesByCompanyId]: {
    method: ApiMethod.get,
    url: '/api/account/company/{company_id}/services/',
  },
  [ApiCommand.addCompanyServicesByCompanyId]: {
    method: ApiMethod.post,
    url: '/api/account/company/{company_id}/services/',
    dataMap: {
      name: 'name',
      sort_order: 'sort_order',
    },
  },
  [ApiCommand.getCompanyServicesByServicesId]: {
    method: ApiMethod.get,
    url: '/api/account/company/{company_id}/services/{id}/',
  },
  [ApiCommand.updateCompanyServicesByServicesId]: {
    method: ApiMethod.patch,
    url: '/api/account/company/{company_id}/services/{id}/',
    dataMap: {
      name: 'name',
      sort_order: 'sort_order',
    },
  },
  [ApiCommand.deleteCompanyServicesByServicesId]: {
    method: ApiMethod.delete,
    url: '/api/account/company/{company_id}/services/{id}/',
  },
  [ApiCommand.getAccountLog]: {
    method: ApiMethod.get,
    url: '/api/account/log/',
    paramsMap: {
      user_id: 'user_id',
      action: 'action',
      company_id: 'company_id',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.getAccountLogById]: {
    method: ApiMethod.get,
    url: '/api/account/log/{id}/',
  },
  [ApiCommand.deleteAccountLog]: {
    method: ApiMethod.delete,
    url: '/api/account/log/{id}/',
  },
  [ApiCommand.getAccountPosition]: {
    method: ApiMethod.get,
    url: '/api/account/position/',
    paramsMap: {
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.getUsersList]: {
    method: ApiMethod.get,
    url: '/api/account/user/',
  },
  [ApiCommand.addUser]: {
    method: ApiMethod.post,
    url: '/api/account/user/',
    dataMap: {
      email: 'email',
      user_phone: 'user_phone',
      password: 'password',
      inn: 'inn',
      first_name: 'first_name',
      last_name: 'last_name',
    },
  },
  [ApiCommand.getUserCompanyList]: {
    method: ApiMethod.get,
    url: '/api/account/user/companies/{id}/',
  },
  [ApiCommand.assignCompanyToUser]: {
    method: ApiMethod.patch,
    url: '/api/account/user/companies/{id}/',
    dataMap: {
      linked_companies: 'linked_companies',
    },
  },
  [ApiCommand.getUserInterfaceSettings]: {
    method: ApiMethod.get,
    url: '/api/account/user/prefs/{id}/',
  },
  [ApiCommand.updateUserInterfaceSettings]: {
    method: ApiMethod.patch,
    url: '/api/account/user/prefs/{id}/',
    dataMap: {
      debtor_per_page: 'debtor_per_page',
      preference_formats: 'preference_formats',
      preference_time: 'preference_time',
      interface_preferences: 'interface_preferences',
      first_name: 'first_name',
      last_name: 'last_name',
    },
  },
  [ApiCommand.getUserData]: {
    method: ApiMethod.get,
    url: '/api/account/user/{id}/',
  },
  [ApiCommand.updateUserData]: {
    method: ApiMethod.patch,
    url: '/api/account/user/{id}/',
    dataMap: {
      first_name: 'first_name',
      last_name: 'last_name',
      user_role: 'user_role',
    },
  },
  [ApiCommand.deleteUser]: {
    method: ApiMethod.delete,
    url: '/api/account/user/{id}/',
  },
  [ApiCommand.getAllUsers]: {
    method: ApiMethod.get,
    url: '/api/account/users/',
  },
  [ApiCommand.dadataBankInfo]: {
    method: ApiMethod.post,
    url: '/api/dadata/bank/',
    dataMap: {
      bik: 'bik',
    },
  },
  [ApiCommand.dadataBankInfoInn]: {
    method: ApiMethod.post,
    url: '/api/dadata/inn/',
    dataMap: {
      bik: 'bik',
    },
  },
  [ApiCommand.getDataFileList]: {
    method: ApiMethod.get,
    url: '/api/datafile/list/',
  },
  [ApiCommand.getDataFileStatus]: {
    method: ApiMethod.get,
    url: '/api/datafile/status/',
  },
  [ApiCommand.getDataFileStatusByUUID]: {
    method: ApiMethod.get,
    url: '/api/datafile/status/{uuid}/',
  },
  [ApiCommand.addJudicialStatus]: {
    method: ApiMethod.post,
    url: '/api/debtors-data/judicial/status/',
    dataMap: {
      debtor_ids: 'debtor_ids',
      company_id: 'company_id',
      status: 'status',
    },
  },
  [ApiCommand.moveDebtor]: {
    method: ApiMethod.post,
    url: '/api/debtors-data/move/',
    dataMap: {
      ids: 'ids',
      production_type: 'production_type',
    },
  },
  [ApiCommand.applyMoveDebtor]: {
    method: ApiMethod.post,
    url: '/api/debtors-data/move/confirm/',
    dataMap: {
      ids: 'ids',
      move_id: 'move_id',
    },
  },
  [ApiCommand.fetchCompanyAttachments]: {
    method: ApiMethod.get,
    url: '/document_attachments/company/',
    paramsMap: {
      company_id: 'companyId',
      production_type: 'productionType',
    },
  },
  [ApiCommand.fetchDefaultAttachments]: {
    method: ApiMethod.get,
    url: '/document_attachments/defaults/',
  },
  [ApiCommand.generateMergedAttachments]: {
    method: ApiMethod.post,
    url: '/document_attachments/generate_merged/',
    dataMap: {
      production_type: 'production_type',
      company_id: 'company_id',
      date_from: 'date_from',
      date_to: 'date_to',
      moratorium_enabled: 'moratorium_enabled',
      court_id: 'court_id',
      regional_court_id: 'regional_court_id',
      services: 'services',
      encrypt: 'encrypt',
      debtor_ids: 'debtor_ids',
      filters: 'filters',
    },
  },
  [ApiCommand.createBulkAttachments]: {
    method: ApiMethod.post,
    url: '/document_attachments/company_bulk_create/',
    dataMap: {
      company_id: 'company_id',
      production_type: 'production_type',
      attachments: 'attachments',
    },
  },
  [ApiCommand.constructorRender]: {
    method: ApiMethod.post,
    url: '/constructor/render',
  },
  [ApiCommand.constructorRenderDebtorsData]: {
    method: ApiMethod.post,
    url: '/constructor/debtors-data',
  },
  [ApiCommand.extractFromEgrn]: {
    method: ApiMethod.post,
    url: '/rosreestr/status/',
  },
  [ApiCommand.sendVoice]: {
    method: ApiMethod.post,
    url: '/pretrial/voice/',
  },
  [ApiCommand.sendSms]: {
    method: ApiMethod.post,
    url: '/pretrial/sms/',
  },
  [ApiCommand.sendEmail]: {
    method: ApiMethod.post,
    url: '/pretrial/email/',
  },
  [ApiCommand.updateDebtorMainInfo]: {
    method: ApiMethod.patch,
    url: '/debtor/main_profile/{id}/',
  },
  [ApiCommand.fetchTenantRelationships]: {
    method: ApiMethod.get,
    url: '/debtor/tenant/relationship/choices',
  },
  [ApiCommand.updateTenant]: {
    method: ApiMethod.patch,
    url: '/debtor/tenant/{id}/',
  },
  [ApiCommand.createTenant]: {
    method: ApiMethod.post,
    url: '/debtor/tenant/',
  },
  [ApiCommand.removeTenant]: {
    method: ApiMethod.delete,
    url: '/debtor/tenant/{id}/',
  },
  [ApiCommand.updateInn]: {
    method: ApiMethod.post,
    url: '/debtor/update-inn/',
  },
  [ApiCommand.fetchEstateObjectMovements]: {
    method: ApiMethod.get,
    url: '/rosreestr/estate_object_ownership_movement/groupped',
    paramsMap: {
      debtor_id: 'debtor_id',
      active: 'active',
    },
  },
  [ApiCommand.fetchEstateObjectCharachteristics]: {
    method: ApiMethod.get,
    url: '/rosreestr/estate_objects_characteristics/',
    paramsMap: {
      debtor_id: 'debtor_id',
      active: 'active',
    },
  },
  [ApiCommand.fetchGeneralDocumentsFlow]: {
    method: ApiMethod.get,
    url: '/documents/general_document_flow/',
    paramsMap: {
      debtor_id: 'debtor_id',
      production_type: 'production_type',
      o: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.fetchHousebook]: {
    method: ApiMethod.get,
    url: '/documents/extract_house_book/',
    paramsMap: {
      debtor_id: 'debtor_id',
      o: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.fetchEgrnData]: {
    method: ApiMethod.get,
    url: '/documents/extract_from_egrn/',
    paramsMap: {
      debtor_id: 'debtor_id',
      o: 'ordering',
      limit: 'limit',
      offset: 'offset',
      fetch_reason_list: 'fetch_reason_list',
    },
  },
  [ApiCommand.fetchEgrnRights]: {
    method: ApiMethod.get,
    url: '/documents/extract_from_egrn_transfer_of_rights/',
    paramsMap: {
      debtor_id: 'debtor_id',
      o: 'ordering',
      limit: 'limit',
      offset: 'offset',
      fetch_reason_list: 'fetch_reason_list',
    },
  },
  [ApiCommand.fetchFeePayments]: {
    method: ApiMethod.get,
    url: '/judicial/debtor/{debtor_id}/payments/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.fetchJudgments]: {
    method: ApiMethod.get,
    url: '/judicial/debtor/{debtor_id}/decisions/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.fetchSms]: {
    method: ApiMethod.get,
    url: '/pretrial/debtor/{debtor_id}/sms/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.fetchVoice]: {
    method: ApiMethod.get,
    url: '/pretrial/debtor/{debtor_id}/voice/',
    paramsMap: {
      ordering: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.fetchFnsHistory]: {
    method: ApiMethod.get,
    url: '/enforcements/executive_fns_history/',
    paramsMap: {
      debtor_id: 'debtor_id',
      o: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.fetchBankHistory]: {
    method: ApiMethod.get,
    url: '/enforcements/executive_bank_history/',
    paramsMap: {
      debtor_id: 'debtor_id',
      o: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.fetchWritsOfExecution]: {
    method: ApiMethod.get,
    url: '/enforcements/writ_of_execution/',
    paramsMap: {
      debtor_id: 'debtor_id',
      o: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.fetchMyDocuments]: {
    method: ApiMethod.get,
    url: '/documents/debtor/',
    paramsMap: {
      debtor_id: 'debtor_id',
      o: 'ordering',
      limit: 'limit',
      offset: 'offset',
    },
  },
  [ApiCommand.uploadMyDocument]: {
    method: ApiMethod.post,
    url: '/documents/debtor/',
  },
  [ApiCommand.uploadHousebookDocument]: {
    method: ApiMethod.post,
    url: '/documents/extract_house_book/',
  },
  [ApiCommand.removeMyDocument]: {
    method: ApiMethod.delete,
    url: '/documents/debtor/{id}/',
  },
  [ApiCommand.fetchCourtCases]: {
    method: ApiMethod.get,
    url: '/reference_books/court_cases_history/',
    paramsMap: {
      company_id: 'company_id',
      debtor: 'debtor',
      id: 'id',
    },
  },
  [ApiCommand.fetchCourtRequisites]: {
    method: ApiMethod.get,
    url: '/reference_books/{type}_court_place/{id}/',
  },
  [ApiCommand.updateCourtRequisites]: {
    method: ApiMethod.patch,
    url: '/reference_books/{type}_court_place/{id}/',
  },
  [ApiCommand.refreshWritoe]: {
    method: ApiMethod.patch,
    url: '/executive/writoe/{id}/writoe_refresh/',
  },
  [ApiCommand.createWritoe]: {
    method: ApiMethod.post,
    url: '/executive/debtor/{id}/writoe/',
  },
  [ApiCommand.fetchFssp]: {
    method: ApiMethod.get,
    url: '/executive/debtor/{id}/fssp/',
    paramsMap: {
      production_date: 'production_date',
      ordering: 'ordering',
      offset: 'offset',
      limit: 'limit',
    },
  },
  [ApiCommand.fetchStandardizedDebtorAddresses]: {
    method: ApiMethod.get,
    url: '/debtor/standardizeddebtoraddress/{id}/',
  },
  [ApiCommand.updateStandardizedDebtorAddress]: {
    method: ApiMethod.put,
    url: '/debtor/standardizeddebtoraddress/{id}/',
  },
  [ApiCommand.setDefaultWritoe]: {
    method: ApiMethod.patch,
    url: '/enforcements/writoe/{id}/default/',
  },
  [ApiCommand.fetchCompanyBalance]: {
    method: ApiMethod.get,
    url: '/api/finance/balance/{id}/',
  },
  [ApiCommand.fetchAvailableServices]: {
    method: ApiMethod.get,
    url: '/api/finance/service/{company_id}/available/',
    paramsMap: {
      o: 'o',
      limit: 'limit',
    },
  },
};

export const actions: ApiModule['actions'] = {
  async request({ rootGetters }, request: ApiRequest) {
    // @TODO уберём после отлова ошибок
    // eslint-disable-next-line no-useless-catch
    try {
      const command = apiCommands[request.command];
      const url = new URL(apiUrl);
      url.pathname = url.pathname.substr(1)
        + Object.entries(request.params || {}).reduce((acc, [field, value]) => (
          acc.replace(new RegExp(`{${field}}`, 'g'), value)
        ), command.url);

      url.search = new URLSearchParams(
        Object.entries(command.paramsMap || {})
          .filter(([, field]) => request.params?.[field] ?? false)
          .reduce((acc, [apiField, field]) => ({
            ...acc,
            [apiField]: request.params?.[field],
          }), {}),
      ).toString();

      const data = request.data ? (
        'dataMap' in command ? (
          Object.entries(command.dataMap || {})
            .filter(([, field]) => request.data?.[field] ?? false)
            .reduce((acc, [apiField, field]) => ({
              ...acc,
              [apiField]: request.data?.[field],
            }), {})
        ) : request.data
      ) : undefined;

      let body: string | FormData;
      if ((request.headers?.['Content-Type'] === 'multipart/form-data') && data) {
        body = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          (body as FormData).append(key, value);
        });
      } else {
        body = JSON.stringify(data);
      }

      const headers = {
        ...request.headers || {},
      };
      if (headers?.['Content-Type'] === 'multipart/form-data') {
        delete headers['Content-Type'];
      } else {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      }

      const token = rootGetters['user/token']?.token;
      const req = await fetch(url.toString(), {
        method: command.method.toUpperCase(),
        signal: request.signal,
        headers: {
          ...headers,
          ...([null, undefined, 'undefined'].includes(token) ? {

          } : {
            'X-Auth-Token': token,
          }),
        },
        body,
      });

      const status = arrayFrom(({
        [ApiMethod.get]: 200,
        [ApiMethod.post]: [200, 201],
        [ApiMethod.patch]: 200,
        [ApiMethod.put]: 200,
        [ApiMethod.delete]: [204, 200],
        [ApiMethod.options]: 200,
      } as {[key in ApiMethod]: number | number[]})[command.method]).includes(req.status);

      try {
        const response = await req.json();
        return {
          status,
          response,
        };
      } catch (e) {
        return {
          status,
          response: null,
        };
      }
    } catch (e) {
      // @TODO отследить ошибки запросов
      throw e;
    }
  },
};
