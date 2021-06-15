<template>
    <popup-wrapper>
            <template v-slot:header>
                    <p class="m-0">Редактирование приложения №{{params.id}}</p>
            </template>
            <div class="popup__status">
                <div class="my-3">
                     <div class="compib__row">
                        <div class="compib__row-label">
                            <span>Наименование {{params.item.Type}}</span>
                        </div>
                        <div class="compib__input">
                            <div class="search-input">
                                <input type="text" placeholder="Введите наименование" v-model="name">
                            </div>
                        </div>
                    </div>
                    <div class="d-data__content-row">
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
                      <div class="d-data__content-row" >
                          <div class="f-container">
                              <div class="">
                                <v-select placeholder="Выберите загруженный документ" :options="docsName" label="description" v-model="selected"></v-select>
                              </div>
                          </div>
                      </div>
                      <div class="d-data__content-row" >
                          <div class="f-container">
                              <div class="">
                                <v-select placeholder="Выберите тип приложения" :options="typesList" label="title" v-model="applicationType"></v-select>
                              </div>
                          </div>
                      </div>
                </div>
                <div class="popup__status-button">
                    <ur-btn
                        class="btn btn-primary"
                        :loading="loading"
                        @click="updateApplication"
                        :disabled="disabled"
                    >
                        <span>Применить</span>
                    </ur-btn>
                  </div>
            </div>
    </popup-wrapper>
</template>
<script>
import { baseURL } from '@/settings/config'
import { mapActions, mapGetters } from 'vuex'
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
            fileName: null,
            newDocument: false,
            documentId: false,
            selected: false,
            docs_list: [],
            docsName: [],
            applicationType: false,
            typesList: [
              {type:'organisation',
              title: 'Организация'
              },
              {type:'egrn_main',
              title: 'ЕГРН'
              },
              {type:'egrn_movement',
              title: 'ЕГРН - переход прав'
              },
              {type:'set_of_charges',
              title: 'Свод начислений по Л/С'
              }, 
              {type:'penni_calculation',
              title: 'Пеня'
              }, 
            {
              type:'court_order',
              title: 'Cyдебный приказ'
            }],
            uploadedDoc: {
              id: '',
              name: ''
            }
        }
    },
    created () {
        this.name = this.params.item.name
        this.getFiles()

        this.uploadedDoc.id = this.params.item.document
        this.uploadedDoc.name = this.docsName.find( d => d.id === this.params.item.document) || null
    },
    methods: {
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
              console.log(response)
                this.loading = false
                this.disabled = false
                // this.fileName = null;
                this.newDocument = false;
                this.documentId = response.data.id
                this.uploadedDoc.id = this.documentId
                this.uploadedDoc.name = response.data.description

            })
      },
            updateApplication () {
                this.loading = true
                this.disabled = true
                let docId = null
                let typeApp = 'organisation';
                if (!this.applicationType) {
                    typeApp = this.params.item.type ? this.params.item.type : 'organisation'
                } else {
                    typeApp = this.applicationType.type
                }

                  if (this.documentId) {
                    docId = this.documentId
                  } else if (this.selected) {
                    docId = this.selected.id
                  } else {
                    docId = this.params.item.document
                  }

                this.$http({
                    command: `/document_attachments/company/${this.params.id}/`,
                    method: 'PUT',
                    data: {
                      name: this.name,
                      type: typeApp,
                      production_type: 'judicial',
                      company: this.params.companyId,
                      document: docId
                    }
                })
                .then(res => {
                  console.log(res)
                  this.loading = false
                  this.disabled = false
                  this.documentId = null
                    this.selected = null
                    this.getFiles()
                    this.$toast.open({
                        message: `Приложение обновлено`,
                        type: 'success',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                    this.getCompanyApplication({id: this.params.companyId, type: 'judicial'})
                    this.setPopupState(false)
                })
                .catch ( (err) => {
                    console.log(err)
                      this.$toast.open({
                        message: `Должен быть выбран документ и имя приложения`,
                        type: 'error',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                      })
                  this.loading = false
                  this.disabled = false
                })
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
}
</script>