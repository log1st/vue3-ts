import {getRandomString} from "@/new/utils/string";

export default {
  namespaced: true,
  state() {
    return {
      dialogs: [],
    }
  },
  getters: {
    dialogs: state => state.dialogs,
  },
  mutations: {
    addDialog: (state, dialog) => {
      state.dialogs.push(dialog);
    },
    removeDialogById: (state, id) => {
      state.dialogs.splice(
        state.dialogs.findIndex((dialog) => dialog.id === id),
        1
      )
    }
  },
  actions: {
    async showDialog({commit}, dialog) {
      const newDialog = {
        id: getRandomString(),
        isCloseable: true,
        ...dialog,
      };

      commit('addDialog', newDialog);

      return newDialog;
    },
    async hideDialogById({ commit }, id) {
      commit('removeDialogById', id);
    },
  }
}
