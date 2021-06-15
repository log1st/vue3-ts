<template>
    <div class="d-data__content-row">
      <div class="f-container">
        <div
          class="f-container__body"
          :class="{ 'highlight' : highlight, 'is-loading' : fileName || isLoading }"
          @dragover.prevent="highlight = true; isLoading = true"
          @dragleave.prevent="highlight = false"
          @drop.stop.prevent="dropFiles"
        >
          <div class="f-container__body-wrap">
            <!-- <baseScrollWrapper :height="'300px'">  -->
              <!-- <div  style="height: 300px; overflow-y: scroll"> -->
              <div v-if="debtorFilesComputed.length > 0" class="f-container__body-table" id="f-container__body-table">
                <table>
                  <thead>
                  <tr>
                    <th style="width:1%">№</th>
                    <th>Название</th>
                    <th>Дата</th>
                    <th>Производство</th>
                    <th>Статус</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, i) in debtorFilesComputed" @mouseover="currentRowHovered = i" @mouseleave="currentRowHovered = null" :key="'fcnttbl' + i"
                    :id="i === debtorFilesComputed.length - 1 ? 'last-element' : ''" 
                  >
                  <td style="width:10px">{{i + 1}}</td>
                    <td>
                      <div style="justify-content: start;">
                        <icon-base width="14" height="15" viewbox="0 0 42 51" iconColor="#7989a0"><icon-file /></icon-base>
                        <span>
                        {{ item.name }}
                        </span>
                      </div>
                    </td>
                    <td>{{ item.date | formatDate }}</td>
                    <td>{{ item.proceedings }}</td>
                    <td>
                      <a href="javascript:void(0);">{{ item.status }}</a>
                      <transition name="fade">
                        <rowHoverActions v-if="currentRowHovered == i" :icons="actionsIcons" @setRowHoverAction="runActions($event)" />
                      </transition>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            <!-- </div> -->
            <!-- </baseScrollWrapper> -->
          </div>
          <div class="f-container__mask" :class="{ 'is-hide' : debtorFilesComputed.length > 0 }">
            <div class="f-container__mask-inner">
              <div class="f-container__icon">
                <icon-base width="42" height="51" :iconColor="fileName != null ? '#ffffff' : '#cbd7e8'"><icon-file /></icon-base>
              </div>
              <div class="f-container__subtitle">{{ fileName === null ? 'Перетащите файлы сюда' : fileName + ' Загружается' }}</div>
            </div>
            <transition name="fade">
              <div v-if="fileName != null" class="f-container__loader">
                <div class="f-container__loader-marker"></div>
              </div>
            </transition>
          </div>
          <transition name="fade">
            <div v-if="isDownloading" class="f-container__loader">
              <div class="f-container__loader-marker"></div>
            </div>
          </transition>
        </div>
        <div class="f-container__input" :class="{ 'is-disabled' : fileName != null }">
          <input type="file" name="f-container-file" multiple @change="changeFile" ref="fContainerFile" :key="'a' + fileName">
          <label for="f-container-file" class="f-container__input-label" @click="fileName === null ? $refs.fContainerFile.click() : null">
            <div class="f-container__placeholder">
              <span>{{ fileName === null ? 'Выбрать файл' : fileName }}</span>
            </div>
            <div class="f-container__button">
              <div class="btn btn-primary">Выбрать</div>
            </div>
          </label>
        </div>
      </div>
    </div>
    
</template>

<script>
  import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
  import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
  import rowHoverActions from '@/components/elements/RowHoverActions'
  import moment from 'moment';
  import download from 'downloadjs'

  export default {
    name: 'PassportOfficeWorkflow',
    components: { 
        baseScrollWrapper,
        rowHoverActions
    },
    props: {
      params: {
        type: Object
      }
    },
    data () {
      return {
        highlight: false,
        isLoading: false,
        isDownloading: false,
        fileName: null,
        currentRowHovered: null,
        actionsIcons: ['view', 'download'],

        files: []
      }
    },
    filters: {
      formatDate: function (value) {
        if(value instanceof Date) {
          return moment(value).format('DD.MM.YYYY HH:mm');
        }
        if (!value) return '' // value = "14.07.2020 21:53" или "2020-06-05 T17:10:43.104Z"
        // дальше будет костыль - спасибо унификации бэкенда
        if(!value.includes('-')) return value
        return  moment(value).format('DD.MM.YYYY HH:mm');
      }
    },
    created() {
      this.updateFilesTable();
    },
    watch: {
      debtorsCourtProceedings: {
        deep: true,
        handler() {
          this.updateFilesTable();
        }
      }
    },
    methods: {
      ...mapActions(['saveDebtorFile', 'downloadFile', 'addHistoryNote']),
      updateFilesTable() {
        const debtor = this.debtorsCourtProceedings.find(d => d.RashSchet == this.params.RashSchet);
        this.files = Object.values(debtor.AllFileDebtPaymentOrderStateDuty).reverse();
      },
      changeFile (event) {
        this.upFiles(this.$refs.fContainerFile.files)
      },
      dropFiles (e) {
        if (e.dataTransfer.files) {
          this.upFiles(e.dataTransfer.files);
          this.isLoading = false;
        }
      },
      /**
       * Загрузка файла
       */
      upFiles (files) {
        files.forEach(async file => {
            this.fileName = file.name
            const data = {
                Data: new Date(),
                Production: 'Cудебное производство', // всегда будет таким
                Status: 'Новый',
                PaymentAccount: parseInt(this.params.RashSchet)
            };
            let fileBase64 = await this.toBase64(file);
            let converted = await this.convertToPDF(fileBase64, file.name);
            fileBase64 = this.prepareBase64(converted.fileBase64);
            data.FileName = converted.name;
            data.File = fileBase64;
            data.PaymentOrderStateDuty = 1; 
            this.saveDebtorFile(data).then(() => {
              this.fileName = null
            })
        });
      },
      async convertToPDF(file, name) {
        // "data:image/jpeg;base64,/9j/
        // "data:application/pdf;base64,sd
        // "data:image/png;base64,i
        let type = file.split(';')[0];
        let fileBase64 = '';
        switch(type) {
          case 'data:image/jpeg': 
            fileBase64 = await this.$store.dispatch('imageToPDFConverter', file);
            return {
              fileBase64: "data:application/pdf;base64," + fileBase64,
              name: name + '.pdf'
            }
            break;

          case 'data:image/png':
            fileBase64 = await this.$store.dispatch('imageToPDFConverter', file);
            return {
              fileBase64: "data:application/pdf;base64," + fileBase64,
              name: name + '.pdf'
            }
          break;

          case 'data:application/pdf':
            return {
              fileBase64: file,
              name: name
            }
            break;
        }
      },
      runActions (e) {
        const file = this.files[this.currentRowHovered];
        this.isDownloading = true;
        switch (e) {
          // Открыть в новой вкладке
          case 0:
            this.downloadFile({ 
              PaymentAccount: this.params.RashSchet,
              File: file.FileName, 
              PassportOffice: true
            }).then(res => {
              // debugger
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
            }).finally(() => {
              this.isDownloading = false;
            })
            break

          case 1:
            // скачать
            this.downloadFile({ 
              PaymentAccount: this.params.RashSchet,
              File: file.FileName,
              PassportOffice: true
            }).then(res => {
              res = this.inversePrepareBase64(res);
              const type = res.substring(res.lastIndexOf(":") + 1, res.lastIndexOf(";"));
              download(res, file.FileName, type);
            }).finally(() => {
              this.isDownloading = false;
            })
            break
        }
      }
    },
    computed: {
      ...mapGetters(['debtorsCourtProceedings']),
      debtorFilesComputed() {
        return Object.values(this.files).map(f => {
          return {
            date: f.Data,
            name: f.FileName,
            proceedings: f.Production,
            status: f.Status
          }
        })
      },
    }
  }
</script>
