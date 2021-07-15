<template>
    <div class="main admin__wrapper">
        <div class="main__head">
            <div class="main__head-title mt-6">Список организацей</div>
        </div>
        <admin-delete-court-n-debtor-adress></admin-delete-court-n-debtor-adress>
        <admin-create-company/>
        <div class="main__content pt-20">
            <div class="admin__wrapper">
                <div class="admin__wrapper-company">
                    <div class="admin__controls" style="display:flex; flex-direction: row; align-items: center">
                      <div class="btn btn-icon" @click="searchOpen = !searchOpen; $emit('changeControlHeight', searchOpen)">
                        <icon-base v-if="!searchOpen" width="13" height="13" iconColor="#848aa1">
                          <icon-search />
                        </icon-base>
                        <icon-base v-else width="9" height="9" iconColor="#848aa1">
                          <icon-close />
                        </icon-base>
                      </div>
                      <div class="placeholder">
                        Поиск организации 
                      </div>
                    </div>
                    <transition name="fade">
                      <div v-show="searchOpen" class="admin__search">
                        <div v-for="(item, i) in searchInputs" :key="'admins' + i" style="padding: 0 10px">
                          <search-input :params="item" @changeInputValue="changeInputsValueSearch($event, i)" />
                        </div>
                        <div class="organization__table" v-if="selectedCompany != null && searchData[0].data != ''">
                      <div class="search__result" style="padding: 10px">
                        <table style="width: 100%">
                          <tbody>
                          <tr class="searchdata" v-for="(item, index) in $store.getters.getAdminUserListArray" :key="index">
                                  <td @click='checkedCompany(item.id, item)'><checkBox :checked="item.checked"></checkBox></td>
                                  <td>id: {{item.id}} <span @click="openTransferBalanceModal(item)">+</span></td>
                                  <td>{{item.name_short}}</td>
                                  <!-- <td v-if="item.Phone != ''">Телефон: {{item.Phone}}</td> -->
                                  <td v-if="item.email != ''">Email: {{item.email}}</td>
                                  <td v-if="item.email == ''">Нет данных</td>
                                  <td>ИНН: {{item.inn}}</td>
                                  <td title="Количество должников в модуле досудебное производство">ДП: {{0}}</td>
                                  <td title="Количество должников в модуле судебное производство">СП: {{0}}</td>
                                  <td title="Количество должников в модуле исполнительное производство">ИП: {{0}}</td>
                                  <td>Баланс:{{0}}</td>

                          </tr>
                          </tbody>
                        </table>
                        </div>
                    </div>
                      </div>
                    </transition>
                    <div class="organization__table" v-if="selectedCompany == null || selectedCompany.checked == false">
                      <div class="search__result" style="padding: 10px">
                        <table style="width: 100%">
                          <tbody>
                          <tr class="searchdata" v-for="(item, index) in $store.getters.getAdminUserListArray" :key="index">
                                  <td @click='checkedCompany(item.id, item)'><checkBox :checked="item.checked"></checkBox> </td>
                                  <td><span title="Перевод баланса" style="font-size: 1.5em; color: red" @click="openTransferBalanceModal(item)">+</span></td>
                                  <td>id: {{item.id}} </td>
                                  <td>{{item.name_short}}</td>
                                  <td>id владельца: {{item.owner}}</td>
                                  <td v-if="item.email">Email: {{item.email}}</td>
                                  <!-- <td v-if="!item.email">Нет данных о </td> -->
                                  <td>ИНН: {{item.inn}}</td>
                                  <td title="Количество должников в модуле досудебное производство">ДП: {{0}}</td>
                                  <td title="Количество должников в модуле судебное производство">СП: {{0}}</td>
                                  <td title="Количество должников в модуле исполнительное производство">ИП: {{0}}</td>
                                  <td>Баланс:{{0}}</td>
                          </tr>
                          </tbody>
                        </table>
                        </div>
                    </div>
                    <div class="admin__content" v-if="selectedCompany != null && selectedCompany.checked == true">
                        <div class="admin__table">
                          <div class="selected__company">
                              <div class="selected__company-header">
                              <span @click="uncheckCompany(SelectedUserId)" id="checkbox1"><checkBox :checked="selectedCompany.checked" ></checkBox></span>
                              <span id="name1">{{selectedCompany.name_short}}</span>
                              <!-- <span id="phone__email" v-if="selectedCompany.Phone != ''">Телефон: {{selectedCompany.Phone}}</span> -->
                              <span id="phone__email" v-if="selectedCompany.email != ''">Email: {{selectedCompany.email}}</span>
                              <span id="inn1">ИНН: {{selectedCompany.inn}}</span>
                              <span id="debtcount1">Колличество должников: 0</span>
                              <span id="balance1">Баланс: {{selectedCompany.balance}} </span>
                              <span @click="addBalance()" style="cursor:pointer">
                                <icon-base width="15" height="15" iconColor="#848aa1">
                                  <icon-edit />
                                </icon-base>
                              </span>
                              </div> 
                          </div>
                          <div class="main-container__head">
                            <div class="main-container__title">Настройка клиента</div>
                          </div>
                          <div class="main-container__body">
                            <div class="inputs__wrapper" v-for="(data, i) in CompanyData" :key="'head' + i">
                              <div v-for="(input, j) in data.inputs" class="compib__row" :key="i + 'xcvsdf' + j">
                                <div class="compib__row-label">
                                  <span>{{ input.label }}</span>
                                </div>
                                <div class="compib__input" :key="input.action ? updateContentInner[input.key] + 'asdasd' : null">
                                  <v-select class="main_company-template" :placeholder="input.inputParams.setItem" :options="input.inputParams.items" @input="setTemplate($event, input)" label="name" v-model="input.inputParams.data"></v-select>
                                </div>
                                <ur-btn
                                  class="delete__template-btn"
                                  @click="deleteLinkedTemplate(input.inputParams.existItem)"
                                  title="Удаление связи установленного шаблона"
                                  >
                                    X
                                  </ur-btn>
                              </div>
                            </div>
                              <div class="draft__create"> 
                                  <div class="btn btn-primary"><router-link :to="{ name: 'Admin' }">Создать шаблон</router-link></div>
                                  <div class="btn btn-primary" style="margin-top: 0.5em" @click="setDocumentTemplate()">Применить выбранные шаблоны</div>
                              </div>
                            </div>
                            <admin-company-court-template :templates="comapnyTemplates" :company="this.selectedCompany" />
                            <!-- Настройка приложений -->
                            <div class="application__wrapper">
                              <div class="col__half">
                                <div class="main-container__head justify-content-between">
                                 <div class="main-container__title">Приложение</div>
                                 <!-- <div class="d-flex align-items-center">
                                    <div class="main-container__title">Режим администратора</div>
                                    <checkBox 
                                      :checked="selectedCompany.AdminSettings.ApplicationsMode === 'Admin' ? true : false" 
                                      @change="setCompanySettings({ e: $event, selectedCompany, settingsMode: 'ApplicationsMode' })" class="m-2"></checkBox>
                                  </div> -->
                               </div>
                              <btn-group class="btn-group-application" :buttons="prodButtons" :active="currentActiveAppProd" @currentActive="selectApplicationProduction($event); currentActiveAppProd = $event"/>
                               <div class="container-content">
                                 <div class="icon__wrapper">
                                  <span style="position: relative; top: 1em; margin-left: 52px;">
                                   <icon-base width="25" height="20" viewBox="0 0 40 25" iconColor="#848aa1">
                                    <icon-print />
                                  </icon-base>
                                  </span>
                                 <span style="position: relative; top:1em">
                                   <icon-base width="20" height="20" iconColor="#848aa1">
                                    <icon-eye />
                                  </icon-base>
                                  </span>
                                 </div>
                                 <ul style="flex-wrap:nowrap; overflow-y: auto">
                                  <draggable
                                    :list="companyApplicationsList"
                                    ghost-class="ghost"
                                    :move="checkMove"
                                    @start="dragging = true"
                                    @end="dragging = false"
                                  >                                 
                                    <li v-for="(list, index) in this.companyApplicationsList" :key="index">
                                      <span class="application__index">{{index + 1}}.</span>
                                      <!-- <span @click="setCheckApplicationToCompile(index, list)"><checkBox :checked="list.CompileSelect"></checkBox></span> -->
                                      <span @click="setCheckApplication({index: index, type:'is_active'})"><checkBox :checked="list.is_active"></checkBox></span>
                                      <span @click="setCheckApplication({index: index, type: 'is_show'})"><checkBox :checked="list.is_show"></checkBox></span>
                                       {{list.name}}
                                       <span v-if="editApplicationMod" @click="renameApplication(list.id, list)" class="edit__application-icon">
                                          <icon-base width="15" height="15" iconColor="#848aa1">
                                            <icon-edit />
                                          </icon-base>
                                       </span>
                                       <span class="edit__application-icon" title="Удалить" @click="deleteApplication({id:list.id, production_type: list.production_type})">
                                          X
                                       </span>
                                    </li>
                                 </draggable>
                                  </ul>
                                  <div class="content__btn-wrapper">
                                     <div class="btn btn-primary" @click="addNewApplication()">Добавить приложение</div>
                                     <div class="btn btn-primary" @click="editApplicationMod = !editApplicationMod">Редактировать</div>
                                  
                                     <ur-btn
                                          class="btn btn-primary"
                                          :loading="loading"
                                          @click="saveApplicationState()"
                                          :disabled="disabled"
                                      >
                                          <span>Сохранить</span>
                                      </ur-btn>
                                  </div>
                               </div>
                            </div>
                              <!-- Услуги -->
                              <div class="col__half">
                                <div class="main-container__head justify-content-between">
                                  <div class="main-container__title">Выбор услуги</div>
                                  <!-- <div class="d-flex align-items-center">
                                    <div class="main-container__title">Режим администратора</div>
                                    <checkBox 
                                      :checked="selectedCompany.AdminSettings.ServicesMode === 'Admin' ? true : false" 
                                      @change="setCompanySettings({ e: $event, selectedCompany, settingsMode: 'ServicesMode' })" class="m-2"></checkBox>
                                  </div> -->
                                </div>
                               <div class="container-content">
                                 <ul style="margin-top: 2.45em;">
                                   <li v-for="(list, index) in this.selectedCompany.Adminservices" :key="index">
                                     <span @click="setCheckService(index)"><checkBox :checked="list.Select" ></checkBox></span>
                                     {{list.Type}}</li>
                                 </ul>
                                 <div class="content__btn-wrapper">
                                    <div class="btn btn-primary" @click="addNewSevice()">Добавить новую услугу</div>
                                 </div>
                               </div>
                              </div>
                            </div>
                            <div class="main-container__head" style="margin-top:2em">
                              <div class="main-container__title">Настройка полей для вырузки</div>
                            </div>
                            <admin-company-data-config :company="this.selectedCompany" />
                            <div class="main-container__head" style="margin-top:2em">
                              <div class="main-container__title">Изменение региона</div>
                            </div>
                            <admin-regions :company="this.selectedCompany" />
                            <!-- данные подписанта организации (фио, должность, документы) -->
                            <admin-company-signer :company="this.selectedCompany" />
                            <admin-delete :selected-company="this.selectedCompany" />
                            <div class="main-container__head">
                                <div class="main-container__title">Документы</div>
                            </div>
                            <!-- устав, свидетельство о гос. регистрации, протокол -->
                            <admin-docs :company="this.selectedCompany" />
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import checkBox from '@/components/elements/CheckBox'
import searchInput from '@/components/elements/SearchInput'
import draggable from "vuedraggable";
import AdminDocs from './components/AdminDocs'
import AdminRegions from './components/AdminRegions'
import AdminCompanySigner from './components/AdminCompanySigner'
import AdminDeleteCourtNDebtorAdress from './components/AdminDeleteCourtNDebtorAdress'
import AdminCompanyDataConfig from './components/AdminCompanyDataConfig'
import AdminCreateCompany from './components/AdminCreateCompany'
import AdminCompanyDelete from './components/AdminCompanyDelete'
import { baseURL, URL } from '@/settings/config'
import _ from 'lodash'
import cloneDeep from 'lodash/cloneDeep'
import AdminCompanyCourtTemplate from './components/AdminCompanyCourtTemplate.vue'

export default {
    name: 'AdminCompany',
    components: { 
      searchInput,
      checkBox,
      'admin-company-court-template':AdminCompanyCourtTemplate,
      'admin-delete-court-n-debtor-adress':AdminDeleteCourtNDebtorAdress,
      'admin-company-data-config':AdminCompanyDataConfig,
      'admin-regions': AdminRegions,
      'admin-company-signer':AdminCompanySigner,
      'admin-docs': AdminDocs,
      'admin-create-company': AdminCreateCompany,
      'admin-delete': AdminCompanyDelete,
      draggable
    },
    data(){
        return{
                contentUpdate: 0,
                searchOpen: false,
                searchInputs: [
                  { placeholder: 'Поиск организации'},
                ],
                actionsIcons: ['view', 'edit'],
                searchData: [
                  { key: 'FullNameOrganization', data: '' },
                ],
                currentActiveAppProd: 1,

                prodButtons: [
                  { name: 'Досудебное' },
                  { name: 'Судебное' },
                  { name: 'Исполнительное' },
                ],

                TemplateDocs: [],
                UsersList: [],

                selectedCompany: null,
                SelectedUserId: null,

                loading: false,
                disabled: false,

                compileDocs: [],
                documentArray: [],

                comapnyTemplates: [],

                moderationMod: false,
                editApplicationMod: false,

                selectedTemplate:{
                  CourtOrder:'',
                  CourtOrderShareholders:'',
                  SetOfCharges: ''
                },

                CompanyData:[
                  {
                    title: 'Header',
                    inputs:{}
                  }
                ],
            }
    },
    methods: {
      ...mapActions([
        'setAdminUserList',
        'AdminUserListFilterData', 
        'checkCompany', 
        'setPopupState', 
        'setPopupComponent', 
        'openPopup', 
        'getCompanyBalance',
        'updateData',
        'getBalanceByUserId',
        'getAllTemplate',
        'getDocumentTypes',
        'getCompanyApplication',
        'clearCompanyApplication',
        'setUpdatedApplication',
        'getRegionsList',
        'getColumnTemplate',
        'getAllDocuments',
        'getAllColumnTemplate'
        ]),

      ...mapMutations([
        'setCompanyTemplate', 
        'setCheckApplication'
      ]),

        saveApplicationState () {
          this.setUpdatedApplication({prod_type_num: this.currentActiveAppProd, type: false})
        },
        /**
         * Открытие модального окна перевода средств
         * @param {Object} payload объект компании
         */
        openTransferBalanceModal (payload) {
            let comapnyData = payload
            this.getBalanceByUserId(comapnyData)
            .then( res => {
              comapnyData.balance = res
              this.setPopupComponent( {component: 'AdminTransferBalance', params: { company: comapnyData } } )
            })
        },

        /**
         * Установить режим администратора
         * const { e: Boolean, selectedCompany: Object, settingsMode: String }
         * e - значение чекбокса, selectedCompany - текущая компания,  settingsMode - какой раздел настраивается
         */
        setCompanySettings(payload) {
          payload.e = !payload.e 
          this.selectedCompany.AdminSettings[payload.settingsMode] = payload.e ? 'Admin' : 'User';
          // debugger
          // запрос на изменение настроек
          this.$store.dispatch('changeOrganizationAdminSettings', { 
            PhoneUser: this.selectedCompany.Phone,
            EmailUser: this.selectedCompany.Email,
            ApplicationsMode: this.selectedCompany.AdminSettings.ApplicationsMode,
            ServicesMode: this.selectedCompany.AdminSettings.ServicesMode
          });
        },

        addBalance () {
            this.setPopupComponent({component: 'AdminAddBalance', params:{
              company: this.selectedCompany,
            }})
        },

        // Переименование приложения
        renameApplication (id, data) {
            this.setPopupComponent({component: 'AdminApplicationEdit', params:{
              id: id, 
              item: data,
              companyId: this.SelectedUserId
            }})
        },

        setTemplate (e, input) {
          // так как v-select имеет косяк в плане реактивности назначении данных из вне приходиться делать так
          this.updateCompanyData()
        },

        // Сохранение изменений в приложении
        saveApplicationData () {
          this.lodaing = true
          this.disabled = true
          this.editApplicationMod = false
        },

        changeInputsValueSearch (event, i) {
            this.searchData[i].data = event
            this.AdminUserListFilterData(this.searchData)
        },

        setCheckApplicationToCompile(id, data){
          if(this.selectedCompany.AdminApplications[id].CompileSelect == 1 || this.selectedCompany.AdminApplications[id].CompileSelect == true){
            this.selectedCompany.AdminApplications[id].CompileSelect = false
            if (this.compileDocs != null) {
              let toDelIndex = this.compileDocs.findIndex(e => e == data.IdApplications)
              this.compileDocs.splice(toDelIndex, 1);
            }
          } else {
            this.selectedCompany.AdminApplications[id].CompileSelect = true
            if (data.FileID == "-1") {
              this.addFileToApplication(data)
            } else {
              this.compileDocs.push(data.IdApplications) 
            }
          }
          let index = id
        },

        /**
         * Выбор модуля приложений
         */
        selectApplicationProduction (production) {
          let production_type = 'judicial';
          switch (production) {
            case 0:
              production_type = 'pretrial'
              break;
            case 1:
              production_type = 'judicial'
              break;
            case 2:
              production_type = 'executive'
              break;
          }
              this.getCompanyApplication({id:this.SelectedUserId, type: production_type})
        },

        /**
         * Вызов модального окна для окончательного назначения шаблона
         */
        setDocumentTemplate () {
          const keys = Object.keys(this.CompanyData[0].inputs)
          let array = new Array
          keys.forEach( item => {
              if (this.CompanyData[0].inputs[item].inputParams.data) {
                let templateItem = this.CompanyData[0].inputs[item].inputParams.data
                array.push(templateItem)
              }
          })
          this.setPopupComponent({component: 'AdminChangeModuleTemplate', params: {
            selectedCompanyId: this.SelectedUserId,
            templates: array,
            alreadyIsntall: this.comapnyTemplates
          }})
        },

        /**
         * Получение шаблонов организации
         * @param {Int} payload id организации
         * @description Есть нестандартное решение по перебору объекта и массива внутри него (467)
         */
        getDocumentTemplate(payload){
          return new Promise ((resolve, reject) => {
            axios({
              url: `${baseURL}/constructor/company/template/`,
              params: {
                company_id: payload
              },
              method: 'GET'
            })
            .then( response => {
              this.comapnyTemplates = response.data
              resolve({status: true, templates: this.comapnyTemplates})
            })
            .catch( err => {
              resolve({status: true, templates: false})
            })
          })
        },

        /**
         * Снятие флага выбора с организации
         * @param {Int} id Оргнизации
         */
        uncheckCompany(id){
          this.checkCompany(id)
          this.selectedCompany.checked = false
          this.clearCompanyApplication()
        },

        /**
         * Выбор компании из чекбокса
         * @param {Int} id Компании что выбрана
         * @param {Object} data Данные компании
         */
        checkedCompany (id, data) {
          this.SelectedUserId = id
          let cloneCompany;
          this.checkCompany(this.SelectedUserId)
          .then ( res => {
            if (res) {
              cloneCompany = cloneDeep(this.getCompany);
              this.selectedCompany = cloneCompany
              this.getDocumentTemplate(this.selectedCompany.id)
              .then( result => {
                 this.allDocsTypes.forEach( type => {

                    let objectKey = type.name 
                    let template = result.templates.find( tm => tm.template_obj.template_type === type.id)

                    this.setReactiveCompanyData({inputsType: objectKey, template: template})
                })
                this.getCompanyBalance()
                this.updateCompanyData()
                this.getColumnTemplate({id:this.selectedCompany.id})
              })
              this.getCompanyApplication({id:this.SelectedUserId, type: 'judicial'})
            }
          })
        },

        /**
         * Установка реактивности полей выбора шаблона
         * @param {Object} payload inputsType и объект template
         * @description v-select не принимает данные назначенные как value из вне из за чего приходиться перезапускать процесс 
         */
        setReactiveCompanyData (payload) {
          const { inputsType, template } = payload
          if (!!template) {
            // this.CompanyData[0].inputs[inputsType].inputParams.setItem = template
            // this.CompanyData[0].inputs[inputsType].inputParams.setItem.template_obj.name = template.template_obj.name  
            
            this.$set(this.CompanyData[0].inputs[inputsType].inputParams, `setItem`, template.template_obj.name)  
            this.$set(this.CompanyData[0].inputs[inputsType].inputParams, `existItem`, template)

          } else {
            this.$set(this.CompanyData[0].inputs[inputsType].inputParams, `setItem`, 'Выберите шаблон из списка')
          }
            // this.updateCompanyData()
        },
        updateCompanyData () {
            this.updateData()
            .then( result => {
              if ( result ) {
                let cloneCompany = cloneDeep(this.getCompany);
                this.selectedCompany = cloneCompany
              }
            })
        },
        /**
         * Удаление связи шаблонов
         * @param {Object} payload объект уже установленного шаблона
         */
          deleteLinkedTemplate (payload) {
            // console.log(payload)
            this.$http({
              command: `/constructor/company/template/${payload.id}/`,
              method: 'DELETE'
            })
            .then ( resp => {
                    this.$toast.open({
                        message: `Шаблон успешно отвязан от типа шаблона компании`,
                        type: 'success',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                    // this.updateCompanyData()
                    this.getDocumentTemplate(this.selectedCompany.id)
                    .then( result => {
                     this.allDocsTypes.forEach( type => {

                      let objectKey = type.name 
                      let template = result.templates.find( tm => tm.template_obj.template_type === type.id)

                      this.setReactiveCompanyData({inputsType: objectKey, template: template})
                    })
                      this.getCompanyBalance()
                      this.updateCompanyData()
                      this.getColumnTemplate({id:this.selectedCompany.id})
                    })
            })
            .catch ( error => {
                this.$toast.open({
                        message: error,
                        type: 'error',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                  })
            })
          },
        /**
         * Добовление нового приложения
         * @description **Требует редактирование**
         */
        addNewApplication () {
          this.setPopupComponent({component: 'AdminServiceApplication', params:{
                title: 'приложения', 
                companyId: this.SelectedUserId,
                Docs: this.documentArray,
                type: 1
              }})
        },

        /**
         * Добовление файла приложения
         * @description **Требует редактирование**
         */
        addFileToApplication(item){
          this.setPopupComponent({component: 'AdminServiceApplication', params:{
              title: 'файла приложения', 
              PhoneUser: this.selectedCompany.Phone, 
              EmailUser: this.selectedCompany.Email, 
              Email: this.$store.getters.user.Email,
              Phone: this.$store.getters.user.Phone,
              Password: this.$store.getters.user.token,
              type: 3,
              Docs: this.documentArray,
              ApplicationName: item.Type,
              ApplicationId: item.IdApplications }})
        },

        /**
         * Добовление нового сервиса
         * @description **Требует редактирование**
         */
        addNewSevice(){
          this.setPopupComponent({component: 'AdminServiceApplication',
              params:{
                title: 'сервиса', 
                PhoneUser: this.selectedCompany.Phone, 
                EmailUser: this.selectedCompany.Email, 
                Email: this.$store.getters.user.Email,
                Phone: this.$store.getters.user.Phone,
                Password: this.$store.getters.user.token, 
                type: 2 
              }
            })
        },
        // обновление пени
        updatePeniType(peni){
          let data = {
              Comand: 'AdminEditTypePeniCalculation',
              TypePeniCalculation: peni,
              Email: this.$store.getters.user.Email,
              Phone: this.$store.getters.user.Phone,
              Password: this.$store.getters.user.token,
              PhoneUser: this.selectedCompany.Phone,
              EmailUser: this.selectedCompany.Email,
              OrganizationId: 0,
              SoccetEnd: 1,
          }
          axios.post(URL, qs.stringify(data))
          .then(response => {
              if (response.data[1].return.Edit === 'Complete'){
                // alert('обновленно')
                this.setAdminUserList()
              }else{
                console.log(response.data[0].Error)
              }
          })
          .catch(err => {
            console.log(err)
          })
        },
        // выбор сервисов
        setCheckService(id){
          let select = this.selectedCompany.Adminservices[id].Select
          let index = id
          // console.log(select)
          if(select === 1 || select === true){
              this.selectedCompany.Adminservices[id].Select = false
          }else{
              this.selectedCompany.Adminservices[id].Select = true
          }
            this.updateAdminservices(index)
        },
        setModerationMod(bool){
          this.moderationMod = bool
        },

        /**
         * Удаление приложения 
         * @param {Int} id приложения
         */
        deleteApplication (payload) {
          const { id, production_type } = payload
          this.$http({
            command: `/document_attachments/company/${id}/`,
            method: 'DELETE'
          })
          .then( resp => {
              this.getCompanyApplication({id:this.SelectedUserId, type: production_type})
          })
        },
        /**
         * @warning неиспользуется
         */
        updateAdminservices(id){
            //
        },
        // Установка данных пени
        setCompanyData(){ 
          this.CompanyData[0].inputs.TypePeniCalculation.inputParams.value = this.selectedCompany.TypePeniCalculation
          this.CompanyData[0].inputs.TypePeniCalculation.data = this.selectedCompany.TypePeniCalculation
        },
        // Drag отправляет состояние положения приложений
        checkMove (e) {
          this.companyApplications[e.draggedContext.index].order_number = e.draggedContext.futureIndex
          
         setTimeout(() => { // ставим задержку чтобы index успел измениться
           this.companyApplications.forEach(r => {
            let indexNumber = this.companyApplications.findIndex( (o) => { return r.IdApplications == o.IdApplications})
            r.sortNumber = indexNumber
            data[r.IdApplications] = indexNumber
          }) }, 2000);
        }
    },
    computed: {
    ...mapGetters([
      'regionsList',
      'getAdminUserListArray',
      'getCompaniesNamesLists', 
      'getCompanyGeneralData', 
      'getCompany', 
      'minCompany', 
      'docsTemplates', 
      'allDocsTypes',
      'companyApplications',
      ]),
      companyApplicationsList : {
        set (val) {
          console.log(val)
        },
        get () {
          let result = cloneDeep(this.companyApplications)
          return result
        }
      }
    },
    created() {
      this.getAllTemplate()
      .then( allDocsTemplates => {
        this.getDocumentTypes()
        .then( result => {
          let activities = this.CompanyData.find(el => el.title === 'Header')
            result.types.forEach( type => {
                let objectKey = type.name
                let inpData = {
                    placeholder: `Выберите шаблон ${type.description}`, 
                    isSelect: true, 
                    items: [], 
                    type: type.id,
                    data: false
                }
                activities.inputs[objectKey] = { 
                  key: objectKey, 
                  label: `Назначить шаблон ${type.description}`, 
                  inputParams: { 
                    placeholder: `Выберите шаблон ${type.description}`, 
                    isSelect: true, 
                    items: [], 
                    type: type.id,
                    data: false
                  }
                }
                this.$set(activities.inputs[objectKey], 'inputParams', {...inpData})
                this.$set(activities.inputs[objectKey].inputParams, `items`, allDocsTemplates.filter( o => o.template_type === type.id))
            })
        })
      })

      this.$store.dispatch('setAdminUserList')

      if (this.minCompany && this.getCompany) {
          this.checkCompany(this.minCompany.id)
      }
      this.getRegionsList()
      this.getAllColumnTemplate()
    },
    mounted(){
      this.getAllDocuments()

      events.$on('docarray', (data) => {
        this.documentArray = data.docs
      })

      events.$on('update_data_after_delete', () => {
        this.getDocumentTemplate(this.selectedCompany.id)
        console.log('template: deleted')
      })

      events.$on('update_data_company', () => {
        this.updateCompanyData()
      })

      events.$on('renameapplication', (payload) => {
          let index = this.selectedCompany.AdminApplications.findIndex(e => e.IdApplications == payload.id)
          this.selectedCompany.AdminApplications[index].Type = payload.name
      })

      events.$on('close_popup_with_selection', bool => {
        this.loading = bool
        this.disabled = bool
      })

      events.$on('newBalance', data => {
         this.selectedCompany.balance = data.balance
      })
    }

}
</script>