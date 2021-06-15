<template>
    <div>
      <!-- Представители что приходят с сервера -->
      <div class="compib__row compib__row--dark">
        <span>Подписанты</span>
      </div>
      <div class="isset__signer" v-for="(signer, index) in signers" :key="index">
        <div class="d-data__content-row">
            <div class="my-3">
                     <div class="compib__row">
                        <div class="compib__row-label">
                            <span><b> Подписант </b></span>
                        </div>
                        <div class="compib__input">
                            <div class="search-input">
                                <input type="text" placeholder="Введите представителя по доверенности" v-model="signer.Subscribe">
                            </div>
                        </div>
                    </div>
                    <div class="compib__row">
                        <div class="compib__row-label">
                            <span><b>ФИО представителя </b></span>
                        </div>
                        <div class="compib__input">
                            <div class="search-input">
                                <input type="text" placeholder="Введите ФИО представителя" v-model="signer.FioProxy">
                            </div>
                        </div>
                    </div>
                    <div class="compib__row">
                        <div class="compib__row-label">
                            <span><b> Выбрать подписанта </b></span>
                        </div>
                        <div class="compib__input">
                            <div class="">
                              <span @click="selectSigner(signer.Id)" title="Показывает выбран подписант или нет"><checkBox :checked="signer.Status"></checkBox></span>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <div class="d-data__content-row">
          <p>{{signer.FileName}}</p>
                    <div class="company-document-item">
                        <div class="company-document-status">
                            <icon-base width="18" height="18" viewbox="0 -2 12 18" iconColor="#7989a0"><icon-check /></icon-base>
                            <span v-if="signer.Files">Файл загружен</span>
                            <span v-if="signer.Files == ''">Файл не загружен</span>
                        </div>
                        <div class="company-document-actions">
                          <template v-if="signers.Files != ''">
                            <row-hover-actions :icons="actionsIcons" @setRowHoverAction="runActions({ e: $event, document: signer.Files })" />
                          </template>
                        </div>
                    </div>
                    <div class="f-container__input">
                        <input 
                          type="file" 
                          name="f-container-file"
                          @change="changeFile({ ref: 'organization_documents', document: signer.Files, index: index, id:signer.Id,  status:1,  name:signer.FileName })" 
                          ref="organization_documents" 
                        >
                        <label for="f-container-file" class="f-container__input-label">
                          <div class="f-container__placeholder">
                              <span>Выбрать файл</span>
                          </div>
                          <div class="f-container__button" @click="$refs.organization_documents[index].click()">
                            <div class="btn btn-primary">Выбрать</div>
                          </div>
                        </label>
                    </div>
                    <div class="f-container__button"  style="margin-top: 1em;">
                        <div class="btn btn-red" @click="deleteSigner(signer.Id)">Удалить подисанта</div>

                        <ur-btn 
                        :loading="loading"
                        class="btn btn-primary"
                        @click="editSigner(signer.Id)"
                        >
                          Сохранить
                    </ur-btn>
                    </div>
                </div>
      </div>
      <!-- Добавление представителя -->
      <div class="compib__row compib__row--dark">
        <span>Добавить подписанта</span>
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
        <!-- Уставы -->
        <div class="d-data__content-row">
            <p>Представитель по доверенности</p>
            <div class="f-container">
                <div class="">
                    
                    <div class="f-container__input" :class="{ 'is-disabled' : fileName != null }">
                        <input 
                          type="file" 
                          name="f-container-file"
                          @change="changeFile({ ref: 'fContainerFileRepresentative' })" 
                          ref="fContainerFileRepresentative" 
                          :key="'a' + fileName"
                        >
                        <label for="f-container-file" class="f-container__input-label" 
                          @click="fileName === null ? 
                          $refs.fContainerFileRepresentative.click() : null"
                        >
                          <div class="f-container__placeholder">
                              <span>{{ fileName === null ? 'Выбрать файл предстаителя по доверенности' : fileName }}</span>
                          </div>
                          <div class="f-container__button">
                            <div class="btn btn-primary">Выбрать</div>
                          </div>
                        </label>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
  import moment from 'moment';
  import download from 'downloadjs'
  import checkBox from '@/components/elements/CheckBox'

  export default {
    name: 'MainWorkflow',
    components:{
      checkBox
    },
    data () {
      return {
        highlight: false,
        isLoading: false,
        isDownloading: false,
        fileName: null,
        loading: false,

        signerName: null,
        fullname: null,

        currentRowHovered: null,
        actionsIcons: ['view', 'download'],

        files: [],
        signers:[],
        documents: {
          Regulation: '',
          CertificateRegistrations: '',
          Protocol: ''
        }
      }
    },
    filters: {
      formatDate: function (value) {
        if(value instanceof Date) {
          return moment(value).format('DD.MM.YYYY HH:mm');
        }
        if (!value) return '' // value = "14.07.2020 21:53" или "2020-06-05 T17:10:43.104Z"
        if(!value.includes('-')) return value
        return  moment(value).format('DD.MM.YYYY HH:mm');
      }
    },
    watch: {
      getDefaultCompany: {
        deep: true,
        immediate: true,
        handler(val) {
          console.log(val);
       
        }
      }
    },
    methods: {
      ...mapActions(['addCompanyRepresentative']),
      changeFile ({ ref, document, index, id, status, name  }) {
        if (status == 1) {
          console.log(this.$refs)
          this.addSignerFile(this.$refs[ref][index].files, id, name)
        } else {
          this.upFiles(this.$refs[ref].files);
        }
      },
      /**
       * Удаляем подписанта
       */
      deleteSigner (id) {
        let signerId = id
        this.$http({
          data:{
            Comand:'DeleteRepresentativeProxy',
            Id:signerId
          }
        }).then((res) => {
            this.getSignersFile()
        })
      },
      /**
       * Редактирукем подписанта
       */
      editSigner (id) {
        this.loading = true
        let index = this.signers.findIndex(e => e.Id === id)
        this.$http({
          data:{
            comand: 'EditRepresentativeProxy',
            Id: id,
            Subscribe: this.signers[index].Subscribe,
            FioProxy: this.signers[index].FioProxy
          }
        }).then( res => {
          this.getSignersFile()
          this.loading = false
        })
      },
      /**
       * Получение списка подписантов
       */
      getSignersFile () {
        this.$http({
          data:{
            Comand: 'ListRepresentativeProxy'
          }
        }).then((res) => {
          this.signers = res.result
          // console.log(res)
        })
      },
      /**
       * Добавление файла подисанту
       */
     async addSignerFile (files, id, fileName) {
      //  console.log(files)
          this.$store.dispatch('appLoadingChange', true, { root: true });
        let fileBase64 = await this.toBase64(files[0]);
        fileBase64 = this.prepareBase64(fileBase64);
        this.$http({
          data:{
            Comand:'AddFileRepresentativeProxy',
            Id:id,
            FileName:fileName,
            Files: fileBase64
          }
          }).then(res => {
          this.$store.dispatch('appLoadingChange', false, { root: true });
            this.getSignersFile()
        })
      },
      /**
       * Выбор подисанта
       */
      selectSigner (id) {
        let signerId = id
        this.$http({
          data:{
            Comand:'AppointRepresentativeProxy',
            Id:signerId
          }
        }).then((res) => {
            this.getSignersFile()
        })
      },
      /**
       * Загрузка файла
       */
      async upFiles (files) {
        let fileBase64 = await this.toBase64(files[0]);
        fileBase64 = this.prepareBase64(fileBase64);
        // debugger
        this.$http({
          data:{
            Comand: 'AddRepresentativeProxy',
            FioProxy: this.fullname,
            Subscribe: this.signerName,
            DateBirth: null,
            PassportSeriesNumber: null,
            WhenIssued: null,
            IssuedWhom: null,          
            DivisionCode: null,        
            RegistrationAddress: null, 
            DatePowerAttorney: null,
            FileName: this.signerName,
            Files: fileBase64   
          }, 
        }).then((res) => {
            // this.signers.push(res.Result)
            this.getSignersFile()
         if (res.addFile === 'Complete') {
             this.fileName = null
        }
        })
      },
      runActions ({ e, document }) {
        let res = document;
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
              download(res, 'document.pdf', filetype);
            break
        }
      }
    },
    computed: {
      ...mapGetters(['debtorsCourtProceedings', 'getDefaultCompany']),
    },
    mounted() {
      this.$nextTick(this.getSignersFile)
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
  padding: 0px 22px;
}
</style>