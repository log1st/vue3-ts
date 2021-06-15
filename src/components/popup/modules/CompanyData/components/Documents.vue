<template>
    <div class="document__wrapper">
      <div class="signers__data-wrapper">
        <div class="signers__data-perosnal-info">
          <div class="signers__data-perosnal-info-input">
            <span class="signers__data-perosnal-info-input-title">
              Подписант
            </span>
            <input class="signers__data-perosnal-info-input-field"
             type="text"
             v-model="signer.name"
             placeholder="Введите имя подписанта"
             >
          </div>
          <div class="signers__data-perosnal-info-input">
            <span class="signers__data-perosnal-info-input-title">
              ФИО подписанта
            </span>
            <input class="signers__data-perosnal-info-input-field"
             type="text"
             v-model="signer.fio"
             placeholder="Введите ФИО подписанта"
             >
          </div>
        </div>
        <div class="signers__data-document">
          <span class="signers__data-document-title"> Загрузить доверенность: </span>
          <label for="file-upload" class="custom-file-upload">
              <div class="custom-file-info"
                v-if="!signer.uploading_document"
              >
                Файл не выбран
              </div>
              <div class="custom-file-info"
                v-else-if="signer.uploading_document && signer.canDownloadFile"
              >
                
                <a :href="'https://api-2.urrobot.net'+signer.uploading_document" target="_blank" download> Скачать файл</a>
              </div>
              <div class="custom-file-info"
                v-else-if="signer.uploading_document"
              >
                Файл выбран
              </div>
              <icon-base width="25" height="25" viewBox="0 0 25 25">
                  <icon-upload-file />
              </icon-base>
          </label>
          <input id="file-upload" type="file" @change="uploadSignersDoc($event)" />
        </div>
      </div>
            <ur-btn
            :loading="signerLoading"
            :disabled="signerDisabled"
            class="btn btn-indigo"
            @click="setSigner()"
            style="margin-left:3em"
            >
              <span>
               Сохранить подписанта
              </span> 
            </ur-btn>
            <div class="document__data-wrapper">
              <div class="document__doc-wrapper"
              v-for="(item, index) in defaultCompanyDocs"
              :key="index"
              :title="item.description">
                <label class="document__doc-wrapper-view">
                  <div class="add" v-if="!item.uploading_document">
                    <div class="add-horizontal"></div>
                    <div class="add-vertical"></div>
                  </div>
                  <div @mouseover="item.editDoc = true"
                       @mouseout="item.editDoc = false"
                   v-else>
                    <a :href="'https://api-2.urrobot.net'+item.uploading_document" target="_blank" download>Документ загружен</a>
                  </div>
                  <div class="edit-icon" v-if="item.editDoc">
                    <icon-base
                    width='25'
                    height="25">
                      <icon-reload/>
                    </icon-base>
                  </div>
                  <input type="file" @change="editDocument($event, index, 'default')" v-if="item.editDoc">
                  <input type="file" @change="setDefaultComapnyDoc($event, index)" v-if="!item.uploading_document">
                </label>
                <div class="document__doc-wrapper-title">
                  <input type="text" v-model="item.name">
                </div>
              </div>
            </div>
            <div class="document__data-add-docs" v-if="addedCompanyDocs.length">
              <div class="document__doc-wrapper"
              v-for="(item, index) in addedCompanyDocs"
              :key="index"
              :title="item.description">
                <label class="document__doc-wrapper-view">
                  <div class="add" v-if="!item.uploading_document">
                    <div class="add-horizontal"></div>
                    <div class="add-vertical"></div>
                  </div>
                  <div class="loaded-placeholder" 
                  @mouseover="item.editDoc = true"
                  @mouseout="item.editDoc = false"
                  v-else>
                        <a :href="baseURL+'/'+item.uploading_document" target="_blank" download>{{item.name}}</a>
                        <!-- <iframe 
                        :src="'http://docs.google.com/gview?url=https://api-2.urrobot.net'+item.uploading_document" 
                        style="width:100%; height:100%;" frameborder="0"></iframe> -->
                  </div>
                    <div class="edit-icon" v-if="item.editDoc">
                      <icon-base
                        width='25'
                        height="25">
                      <icon-reload/>
                    </icon-base>
                  </div>
                  <input type="file" @change="editDocument($event, index, 'custom')" v-if="item.editDoc">
                  <input type="file" @change="setDefaultComapnyDoc($event, index)"  v-if="!item.uploading_document">
                </label>
                <div class="document__doc-wrapper-title">
                  <input type="text" v-model="item.name">
                </div>
              </div>
            </div>
        
        <div class="document__add_new" v-if="addingMode">
          <div class="document__add_new-docs-data">
              <span class="document__add_new-docs-data-title">
                Введите название документа (например "устав") и выберите файл:
              </span>
              <div class="document__add_new-docs-data-input">
                <input 
                type="text" 
                v-model="newCustomDoc.name"
                placeholder="Название документа">
              </div>
              <div class="document__add_new-docs-data-file">
                <label class="custom-file-upload">
                  <div class="custom-file-info"
                    v-if="!newCustomDoc.uploading_document"
                  >
                    Файл не выбран
                  </div>
                  <div class="custom-file-info"
                    v-else-if="newCustomDoc.uploading_document && newCustomDoc.canDownloadFile"
                  >

                    <a :href="'https://api-2.urrobot.net'+newCustomDoc.uploading_document" target="_blank" download> Скачать файл</a>
                  </div>
                  <div class="custom-file-info"
                    v-else-if="newCustomDoc.uploading_document"
                  >
                    Файл выбран
                  </div>
                  <icon-base width="25" height="25" viewBox="0 0 25 25">
                      <icon-upload-file />
                  </icon-base>
                  <input style="display:none" type="file" @change="uploadCustomFile($event)">
                </label>
              </div>
          </div>
          <div class="document__add_new-decline">
              <div class="btn btn-accept-outline" @click="saveNewCustomDocument()">Добавить документ</div>
              <div class="btn btn-red-outline" @click="addingMode = false">Отменить добавление</div>
          </div>
        </div>
        <div class="d-data__content-row d-flex justify-content-center">
          <div class="btn btn-accept-outline" @click="addNewDocument" v-if="!addingMode">Добавить документ 
            <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0)">
                <path d="M7.46172 7.6101L7.46171 1.48211C7.46171 1.26636 7.28681 1.09146 7.07107 1.09147C6.85534 1.09149 6.68043 1.26637 6.68044 1.48211L6.68044 7.61011L0.552447 7.6101C0.336697 7.6101 0.161799 7.785 0.161812 8.00073C0.161826 8.21647 0.336711 8.39138 0.552447 8.39137L6.68043 8.39137L6.68044 14.5194C6.68044 14.7351 6.85534 14.91 7.07107 14.91C7.17894 14.91 7.27659 14.8663 7.34729 14.7956C7.41798 14.7249 7.46171 14.6272 7.46172 14.5193L7.46171 8.39138L13.5897 8.39138C13.6975 8.39138 13.7952 8.34764 13.8659 8.27695C13.9366 8.20625 13.9803 8.10861 13.9803 8.00073C13.9803 7.78498 13.8054 7.61009 13.5897 7.6101L7.46172 7.6101Z" fill="black"/>
              </g>
            <defs>
              <clipPath id="clip0">
                <rect width="10" height="10" fill="white" transform="translate(0 8) rotate(-45)"/>
              </clipPath>
            </defs>
            </svg>

          </div>
        </div>

    </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
  import download from 'downloadjs';
  import axios from 'axios'
  import { baseURL } from '@/settings/config'

  export default {
    name: 'MainWorkflow',
    props:{
      id: String || Number
    },
    data () {
      return {
        highlight: false,
        isLoading: false,
        isDownloading: false,
        fileName: '',
        currentRowHovered: null,
        actionsIcons: ['view', 'download'],

        defaultCompanyDocs: [
          {
            name: '',
            description: '',
            uploading_document: '',
          },
          {
            name: '',
            description: '',
            uploading_document: '',
          },
          {
            name: '',
            description: '',
            uploading_document: '',
          },
          {
            name: '',
            description: '',
            uploading_document: '',
          },
        ],

        addedCompanyDocs: [],

        newCustomDoc: {
          name: '',
          description: '',
          uploading_document: '',
          canDownloadFile: false
        },

        signer:{
          name: '',
          fio: '',
          uploading_document: '',
          canDownloadFile: false
        },

        signerLoading: false,
        signerDisabled: false,

        newDocument: false,

        highlight: false,
        isLoading: false,
        isDownloading: false,

        newDocument: false,
        // new document
        addingMode: false,
      }
    },
    created () {
      this.signerLoading = true
      this.signerDisabled = true
      axios({
        url: baseURL + '/api/account/document/',
        method: 'GET',
      })
      .then( res => {
        let signer = res.data.find( d => d.signer)
          if (signer) {
            this.signer.name = signer.signer
            this.signer.fio = signer.signer_name
            this.signer.file = signer.file
            this.signer.canDownloadFile = true
          } else {
            console.log('Signers: Empty')
          }
            this.signerLoading = false
            this.signerDisabled = false
      })
      .catch( err => {
        this.signerLoading = false
        this.signerDisabled = false
        
        console.error(err)
      })

      this.getCustomDocs()
    },
    methods: {
      ...mapActions(['addCompanyFile', 'deleteCompanyFile', 'toBase64', 'fromBase64']),

      async uploadSignersDoc ( e ) {
        let file = e.target.files[0]
        file = await this.toBase64(file)
        this.signer.uploading_document = file
      },
      /**
       * @todo Transfer axios to store
       */
      setSigner () {
        
        let data = {
          signer: this.signer.name,
          signer_name: this.signer.fio,
          klass: 'attorney',
          name: `документ_подписанта_${this.signer.fio}`,
          file: this.signer.uploading_document,
          company: this.id
        }
        this.signerLoading = true
        this.signerDisabled = true

        axios({
          url: baseURL + '/api/account/document/',
          method: 'POST',
          data: data
        })
        .then( res => {
          this.signerLoading = false
          this.signerDisabled = false
          if (res.data.date_created) {
            this.$toast.open({
            message: `Подписант сохранен`,
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
            })
          }
        })
        .catch( err => {
          console.error(err)
          this.$toast.open({
            message: `Ошибка обработки данных`,
            type: 'error',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
            })
          this.signerLoading = false
          this.signerDisabled = false
        })
      },

     async setDefaultComapnyDoc (e, index) {
        let file = e.target.files[0]
        file = await this.toBase64(file)

        let data = {
          name: this.defaultCompanyDocs[index].name || e.target.files[0].name,
          description: this.defaultCompanyDocs[index].description ? this.defaultCompanyDocs[index].description : 'description',
          file: file,
          company: this.id,
          klass: 'default'
        }

        axios({
          url: baseURL + '/api/account/document/',
          method: 'POST',
          data: data,
        })
        .then( res => {
          this.defaultCompanyDocs[index].uploading_document = file
          this.$toast.open({
            message: `Данные сохранены`,
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
            })
          this.getCustomDocs()

        })
        
      },

      /**
       * @description add new custom docs to array
       */
      addNewDocument () {
        this.addingMode = true;
      },

     async uploadCustomFile (e) {
        let file = e.target.files[0]
        file = await this.toBase64(file)
        this.newCustomDoc.uploading_document = file
      },

      saveNewCustomDocument (  ) {
        let data = {
          name: this.newCustomDoc.name,
          description: 'Дополнительный документ',
          klass: 'default',
          file: this.newCustomDoc.uploading_document,
          company: this.id
        }

        this.addingMode = true

        axios({
          url: baseURL + '/api/account/document/',
          method: 'POST',
          data: data
        })
        .then ( (res) => {
          console.log(res)
          this.$toast.open({
            message: `Данные сохранены`,
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
            })
          this.getCustomDocs()
        })
      },

      getCustomDocs () {
        axios({
          url: baseURL + '/api/account/document/',
          method: 'GET',
        })
        .then ( res => {
          console.log(res)
          this.addedCompanyDocs = []
          if (res.data.length <= 4) {

          }
          let index = 0
          res.data.forEach( d => {
            index++
            d.editDoc = false
            if (index > 4) {
            this.addedCompanyDocs.push(d)
            } else {
              switch (index) {
                case 1:
                  this.defaultCompanyDocs[0] = d
                  break;
                case 2:
                  this.defaultCompanyDocs[1] = d
                  break;
                case 3:
                  this.defaultCompanyDocs[2] = d
                  break;
                case 4:
                  this.defaultCompanyDocs[3] = d
                  break;
              }
            }
          })
        })
      },

     async editDocument (e, id, status) {
        let data = {}
        let file = e.target.files[0] ? e.target.files[0] : false
        if (file) {
          file = await this.toBase64(file)
          data.file = file
        } 

        let doc;
        
        if (status === 'default') {
          doc = this.defaultCompanyDocs[id]
        } else if (status === 'custom') {
          doc = this.addedCompanyDocs[id]
        }

        data.company = this.id
        data.name = doc.name

        axios({
          url: baseURL + `/api/account/document/${doc.id}/`,
          method: 'PATCH',
          data: data
        })
        .then ( () => {
          this.$toast.open({
            message: `Данные сохранены`,
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
            })
          this.getCustomDocs()
        })
      },

      /**
       * Открыть или просмотреть документы
       */
      async runActions ({ e, document }) {
        const { regulation } = await this.loadFileRegulation(document.id);
        let res = regulation.FileContents;
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
              // res = res.split(',')[1];
              const filetype = res.substring(res.lastIndexOf(":") + 1, res.lastIndexOf(";"));
              download(res, `${document.fileName}.pdf`, filetype);
            break
        }
      }
    },
  }
</script>

<style lang="scss">
.company-document-item {
    border: 1px solid #e0e3ea;
    border-radius: 2px;
    display: flex;
    padding: 12px;
    justify-content: space-between;
}
.company-document-status {
    display: flex;
    align-items: center;
}
.company-document-actions {
    position: relative;
    .companies__actions {
        right: 0;
        padding: 0;
        width: 62px;
    }
}
.d-data__content-row {
  padding: 12px 22px;
}
</style>