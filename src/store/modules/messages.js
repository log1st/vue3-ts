import isEmpty from 'lodash/isEmpty';

export default {
  state: () => ( {
    messages: [
      { _id: 0, message: 'Должник <b>Кузовенкова Л.Н.</b> закрыл долг', time: 1582630022, read: false },
      { _id: 5, message: 'Должник <b>Кузовенкова Л.Н.</b> не оплатил вовремя', time: 1575549000, read: false },
    ],
    emails: [
      { _id: 0, sender: 'ЮРРОБОТ', title: '<b>Кузовенковой Л.Н.</b> выставлен счет на оплату', time: 1575549000, read: false },
      { _id: 1, sender: 'ЮРРОБОТ', title: '<b>Кузовенковой Л.Н.</b> выставлен счет на оплату', time: 1575549000, read: false },
      { _id: 2, sender: 'ЮРРОБОТ', title: '<b>Кузовенковой Л.Н.</b> выставлен счет на оплату 3', time: 1575549000, read: true },
      { _id: 3, sender: 'ЮРРОБОТ', title: '<b>Кузовенковой Л.Н.</b> выставлен счет на оплату 4', time: 1575549000, read: true },
      { _id: 4, sender: 'ЮРРОБОТ', title: '<b>Кузовенковой Л.Н.</b> выставлен счет на оплату 5', time: 1575549000, read: false },
      { _id: 5, sender: 'ЮРРОБОТ', title: '<b>Кузовенковой Л.Н.</b> выставлен счет на оплату 6', time: 1575549000, read: false }
    ]
  }),
  mutations: {
    removeAllMessages (state, payload) {
      if (payload === 'email') state.emails = []
      if (payload === 'message') state.messages = []
    },
    readAllMessages (state, payload) {
      if (payload === 'email') state.emails.forEach(el => { el.read = true })
      if (payload === 'message') state.messages.forEach(el => { el.read = true })
    },
    setAllMessages (state, payload) {
      // const common = Object.values(payload.Common)

      state.messages = [ 
        // ...Object.values(payload.Common).map(i => { 
        //   return {
        //     message: i.Comment,
        //     time: i.DataEvents,
        //     messageType: 'Common'
        //   }
        // }),
        ...Object.values(payload.Individual).map((i, index) => { 
          return {
            message: i.Comment,
            time: i.DataEvents,
            messageType: 'Individual'
          }
        })
      ]
    }
  },
  actions: {
    /**
     * Прочитать события
     * @param {*} param0 
     */
    removeAllMessages({ state, commit, getters, dispatch }) {
      const payload = Object.keys(state.messages);
      return $http({
        data: {
          command: 'ReadEvents',
          OrganizationId: 0,
          ...payload
        }
      }).then(res => {
        if (res.addEvents === 'Complete') {
          // commit('setAllMessages', result);
          // dispatch('getAllMessages');
        }
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        //
      });
    },
    readAllMessages ({ commit }, payload) {
      commit('readAllMessages', payload)
    },
    /**
     * Получить все события
     * @param {*} param0 
     */
    getAllMessages ({ commit, dispatch }) {
      return $http({
        data: {
          command: 'Events',
          OrganizationId: 0
        }
      }).then(res => {
        dispatch('_checkNotificationResponseStructure', res);
        if (res.result) {
          commit('setAllMessages', res.result);
        }
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        //
      });
    },
    /**
     * Добавить событие
     * @param {*} param0 
     */
    createNotificationMessage ({ commit, getters, dispatch }, message) {
      return $http({
        data: {
          command: 'AddEvents',
          OrganizationId: 0,
          TextEvents: message,
          DataEvents: Date.now()
        }
      }).then(res => {
        if (res.addEvents === 'Complete') {
          // commit('setAllMessages', result);
          dispatch('getAllMessages');
        }
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        //
      });
    },
    /**
     * Проверка структуры ответа сервера 'Events' команды
     * @param {*} state 
     * @param {*} res ответ 
     */
    _checkNotificationResponseStructure(state, res) {
      // проверка объектов ответа или ошибок
      const errorsObject = !isEmpty(res) && res.hasOwnProperty('data') && res.data.hasOwnProperty('0');
      if(!errorsObject) {
        // console.error("API error. No Errors object found. Vuex module 'messages'. getAllMessages action", res);
        return
      }
      const responseObject = !isEmpty(res) && res.hasOwnProperty('data') && res.data.hasOwnProperty('1');
      if(!responseObject) {
        // console.error("API error. No return object found. Vuex module 'messages'. getAllMessages action", res);
        return
      }
      // проверка на наличие ошибок сервера
      const errorCheck = res.data[0].Errors && !isEmpty(res.data[0].Errors);
      if(errorCheck) {
        const errors = Object.values(res.data[0].Errors);
        errors.forEach(e => {
          // console.error('_checkNotificationResponseStructure messages module', e);
        })
      }  
      // проверка на правильность структуры
      const dataResult = res.data[1].hasOwnProperty('return') && res.data[1].return.hasOwnProperty('Result');
      if(!dataResult) {
        // console.error("API error. No 'return' or 'Result' object found. Vuex module 'messages'. getAllMessages action", res);
        return
      }
      
      const commonItemChecked = 
        res.data[1].return.Result.hasOwnProperty('Common') && 
        !isEmpty(res.data[1].return.Result.Common) &&
        Object.values(res.data[1].return.Result.Common).every(item => {
          return item.hasOwnProperty('Comment') && typeof(item.Comment) === 'string' && item.Comment.length > 0 && 
                 item.hasOwnProperty('Status') && typeof(item.Status) === 'string' && item.Status.length > 0 && 
                 item.hasOwnProperty('Tema') && typeof(item.Tema) === 'string' && item.Tema.length > 0 && 
                 item.hasOwnProperty('DateTime') && typeof(item.DateTime) === 'string' && item.DateTime.length > 0
        })
        if(!commonItemChecked) {
          // console.error("API error. Common object notification item ivalid fields. Vuex module 'messages'. getAllMessages action", res);
        }

      const individualItemChecked = 
        res.data[1].return.Result.hasOwnProperty('Individual') && 
        !isEmpty(res.data[1].return.Result.Individual) &&
        Object.values(res.data[1].return.Result.Individual).every(item => {
          return item.hasOwnProperty('Comment') && typeof(item.Comment) === 'string' && item.Comment.length > 0 && 
                 item.hasOwnProperty('Status') && typeof(item.Status) === 'string' && item.Status.length > 0 && 
                 item.hasOwnProperty('Tema') && typeof(item.Tema) === 'string' && item.Tema.length > 0 && 
                 item.hasOwnProperty('DateTime') && typeof(item.DateTime) === 'string' && item.DateTime.length > 0
        })
        if(!individualItemChecked) {
          // console.error("API error. Individual object notification item ivalid fields. Vuex module 'messages'. 'getAllMessages' action", res);
        }
    },
  },
  getters: {
    getMessages: state => state.messages,
    getMessagesNew: state => state.messages.filter(el => !el.read),
    getEmails: state => state.emails,
    getEmailsNew: state => state.emails.filter(el => !el.read)
  }
}
