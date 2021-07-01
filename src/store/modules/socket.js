import {socketURL} from "@/settings/config";

export const socketPlugins = [
  store => {
    store.socket = null;
    const connect = () => {
      store.commit('socket/setIsConnected', false);
      store.socket = null;

      let connection = new WebSocket(
        `${socketURL}/rosreestr/status/`
      )

      connection.addEventListener('message', e => {
        store.dispatch('socket/')
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
        }, 5000);
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
    }
  }
}
