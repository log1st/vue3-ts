<template>
    <div class="signer__wrapper">
        <div class="main-container__head">
            <div class="main-container__title">Доверенность</div>
        </div>
        <div class="d-data__content-row">
            <div class="my-3">
                     <div class="compib__row">
                        <div class="compib__row-label">
                            <span><b> Подписант </b></span>
                        </div>
                        <div class="compib__input">
                            <div class="search-input">
                                <input type="text" placeholder="Введите представителя по доверенности" v-model="signerName">
                            </div>
                        </div>
                    </div>
                    <div class="compib__row">
                        <div class="compib__row-label">
                            <span><b>ФИО представителя </b></span>
                        </div>
                        <div class="compib__input">
                            <div class="search-input">
                                <input type="text" placeholder="Введите ФИО представителя" v-model="fullname">
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <div class="d-data__content-row" v-for="(document, index) in documents" :key="index">
            <div class="f-container" >
                <div class="">
                    <div class="company-document-item">
                        <div class="company-document-status">
                            <icon-base width="18" height="18" viewbox="0 -2 12 18" iconColor="#7989a0"><icon-check /></icon-base>
                            <span v-if="document.FileContents">Файл загружен</span>
                            <span v-if="!document.FileContents">Файл не загружен</span>
                        </div>
                        <div class="company-document-actions">
                          <template v-if="document.FileContents">
                            <row-hover-actions :icons="actionsIcons" @setRowHoverAction="runActions({ e: $event, document: document })" />
                          </template>
                        </div>
                    </div>
                    <div class="f-container__input">
                        <input 
                          type="file" 
                          name="f-container-file"
                          @change="changeFile({ ref: 'admin_organization_documents', document: document, index: index })" 
                          ref="admin_organization_documents" 
                        >
                        <label for="f-container-file" class="f-container__input-label">
                          <div class="f-container__placeholder">
                              <span>Выбрать файл</span>
                          </div>
                          <div class="f-container__button" @click="$refs.admin_organization_documents[index].click()">
                            <div class="btn btn-primary">Выбрать</div>
                          </div>
                          <div class="f-container__button" @click="deleteDocument(document.id)" v-if="document.FileContents">
                            <div class="btn btn-red">Удалить</div>
                          </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { baseURL } from '@/settings/config'
import qs from 'qs'
import download from 'downloadjs';

export default {
    props:{
         company: {
          type: Object,
          required: true
      }
    },
    data () {
        return {
            highlight: false,
            isLoading: false,
            isDownloading: false,

            signerName: null,
            fullname: null,

            currentRowHovered: null,
            actionsIcons: ['view', 'download'],

            documents:[
                {
                  fileName: 'Представитель по доверенности',
                  id: '-5',
                  FileContents: ''
                }
            ]
        }
    },
    methods: {

        changeFile ({ ref, document, index }) {
            this.upFiles(this.$refs[ref][index].files, document);
        },
        async createFileObject(file, document) {
          let fileBase64 = await this.toBase64(file);
          fileBase64 = this.prepareBase64(fileBase64);
          return {
              FileName: document.fileName || document.FileName || 'без_названия',
              Files: fileBase64,
            //   Id: document.id || null
          }
      },
        /**
       * Загрузить файл представителя
       */
      async upFiles (files, document) {
          this.$store.dispatch('appLoadingChange', true, { root: true });
          let adminFile = await this.createFileObject(files[0], document);
          let data = {
              Comand: 'AddRepresentativeProxy',
            //   Email: this.$store.getters.user.Email, // Данные Администратора для админской апи, пока что юзаем пользовательскую...
            //   Phone: this.$store.getters.user.Phone,
              Password: this.$store.getters.user.token,
              FioProxy: this.fullname,
              Subscribe: this.signerName,
              Phone: this.company.Phone,
              Email: this.company.Email,
              OrganizationId: 0,
              DateBirth: null,
              PassportSeriesNumber: null,
              WhenIssued: null,
              IssuedWhom: null,                   
              DivisionCode: null,                  
              RegistrationAddress: null,       
              DatePowerAttorney: null,           
              ...adminFile,
              SoccetEnd: 1
          }
          axios({
              method: 'post',
              url: baseURL,
              data: qs.stringify(data)
          }).then(res => {
              // this.fileName = null;
              // this.newDocument = false;
              // this.documents = []
            //   this.getCompanyFiles()
          }).finally(() => {
            this.$store.dispatch('appLoadingChange', false, { root: true });
          })
      },
    },
}
</script>
<style lang="scss">
    .signer__wrapper {
        margin: 2em 0;
    }
</style>