<template>
    <div class="d-data__content-row">
      <div class="f-container">
        <!-- <div
          class="f-container__body"
          :class="{ 'highlight' : highlight, 'is-loading' : fileName || isLoading }"
          @dragover.prevent="highlight = true; isLoading = true"
          @dragleave.prevent="highlight = false"
          @drop.stop.prevent="dropFiles"
        > -->
        <div
          class="f-container__body"
          :class="{ 'highlight' : highlight, 'is-loading' : fileName || isLoading }"
        >
          <div class="f-container__body-wrap">
            <!-- <baseScrollWrapper :height="'300px'">  -->
              <!-- <div  style="height: 300px; overflow-y: scroll"> -->
              <div v-if="debtorFilesComputed.length > 0" class="f-container__body-table egrn" id="f-container__body-table">
                <table>
                  <thead>
                  <tr>
                    <th style="width: 10%">№</th>
                    <th>Наименование</th>
                    <th>Дата запроса</th>
                    <th>Дата выгрузки</th>
                    <th>Статус</th>
                  </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(item, i) in debtorFilesComputed" @mouseover="currentRowHovered = i" @mouseleave="currentRowHovered = null" :key="'fcnttbl' + i"
                        :id="i === debtorFilesComputed.length - 1 ? 'last-element' : ''" 
                      >
                        <td style="width:10px">{{ i + 1}}</td>
                        <td>
                          <div style="justify-content: start;">
                            <icon-base width="14" height="15" viewbox="0 0 42 51" iconColor="#7989a0"><icon-file /></icon-base>
                            <span>{{ item.name }}</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <span > {{ new Date(item.datestart) }} </span>
                          </div>
                        </td>

                        <td>
                            <div>
                              <span > {{ item.date | formatDate }} </span>
                            </div>
                        </td>
                        
                        <td>
                          <div>
                            <!-- <a href="javascript:void(0);" v-if="index === 0">{{ item.status }}</a> -->
                            <a href="javascript:void(0);" >{{item.status}}</a>
                            <transition name="fade"> 
                              <div v-if="currentRowHovered == i">
                                  <row-hover-actions v-if="i === 0" class="actionPDF" :icons="actionsIcons" @setRowHoverAction="runActions({ e: $event, file: item })" />
                                  <row-hover-actions v-else-if="i === 1" class="actionZIP" :icons="actionsIconsZIP" @setRowHoverAction="runActionsZIP(item)" />
                              </div>
                            </transition>
                          </div>
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
        <!-- <div class="f-container__input" :class="{ 'is-disabled' : fileName != null }">
          <input type="file" name="f-container-file" multiple @change="changeFile" ref="fContainerFile" :key="'a' + fileName">
          <label for="f-container-file" class="f-container__input-label" @click="fileName === null ? $refs.fContainerFile.click() : null">
            <div class="f-container__placeholder">
              <span>{{ fileName === null ? 'Выбрать файл' : fileName }}</span>
            </div>
            <div class="f-container__button">
              <div class="btn btn-primary">Выбрать</div>
            </div>
          </label>
        </div> -->
      </div>
    </div>
    
</template>

<script>
  import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'

  export default {
    name: 'egrn-workflow',
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
        actionsIconsZIP: ['download'],
        files: []
      }
    },
    created() {
      this.initFilesInTable();
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
      ...mapActions(['saveDebtorFile', 'downloadFile', 'getEgrnDoc', 'getEgrnStatus']),
      /**
       * Подготавливает файлы для рендера в хуке created
       * В пропсе params уже есть файлы - просто берем их из пропса
       */
      initFilesInTable() {  
        this.getEgrnDoc({id: this.params.debtor.pk})
        .then( result => {
          if ( result.status ) {
            console.log(result)
          }
        })
        .catch( err => {
          this.getEgrnStatus({id:this.params.debtor.pk})
          .then( statusResp => {
            console.log(statusResp)
            if (statusResp.items.data) {
              this.files = statusResp.items.data
            }
          })
          console.log(err)
        })
        if (this.params.AllFileDebtFromEgrn) {
          this.files = this.filterDebtorFilesByExtension(Object.values(this.params.AllFileDebtFromEgrn).reverse());
        } else console.log('none: Egrn debtors data')
      },
      /**
       * Подготавливает/обновляет файлы для рендера после операций с ними во vuex
       * Пропс не обновляется, поэтому слушаем геттер и находим файлы по RashSchet должника  
       */
      updateFilesInTable() {
        const debtor = this.debtorsCourtProceedings.find(d => d.RashSchet == this.params.RashSchet);
        this.files = this.filterDebtorFilesByExtension(Object.values(debtor.AllFileDebtFromEgrn).reverse());
      },
      /**
       * Фильрует файлы по расширению .zip и .pdf имени и возвращает их
       * @param {Array} массив файлов
       */
      filterDebtorFilesByExtension(files) {
        return files.filter(d => d.FileName.includes('.pdf') || d.FileName.includes('.zip')); 
      },
      /**
       * Группирует файлы по имени
       * @param {Array}
       * @return {Object}
       */
      groupDebtorFilesByName(files) {
        return groupBy(files, file => file.FileName.split('.')[0]);
      },
      /**
       * Обработчик события input для файлов выписки (пока функционал скрыт)
       */
      changeFile (event) {
        this.upFiles(this.$refs.fContainerFile.files)
      },
      /**
       * Обработчик дропа файлов
       */
      dropFiles (e) {
        if (e.dataTransfer.files) {
          this.upFiles(e.dataTransfer.files);
          this.isLoading = false;
        }
      },
      /**
       * Загрузка файла выписки (пока этот функционал скрыт)
       */
      upFiles (files) {
        files.forEach(async file => {
            this.fileName = file.name
            const data = {
                FileName: file.name,
                Data: new Date(),
                Production: 'Cудебное производство', // всегда будет таким
                Status: this.params.Status,
                PaymentAccount: parseInt(this.params.RashSchet)
            };
            let fileBase64 = await this.toBase64(file);

            fileBase64 = this.prepareBase64(fileBase64);
            data.File = fileBase64;
            data.FromEgrn = 1; 

            this.saveDebtorFile(data).then(() => {
              this.fileName = null
            })
        });
      },
      /**
       * Скачать или просмотреть файл выписки
       */
      runActions (payload) {
        this.isDownloading = true;
        switch (payload.e) {
          // Открыть в новой вкладке
          case 0:
            this.downloadFile({ 
              PaymentAccount: this.params.RashSchet, 
              File: payload.file.name,
              FromEgrn: true
            }).then(res => {
              res = this.inversePrepareBase64(res);
              // res = res.split(',')[1];
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
          // Скачать
          case 1:
            this.downloadFile({ 
              PaymentAccount: this.params.RashSchet,
              File: payload.file.name,
              FromEgrn: true
            }).then(res => {
              res = this.inversePrepareBase64(res);
              res = 'data:application/pdf;base64,' + res;
              const type = 'application/pdf';
              download(res, payload.file.name, type);
            }).finally(() => {
              this.isDownloading = false;
            })
            break
        }
      },
      /**
       * Скачать архив
       */
      runActionsZIP (payload) {
        this.isDownloading = true;
        this.downloadFile({ 
          PaymentAccount: this.params.RashSchet,
          File: payload.name,
          FromEgrn: true
        }).then(res => {
          res = this.inversePrepareBase64(res);
          res = 'data:application/x-zip-compressed;base64,' + res;
          download(res, payload.name + '.zip', 'application/x-zip-compressed');
        }).finally(() => {
          this.isDownloading = false;
        })
      }
    },
    computed: {
      ...mapGetters(['debtorsCourtProceedings']),
      debtorFilesComputed() {
        let groupedFiles = this.files
        let finalArr = []
        groupedFiles.forEach(file => {
          let item = {
              date: file.cad_number,
              datestart: file.created_at,
              name: !file.name ? `Заявка - ${file.tracker}`: file.name,
              proceedings: file.request_type,
              status: file.status
          }
          finalArr.push(item)
        })
        return finalArr
      }
    }
  }
</script>

<style lang="scss">
  .f-container__body-table.egrn tbody tr {
    height: 80px;
  }
  .actionPDF {
    top: 28%
  }
  .actionZIP {
    top: 74%
  }
</style>