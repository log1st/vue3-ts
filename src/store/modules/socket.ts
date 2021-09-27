import { Module, Plugin } from 'vuex';
import { StoreState } from '@/store';
import { socketURL } from '@/utils/env';
import { getRandomString } from '@/utils/string';
import { IToastLevel } from '@/hooks/useToast';

export type SocketSubscriber = {
  id: string;
  condition(payload: any): boolean;
  handler(payload: any): void | Promise<void>;
};

let socket: WebSocket | null = null;
let socketSubscribers: Array<SocketSubscriber>;

export const plugins: Array<Plugin<StoreState>> = [
  (store) => {
    socketSubscribers = [];
    socket = null;
    const connect = () => {
      store.commit('socket/setIsConnected', false);
      socket = null;

      socket = new WebSocket(
        `${socketURL}/ws/`,
      );

      socket.addEventListener('message', (e) => {
        const data = JSON.parse(e.data).payload;
        socketSubscribers.filter(({ condition }) => condition(data)).forEach(({ handler }) => {
          handler(data);
        });
      });

      socket.addEventListener('open', () => {
        store.commit('socket/setIsConnected', true);

        store.watch(
          (state) => state.companies.defaultCompanyId,
          async (newId, oldId) => {
            if (oldId) {
              await store.dispatch('socket/unsubscribeFromCompany', oldId);
            }
            if (newId) {
              await store.dispatch('socket/subscribeToCompany', newId);
            }
          }, {
            immediate: true,
          },
        );
      });

      let timeout: number;
      const retry = async () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          store.dispatch('layout/showToast', {
            type: 'error',
            message: 'socket.retry',
            level: IToastLevel.danger,
          });
          socket = null;
          connect();
        }, 10000);
      };

      socket.addEventListener('close', retry);
      socket.addEventListener('error', retry);
    };

    connect();
  },
];

export type SocketState = {
  isConnected: boolean;
}

type SocketModule = Module<SocketState, StoreState>;

export const namespaced = true;
export const state: SocketModule['state'] = () => ({
  isConnected: true,
});

export const getters: SocketModule['getters'] = {
  isConnected: (state) => state.isConnected,
};

export const mutations: SocketModule['mutations'] = {
  setIsConnected: (state, isConnected: boolean) => {
    state.isConnected = isConnected;
  },
};

export const actions: SocketModule['actions'] = {
  async send(context, payload) {
    const body = {
      ...payload,
    };
    await socket?.send(JSON.stringify(body));
  },
  async unsubscribe(context, id) {
    socketSubscribers.splice(
      socketSubscribers.findIndex(
        ({ id: sId }) => sId === id,
      ),
      1,
    );
  },
  async subscribe({ dispatch }, { condition, handler }) {
    const id = getRandomString();
    socketSubscribers.push({
      id,
      condition,
      handler,
    });

    const unsubscribe = () => {
      dispatch('unsubscribe', id);
    };
    unsubscribe.id = id;

    return unsubscribe;
  },
  async unsubscribeFromCompany({ dispatch }, id: number) {
    await dispatch('send', {
      stream: 'company_events',
      payload: {
        action: 'unsubscribe_company',
        company_id: String(id),
        request_id: getRandomString(),
      },
    });
  },
  async subscribeToCompany({ dispatch, rootGetters }, id: number) {
    await dispatch('send', {
      stream: 'company_events',
      payload: {
        action: 'subscribe_company',
        company_id: String(id),
        request_id: getRandomString(),
        auth_token: rootGetters['user/token']?.token,
      },
    });
  },
};
