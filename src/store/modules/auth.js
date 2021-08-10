import { URL, baseURL } from '@/settings/config'
import cloneDeep from 'lodash/cloneDeep';
import axios from 'axios'
// Шифрование
import { JSEncrypt } from 'jsencrypt'


export default {
  state: () => ( {
    authLayout: 0, // текущий шаг/компонент авторизации

    userEmail: '', // поле email после разделения/распознавания введенного значния
    userPhone: '',
    password: '',
    repeatPassword: '',
    forgotData: '',
    newuser: false,

    // ur-auth
    inn: '',
    userLogin: '', // общее поле
    password: '',

    // ur-auth-code
    emailCode: null,
    smsCode: null,
    code: '',
    setTimer: false,
    timerID: null,
    timerStart: null,
    time: '0:59',

    authSetPasswordType: null,

    key: `-----BEGIN RSA PRIVATE KEY-----
    MIICXAIBAAKBgQDXqPJVrhbv9jtj37SQrflWw+sPxl9iEFUsN40Bi2v8uQl6lkUe
    b1qgeNivtpz+BBls5I9L/hzwfIAtReSQXBs/NIgbKEEFRnFbegHbxIzurgSfm4f9
    +lSnIGNgKV7wQMz4d3AaDDC2nAzTBZwnTiGIUoJRFo4P4RBuWZtqljPaFQIDAQAB
    AoGBANDly+eGvJ0wTJMPzJ4gh1eua3FaXGZnH7m3DZUjcjTZH/9otAcpIgYzSOHb
    5/J+EgrS0qNvwKSKVLaF70KOlaw6UAMuPsewiqc9kqSFCQoPh4kEvl5TSZNdjoSK
    Vu9W2AncZQ0fFnZBonnnNljDG8Lktv56MEMon3lkKO86hL2BAkEA8mL5/qb97AKv
    hn0amC1qVphX/f2hnK0WiYhc53ybpd72co3mZOALHeGqZ0w9PNgPiPw7EjJ95miD
    IjM+wYpZZQJBAOPFsfUYzI1SpU32jBbGrO6HD/SuIlJIbJTQwui7jc4XHR/uTThO
    ag0AcFHqthjZoW8tToJwcA+hlFa3C0X8yvECQBtT93WzpDtgziNupXn03OFoibs0
    Rm1gwoK9IiRjUzUvXz/pKcnDzN0QnWLKILlkbtP2BD73/GPm8qn/dxrhG1UCQD+g
    IuTnZ4R2uKx9mYZnOzlqSx+7YOUBTCuJ4Vhnw+X0+PLJe5Kl/OPi4n1PhkyMxpaq
    3kp7pCIJrclHWoPTaNECQEPF9F3g38rhmW4gW11MWWlJucIb3wSuDNXtFqAUpuSO
    9DyNtP27INOok+PfVQ4jUuclcxrzCLRsOhliwQ4mF5U=
    -----END RSA PRIVATE KEY-----`
  }),
  mutations: {
    setNewUserStatus(state, payload) { // Установка статуса "Нового" пользователя для выдачи уведомления о необходимости внесения должников в разделе "Обмен дынными"
      state.newuser = payload;
    },
    authResolve (state) {
      state.authLayout = 0;
    },
    setUserEmailField(state, payload) {
      state.userEmail = payload;
    },
    setUserPhoneField(state, payload) {
      state.userPhone = payload;
    },
    // установить поле
    setStateField(state, { key, value }) {
      state[key] = value;
    },

    setAuthLayout(state, payload) {
      state.authLayout = payload
    },

    clearAuthForm(state) {
      state.userEmail = '';
      state.userPhone = '';
      state.password = '';
      state.forgotData = '';
      state.inn = '';
      state.userLogin = ''; // общее поле
      state.password = '';
    },

    setVerificationCode (state, payload) {
          state.smsCode = payload
          state.emailCode = payload
    },

    clearCode (state) {
      state.code = ''
    },

    setAuthTypeInstallPassword (state, payload) {
      state.authSetPasswordType = payload
    }

  },
  actions: {
    _validEmail (state, email) {
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(email)
    },
    _validPhone (state, phone) {
      const phoneCloned = cloneDeep(phone);
      return phoneCloned.replace(/\D+/g, '')
    },
    async defineLoginType({ state, commit, dispatch }, inputField) {
      commit('setUserEmailField', '');
      commit('setUserPhoneField', '');

      if(state.userLogin.length === 0) return
      const validEmail = await dispatch('_validEmail', state.userLogin)

      if (!validEmail) {
        let validPhone = await dispatch('_validPhone', state.userLogin);
        if(validPhone.length === 11) {
          if(validPhone.charAt(0) === '8') {
            validPhone = validPhone.replace(/8/, "7");
          }
          commit('setUserPhoneField', validPhone);
        }
      } else {
        commit('setUserEmailField', state.userLogin);
      }
    },
    checkUserExist ({state}) {
      let comandUrlEmail = '/api/check_user_email/',
      comandUrlPhone = '/api/check_user_phone/',
      comandURL,
      data = {};
      return new Promise ( (resolve, reject) => {
        // console.log(state)
        if (state.userEmail != '') {
          comandURL = comandUrlEmail
          data.user_email = state.userEmail
        } else if (state.userPhone != '') {
          comandURL = comandUrlPhone
          data.user_phone = state.userPhone
        }
        // console.log([comandURL, data])
        axios({
          url: baseURL + comandURL,
          method: 'POST',
          data: data
        })
        .then ( res => {
          // console.log(res)
          if (res.error || res.data.error) {
            reject('Error')
            this._vm.$toast.open({
              message: `Серверная ошибка, обновите страницу и попробуйте снова`,
              type: 'error',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
          });
          } else if (res.data.id || res.id) {
            let id = res.data.id || res.id
            resolve(id)
          }
        })
      } )
    },
    setNewPass ( { commit } , {field, value, code, password}) {
        return new Promise ((resolve, reject) => {
          axios({
            url: baseURL + '/api/account/restore/',
            method: 'PUT',
            data: {
              [{
                email: 'email',
                phone: 'user_phone',
              }[field]]: value,
              password,
              verification_code: code
            }
          })
          .then( res => {
            if (res.status === 200 || res.status === 201) {
              commit('setAuthLayout', 0); // change layout
              resolve({status: true, msg: 'Установка пароля прошла успешно'})
            } else {
              reject(['Ошибка сервера, проверьте соединение с интренетом'])
            }
          })
          .catch ( err => {
            console.log(err.response)
            reject(err.response.data)
          })
        })

    },
    /**
     * Запрос регистрации
     */
    register ({ commit, dispatch, state }) {
      return dispatch('registerNewAccount', {
          Inn: state.inn,
          Email: state.userEmail,
          Phone: state.userPhone
      }).then(res => {
          commit('setAuthLayout', 5); // change layout
          dispatch('setNewTimer');
      }).catch(err => {
          console.log(err)
          const errors = Object.values(err.data[0].Errors);
          errors.forEach(e => {
              this._vm.$toast.open({
                  message: `${e}`,
                  type: 'error',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
              });
              if (e === 'Account already registered') {
                // debugger
                dispatch('resend', { Email: state.userEmail, Phone: state.userPhone })
              }
          })
      });
    },
    /**
     * Расшифрование данных
     * @param {Object} state
     * @param {*} payload
     * @returns
     */
    async decryptCode({state}, payload) {
      const JSDecrypt = new JSEncrypt()
      JSDecrypt.setPrivateKey(state.key)
      let encrypted = payload
      const originalText = await JSDecrypt.decrypt(encrypted)
      return originalText
    },

    registerNewAccount({ dispatch, commit }, { Inn, Email, Phone }) {
        let comandUrl = '/api/account/register/'
        let data = {}
        if (Phone) {
          data = {
            user_phone: Phone,
          }
        } else if (Email) {
          data = {
            email: Email,
          }
        }
        data.inn = Inn

        return new Promise((resolve, reject) => {
          axios(
            {
              url: baseURL+comandUrl,
              method: 'POST',
              data: {
                ...data
              }
            })
            .then( resp => {

                let data = resp.data.inn
                if (data) {
                  resolve('Complete')
                } else {
                  reject(resp)
                }

            })
            .catch ( err => {
              if (err.response.data.message) {
                this._vm.$toast.open({
                  message: 'Колличество попыток исчерпано, попробуйте через 24 часа',
                  type: 'error',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
              });
              reject(err)

              } else if (err.response.data.inn) {
                let errMsg = err.response.data.inn
                if (Array.isArray(err.response.data.inn)) {
                  errMsg = err.response.data.inn[0]
                } else {
                  errMsg = err.response.data.inn
                }
                this._vm.$toast.open({
                  message: errMsg,
                  type: 'error',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
                });
              reject(err)

              } else if (err.response.data.email || err.response.data.phone_number) {
                this._vm.$toast.open({
                  message: 'Данный логин уже используется в системе',
                  type: 'error',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
                });
                reject(resp)
              } else {
                reject(err)
                console.log(err)
              }
            })
        })
    },

    /**
     * Авторизация/Вход в личный кабинет
     * @param path
     */
    enter ({ state, dispatch, commit }, path = "/") {
      return dispatch('login', {
        Email: state.userEmail,
        Phone: state.userPhone,
        Password: state.password,
        path: '/'
      }, { root: true }).then(() => {
        commit('clearAuthForm');
        // так как router недосупен во vuex обращаемся к нему по типу events
        events.$emit('auth', true)

      }).catch(err => {
        console.log('enter action error. auth state module', { err });
      });
    },
    // отправить повторный запрос
    passwordRecoveryPhone ({ commit, dispatch }, {field, value}) {
      let comandUrl = '/api/account/restore/'
      return new Promise((resolve, reject) => {
        axios({
          url: URL+comandUrl,
          method: 'POST',
          data: {
            [{
              email: 'email',
              phone: 'user_phone',
            }[field]]: value,
          }
        }).then(res => {
          // console.log(res)
          if (res.status === 201 || res.status === 200) {
            if (res.data.email !== null ) {
              commit('setAuthLayout', 6); // change layout
              dispatch('setNewTimer');
              resolve('Email')
            } else {
              commit('setAuthLayout', 7); // change layout
              dispatch('setNewTimer');
              resolve('Phone')
            }
          }
        }).catch(err => {
          if (err.respone?.data?.message) {
            this._vm.$toast.open({
              message: `Лимит запросов привышен, повторите запрос через некоторое время`,
              type: 'error',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
          });
          } else {
            this._vm.$toast.open({
              message: `Не удалось отправить проверочный код`,
              type: 'error',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
            });
          }
          commit('setAuthLayout', 1); // change layout
            reject(err)
        });
      })
    },
    /**
     * Установка пароля при регистрации
    */
    passInstall ({ state, dispatch, commit }) {
      let commandUrl = '/api/api_to_fns/';

      return dispatch('passwordInstall', {
        Email: state.userEmail,
        Phone: state.userPhone,
        Password: state.password,
        inn: state.inn,
        Code: state.code || state.emailCode
      }, { root: true }).then(() => {
        commit('clearAuthForm');
        // так как router не досупен во vuex обращаемся к нему по типу events
        events.$emit('auth', true)

        let user = localStorage.getItem('user')
        user = JSON.parse(user)
        commit('setAuthLayout', 0); // change layout

        const data = {
          inn: state.inn,
          id: user.id
        }
        axios({
          url: baseURL+commandUrl,
          method: 'POST',
          data
        }).then ( res => {
        let user_company = JSON.stringify(res)
        localStorage.setItem('user_company', user_company)
          commit('authResolve')
        })

        // dispatch('enter');
      }).catch(err => {
          this._vm.$toast.open({
              message: `${err}`,
              type: 'error',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
          });
      })
  },

    // timer
    setNewTimer ({ state, commit }) {
      commit('setStateField', { key: 'code', value: ''});
      commit('setStateField', { key: 'setTimer', value: true });
      // старт счетчика
      let timerStart = (new Date().getTime() / 1000).toFixed(0) * 1
      commit('setStateField', { key: 'timerStart', value: timerStart });

      const timerID = setInterval(() => {
        const seconds = 59 - ((new Date().getTime() / 1000).toFixed(0) * 1 - state.timerStart)
        if (seconds > 0) {
          let time = Math.trunc(seconds / 60) + ':' + ('0' + seconds % 60).slice(-2)
          commit('setStateField', { key: 'time', value: time });
        } else {
          commit('setStateField', { key: 'setTimer', value: false });
          clearTimeout(state.timerID)
          commit('setStateField', { key: 'timerID', value: null });
          commit('setStateField', { key: 'time', value: '0:59' });
        }
      }, 1000);
      commit('setStateField', { key: 'timerID', value: timerID });
    },
    /**
     * Активация аккаунта
     */
    activatePhoneEmail ({ state, dispatch, commit }, {field, value, code}) {
      return new Promise((resolve, reject) => {
        axios({
          url: baseURL + '/api/account/verificate/',
          method: 'POST',
          data: {
            [{
              email: 'email',
              phone: 'user_phone',
            }[field]]: value,
            verification_code: code,
          }
        })
        .then (resp => {
          if (resp.data.message === 'verification code succeed') {
          commit('setVerificationCode', state.code)
          commit('setAuthLayout', 4); // change layout
          resolve('Account activated')
          } else {
            reject(resp)
            commit('clearCode')
            this._vm.$toast.open({
              message: `Код введен не верно`,
              type: 'error',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
            });
          }
        })
        .catch ( err => {
          reject(err)
          commit('clearCode')
        })
      })
    },
      /**
       * Запрос нового пароля. После резолва промиса подставляет
       * полученный новый пароль в форму авторизации и вызывает
       * метод this.enter()
       * @returns {Promise<unknown>}
       */
      sentPinForNewPassword ({ commit, state, dispatch }) {

        let data = {}
        if (state.userEmail !== '') {
          data = {
            email: state.userEmail
          }
        } else if (state.userPhone !== "") {
          data = {
            phone_number: state.userPhone
          }
        }

        data.verification_code = state.code

        axios({
          url: baseURL + '/api/account/verificate/',
          method: 'POST',
          data: {
            ...data
          }
        })
        .then ( resp => {
          if (resp.data.message === 'verification code succeed') {
            commit('authResolve')
            commit('setStateField', { key: 'setTimer', value: false });
            clearTimeout(state.timerID)
            commit('setStateField', { key: 'timerID', value: null });
            commit('setStateField', { key: 'time', value: '0:59' });
            commit('setAuthLayout', 9); // change layout
          } else {
            this._vm.$toast.open({
                message: `Код введен не верно`,
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
            });
            commit('clearCode')
        }
        }).catch( err => {
          commit('clearCode')

          if ( err.response.data.message === 'verification code failed' ) {
            this._vm.$toast.open({
              message: `Код введен не верно`,
              type: 'error',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
          });
          }
        })



    }
  },
  getters: {
    userEmail: state => state.userEmail,
    userPhone: state => state.userPhone,

    authLayout: state => state.authLayout,
    // timer
    setTimer: state => state.setTimer,
    code: state => state.code,
    timerStart: state => state.timerStart,
    time: state => state.time,
  }
}
