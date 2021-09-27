import { useStore } from 'vuex';
import { ApiResponse } from '@/store/modules/api';
import { Company } from '@/hooks/useCompanies';
import { ProductionType } from '@/hooks/useConstructor';
import { Debtor } from '@/hooks/useDebtors';

export type EmailModel = {
  company: Company['id'];
  productionType: ProductionType;
  payload?: Array<Debtor['pk']>;
  filters?: Record<any, any>;
}
export type EmailResponse = {
  task_uuid: number;
}

export type SmsModel = {
  company: Company['id'];
  productionType: ProductionType;
  payload?: Array<Debtor['pk']>;
  filters?: Record<any, any>;
}
export type SmsResponse = {
  task_uuid: number;
}

export type VoiceModel = {
  company: Company['id'];
  productionType: ProductionType;
  payload?: Array<Debtor['pk']>;
  filters?: Record<any, any>;
}
export type VoiceResponse = {
  task_uuid: number;
}

export const usePretrial = () => {
  const store = useStore();

  const sendSms = async (payload: SmsModel): Promise<ApiResponse<SmsResponse>> => {
    const { status, response } = await store.dispatch('pretrial/sendSms', payload);

    return { status, response };
  };

  const sendEmail = async (payload: SmsModel): Promise<ApiResponse<SmsResponse>> => {
    const { status, response } = await store.dispatch('pretrial/sendEmail', payload);

    return { status, response };
  };

  const sendVoice = async (payload: SmsModel): Promise<ApiResponse<SmsResponse>> => {
    const { status, response } = await store.dispatch('pretrial/sendVoice', payload);

    return { status, response };
  };

  return {
    sendSms,
    sendEmail,
    sendVoice,
  };
};
