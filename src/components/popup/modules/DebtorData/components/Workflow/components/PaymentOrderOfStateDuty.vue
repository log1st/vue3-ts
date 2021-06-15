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
                    <th style="width:80%">Название</th>
                    <th style="width:19%">Дата</th>
                    <!-- <th>Производство</th> -->
                    <th></th>
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
                    <!-- <td>{{ item.proceedings }}</td> -->
                    <td>
                      <!-- <a href="javascript:void(0);">{{ item.status }}</a> -->
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
              <div class="btn btn-add">
                <icon-base width="22" height="22" >
                  <icon-plus/>
                </icon-base>
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
    import download from 'downloadjs';

export default {
    name: 'PaymentWorkflow',
    components: { 
        baseScrollWrapper,
        rowHoverActions
    },
    props: {
      params: {
        type: Object
      }
    },
    data(){
        return{
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
        if(!value.includes('-')) return value
        return  moment(value).format('DD.MM.YYYY HH:mm');
      },
    },
    created() {
          this.updateFilesTable();
    },
    methods: {
    ...mapActions(['saveDebtorFile', 'downloadFile', 'addHistoryNote']),

        updateFilesTable() {
          const debtor = this.debtorsCourtProceedings.find(d => d.RashSchet == this.params.RashSchet);
          if (debtor.AllFileDebtPaymentOrderStateDuty) {
            this.files = Object.values(debtor.AllFileDebtPaymentOrderStateDuty).reverse();
          } 
        },
        changeFile (event) {
        this.upFiles(this.$refs.fContainerFile.files)
      },
      /**
       * Файл в base64
       * @param file
       * @returns {Promise<any>}
       */
      toBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        })
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
            let stringStatus = this.params.Status
            if (typeof this.params.Status == "object") {
              let findStatus = this.params.Status.Status
              console.log(findStatus)
              findStatus = JSON.parse(findStatus)
              findStatus = findStatus.find(s => s.selected == true)
              stringStatus = findStatus.title
            }
          this.fileName = file.name
          const data = {
            FileName: file.name,
            Data: new Date(),
            Production: 'Cудебное производство', // всегда будет таким
            Status: stringStatus,
            PaymentAccount: parseInt(this.params.RashSchet)
          };
          let fileBase64 = await this.toBase64(file);

          fileBase64 = this.prepareBase64(fileBase64);
          data.File = fileBase64;
          data.PaymentOrderStateDuty = 1;
          this.saveDebtorFile(data)
            .then(res => {
              // записываем в историю
              this.addHistoryNote({
                Names: 'Загрузка документов (ПП об оплате госпошлины - Документооборот)',
                DataTime: new Date(),
                Status: 'Загружено',
                PaymentAccount: parseInt(this.params.RashSchet)
              }).then(() => {
                this.fileName = null
              })
            })
            .catch(error => console.log(error))
        });
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
              PaymentOrderStateDuty: true
            })
            .then(res => {
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
            this.downloadFile({ PaymentAccount: this.params.RashSchet, File: file.FileName, PaymentOrderStateDuty: true }).then(res => {
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
        let tets = Object.values(this.files).map((f, index) => {
          return {
            id: index + 1,
            date: f.Data,
            name: f.FileName,
            proceedings: f.Production,
            status: f.Status
          }
        })
        // debugger
        return tets;
      },
    },
    watch: {
      debtorsCourtProceedings: {
        deep: true,
        handler() {
          this.updateFilesTable();
        }
      }
    },
}
</script>