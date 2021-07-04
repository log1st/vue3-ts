import { URL, baseURL } from '@/settings/config'
import cloneDeep from 'lodash/cloneDeep'
import sortBy from 'lodash/sortBy'

export default {
    state: () => ({
        UsersList: [],
        checkedCompany: null,
        organizationVars: [],
        generalVars: [],
        debtorVars: [],
        courtVars: [],
        debtorMainVars: [],
        tenantVars: [],
        allTemplates:[],
        docsTypes:[],
        allVars: [],
        companyTemplate:[],
        applications: [],
        columnTemplate: [],
        documents: [],
        allColumnTemplate: [],
        selectedCompanySettings: false
    }),
    mutations:{
        checkCompany (state, payload) {
          state.checkedCompany = payload
        },
        setCompanyApplication (state, payload) {
          state.applications = payload
        },
        clearCompanyApplication (state) {
          state.applications = []
        },
        setCompanyTemplate (state, payload) {
//
        },
        /**
         * Установка шаблона колонок
         * @param {*} state 
         * @param {*} payload 
         */
        setColumnTemplate (state, payload) {
          state.columnTemplate = payload
        },
        AdminUserListFilterData(state, payload){
            state.UsersList.forEach(user => {
                payload.every(cols => cols.data === '' ? true : (!user[cols.key] ? false : user[cols.key].toString().toLowerCase().includes(cols.data.toLowerCase())))
                ? user.done = true
                : user.done = false
            })
        },
        setAdminUserList (state, payload) { 
            state.UsersList = payload
          },
        setEditorVars ( state, payload ) {
          const { groups } = payload
          state.allVars = groups
          state.organizationVars = groups.find( e => e.id === 1)
          state.debtorVars = groups.find( e => e.id === 2)
          state.courtVars = groups.find( e => e.id === 3)
          state.debtorMainVars = groups.find( e => e.id === 4)
          state.tenantVars = groups.find( e => e.id === 5)
          state.generalVars = groups.find( e => e.id === 6)
        },
        setCompanyBalance ( state, payload ) {
          state.checkedCompany.balance = payload
        },
        uncheckCompany (state, id) {
          const unselect = state.UsersList.filter( us => us.id != id);
            unselect.forEach((e) => {
                e.checked = false
            })
            const elem = state.UsersList.find(el => el.id === id); 
            elem.checked = !elem.checked;
        },
        setCheckApplication (state, payload) {
          const { index, type } = payload
          state.applications[index][type] = !state.applications[index][type]
        },
        setAllTemplate (state, payload) {
          state.allTemplates = payload
        },
        setDocsTypes (state, payload) {
          state.docsTypes = payload
        },
        addDefaultCompanyApplication(state, payload) {
          payload.forEach( att => {
            state.applications.push(att)
          })
        },
        clearCompanyApplication (state) {
          state.applications = []
        },
        setAllDocuments (state, payload) {
          state.documents = payload
        },
        setSelectedCompanySettings (state, payload) {
          state.selectedCompanySettings = payload 
        },
        setAllColumnTemplate ( state , payload ) {
          state.allColumnTemplate = payload
        }
    },
    actions:{
        AdminUserListFilterData ({ commit }, payload) {
          commit('AdminUserListFilterData', payload)
        },

        /**
         * Установка выбранной компании 
         * @param {*} id выбранной компании
         * @returns Promise
         */
        checkCompany({ commit, state, dispatch }, id){
          return new Promise ((resolve, rej) => {
            const elem = state.UsersList.find(el => el.id === id); 
            commit('uncheckCompany', elem.id)

            if (elem.checked) {
              $http({
                command: `/api/account/company/${elem.id}/`,
                method: 'GET'
              })
              .then ( res => {
                if (res.RequestStatusCode === 200) {
                  res.checked = true
                  commit('checkCompany', res)
                  resolve(true)
                } else {
                  rej(false)
                }
              })
            } else {
              commit('checkCompany', null)
              resolve(true)
            }
          })
        },

        setAdminUserList({ commit, getters }){
            let userRole, user;
            if (typeof window !== 'undefined') {
              user = localStorage.getItem('user');
              user = JSON.parse(user);
              userRole = user.role;
            } else {
              userRole = 'company'
            }
            if (userRole == 'admin') { // ПЕРЕД ЗАГРУЗКОЙ СТАВЬ admin
            return new Promise((resolve, reject) => {
              let token = localStorage.getItem('token')
              axios.defaults.headers.common["X-Auth-Token"] = token
              
              axios.get(URL+'/api/account/company/')
                .then(resp => {
                  if (resp.data) {
                    resp.data.forEach( c => { c.checked = false }) // добавляем поле для checkbox
                    let companyList = resp.data
                    companyList = sortBy( companyList, o => o.owner )
                    commit('setAdminUserList', companyList)
                    resolve()
                  } else {
                    reject(resp.data.error)
                  }
                }).catch(err => {
                  reject(err)
                })
            })
          }
        },

        GetAdminCreateCompany ( {state}, payload) {
          axios({
            url: baseURL + '/api/account/company/',
            data: {...payload},
            method: 'POST'
          })
          .then (
            res => {
              events.$emit('CompanyWasCreated', true)
            }
          )
        },

        getAdminCreateCompanyFNS ( {dispatch ,state}, payload ) {
          axios({
            url: baseURL + '/api/account/company/',
            data: {...payload},
            method: 'POST'
          })
          .then (
            res => {
              events.$emit('CompanyWasCreated', true)
              this._vm.$toast.open({
                message: `Компания добавлена`,
                type: 'success',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
            });
            dispatch('setAdminUserList')
            }
          ).catch( err => {
            this._vm.$toast.open({
              message: `${err}`,
              type: 'error',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
          });
          })
        },
        getAllColumnTemplate ({commit}, payload) {
          return $http({
            command: '/api/document-parsing/templates/',
            method: 'GET',
            requestCode: 'none'
          })
          .then ( resp => {
            commit('setAllColumnTemplate', resp)
            // console.log(resp)
          })
          .catch ( error => {
            console.log(error)
          })
        },

        /**
         * Полечение шаблона компании
         * @param {*} commit 
         * @param {*} dispatch 
         * @param {*} payload 
         * @returns 
         */
        getColumnTemplate ({commit, dispatch}, payload) {
          const { id } = payload
          return new Promise ((resolve, reject) => {
            $http({
              command: `/api/document-parsing/templates/${id}/`,
              method: 'GET',
              requestCode: 'none'
            }).then (resp => {
              resolve({status: true, item: resp})
              commit('setColumnTemplate', resp)
              console.log(resp)
            }).catch(err => {
              console.log(err)
              reject({status: false})
              dispatch('getDefautltColumnTemplate') 
            })
          }) 
        },

        getDefautltColumnTemplate ({commit}) {
          return new Promise ((resolve, reject) => {
            $http({
              command: `/api/document-parsing/templates/default/`,
              method: 'GET'
            })
            .then (resp => {
              commit('setColumnTemplate', resp)
              resolve({status: true, items: resp})
            })
            .catch (error => {
              reject({status: false, msg: error})
            })
          })
        },
        /**
         * Изменить админ -настройки организации
         */
        changeOrganizationAdminSettings({ state, commit }, payload) {
          //
        },
        clearCompanyApplication ({commit}) {
          commit('clearCompanyApplication')
        },

        setUpdatedApplication ({state, commit}, payload) {
          return new Promise ((resolve, reject) => {
            let attachments = state.applications
            attachments.forEach(att => {
              if (att.id) {
                delete att.id
              }
              if (att.model) {
                delete att.model
              }
            })
            axios({
              url: `${baseURL}/document_attachments/company_bulk_create/`,
              method: 'POST',
              data: {
                company_id: state.checkedCompany.id,
                production_type: payload,
                attachments
              }
            })
            .then (response => {
              resolve({status: true})
              commit('setCompanyApplication', response.data)
              console.log(response)
            })
          })
        },

        addDefaultApplicationToArray ({ state, commit, dispatch }, payload) {
          return new Promise ((resolve, reject) =>{
            $http({
              command: '/document_attachments/defaults/',
              method: 'GET'
            })
            .then( response => {
              let attachment = response.attachments
              const applicationKeys = Object.keys(response.attachments)
              let arr = []
              applicationKeys.forEach( d => {
                attachment[d].is_active = true
                attachment[d].is_show = true
                attachment[d].type = d
                attachment[d].company = state.checkedCompany.id
                attachment[d].production_type = payload
                arr.push(attachment[d])
              })
              commit('addDefaultCompanyApplication', arr)
              dispatch('setUpdatedApplication', payload)
              resolve({status: true})
            })
            .catch( err => {
              reject({status: false})
            })
          })
        },
        getDefaultApplicationAdmin ({commit}) {
          return new Promise ((resolve, reject) =>{
            $http({
              command: '/document_attachments/defaults/',
              method: 'GET'
            })
            .then( response => {
              let attachment = response.attachments
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
              commit('setCompanyApplication', arr)
              resolve({status: true})
            })
            .catch ( err => {
              reject({status: false, msg: err})
            })
          })
        },
        /**
         * Получение приложений организации
         * @returns 
         */
        getCompanyApplication ( {dispatch, commit}, payload ) {
          const { id, type } = payload
          return new Promise ((resolve, reject) => {
            axios({
              url: baseURL+'/document_attachments/company/',
              params: {
                company_id: id,
                production_type: type
              },
              method: 'GET'
            })
            .then( async resp => {
              let items = resp.data
               if ( resp.data.length > 0) {
                commit('setCompanyApplication', items)
                resolve({applications: items, status: true})
              }
             else if (resp.data.length === 0) {
               await dispatch('getDefaultApplicationAdmin')
               await dispatch('addDefaultApplicationToArray', type)
                resolve({applications: items, status: true})
              }
              // console.log(resp)
            })
            .catch( err => {
              reject(err)
              commit('clearCompanyApplication')
              dispatch('getDefaultApplicationAdmin')
              console.log(err)
              
            })
          })
        },
        /**
         * Получение баланса компании
         */
        getCompanyBalance ({ state, commit }, payload) {
          return new Promise ((res, rej) => {
            const { company_id } = payload
            let checkedCompany = state.UsersList.find( c => c.checked === true) 
            $http({
              command: `/api/finance/balance/${checkedCompany.owner}/`,
              method: 'GET',
              requestCode: 'none'
            })
            .then ( result => {
              let calc;
              let company = result.find( c => c.id === company_id)
              calc = company.income - company.outcome
              // console.log(calc)

                // let calc = result[0].income - result[0].outcome
                commit('setCompanyBalance', calc)
                res(true)
            })
          })
        },

        /**
         * @param {*State} state объект state нужен ибо vue истерит
         * @param {*} payload 
         * @returns 
         */
        getBalanceByUserId ( { state }, payload) {
          return new Promise ((resolve, reject) => {
            const { owner } = payload
            $http({
              command: `/api/finance/balance/${owner}/`,
              method: 'GET',
              requestCode: 'none',
            })
            .then (res => {
              // if (res.RequestStatusCode === 200 || res.RequestStatusCode === 201) {
                let calc = [];
                // let company = result.find( c => c.id === company_id)
                // calc = company.income - company.outcome
                // let calc = res[0].income - res[0].outcome
                res.forEach( company => {
                  calc.push(company.income - company.outcome)
                })
                let result = 0;
                calc.forEach( sum => {
                  result +=  sum
                })
                // console.log(result)
                resolve(result)
            })
          })
        },
        
        getCompanySettingsById ( {commit}, payload ) {
          return new Promise ((res, rej) => {
            const { id } = payload
            $http({
              command: `/api/account/company-settings/${id}/`,
              method: 'GET'
            })
            .then(resp => {
              commit('setSelectedCompanySettings', resp)
              res({status: true, item: resp})
            })
            .catch ( error => {
              rej({status: false, msg: error})
            })
          })
        },

        /**
         * Обновить данные выбранной организации
         */
         updateData ({state, commit, dispatch}) {
          return new Promise ((res, rej) => {
            const elem = state.checkedCompany
            if (elem.checked) {
              $http({
                command: `/api/account/company/${elem.id}/`,
                method: 'GET'
              })
              .then ( async result => {
                if (result.RequestStatusCode === 200) {
                  result.checked = true
                  commit('checkCompany', result)
                  await dispatch('getCompanyBalance', {company_id: elem.id})
                  .then( resp => {
                    if (resp) {
                      res(true)
                    }
                  })
                  // await dispatch('getCompanySettingsById', {id: elem.id})
                } else {
                  rej(false)
                }
              })
            } else {
              commit('checkCompany', null)
              resolve(true)
            }
          })
        },
        /**
         * Вешает флаг выбора на приложение
         * @param {Int} payload index приложения в массиве
         */
         setCheckApplication({commit}, payload){
          commit('setCheckApplication', payload)
          // this.updateApplication(index)
        },
        /**
         * Финальная установка шаблона на организацию (выбор модуля из модального окна)
         * @param {*} payload данные шаблона
         */
        setFinalyDocumentTemplate ( { state }, payload ) {
          const { template } = payload
         return axios({
            url:`${baseURL}/constructor/company/template/`,
            method: 'POST',
            data: {
              company: state.checkedCompany.id,
              production_type: template.template_type,
              template: template.id
            }
          })
          .then(resp => {
                if (resp.status === 200 || resp.status === 201) {
                  this._vm.$toast.open({
                    message: `Шаблон установлен`,
                    type: 'success',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                  })
                }
          })
          .catch( err => {
            let errorsKeys = Object.keys(err.response.data)
            errorsKeys.forEach(error => {
              this._vm.$toast.open({
                message: err.response.data[error][0],
                type: 'success',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              })
            })
            console.log(err)
          })
        },

        /**
         *  Обновление шаблона организации
         */
        patchCompanyDocumentTemplate ( {state}, payload ) {
          const { template } = payload
          // console.log(template)

         return axios({
            url:`${baseURL}/constructor/company/template/${template.existId}/`,
            method: 'PATCH',
            data: {
              company: state.checkedCompany.id,
              production_type: template.template_type,
              template: template.id
            }
          })
          .then(resp => {
            if (resp.status === 200 || resp.status === 201) {
              this._vm.$toast.open({
                message: `Шаблон установлен`,
                type: 'success',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              })
            }
          })
          .catch( err => {
            console.log(err)
          })
        },
        /**
         * Получение всех доступных документов (всех компаний)
         * @param {*} commit 
         * @returns 
         */
        getAllDocuments ( {commit} ) {
          return $http({
            command: `/api/account/document/`,
            method: 'GET',
            requestCode: 'none'
          })
          .then( resp => {
            commit('setAllDocuments', resp)
          })
        },

        deleteDocument ( { dispatch }, payload ) {
          const { id } = payload
          return $http({
            command: `/api/account/document/${id}/`,
            method: 'DELETE',
          }).then ( resp => {
            this._vm.$toast.open({
              message: `Документ удален`,
              type: 'success',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
            })
            dispatch('getAllDocuments')
          })
          .catch( error => {
            this._vm.$toast.open({
              message: `Ошибка удаления документа - ${error} `,
              type: 'erorr',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
            })
          })
        },
        /**
         *  ========================================
         *  Конструктор документов
         *  ========================================
         */

        /**
         * Получение типов документов
         */
        getDocumentTypes ({commit, dispatch}) {
          return new Promise ((resolve, reject) => {
            $http({
            command: '/constructor/template_type/',
            method: 'GET',
            })
            .then( resp => {
              resolve({status: true, types: resp})
              commit('setDocsTypes', resp)
            })
            .catch( err => {
              if (err.status === 403) {
                dispatch('logout')
                reject(false)
              }
            })
          })
        },
        
        editVariable ( { state }, payload ) {
          const { item, id } = payload
          return new Promise ((resolve, reject) => {
            $http({
              command: `/constructor/variable/${id}/`,
              method: 'PATCH',
              data: item
            })
            .then(res => {
              if (res.RequestStatusCode === 200 || res.RequestStatusCode === 201) {
                this._vm.$toast.open({
                  message: `Данные сохранены`,
                  type: 'success',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
                })
                resolve(true)
              }
            })
            .catch( err => {
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

        /**
         * Получение шаблона документа на редактирование 
         * @param {*} payload id шаблона 
         * @returns 
         */
        editDocumentTemplate ({dispatch}, payload) {
          return new Promise ((resolve, reject) => {
            $http({
              command: `/constructor/template/${payload}/`,
              method: 'GET'
            })
            .then ( resp => {
              if (resp.RequestStatusCode === 200 || resp.RequestStatusCode === 201) {
                this._vm.$toast.open({
                  message: `Шаблон готов к редактированию \nЗагрузка конструктора...`,
                  type: 'success',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
                });
                dispatch("getAllTemplate")
                resolve(resp)
              }
            })
            .catch( err => {
              this._vm.$toast.open({
                message: `${err}`,
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              });
              reject(false)
            })
          })
        },

        /**
         * Удаленя шаблона по id
         * @param {*} payload id удаляемого шаблона
         * @returns 
         */
        deleteDocumentTemplate ( {dispatch}, payload ) {
          return new Promise ((resolve, reject) => {
            $http({
              command: `/constructor/template/${payload}/`,
              method: 'DELETE'
            })
            .then( resp => {
                console.log(resp)
                this._vm.$toast.open({
                  message: `Шаблон удален`,
                  type: 'success',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
              });
                dispatch("getAllTemplate")
                resolve(true)
            })
            .catch( err => {
              this._vm.$toast.open({
                message: `${err}`,
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              });
              dispatch("getAllTemplate")
              reject(false)
            })
            .finally ( () => {
              resolve(true)
              dispatch("getAllTemplate")
            })

          })
        },

          /**
          * Получение всех созданых шаблонов
          */
          getAllTemplate ( { commit, dispatch } ) {
            return new Promise ((resolve, reject) => {
              dispatch('appLoadingChange', true, { root: true });
              $http({
                command: '/constructor/template/',
                method: 'GET',
              })
              .then( resp => {
                if (resp.RequestStatusCode === 200 || resp.RequestStatusCode === 201) {
                  dispatch('appLoadingChange', false, { root: true });
                  commit('setAllTemplate', resp)
                  resolve(resp)
                }
              })
              .catch( err => {
                console.log(err)
                if (err.response.status === 403) {
                    dispatch('logout')
                }
                dispatch('appLoadingChange', false, { root: true });
                reject()
              })
                dispatch('appLoadingChange', false, { root: true });
              })
          },

          createDocumentType ({dispatch}, payload) {
            return new Promise ((resolve, reject) => {
              $http({
              command: '/constructor/template_type/',
              method: 'POST',
              data: payload
              })
              .then ( resp => {
                if (resp.RequestStatusCode === 200 || resp.RequestStatusCode === 201) { 
                  dispatch('getDocumentTypes')
                  resolve(true)
                }
              }).catch( err => reject(false)) 
            })
            
          },

        /**
         * @param payload содержит id категории
         * @description Получение переменных для конструктора по id категории документа  
         */
         getEditorVars ( {commit}, payload ) {
          $http({
            command: '/constructor/vars',
            method: 'GET',
            params: {
              production_type: payload
            }
          })
          .then ( res => {
            console.log(res)
            commit('setEditorVars', res)
          })
        },
        
    },
    getters:{
        /**
         * Список компаний
         * @param state
         */
        getAdminUserListArray: state => state.UsersList,
        
        /**
         * Объект компании
         * @param state
         */
        getCompany: state => state.checkedCompany,

        /**
         * Минимизированный объект компании 
         * @param state
         */
        minCompany: state => state.UsersList.find(el => el.checked === true) || false,

        /**
         * Все типы шаблонов документов 
         * @param state
         */
        allDocsTypes: state => state.docsTypes,

        /**
         * Все шаблоны документов
         * @param state
         */
        docsTemplates: state => state.allTemplates,

        /**
        * Отмеченные задолжники
        * @param state
        */
        checkedCompany (state) {
            return cloneDeep(state.UsersList.filter(d => d.checked));
        },

        /**
         * Все приложения организации
         * @param state
         */
        companyApplications: state => state.applications,

        /**
         * Все переменные что приходят в обертки групп
         */
        allGroupsVariables: state => state.allVars,

        /**
         * Получение шаблона парсинга документа 
         * @param state
         */
        columnTemplate: state => state.columnTemplate,

        /**
         * Получение документов по id компании
         * @param state
         * @param {Integer} id компании 
         */
        documentsByCompanyId: (state) => (id) => {
            return state.documents.filter( doc => doc.company === id )
        },

        adminCompanySettings: state => state.selectedCompanySettings,
        allColumnTemplate: state => state.allColumnTemplate
    }
}