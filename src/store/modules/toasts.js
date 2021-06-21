import {getRandomString} from "@/new/utils/string";

export default {
  namespaced: true,
  state() {
    return {
      toasts: [],
    }
  },
  getters: {
    toasts: state => state.toasts,
  },
  mutations: {
    addToast: (state, toast) => {
      state.toasts.push(toast);
    },
    removeToastById: (state, id) => {
      state.toasts.splice(
        state.toasts.findIndex((toast) => toast.id === id),
        1
      )
    }
  },
  actions: {
    async showToast({commit}, toast) {
      const newToast = {
        id: getRandomString(),
        isCloseable: true,
        duration: 5000,
        position: 'top',
        align: 'end',
        ...toast,
      };

      this.$toast.open({
        dismissible: newToast.isCloseable,
        duration: newToast.duration,
        position: `${newToast.position}-${{end: 'right'}[newToast.align]}`,
        message: newToast.message,
        type: newToast.type,
      })

      commit('addToast', newToast);

      return newToast;
    },
    async hideToastById({ commit }, id) {
      commit('removeToastById', id);
    },
  }
}
