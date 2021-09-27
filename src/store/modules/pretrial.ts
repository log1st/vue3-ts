import { Module } from 'vuex';
import { StoreState } from '@/store';
import { ApiCommand, ApiRequest, ApiResponse } from '@/store/modules/api';
import {
  EmailModel,
  EmailResponse,
  SmsModel,
  SmsResponse,
  VoiceModel,
  VoiceResponse,
} from '@/hooks/usePretrial';

// eslint-disable-next-line @typescript-eslint/ban-types
export type PretrialState = {}

type PretrialModule = Module<PretrialState, StoreState>;

export const namespaced = true;

export const actions: PretrialModule['actions'] = {
  async sendSms({ dispatch }, request: SmsModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.sendSms,
      data: request,
    } as ApiRequest, { root: true })) as ApiResponse<SmsResponse>;

    return {
      status,
      response,
    };
  },
  async sendVoice({ dispatch }, request: VoiceModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.sendVoice,
      data: request,
    } as ApiRequest, { root: true })) as ApiResponse<VoiceResponse>;

    return {
      status,
      response,
    };
  },
  async sendEmail({ dispatch }, request: EmailModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.sendEmail,
      data: request,
    } as ApiRequest, { root: true })) as ApiResponse<EmailResponse>;

    return {
      status,
      response,
    };
  },
};
