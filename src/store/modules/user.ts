import { Module, Plugin } from 'vuex';
import { RouteRecordRaw } from 'vue-router';
import {
  ChangePasswordModel,
  ChangePasswordResponse,
  PasswordModel,
  PasswordResponse,
  RegistrationData,
  RestoreModel,
  RestoreResponse,
  SignInModel,
  SignInResponse,
  SignUpModel,
  SignUpResponse,
  UserData,
  UserResponse,
  UserRole,
  UserToken,
  VerifyModel,
  VerifyResponse,
} from '@/hooks/useUser';
import { StoreState } from '@/store';
import router from '@/router';
import { ApiCommand, ApiRequest, ApiResponse } from '@/store/modules/api';
import { isAtLeastPartialPhone } from '@/utils/string';
import { FetchCompaniesResponse } from '@/hooks/useCompanies';
import { awaitFrame } from '@/utils/window';
import { SignalType } from '@/hooks/useSignal';
import { isDev } from '@/utils/env';

export type AuthGuard = {
  isAuthorized: boolean;
  guestRequired: boolean;
  authRequired: boolean;
}

export type AuthGuardResponse = {
  result: boolean;
} & ({
  result: true;
} | {
  result: false;
  redirect: Partial<RouteRecordRaw>;
})

export type UserState = {
  token: UserToken | null;
  data: UserData | null;
  registrationData: RegistrationData | null;
  codeUntil: Date | null;
}

type UserModule = Module<UserState, StoreState>;

export const namespaced = true;

export const state: UserModule['state'] = () => ({
  token: null,
  data: null,
  registrationData: null,
  codeUntil: null,
});

export const getters: UserModule['getters'] = {
  token: (state) => state.token,
  data: (state) => state.data,
  isAuthorized: (state) => !!state.token,

  registrationData: (state) => state.registrationData,
  codeUntil: (state) => state.codeUntil,
};

export const mutations: UserModule['mutations'] = {
  setToken: (state, token: UserToken) => {
    state.token = token;
  },
  setData: (state, data: UserData) => {
    state.data = data;
  },
  setRegistrationData: (state, data: RegistrationData) => {
    state.registrationData = data;
  },
  setCodeUntil: (state, codeUntil: UserState['codeUntil']) => {
    state.codeUntil = codeUntil;
  },
};

export const actions: UserModule['actions'] = {
  async fetchData({ dispatch, commit, getters }) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.fetchAuthData,
      params: {
        id: getters.data?.id,
      },
    } as ApiRequest<UserData>, { root: true })) as ApiResponse<UserResponse>;

    if (status) {
      commit('setData', response);
    }

    return {
      status,
      response,
    } as ApiResponse<UserResponse>;
  },
  async signUp({ dispatch, commit }, model: SignUpModel) {
    // @TODO вынести
    if (!model.agreement) {
      return {
        status: false,
        response: {
          agreement: 'Подтвердите обработку персональных данных',
        },
      };
    }

    // await dispatch('thirdParty/runCaptcha', CaptchaActions.signUp, { root: true });
    // return { result: false };

    const isPhone = isAtLeastPartialPhone(model.login);
    const data = {
      inn: model.inn,
      [isPhone ? 'phone' : 'email']: (
        isPhone
          ? model.login.replace(/[^\d]/g, '').replace(/^8/, '7')
          : model.login
      ),
    };
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.signUp,
      data,
    } as ApiRequest<SignUpModel>, { root: true })) as ApiResponse<SignUpResponse>;

    if (status) {
      commit('setCodeUntil', new Date((new Date()).getTime() + 60 * 1000));
      commit('setRegistrationData', data);
    }

    return {
      status,
      response,
    } as ApiResponse<SignUpResponse>;
  },
  async verify({ dispatch, getters, commit }, model: VerifyModel) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.verify,
      data: {
        ...getters.registrationData,
        ...model,
      },
    } as ApiRequest<VerifyModel>, { root: true })) as ApiResponse<VerifyResponse>;

    if (status) {
      commit('setRegistrationData', {
        ...getters.registrationData,
        code: model.code,
      });
    }

    return {
      status,
      response,
    } as ApiResponse<VerifyResponse>;
  },
  async restore({ dispatch, commit }, model: RestoreModel) {
    const isPhone = isAtLeastPartialPhone(model.login);
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.restore,
      data: {
        [isPhone ? 'phone' : 'email']: (
          isPhone
            ? model.login.replace(/[^\d]/g, '').replace(/^8/, '7')
            : model.login
        ),
      },
    } as ApiRequest<RestoreModel>, { root: true })) as ApiResponse<RestoreResponse>;

    if (status) {
      commit('setRegistrationData', {
        [isPhone ? 'phone' : 'email']: model.login,
      });
    }

    return {
      status,
      response,
    } as ApiResponse<RestoreResponse>;
  },
  async setPassword({ dispatch, getters, commit }, model: PasswordModel) {
    // @TODO вынести
    if (model.passwordConfirmation !== model.password) {
      return {
        status: false,
        response: {
          passwordConfirmation: 'Пароли не совпадают',
        },
      };
    }
    const { status, response } = (await dispatch('api/request', {
      command: getters.registrationData.inn
        ? ApiCommand.doneSignUp
        : ApiCommand.doneRestore,
      data: {
        ...getters.registrationData,
        ...model,
        role: UserRole.company,
        intInn: parseInt(getters.registrationData.inn, 10),
      },
    } as ApiRequest<PasswordModel>, {
      root: true,
    })) as ApiResponse<PasswordResponse & SignInResponse>;

    if (status) {
      await dispatch('layout/showPreloader', null, { root: true });
      setTimeout(() => {
        commit('setToken', {
          token: response.auth_token,
          validUntil: new Date(response.valid_till),
        } as UserToken);
        commit('setData', {
          id: response.id,
          is_demo: response.demo,
        });
        commit('setRegistrationData', null);
      }, isDev ? 0 : 1000);
    }

    return {
      status,
      response,
    } as ApiResponse<PasswordResponse>;
  },
  async signIn({ dispatch, commit }, model: SignInModel) {
    // @TODO вынести
    if (!model.agreement) {
      return {
        status: false,
        response: {
          agreement: 'Подтвердите обработку персональных данных',
        },
      };
    }
    const isPhone = model.login && isAtLeastPartialPhone(model.login!);
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.signIn,
      data: {
        ...model,
        login: model.login ? isPhone
          ? model.login.replace(/[^\d]/g, '').replace(/^8/, '7')
          : model.login : undefined,
      },
    } as ApiRequest<SignInResponse>, {
      root: true,
    })) as ApiResponse<SignInResponse>;

    if (status) {
      await dispatch('layout/showPreloader', null, { root: true });
      setTimeout(() => {
        commit('setToken', {
          token: response.auth_token,
          validUntil: new Date(response.valid_till),
        } as UserToken);
        commit('setData', {
          id: response.id,
          is_demo: response.demo,
        });
      }, 1000);
    }

    return {
      status,
      response,
    } as ApiResponse<SignInResponse>;
  },
  async signOut({ dispatch, commit }) {
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.signOut,
    } as ApiRequest, {
      root: true,
    })) as ApiResponse;

    if (status) {
      commit('setToken', null);
      commit('setData', null);
    }

    return {
      status,
      response,
    } as ApiResponse<SignInResponse>;
  },
  async changePassword({ dispatch, getters }, model: ChangePasswordModel) {
    if (model.password !== model.confirmation) {
      return {
        status: false,
        response: {
          // @TODO первести на бэк
          confirmation: 'Пароли не совпадают',
        },
      } as ApiResponse<ChangePasswordResponse>;
    }
    const { status, response } = (await dispatch('api/request', {
      command: ApiCommand.changePassword,
      params: {
        id: (getters.data as UserData).id,
      },
      data: model,
    } as ApiRequest, {
      root: true,
    })) as ApiResponse<ChangePasswordResponse>;

    return {
      status,
      response,
    } as ApiResponse<ChangePasswordResponse>;
  },
  async checkAuth(context, {
    isAuthorized,
    guestRequired,
    authRequired,
  }: AuthGuard): Promise<AuthGuardResponse> {
    if (isAuthorized /* && (getters.token.validUntil > new Date()) */) {
      if (guestRequired) {
        return { result: false, redirect: { name: 'index' } };
      }
    } else if (authRequired) {
      return { result: false, redirect: { name: 'sign' } };
    }
    return { result: true };
  },
};

export const plugins: Array<Plugin<StoreState>> = [
  (store) => {
    store.watch((state) => !!state.user.token, async (isAuthorized) => {
      const response = await store.dispatch('user/checkAuth', {
        isAuthorized,
        ...router.currentRoute.value.meta,
      }) as AuthGuardResponse;
      if (!response.result) {
        await router.push(response.redirect);
      }
    });
  },
  (store) => {
    return;
    let signOutTimeout: number;
    store.watch((state) => state.user.token?.validUntil, (validUntil) => {
      clearTimeout(signOutTimeout);
      if (validUntil) {
        signOutTimeout = setTimeout(async () => {
          await store.dispatch('user/signOut');
        }, validUntil.getTime() - Date.now());
      }
    }, {
      immediate: true,
    });
  },
  (store) => {
    store.watch((state) => state.user.token, async (isAuthorized) => {
      if (!isAuthorized) {
        store.commit('user/setData', null);
      } else {
        await store.dispatch('user/fetchData');
      }
    }, {
      immediate: true,
    });
  },
  (store) => {
    store.subscribe(async ({ type, payload }) => {
      if (type === 'layout/signal' && [
        SignalType.companyAdded,
        SignalType.companyUpdated,
        SignalType.companyDeleted,
      ].includes(payload.signalType)) {
        const { status, response } = (
          await store.dispatch('companies/fetchCompanies')
        ) as ApiResponse<FetchCompaniesResponse>;

        if (status) {
          store.commit('companies/setCompanies', response.results);
        }

        await store.dispatch('companies/fetchDefaultCompanyId');
      }
    });

    store.watch((state) => state.user.data?.id, async (id) => {
      await awaitFrame();

      if (!id) {
        store.commit('companies/setCompanies', []);
        store.commit('companies/setDefaultCompanyId', null);
        store.commit('user/setCodeUntil', null);
        return;
      }
      const { status, response } = (
        await store.dispatch('companies/fetchCompanies')
      ) as ApiResponse<FetchCompaniesResponse>;

      if (status) {
        store.commit('companies/setCompanies', response.results);
      }

      await store.dispatch('companies/fetchDefaultCompanyId');

      if (!store.getters['companies/defaultCompanyId']) {
        const { id } = store.getters['companies/companies'][0];
        if (!id) {
          return;
        }
        store.commit('companies/setDefaultCompanyId', id);
        await store.dispatch('companies/setDefaultCompanyId', id);
      }
    }, {
      immediate: true,
    });
  },
];
