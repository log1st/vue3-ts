import { keys, timeZones } from '@/settings/config'
import { URL as baseURL  } from '@/settings/config'
import axios from 'axios'
import { filter } from 'jszip'
// import download from 'downloadjs'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import cloneDeep from 'lodash/cloneDeep'

export const companiesPlugins = [
  store => {
    store.watch(state => state.defaultCompany, id => {
      localStorage.setItem('defaultCompany', id)
    })
  }
]

export default {
  state: () => ( {
    //Объект данных для модального окна организации *(выбранная организация)
    modalCompanyContent: null,
    companyBalance: [],
    companies: [],
    exchangedCompany: false,
    applicationLists: [],
    documents: [],
    companySettings: false,
    companiesNamesLists: {
      ListOKOPF: null,
      ListTypeOrganization: null,
      ListTaxSystems: null,
      ListPenaltyCalculation: null,
      ListGroundsPowersSignatory: null
    },
    positions: [],
    InfoINNSharedData: {
      ContractNumberDate: '',
      FullNameOrganization: '',
      PostalAddressWithZipCode: '',
      Fio: '',
      Email1: '',
      EmailBuh: '',
      DateRegistre: '',
      TimeZone: '',
      Balance: 0,
      RecomendedBalance: 0
    },

    InfoINNContracts: null,
    defaultCompany: +(localStorage.getItem('defaultCompany') || null), // - организация по умолчанию
    companyEmployees: [],
    isDefaultCompanyInitiated: false,
  }),
  mutations: {
    clearCompanies (state) {
      state.companies = []
      state.InfoINNSharedData = null
      state.InfoINNContracts = null
    },
    setCompanyChecked (state, i) {
      state.companies.forEach((el, index) => {
        index !== i ? el.checked = false : el.checked = true
      })
    },
     /**
     * Установка организации по умолчанию
     * @param state
     */
    setCompanyDefault ( state , index) {
      state.defaultCompany = index
    },
    setIsDefaultCompanyInitiated(state, value) {
      state.isDefaultCompanyInitiated = value;
    },
    removeCompany (state, id) {
      state.companies.splice(id, 1)
    },
    saveNewCompany (state, payload) {
      const newObj = { checked: false, done: true }
      keys.forEach(key => { newObj[key] = payload[key] })
      state.companies.push(newObj)
    },
    editCompanyGeneralData (state, { id, data }) {

      let editedCompany = find(state.companies, ec => {
        return ec.id == data.id
      })
      // console.log(editedCompany)
      for (const key in data) {
        editedCompany[key] = data[key]
      }
    },
    setCompanyFilterData (state, payload) {
      state.companies.forEach(company => {
        company.done = payload.every(({ key, data }) => {
          if (data === '') return true
          else return company[key].toString().toLowerCase().includes(data)
        })
      })
    },
    setCompanySetting (state, payload) {
      state.companySettings = payload
    },
    uploadCompanies (state, payload) {
        payload.forEach( c => {
          if (c.name_full === null) {
            c.name_full = "Нет данных"
          }
          c.checked = false
        })

        state.companies = payload
    },
    setCompaniesNamesLists (state, payload) {
      for (const key in payload) {
        state.companiesNamesLists[key] = Object.values(payload[key])
      }
    },
    loadInfoINNSharedData (state, payload) {
      state.InfoINNSharedData = { ...state.InfoINNSharedData, ...payload}
    },
    loadInfoINNContracts (state, payload) {
      state.InfoINNContracts = payload
    },
    // раздел сотрудников
    setCompanyEmployees(state, payload) {
      state.companyEmployees = payload;
    },
    setExchangeCompany(state, payload) {
      state.exchangedCompany = payload
    },
    setCompanyById ( state, payload ) {
      state.modalCompanyContent = payload
    },
    setCompanyBalanceUser ( state, payload ) {
      state.companyBalance = payload
    },
    apllicationListForUser ( state, payload) {
      state.applicationLists = payload
    },
    setCompanyDocuments (state, payload) {
      state.documents = payload
    },
    setEditApplicationDocument (state, payload) {
      const { id, type, data } = payload
      let attach = state.applicationLists.find( app => app.id === id)
      if ( type === 'select') {
        attach.is_active = !attach.is_active
      } else if (type === 'move') {
        attach.order_number = data
      }
    },
    setPositionEmployee (state, payload) {
      state.positions = payload
    }
   },
  actions: {
    clearCompanies ({ commit }) {
      commit('clearCompanies')
    },
    async setCompanyDefault ({ commit, state }) {
      const user = JSON.parse(
        localStorage.getItem('user')
      )
      const {data: {default_company}} = await axios({
        method: 'get',
        url: `${baseURL}/api/account/user/active-company/${user.id}/`,
      });
      commit('setIsDefaultCompanyInitiated', true);
      commit('setCompanyDefault', default_company)
    },
    setCompanyChecked ({ commit }, payload) {
      commit('setCompanyChecked', payload)
    },
    setCheckedByDefault ({ commit, getters }) {
      commit('setCompanyChecked', getters.getDefaultCompany)
    },
    setCompanyFilterData ({ commit }, payload) {
      commit('setCompanyFilterData', payload)
    },
    getDefaultCompany() {
      // TODO вынести получение организации по умолчанию сюда
    },
    /**
     * Получение данных банка по БИК и вызов функции сохранения данных банка в организацию
     * @param {*} payload БИК банка
     */
    getDataByBIC ({dispatch}, payload) {
      return new Promise ((resolve, reject) => {
        const {bic, id} = payload
        $http({
          command: '/api/dadata/bank/',
          data:{
            bik: bic
          },
          method: 'POST'
        })
        .then ( resp => {
          console.log(resp)
          if (resp['RequestStatusCode'] === 200) {
            let data = {
              bic: bic,
              full_name_bank: resp[0].value,
              id: id
            }
            // Получился паравозик из ожидайний методов нужно будет оптимизировать данный процесс в некой уникальный функции обновдения данных
            // отправляем PATCH на редактирование данных БИК и полного наименования банка
            dispatch('editCompanyGeneralData', {data: data})
            .then( result => {
              if (result.status) {
                // Запрашиваем данные организации еще раз и уже в компоненте перезапускаем модалку
                dispatch('updateCompanyData', id)
                .then( (result2) => {
                  if (result2.status)  resolve({res:resp, status: true})
                })
              }
            })
          }
        })
        .catch(err => {
          this._vm.$toast.open({
            message: err,
            type: 'error',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
          })
          reject(false)
        })
      })
    },

    removeCompany ({ commit, state, dispatch }, id) {
      let idDelete = state.companies[id].id
      axios({
        url: baseURL+`/api/account/company/${idDelete}/`,
        method: 'DELETE'
      })
      .then ( res => {
        // console.log(res)
        if (res.data.error || res.error) {
          this._vm.$toast.open({
            message: `Ошибка сервера`,
            type: 'error',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
          });
        } else {
          dispatch('uploadCompanies');
          commit('removeCompany', id);
        }
          dispatch('uploadCompanies');
      })
    },
    getCompanySettings ({commit, state}, id = state.defaultCompany) {
      if(!id) {
        return;
      }
      return new Promise ((resolve, reject) => {
        $http({
          command: `/api/account/company-settings/${id}/`,
          method: 'GET',
        })
        .then (resp => {
          resolve({status: true, response: resp})
          commit('setCompanySetting', resp)
        })
        .catch( err => {
          reject({status: false, response: err})
        })
      })
    },
    saveNewCompany ({ commit }, payload) {
      commit('saveNewCompany', payload)
    },
    editCompanyGeneralData ({ commit, getters, dispatch }, payload) {
      let data = {...payload.data}

      keys.forEach(key => {
        if (payload.data[key] === undefined) data[key] = getters.getCompanyGeneralData(payload.index)[key]
        else data[key] = payload.data[key]
      })

      return new Promise((resolve, reject) => {
        axios({
          url:baseURL+`/api/account/company/${payload.data.id}/`,
          data: data,
          method: 'PATCH'
        })
          .then(resp => {
              dispatch('uploadCompanies');
              commit('editCompanyGeneralData', payload)
              this._vm.$toast.open({
                message: `Данные успешно обновлены`,
                type: 'success',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
            });
              resolve({status:true})
          }).catch(err => {
            this._vm.$toast.open({
              message: `Проверьте правильность введенных данных, поля физического и юредического адреса обязательные `,
              type: 'error',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
          });
            reject(err)
          })
      })
    },
    /**
     * Получение баланса компании
     * @param commit
     * @returns {Promise<unknown>}
     */
    getCompanyUserBalance ( { commit, state } ) {
      return new Promise ((resolve, reject) => {
        // const localCompany = localStorage.getItem('defaultCompany')
        // let companyId = !localCompany ? state.companies[0].id : localCompany
        $http({
          command: '/api/finance/balance/',
          method: 'GET',
        })
        .then( res => {
          let calc = {};
          res.forEach( r => {
            calc[r.id] = r.income - r.outcome
          })
          // console.log(calc)
          commit('setCompanyBalanceUser', calc)
          resolve({status: true, result: res})
        })
        .catch( err => {
          // console.log(err)
          reject({status: false})
        })
      })
    },

    async editApplicationDocument ({commit, state}, payload) {
      const { id, type, data } = payload
      if ( type === 'select' ) {
        await commit('setEditApplicationDocument', {type: type, data: data, id: id})
        let attach = state.applicationLists.find( app => app.id === id)
        $http({
          command: `/document_attachments/company/${id}/`,
          data: attach,
          method: 'PUT'
        })
        .then( response => {
          // console.log(response)
        })
      } else if ( type === 'move' ) {
        await commit('setEditApplicationDocument', {type: type, data: data, id: id})
        let attach = state.applicationLists.find( app => app.id === id)
        $http({
          command: `/document_attachments/company/${id}/`,
          data: attach,
          method: 'PUT'
        })
        .then( response => {
          // console.log(response)
        })
      }
    },
    /**
     * Получение документов организации
     * @param commit
     * @returns
     */
    getCompanyDocuments ( {commit} ) {
      return new Promise ((resolve, reject) => {
        $http({
          command: '/api/account/document/',
          method: 'GET',
        })
        .then(response => {
          let docs = response.data
          commit('setCompanyDocuments', docs)
          resolve({status: true, result: docs})
        })
        .catch( err => {
          reject({status: false})
          // console.log(err)
        })
      })
    },

    addCompanyAttachment ( {disaptch}, payload ) {
      let types;
      return new Promise ((resolve, reject) => {
        let { attachment } = payload
        if (attachment.mode === 'user') {

        }
        $http({
          command: '/document_attachments/company/',
          data: {
            type: types,
            production_type: attachment.module,
            name: attachment.name
          },
          method: 'POST'
        })
      })
    },
    /**
     * Получение стандартных приложений
     */
    getDefaultApplication ({commit, dispatch}) {
      return new Promise((resolve, reject) => {
          $http({
            command: '/document_attachments/defaults/',
            method: 'GET'
          })
          .then ( response => {
            // console.log(response)
            let id = localStorage.getItem('defaultCompany')
            const attachment = response.attachments
            const applicationKeys = Object.keys(response.attachments)
            let arr = []
            applicationKeys.forEach( d => {
              if (d !== 'court_order') {
              attachment[d].is_active = true
              attachment[d].is_show = true
              attachment[d].type = d
              attachment[d].company = id
              attachment[d].production_type = 'judicial'
              arr.push(attachment[d])
              }
            })
            commit('apllicationListForUser', arr)
            dispatch('refreshApplication')
            // console.log(arr)
            resolve({status: true})
          })
      })
    },
    /**
     * Обновляем Стнадартные приложения как кастомные для полного управления ими
     * @param {*} state
     * @param {*} payload
     * @returns
     */
    refreshApplication ({commit, state}, payload) {
      return new Promise ((resolve, reject) => {
        let defaultCompanyId = localStorage.getItem('defaultCompany')
        axios({
          url: `${baseURL}/document_attachments/company_bulk_create/`,
          method: 'POST',
          data: {
            production_type: 'judicial',
            company_id: defaultCompanyId,
            attachments: state.applicationLists
          }
        })
        .then ( result => {
          commit('apllicationListForUser', result.data)
          resolve({status: true, userApplication: result.data})
        })
      })
    },

    /**
     * Получения приложений пользователя
     * @returns
     */
    getCompanyUserApplication ({commit, dispatch}) {
      return new Promise ((resolve, reject) => {
          let defaultCompany = localStorage.getItem('defaultCompany')
          axios({
              url: baseURL+'/document_attachments/company/',
              params: {
                  company_id: defaultCompany,
                  production_type: 'judicial'
              },
              method: "GET"
          })
          .then ( response => {
              if (response.data.length === 0) {
                dispatch('getDefaultApplication')
                resolve({status: true, userApplication: false})
              } else {
                commit('apllicationListForUser', response.data)
                resolve({status: true, userApplication: response.data})
              }
          })
          .catch ( err => {
              // console.log(err)
              // if (err.data.length === 0) {
              //   dispatch('getDefaultApplication')
              // }
              reject({status: false})
          })
      })
    },
    /**
     * Получение списка должностей
     */
    getPositionForEmployee ( {commit} ) {
      return axios({
        url: baseURL+'/api/account/position/',
        method: 'GET'
      })
      .then( resp => {
        // console.log(resp)
        commit('setPositionEmployee', resp.data)
      })
      .catch( err => {
        //
      })
    },
    /**
     * Загрузка организаций/филиалов
     * @param commit
     * @param getters
     * @param dispatch
     * @returns {Promise<unknown>}
     */
     uploadCompanies ({ commit, dispatch }) {
      let user = localStorage.getItem('user')
      user = JSON.parse(user);
      return axios({
          method: 'GET',
          url: baseURL+'/api/account/company/',
      }).then(( info ) => {
        let resultData = info.data;
          commit('uploadCompanies', resultData);
          dispatch('setCompanyDefault')
          dispatch('getCompanyUserBalance')
          setTimeout( () => {
            dispatch('getCompanySettings')
            dispatch('getCompanyUserApplication')
          }, 1000)
      }).catch((e) => {
        console.error('uploadCompanies action error', e);

        if (e.response.status === 403) {
          dispatch('logout')
        }

        dispatch('appLoadingChange', false, { root: true });
      })
    },
    /**
     * Загрузить INN shared data
     * @param commit
     * @returns {Promise<void>}
     */
    async loadInfoINNSharedData ({ commit }) {
      return $http({
        data: {
          command: 'InfoInn',
          shared_data: 1
        }
      }).then(({ info }) => {
          const formattedArray = Object.values(info).map((item) => {
            if (!item.TimeZoneCity) {
              item.TimeZoneCity = timeZones[-2 - (new Date().getTimezoneOffset() / 60)];
            }
            return item;
          });
          commit('loadInfoINNSharedData', formattedArray[0])
      });
    },
    /**
     * Загрузка ИНН чего-то там
     * @param dispatch
     * @param commit
     * @param getters
     * @returns {*}
     */
    async loadInfoINNContracts ({ commit }) {
      return $http({
        data: {
          command: 'InfoInn',
          contracts: 1
        }
      }).then(({ info }) => {
        commit('loadInfoINNContracts', Object.values(info)[0]);
      }).catch(e => {
        console.error(e);
      })
    },
    /**
     * Редактировать контракт
     * @param {*} param0
     * @param {*} payload
     */
    companyContractsEdit ({ commit, dispatch }, payload) {
      dispatch('appLoadingChange', true, { root: true });
      return $http({
        data: {
          command: 'ContractsEdit',
          ...payload
        }
      }).then(res => {
        if (res.edit === 'Complete') {
          commit('loadInfoINNContracts', data)
        }
      }).catch(err => {
        console.error('companyContractsEdit action error. companies vuex module', err)
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    },
    /**
     * Создание организации по инн через фнс
     * @param {*} Inn инн компании, для запроса данных по фнс и добавления ее в пулл организаций пользователя
     * @returns
     */
    uploadNewCompanyDataOnINN ({ dispatch, getters }, Inn) {

      return new Promise((resolve, reject) => {
        let user = localStorage.getItem('user')
        user = JSON.parse(user)

        axios({
          url: baseURL+'/api/account/company/',
          data:{
            inn: Inn
          },
          method: "POST"
        })
          .then(resp => {
            if (!resp.data.error) {
              if (resp.data.data_response === "Компания с указанным ИНН уже есть в базе!") {
                this._vm.$toast.open({
                    message: `Компания с указанным ИНН уже есть в базе!`,
                    type: 'error',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                });
                reject('Компания с указанным ИНН уже есть в базе!')
              }
              dispatch('uploadCompanies');
              resolve()
            } else {
              this._vm.$toast.open({
                message: `Серверная ошибка, повторите попытку позже`,
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
            });
              dispatch('uploadCompanies');
              reject(resp.data.error)
            }
          }).catch(err => {

            const errorKeys = Object.keys(err.response.data)
            errorKeys.forEach( e => {
              this._vm.$toast.open({
                message: `${err.response.data[e]}`,
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              });
            })

            dispatch('uploadCompanies');
            reject(err)
          })
      })
    },
    /*
    |--------------------------------------------------------------------------
    | API Вкладки сотрудников в модалке раздела "Организации"
    |--------------------------------------------------------------------------
    */
    /**
     * Загрузка Списка сотрудников компании
     */
    getListEmployee ({ commit, dispatch }) {
        dispatch('appLoadingChange', true, { root: true });
        axios({
            method: 'GET',
            url: `${baseURL}/api/account/employee/`
        }).then(res => {
          console.log(res)
            if(!res.data.error) {
              const employees = res.data
              commit('setCompanyEmployees', employees);
            }
        }).catch(e => {
            console.log(e)
            // debugger
        }).finally(() => {
          dispatch('appLoadingChange', false, { root: true });
        })
    },

    /**
     * Удалить сотрудника
     */
    deleteEmployee ({ dispatch }, payload) {
      dispatch('appLoadingChange', true, { root: true });
      console.log(payload)
      axios({
        method: 'DELETE',
        url: baseURL + `/api/account/user/${payload.id}/`
      }).then(res => {
        dispatch('getListEmployee')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    },

    /**
     * ===============================
     *  Документа организации
     * ===============================
     */

    /**
     * Добавить документ в организацию
     */
    addCompanyFile ({ dispatch }, { Type, Files }) {
      dispatch('appLoadingChange', true, { root: true });
      $http({
        data: {
          command: 'AddFileRegulation',
          files: Files,
          type: Type,
          OrganizationId: 0
        }
      }).then(res => {
        if(res.addFile === "Complete") {
          console.log('успешно добавлено')
          // const employees = Object.values(res.data[1].return.Result)
          // commit('setCompanyEmployees', employees);
        }
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        dispatch('uploadCompanies');
        dispatch('appLoadingChange', false, { root: true });
      })
    },

    /**
     * =================================================
     *  Кастомные функции по запросу данных организации
     * =================================================
     */


    /**
     * Получение организации для блока обмена данными
     * @param {String} payload Краткое имя организации
     */
    getExchengeCompany ( { state ,commit }, payload ) {
      let exchangedCompany = find(state.companies, c => {
        if (c.name_short === payload) {
          return c
        } else if (c.name_full === payload) {
          return c
        }
      })
      if (typeof exchangedCompany === undefined) {
        commit('setExchangeCompany', false)
      } else {
        commit('setExchangeCompany', exchangedCompany)
      }
    },

    updateCompanyData({commit}, payload) {
      return new Promise ((resolve, reject) => {
        $http({
          command: `/api/account/company/${payload}/`,
          method: 'GET',
        })
        .then( async resp => {
          await commit('setCompanyById', resp )
          resolve({status:true})
        })
        .catch( errors => {
          if (errors.response) {
            const error = errors.response.data
            console.error(error)
            if (error.detail) {
              this.$toast.open({
                message: `${error.detail}`,
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              });
            }
            reject(false)
          }
        })
      })
    },

    /**
     * Получениие всех данных о компаниипо по id
     * @param {Int} payload index компании в массиве
     */
    getCompanyById({state, commit}, payload) {
      const { id } = payload
      return new Promise ((res, rej) => {
        $http({
          command: `/api/account/company/${state.companies[id].id}/`,
          method: 'GET',
        })
        .then( async resp => {
          await commit('setCompanyById', resp )
          res(true)
        })
        .catch( errors => {
          if (errors.response) {
            const error = errors.response.data
            console.error(error)
            if (error.detail) {
              this.$toast.open({
                message: `${error.detail}`,
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              });
            }
            rej(false)
          }
        })
      })
    }

  },
  getters: {
    isDefaultCompanyInitiated: state => state.isDefaultCompanyInitiated,
    /**
     * Отдает список приложений пользователя
     * @param state
     */
    applicationDocument: state => state.documents.map(d => {
      return {
        name: d.name,
        can_be_attached: d.can_be_attached,
        id: d.id
      }
    }),
    employeePosition: state => state.positions,
    applicationUserList: state => state.applicationLists,
    getCompanies: state => state.companies,
    getCompaniesFullNames: state => state.companies.map(el => el.name_full),
    getDefaultCompanyId: state => state.defaultCompany,
    defaultCompanyId: state => state.defaultCompany,
    getDefaultCompany: state => state.companies.find(({id}) => id === state.defaultCompany),
    getDefaultCompanyFullName: (state, getters) => getters.getDefaultCompany?.name_full || 'Компания',
    exchangedCompanyData: state => state.exchangedCompany,
    /**
     * Вернуть данные компании по id
     */
    getCompanyGeneralData(state) {
      return () => {
        return state.modalCompanyContent
      }
    },
    getCompaniesNamesLists: state => state.companiesNamesLists,
    getInfoINNSharedData: (state) => state.InfoINNSharedData,
    getInfoINNContracts (state) {
      return state.InfoINNContracts
    },
    getDefaultCompanyShortName (state, getters) {
      return getters.getDefaultCompany?.name_short || '';
    },
    companySettings: state => state.companySettings,
    companyEmployees: state => state.companyEmployees,
    balance (state) {
       return state.companyBalance[state.defaultCompany];
    }
  }
}
