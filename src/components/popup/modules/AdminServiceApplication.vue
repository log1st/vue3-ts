<template>
    <popup-wrapper>
      <template v-slot:header>
              <p class="m-0">Добавление {{params.title}}</p>
      </template>
            <div class="popup__status">
                <div class="my-3">
                    <div class="d-data__content-row" v-if="this.params.type == 1 || this.params.type == 3">
                      <div class="f-container">
                          <div class="">
                            <p>Введите название документа (например "устав") и выберите файл:</p>
                              <ur-input
                                placeholder="Название документа\Название приложения"
                                v-model="name"
                              ></ur-input>

                              <div class="f-container__input">
                                  <input 
                                    type="file" 
                                    :disabled="!name"
                                    name="f-container-file"
                                    @change="changeFile({ ref: 'fContainerFileNew', type: null })" 
                                    ref="fContainerFileNew" 
                                  >
                                  <label for="f-container-file"  class="f-container__input-label" 
                                    @click="$refs.fContainerFileNew.click()"
                                  >
                                    <div class="f-container__button">
                                      <div class="btn btn-primary" :class="{'disabled-file': !name}" title="перед загрузкой документа введите его имя!">Выбрать файл</div>
                                      <span v-if="uploadedDoc.id"> Выбран документ - {{uploadedDoc.name}}</span>
                                    </div>
                                  </label>
                              </div>
                           </div>
                        </div>
                      </div>
                      <div class="d-data__content-row" v-if="params.type == 1 || params.type == 3">
                          <div class="f-container">
                              <div class="">
                                <v-select placeholder="Выберите модуль приложения" :options="applicationModules" label="title" v-model="production_type"></v-select>
                              </div>
                          </div>
                      </div>
                      <div class="d-data__content-row" v-if="params.type == 1 || params.type == 3">
                          <div class="f-container">
                              <div class="">
                                <v-select placeholder="Выберите загруженный документ" :options="docsName" label="name" v-model="selected"></v-select>
                              </div>
                          </div>
                      </div>
                      <div class="d-data__content-row" v-if="params.type == 1 || params.type == 3">
                          <div class="f-container">
                              <div class="">
                                <v-select placeholder="Выберите тип приложения" :options="typesList" label="title" v-model="applicationType"></v-select>
                              </div>
                          </div>
                      </div>
                      <div class="compib__row" v-if="params.type != 3">
                          <div class="compib__row-label">
                              <span>Наименование {{params.title}}</span>
                          </div>
                          <div class="compib__input">
                              <div class="search-input">
                                  <input type="text" placeholder="Введите наименование" v-model="name">
                              </div>
                          </div>
                      </div>
                    </div>
                    <div class="popup__status-button">
                      <ur-btn
                          class="btn btn-primary"
                          :loading="loading"
                          @click="getNewData"
                          :disabled="disabled"
                      >
                          <span>Применить</span>
                      </ur-btn>
                    </div>
          </div>
    </popup-wrapper>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { baseURL } from '@/settings/config'
import UrBtn from '@/components/elements/Button'

export default {
    props:{
        params:{
            type: Object
        }
    },
    components: {
      'ur-btn': UrBtn,
      },
    data(){
        return{
            loading: false,
            disabled: false,
            name: '',
            function: '',
            fileName: null,
            newDocument: false,
            documentId: false,
            selected: false,
            docs_list: [],
            docsName: [],
            applicationType: false,
            production_type: undefined,
            applicationModules: [
              {
                    name: 'pretrial',
                    title: 'Досудебный модуль'
                },
                {
                    name: 'judicial',
                    title: 'Судебный модуль'
                },
                {
                    name: 'executive',
                    title: 'Исполнительный модуль'
                },
            ],
            uploadedDoc: {
              id: '',
              name: ''
            }
        }
    },
    methods:{
        ...mapActions(['setAdminUserList', 'AdminUserListFilterData', 'toBase64', 'getCompanyApplication', 'setPopupState']),
        changeFile ({ ref, type }) {
            this.upFiles(this.$refs[ref].files, type);
        },
        async upFiles (files, type) {
            this.loading = true
            this.disabled = true
            let nameFiles = '';
                nameFiles = this.name ? this.name : `document-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}`;

            let data = {
              name: nameFiles,
              klass: 'default',
              file: await this.toBase64(files[0]),
              can_be_attached: true,
              company: this.params.companyId,
              description: `Документ приложения - ${this.name}`
            }

            axios({
              url: baseURL + '/api/account/document/',
              data:data,
              method: 'POST'
            })
            .then((response) => {
              this.$toast.open({
                message: `Документ ${response.data.description} выбран для приложения`,
                type: 'success',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              })
              this.$toast.open({
                message: `Нажмите сохранить для создания документа с этим приложением`,
                type: 'success',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
              })
                this.loading = false
                this.disabled = false
                // this.fileName = null;
                this.newDocument = false;
                this.documentId = response.data.id
                this.uploadedDoc.id = this.documentId
                this.uploadedDoc.name = response.data.description

            })
      },
        getNewData(){
            this.loading = true
            this.disabled = true
            if (this.function == 'AdminAddServices') {
              //// Сервисы - еще нет апи
            let data = {
                name: this.name,
            }
              this.$http({

              })
              .then(response => {
                  
              })
              .catch(err => {
                console.log(err)
              })

              } else if (this.function == 'AdminAddApplications') {
                  let docId = null
                  if (this.documentId) {
                      // data.fileId = this.documentId
                         docId = this.documentId
                  }
                  if (this.selected) {
                      console.log(this.selected)  
                      docId = this.selected.id
                  }
                  this.$http({
                    command: '/document_attachments/company/',
                    method: "POST",
                    data: {
                      name: this.name,
                      type: !this.applicationType ? 'organisation' : this.applicationType.type,
                      production_type: this.production_type.name,
                      company: this.params.companyId,
                      document: docId
                    }
                    })
                  .then((response) => {
                    this.setAdminUserList()
                    this.loading = false
                    this.disabled = false
                    this.documentId = null
                    this.selected = null
                    this.getFiles()
                    this.$toast.open({
                        message: `Приложение добавлено`,
                        type: 'success',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                    this.getCompanyApplication({id: this.params.companyId, type: this.production_type.name})
                    this.setPopupState(false)
                  })
                  .catch(err => {
                      console.log(err.response.data)
                      const errorKey = Object.keys(err.response.data)
                      errorKey.forEach( error => {
                        let erMsg;
                        if (error === 'type') {
                          erMsg = 'Серверная ошибка: Не верный тип приложения'
                        } else {
                          erMsg = err.response.data[error][0]
                        }
                        this.$toast.open({
                          message: erMsg,
                          type: 'error',
                          duration: 5000,
                          dismissible: true,
                          position: 'top-right'
                        })
                      })
                      // this.$toast.open({
                      //   message: `Должен быть выбран документ и имя приложения`,
                      //   type: 'error',
                      //   duration: 5000,
                      //   dismissible: true,
                      //   position: 'top-right'
                      // })
                      this.loading = false
                      this.disabled = false
                    })

              } else if (this.function == 'AdminAddFileIdApplications') {
                  let data = {
                    IdApplications: this.params.ApplicationId,
                    IdFile: '-1',
                  }
                  let docId = null
                  if (this.documentId != null) {
                      data.IdFile = this.documentId
                         docId = this.documentId
                  }
                  if (this.selected != null) {
                      data.IdFile = this.selected.Id
                      docId = this.selected.Id
                  }
                  axios.post(URL)
                  .then((response) => {
                        
                    events.$emit('newdatainadmin', { 
                        status: true, 
                        name: this.name, 
                        type: this.params.type, 
                        docid: docId, 
                        id: this.params.ApplicationId 
                    })
                        this.loading = false
                        this.disabled = false
                        this.documentId = null
                        this.selected = null  
                        this.getFiles()
                  })
              }
            },
            /**
             * Получаем файлы организации на приложения
             */
              getFiles () {
                axios({
                  url: baseURL + '/api/account/document/',
                  method: 'GET',
                  params: {
                    company_id: this.params.companyId
                  }
                })
                .then ( res => {
                   this.docsName = res.data.filter( doc => doc.company === this.params.companyId);
                })
              }
    },
    mounted() {
        if (this.params.type == 1){
            this.function = 'AdminAddApplications'
        } else if (this.params.type == 2) {
            this.function = 'AdminAddServices'
        } else if (this.params.type == 3) {
            this.function = 'AdminAddFileIdApplications'
            this.name = this.params.ApplicationName
        }
    },
    created () {
      this.getFiles()
    },
    computed: {
      ...mapGetters(['allDocsTypes']),
      typesList () {
        return this.allDocsTypes.map( doc => {
          return {
              type: doc.name,
              title: doc.description
          }}
        )
      }
    }
}
</script>
<style lang="scss">
  .disabled-file {
    cursor: no-drop !important;
    background-color: #b2b7cc !important;
  }
  .f-container {
    .vs__search {
      display: block;
    }
  }
</style>