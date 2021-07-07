<template>
    <div class="document__wrapper">
        <!-- Дополнительные документы -->
        <div class="d-data__content-row" v-for="(document, index) in companyDocuments" v-show="!!!document.signer" :key="index + '_additional'" >
              <div class="f-container">
                  <p>{{ document.description || document.name || 'Введите название документа (например "устав") и выберите файл:' }}</p>
                  <div class="">
                      <!-- Если новый файл, даем ввести имя -->
                      <ur-input placeholder="Название документа" v-model="document.description" v-if="!document.id"></ur-input>
                      <!-- Если уже хагружался ранее, отображаем имя -->
                      <div class="company-document-item" v-else>
                          <div class="company-document-status">
                              <icon-base width="18" height="18" viewbox="0 -2 12 18" iconColor="#7989a0"><icon-check /></icon-base>
                              <span v-if="document.file">Файл загружен</span>
                              <span v-if="!document.file">Файл не загружен</span>
                              <span><a :href="document.file" v-if="document.file" style="padding-left: 1em" target="_blank">скачать</a></span>
                          </div>
                          <!-- <div class="company-document-actions">
                            <template>
                              <row-hover-actions :icons="actionsIcons" @setRowHoverAction="runActions({ e: $event, document: document })" />
                            </template>
                          </div> -->
                      </div>

                      <div class="f-container__input">
                          <input 
                            type="file" 
                            name="f-container-file"
                            @change="changeFile({ ref: 'admin_organization_documents_additional', document: document, index: index })" 
                            ref="admin_organization_documents_additional" 
                            :key="'a' + index"
                          >
                          <label for="f-container-file" class="f-container__input-label">
                            <div class="f-container__placeholder">
                                <span v-if="document.file">Файл выбран</span>
                                <span v-else>Файл не выбран</span>
                            </div>
                            <div class="f-container__button" @click="$refs.admin_organization_documents_additional[index].click()">
                              <div class="btn btn-primary">Выбрать</div>
                            </div>
                            <div class="f-container__button" @click="deleteDocument({id: document.id})" v-if="document.file">
                              <div class="btn btn-red">Удалить</div>
                            </div>
                          </label>
                      </div>

                  </div>
              </div>
        </div>
        <div class="d-data__content-row" v-if="addingMode">
          <div class="f-container">
                  <p>{{ newDocument.description || 'Введите название документа (например "устав") и выберите файл:' }}</p>
                  <div class="">
                      <!-- Если новый файл, даем ввести имя -->
                      <ur-input placeholder="Название документа" v-model="newDocument.description"></ur-input>

                      <div class="f-container__input">
                          <input 
                            type="file" 
                            id="new-f-container-file"
                            @change="setNewFile($event)"
                            :key="'c0'"
                          >
                          <label for="new-f-container-file" class="f-container__input-label">
                            <div class="f-container__placeholder">
                                <span v-if="newDocument.file">Файл выбран</span>
                                <span v-else>Файл не выбран</span>
                            </div>
                            <!-- <div class="f-container__button" @click="setNewFile($event)">
                              <div class="btn btn-primary">Выбрать</div>
                            </div> -->
                            <div class="f-container__button" @click="clearNewDocument()" v-if="newDocument.file">
                              <div class="btn btn-red">Удалить</div>
                            </div>
                          </label>
                      </div>
                  </div>
                  <div class="btn btn-primary" @click="uploadNewFile()">Загрузить документ</div>
              </div>
        </div>
        <div class="d-data__content-row d-flex justify-content-end">
          <div class="btn btn-primary" @click="addNewDocument" v-if="!addingMode">Добавить документ</div>
          <div class="btn btn-primary" @click="cancelAddingDocument" v-else>Отменить добавление</div>
        </div>

    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
      company: {
          type: Object,
          required: true
      }
  },
    data(){
        return{
            highlight: false,
            isLoading: false,
            isDownloading: false,

            fileName: '',
            documentsAdditional: [],
            newDocument: {
              file: undefined,
              description: undefined,
              klass: 'default',
            },
            
            currentRowHovered: null,
            // actionsIcons: ['view', 'download'],
            addingMode: false,
        }
    },
    methods: {
      ...mapActions(['deleteDocument', 'toBase64', 'getAllDocuments']),
      clearNewDocument () {
        this.newDocument.file = undefined
      },
      addNewDocument () {
        this.addingMode = true;
      },
      cancelAddingDocument() {
        this.addingMode = false;
      },
      async setNewFile (e) {
        // console.log(e)
        this.newDocument.file = await this.toBase64(e.target.files[0])
      },
      uploadNewFile () {
        this.$http({
          command: '/api/account/document/',
          method: 'POST',
          data: {
            name: this.newDocument.description,
            company: this.company.id,
            ...this.newDocument
          }
        })
        .then( resp => {
          this.$toast.open({
            message: `Документ добавлен`,
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
          })
          this.getAllDocuments()
          this.addingMode = false
        })
        .catch( error => {
          console.log(error)
          this.$toast.open({
            message: `Ошибка добавления документа`,
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
          })
          this.getAllDocuments()
        })
      },
      /**
       * Обработчик для поля загрузки
       * @params { ref: File, id: }
       */
      changeFile ({ ref, document, index }) {
        this.upFiles(this.$refs[ref][index].files, document);
      },
      
      /**
       * Загрузить файл (Устав, Свидетельство, Протокол)
       */
      async upFiles (files, document) {
         this.$http({
           command: `/api/account/document/${document.id}/`,
           method: 'PATCH',
           data: {
             file: await this.toBase64(files)
           }
         })
         .then( () => {
           this.getAllDocuments()
           this.$toast.open({
            message: `Документ обновлен`,
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
          })
         })
         .catch (error => {
           console.log(error)
           this.$toast.open({
            message: `Ошибка обновления документа`,
            type: 'error',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
          })
         })
      },
     
    },
    computed: {
      ...mapGetters(['documentsByCompanyId']),
      companyDocuments () {
        return this.documentsByCompanyId(this.company.id)
      }
    }
}
</script>