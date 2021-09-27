/// <reference types="grecaptcha" />

import { Module } from 'vuex';
import { StoreState } from '@/store';
import { reCaptchaApiKey, tinyApiKey } from '@/utils/env';

export type ThirdPartyState = {
  isCaptchaLoaded: boolean;
  isTinyMCELoaded: boolean;
}

type ThirdPartyModule = Module<ThirdPartyState, StoreState>;

export enum CaptchaActions {
  signUp = 'signUp'
}

export const namespaced = true;

export const state: ThirdPartyModule['state'] = () => ({
  isCaptchaLoaded: false,
  isTinyMCELoaded: false,
});

export const getters: ThirdPartyModule['getters'] = {
  isCaptchaLoaded: (state) => state.isCaptchaLoaded,
  isTinyMCELoaded: (state) => state.isTinyMCELoaded,
};

export const mutations: ThirdPartyModule['mutations'] = {
  setCaptchaLoadingState: (state, isLoaded: boolean) => {
    state.isCaptchaLoaded = isLoaded;
  },
  setTineMCELoadingState: (state, isLoaded: boolean) => {
    state.isTinyMCELoaded = isLoaded;
  },
};

export const actions: ThirdPartyModule['actions'] = {
  async loadTinyMCE({ commit, getters }) {
    if (getters.isTinyMCELoaded) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.async = true;
      script.addEventListener('load', () => {
        commit('setCaptchaLoadingState', true);
        resolve(true);
      });

      script.src = `https://cdn.tiny.cloud/1/${tinyApiKey}/tinymce/5/tinymce.min.js`;
      document.head.appendChild(script);
    });
  },
  async loadCaptcha({ commit, getters }) {
    if (getters.isCaptchaLoaded) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.async = true;
      script.addEventListener('load', () => {
        commit('setCaptchaLoadingState', true);
        resolve(true);
      });

      script.src = `https://www.recaptcha.net/recaptcha/enterprise.js?render=${reCaptchaApiKey}`;
      document.head.appendChild(script);
    });
  },
  async runCaptcha({ dispatch }, action: string) {
    await dispatch('loadCaptcha');
    return new Promise((resolve, reject) => {
      grecaptcha.enterprise.ready(() => {
        try {
          grecaptcha.enterprise.execute(reCaptchaApiKey, { action }).then((token: string) => {
            resolve(token);
            document.querySelector<HTMLDivElement>(
              '.grecaptcha-badge',
            )?.style.setProperty('visibility', 'hidden');
          }, (error) => {
            reject(error);
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  },
};
