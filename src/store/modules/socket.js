import {socketURL} from "@/settings/config";
import {getRandomString} from "@/new/utils/string";

export const socketPlugins = [
  store => {
    store.socketSubscribers = [];
    store.socket = null;
    return;
    const connect = () => {
      store.commit('socket/setIsConnected', false);
      store.socket = null;
      store.socketSubscribers = [];

      let connection = new WebSocket(
        `${socketURL}/ws/`
      )

      connection.addEventListener('message', e => {
        const {payload} = JSON.parse(e.data);

        store.socketSubscribers.forEach(({id, handler}) => {
          if(id === payload.request_id) {
            handler(payload);
          }
        })
      })

      connection.addEventListener('open', () => {
        store.socket = connection;
        store.commit('socket/setIsConnected', true);
      })

      let timeout;
      const retry = async () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          store.dispatch('toasts/showToast', {
            type: 'error',
            message: 'Ошибка подключения, пробуем ещё раз'
          })
          connection = null;
          connect();
        }, 10000);
      }

      connection.addEventListener('close', retry)
      connection.addEventListener('error', retry)
    }

    connect();
  }
]

export default {
  namespaced: true,
  state() {
    return {
      isConnected: false,
    }
  },
  getters: {
    isConnected: state => state.isConnected,
  },
  mutations: {
    setIsConnected: (state, isConnected) => {
      state.isConnected = isConnected
    }
  },
  actions: {
    async send(context, payload) {
      const body = {
        ...payload
      }
      await this.socket.send(JSON.stringify(body));
    },
    async unsubscribe(context, id) {
      this.socketSubscribers.splice(
        this.socketSubscribers.find((subscriber) => subscriber.id === id),
        1
      )
    },
    async subscribe({dispatch}, {stream, payload, handler}) {
      const id = payload?.request_id || getRandomString()
      await dispatch('send', {
        stream,
        payload: {
          request_id: id,
          ...payload,
        }
      });
      this.socketSubscribers.push({
        id,
        handler,
      })

      return () => {
        dispatch('unsubscribe', id)
      }
    },
    async fetch({dispatch}, {stream, payload}) {
      return new Promise((resolve, reject) => {
        dispatch('subscribe', {
          stream,
          payload,
          handler: (e) => {
            resolve(e);
          }
        })
      });
    },
  }
}
