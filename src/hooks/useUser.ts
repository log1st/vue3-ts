import { useStore } from 'vuex';
import { computed } from 'vue';
import { ApiResponse } from '@/store/modules/api';

export type UserToken = {
  token: string;
  validUntil: Date;
};

export enum UserRole {
  company= 'company',
  judge = 'judge',
  bailiff = 'bailiff',
}

export type UserData = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_role: UserRole;
  is_active: boolean;
  is_staff: boolean;
  is_demo: boolean;
  master: null;
}

export type RegistrationData = {
  inn: string;
  email?: string;
  phone?: string;
  code?: string;
}

export type SignInModel = {
  login?: string;
  password?: string;
  agreement?: boolean;
  demoRole?: UserRole;
  captcha?: string;
}

export type SignInResponse = {
  auth_token: string;
  id: number;
  demo: boolean;
  valid_till: string;
  detail: string;
  agreement: string;
}

export type PasswordModel = {
  password: string;
  passwordConfirmation: string;
}

export type PasswordResponse = {
  password: string;
  passwordConfirmation: string;
}

export type RestoreModel = {
  login: string;
  captcha?: string;
}

export type RestoreResponse = {
}

export type VerifyModel = {
  code: string;
}

export type VerifyResponse = {
  verification_code: string;
}

export type SignUpModel = {
  login: string;
  inn: string;
  agreement: boolean;
  captcha?: string;
}

export type SignUpResponse = {
  inn: string;
  email: string;
  user_phone: string;
  detail: string;
  agreement: string;
}

export type ChangePasswordModel = {
  oldPassword: string;
  password: string;
  confirmation: string;
}

export type ChangePasswordResponse = Partial<{
  old_password: string;
  password: string;
  confirmation: string;
}>

export type UserResponse = UserData;

export const useUser = () => {
  const store = useStore();

  const signIn = async (model: SignInModel): Promise<ApiResponse<SignInResponse>> => store.dispatch(
    'user/signIn',
    model,
  );

  const signOut = async (model: SignInModel): Promise<ApiResponse> => store.dispatch(
    'user/signOut',
    model,
  );

  const signUp = async (model: SignUpModel): Promise<ApiResponse<SignUpResponse>> => store.dispatch(
    'user/signUp',
    model,
  );

  const verify = async (model: VerifyModel): Promise<ApiResponse<VerifyResponse>> => store.dispatch(
    'user/verify',
    model,
  );

  const changePassword = async (
    model: ChangePasswordModel,
  ): Promise<ApiResponse<ChangePasswordResponse>> => store.dispatch(
    'user/changePassword',
    model,
  );

  const restore = async (
    model: RestoreModel,
  ): Promise<ApiResponse<RestoreResponse>> => store.dispatch(
    'user/restore',
    model,
  );

  const setPassword = async (
    model: PasswordModel,
  ): Promise<ApiResponse<PasswordResponse>> => store.dispatch(
    'user/setPassword',
    model,
  );

  const registrationData = computed<RegistrationData | null>(() => (
    store.getters['user/registrationData']
  ));

  const resendCode = async (): Promise<ApiResponse> => (
    registrationData.value?.inn
      ? signUp
      : restore
  )({
    login: registrationData.value?.email || registrationData.value?.phone || '',
    inn: registrationData.value?.inn || '',
    agreement: true,
  });

  const codeUntil = computed<Date | null>(() => (
    store.getters['user/codeUntil']
  ));

  const user = computed<UserData | null>(() => (
    store.getters['user/data']
  ));

  return {
    signOut,
    signIn,
    signUp,
    verify,
    registrationData,
    codeUntil,
    resendCode,
    setPassword,
    restore,
    user,
    changePassword,
  };
};
