import axios from 'axios'
import { URL, baseURL } from '@/settings/config';
import qs from 'qs';
import cloneDeep from 'lodash/cloneDeep';

export const userPlugins = [
  store => {
    store.watch(state => state.user.user.user, async id => {
      if(!id) {
        store.commit('setUserData', null);
        return;
      }
      const {data} = await axios({
        method: 'get',
        url: `${baseURL}/api/account/user/${id}/`
      });
      store.commit('setUserData', data);
    })
  }
]

export default {
  state: () => ( {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null,
    request: false,
    appTheme: 'day',
    userData: null,
  }),
  mutations: {
    setUserData: (state, data) => {
      state.userData = data;
    },
    changeTheme(state, payload) {
        state.appTheme = payload
    },
    auth_success (state, { token, user }) {
      state.token = token
      state.user = user ? user : ''
    },
    logout (state) {
      state.token = null
    },
    change_user (state, payload) {
      for (const key in payload) {
        state.user[key] = payload[key]
      }
    },
    setUserSettings (state, payload) {
      state.user = payload;
    }
  },
  actions: {
    /**
     * Изменение цветовой темы
     * @param {String}
     */
    changeAppTheme ({commit}, payload) {
      commit('changeTheme', payload)
    },
    demoLogin ( { commit }, { demo_role } ) {
      let role = demo_role
      return new Promise ((resolve, rej) => {
        axios ( {
          method: 'POST',
          url: baseURL + '/auth/login/',
          data: {
            demo_role: role
          }
        })
        .then ( res => {
          if (res.data.demo) {
            let result = res.data
            delete axios.defaults.headers.common["X-Auth-Token"];
            axios.defaults.headers.common['X-Auth-Token'] = result.auth_token
            axios({
              url: `${baseURL}/api/account/user/${res.data.id}/`,
              method: 'GET',
            }).then ( resp => {
              let userData = resp.data
              let user = {
                id: userData.id,
                token: result.auth_token,
                role: userData.user_role,
                INN: userData.user_inn,
                Phone: userData.user_phone,
                Email: userData.email
              }
              if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', result.auth_token);
                localStorage.setItem('token_until', res.data.valid_till)
              }
              // console.log(resp)
              commit('auth_success', { token: user.id, user });
              commit( 'percentLoginLoader', {status:true, type: 3} )

            })
            .catch ( err  => {
              delete axios.defaults.headers.common["X-Auth-Token"];
            })
            resolve()
          }
        })
        .catch ( err => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          // Отлавливаем текст ошибки с сервара при коде 4XX или 5XX
          if (err.response) {
            console.log(err.response)
            this._vm.$toast.open({
              message: err.response.data.error,
              type: 'error',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
            })
            // Текста не даст но скажет что мы не можем стучаться к серверу
          } else if (err.request) {
            console.log(err.request)
          }
          rej(err)
        })
      })
    },
    /**
     *
     * @param {String} Email
     * @param {String} Phone
     * @param {String} Password
     * @returns - При условии что пользователь прошел валидации и данные приняты то он будет перенаправлен в систему если же нет то пройдет обработка одной из ошибок
     */
    login ({ commit, dispatch }, { Email, Phone, Password }) {
      delete axios.defaults.headers.common["X-Auth-Token"];
      let login;
      if (Email) {
        login = Email
      } else if (Phone) {
        login = Phone
      }

      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: baseURL+'/auth/login/',
          data: {
            user_login: login,
            password: Password
          }
        }).then(res => {

            if (res.data.error) {
              this._vm.$toast.open({
                message: res.data.error,
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
            });
              reject(e);
            } else if (res.data.auth_token !== '' ) {

              let result = res.data
              axios.defaults.headers.common['X-Auth-Token'] = result.auth_token

              axios({
                url: `${baseURL}/api/account/user/${res.data.id}/`,
                method: 'GET',
              }).then ( resp => {
                let userData = resp.data
                let user = {
                  id: userData.id,
                  token: result.auth_token,
                  role: userData.user_role,
                  INN: userData.user_inn,
                  Phone: userData.user_phone,
                  Email: userData.email
                }
                if (typeof window !== 'undefined') {
                  localStorage.setItem('user', JSON.stringify(user));
                  localStorage.setItem('token', result.auth_token);
                }
                // console.log(resp)
                commit('auth_success', { token: user.id, user });
                commit( 'percentLoginLoader', {status:true, type: 2} )

              }).finally(resolve)
            }
        }).catch(e => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          // Отлавливаем текст ошибки с сервара при коде 4XX или 5XX
          if (e.response) {
            const errorKey = Object.keys(e.response.data)
            const errors = e.response.data
            errorKey.forEach( err => {
              this._vm.$toast.open({
                message: errors[err],
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              })
            })

            if (e.response.data.detail) {
              this._vm.$toast.open({
                message: 'Проверьте правильность введеных данных',
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              })
            }

            // Текста не даст но скажет что мы не можем стучаться к серверу
          } else if (e.request) {
            console.log(e.request)
          }
          delete axios.defaults.headers.common["X-Auth-Token"];

          reject(e);
        });
      });
    },
    /**
     * Выход из приложения
     * @returns
     */
    logout ({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        axios({
          method:'DELETE',
          url: baseURL+'/auth/logout/',
        })
        dispatch('clearListDebtors')
        dispatch('clearCompanies')
        dispatch('clearCourts')
        commit('logout')
        if (typeof window !== 'undefined') {
          delete axios.defaults.headers.common["X-Auth-Token"];
          localStorage.clear();
        }
        resolve()
      })
    },

    getCookie (name) {
      if (!document.cookie) {
        return null;
      }

      const xsrfCookies = document.cookie.split(';')
        .map(c => c.trim())
        .filter(c => c.startsWith(name + '='));

      if (xsrfCookies.length === 0) {
        return null;
      }
      return decodeURIComponent(xsrfCookies[0].split('=')[1]);
    },

    sendInnToFns ( {dispatch}, payload ) {

        let user = localStorage.getItem('user')
        user = JSON.parse(user)

        axios({
          url: baseURL+'/api/api_to_fns/',
          data:{
            inn: payload,
            id: user.id
          },
          method: 'POST'
        }).then ( res => {
          if (res.data.error) {
            this._vm.$toast.open({
              message: `${res.data.error}`,
              type: 'error',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
          });
          }
        })
    },
    passwordInstall ({ commit, dispatch }, { field, value, password, inn, code }) {
      let comandUrl = inn ? '/api/account/register/' : '/api/account/restore/'
      let data = inn ? {
        inn,
        password,
        user_inn: parseInt(inn),
        user_role: 'company',
        verification_code: code,
        [{
          email: 'email',
          phone: 'user_phone',
        }[field]]: value,
      } : {
        password,
        verification_code: code,
        [{
          email: 'email',
          phone: 'user_phone',
        }[field]]: value,
      }

      return new Promise((resolve, reject) => {
        axios({
          url:baseURL+comandUrl,
          method: 'PUT',
          data: data
        })
          .then(resp => {
            // console.log(resp)
            if (resp.data.demo === false && resp.data.auth_token !== "") {
              let user = {
                id: resp.data.id,
                token: resp.data.auth_token
              }
              if (typeof window !== 'undefined')
                  {
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('token', user.token);
                  }
                dispatch( 'sendInnToFns', inn )
                commit( 'auth_success', { token: user.token, user } );
                commit( 'percentLoginLoader', {status:true, type: 1})

              // console.log(resp)

              resolve('Install')
            } else if (resp.data.error || resp.error) {
              this._vm.$toast.open({
                message: `${resp.data.error}`,
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
            });
              reject(resp.data.error)
            } else {
              reject(resp)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    changePassword ({ commit, getters, state, dispatch }, { password, newPassword }) {
      return axios({
        method: 'patch',
        url: `${baseURL}/api/account/user/password/${state.user.user}/`,
        data: {
          password: newPassword,
          old_password: password,
        }
      }).then(res => {
          this._vm.$toast.open({
            message: 'Пароль был успешно изменен',
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
          });
      }).catch(e => {
        const errors = Object.values(e.response?.data || {});

        dispatch('toasts/showToast', {
          message: errors[0]?.[0] || 'Не удалось сменить пароль',
          type: 'error',
        }, {
          root: true,
        })
      })
    },
    /**
     * Установить настройки услуг
     * пока что передаю id организации и список настроек
     */
    setUserSettings({ commit, getters, state }, payload) {
      // меняем в localstorage
      const user = cloneDeep(state.user);
      // меняем флажок
      user.settings[payload.settingsMode] = payload.e ? 'Admin' : 'User';
      // меняем в хранилище
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user))
      }
      // меняем в сторе
      commit('setUserSettings', user);
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    user: state => state.user,
    userData: state => state.userData,
  }
}
