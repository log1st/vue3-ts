<template>
    <div class="document__wrapper">
      <div class="d-data__content-row" v-for="(document, index) in documents" :key="index">
            <p>{{ document.fileName }}</p>
            <div class="f-container">
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
        <!-- Дополнительные документы -->
        <div class="d-data__content-row" v-for="(document, index) in documentsAdditional" :key="index + '_additional'" >
              <div class="f-container">
                  <p>{{ document.FileName || 'Введите название документа (например "устав") и выберите файл:' }}</p>
                  <div class="">
                      <!-- Если новый файл, даем ввести имя -->
                      <ur-input placeholder="Название документа" v-model="document.FileName" v-if="!document.Id"></ur-input>
                      <!-- Если уже хагружался ранее, отображаем имя -->
                      <div class="company-document-item" v-else>
                          <div class="company-document-status">
                              <icon-base width="18" height="18" viewbox="0 -2 12 18" iconColor="#7989a0"><icon-check /></icon-base>
                              <span v-if="document.FileContents">Файл загружен</span>
                              <span v-if="!document.FileContents">Файл не загружен</span>
                          </div>
                          <div class="company-document-actions">
                            <template>
                              <row-hover-actions :icons="actionsIcons" @setRowHoverAction="runActions({ e: $event, document: document })" />
                            </template>
                          </div>
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
                                <span v-if="document.FileContents">Файл выбран</span>
                                <span v-else>Файл не выбран</span>
                            </div>
                            <div class="f-container__button" @click="$refs.admin_organization_documents_additional[index].click()">
                              <div class="btn btn-primary">Выбрать</div>
                            </div>
                            <div class="f-container__button" @click="deleteDocument(document.Id)" v-if="document.FileContents">
                              <div class="btn btn-red">Удалить</div>
                            </div>
                          </label>
                      </div>

                  </div>
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
import { baseURL } from '@/settings/config'
import qs from 'qs'
import download from 'downloadjs';

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
            files: [],
            documents: this.getDefaultDocuments(),
            documentsAdditional: [],
            newDocument: false,
            
            currentRowHovered: null,
            actionsIcons: ['view', 'download'],
            // new document
            addingMode: false,
        }
    },
    methods: {
      getNewDocument() {
        return {
          FileName: '',
          FileСontents: '',
          Id: null
        }
      },
      addNewDocument () {
        this.addingMode = true;
        this.documentsAdditional.push(this.getNewDocument());
      },
      cancelAddingDocument() {
        this.addingMode = false;
        this.documentsAdditional.pop();
      },
      /**
       * Запрос документов компании
       */
      getCompanyFiles(){
        let data = {
          Comand: 'AdminListFileRegulation',
          Email: this.$store.getters.user.Email,
          Phone: this.$store.getters.user.Phone,
          Password: this.$store.getters.user.token,
          PhoneUser: this.company.Phone,
          EmailUser: this.company.Email,
          OrganizationId: 0,
          SoccetEnd: 1
        }
        axios.post(baseURL, qs.stringify(data))
        .then((res) => {
            if (res.data[1].return != '' && res.data[1].return.Result != ''){
                let data = res.data[1].return.Result
                this.distributeDocuments(data)
                let allDocs = []
                this.documents.forEach(d => {
                  allDocs.push(d)
                })
                this.documentsAdditional.forEach(da => {
                  da.fileName = da.FileName
                  allDocs.push(da)
                })
                events.$emit('docarray', {docs:allDocs }) // отправляем полученные документы в добавление приложений (для выбора дока из списка)
            }
        })
      },
      /**
       * Возвращает дефолтные документы
       */
      getDefaultDocuments() {
        return [
          {
            fileName: 'Устав',
            id: '-1',
            FileContents: ''
          },
          {
            fileName: 'Свидетельство о гос. Регистрации',
            id: '-2',
            FileContents: ''
          },
          {
            fileName: 'Протокол',
            id: '-3',
            FileContents: ''
          }]
      },
      /**
       * Распределяет документы
       */
      distributeDocuments (docs) {
        this.documents = this.getDefaultDocuments().map(d => {
          const existingDoc = docs.find(_d => d.id === _d.Id)
          if(existingDoc) {
            return {
              fileName: existingDoc.FileName,
              id: existingDoc.Id,
              FileContents: existingDoc.FileContents
            }
          } else return d
        });

        this.documentsAdditional = docs.filter(d => {
          if(d.Id !== '-1' && d.Id !== '-2' && d.Id !== '-3') {
            return d
          }
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
       * Подготавливает и возвращает документ перед заливкой
       */
      async createFileObject(file, document) {
          let fileBase64 = await this.toBase64(file);
          fileBase64 = this.prepareBase64(fileBase64);
          return {
              FileName: document.fileName || document.FileName || 'без_названия',
              FileСontents: fileBase64,
              Id: document.id || null
          }
      },
      /**
       * Загрузить файл (Устав, Свидетельство, Протокол)
       */
      async upFiles (files, document) {
          this.$store.dispatch('appLoadingChange', true, { root: true });
          let adminFile = await this.createFileObject(files[0], document);
          let data = {
              Comand: 'AdminAddFileRegulation',
              Email: this.$store.getters.user.Email,
              Phone: this.$store.getters.user.Phone,
              Password: this.$store.getters.user.token,
              PhoneUser: this.company.Phone,
              EmailUser: this.company.Email,
              OrganizationId: 0,
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
              this.getCompanyFiles()
          }).finally(() => {
            this.$store.dispatch('appLoadingChange', false, { root: true });
            this.addingMode = false;
          })
      },
      /**
       * Удалить документ
       */
      deleteDocument(id) {
          this.$store.dispatch('appLoadingChange', true, { root: true });
          let data = {
              Comand: 'AdminDeleteFileRegulation',
              Email: this.$store.getters.user.Email,
              Phone: this.$store.getters.user.Phone,
              Password: this.$store.getters.user.token,
              PhoneUser: this.company.Phone,
              EmailUser: this.company.Email,
              OrganizationId: 0,
              Id: id,
              SoccetEnd: 1
          }
          axios({
              method: 'post',
              url: baseURL,
              data: qs.stringify(data)
          }).then(res => {
              let data = res.data[1].return.Result
              this.distributeDocuments(data)
          }).finally(() => {
            this.$store.dispatch('appLoadingChange', false, { root: true });
          })
      },
      /**
       * Открыть или просмотреть документы
       */
      runActions ({ e, document }) {
        let res = document.FileContents;
        switch (e) {
          // Открыть в новой вкладке
          case 0:
              res = this.inversePrepareBase64(res);
              res = res.split(',')[1];
              var binary = atob(res)
              var len = binary.length
              var buffer = new ArrayBuffer(len)
              var view = new Uint8Array(buffer)
              for (var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i)
              }
              var blob = new Blob([view], { type: 'application/pdf' })
              var url = URL.createObjectURL(blob)
              setTimeout(() => {
                  window.open(url, '_blank')
              }, 1000)
            break
          case 1:
            // скачать
              res = this.inversePrepareBase64(res);
              // res = res.split(',')[1]; // не обрезаем тип документа
              // console.log(res)
              const filetype = res.substring(res.lastIndexOf(":") + 1, res.lastIndexOf(";"));
              // console.log(filetype)
              download(res, `${document.fileName}.pdf`, filetype);
            break
        }
      }
    },
    created() {
      // this.getCompanyFiles()
    },
    computed: {
      // ...mapGetters(['getCompanies']),
    }
}
</script>