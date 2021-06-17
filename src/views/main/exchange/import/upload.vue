<template>
  <exchangeWrapper>
    <main-container :title="title" :elemClass="'exchange-wrapper'">
      <div class="exchange-content">
        <div class="exchange-content-head">
          <search-input
          v-if="typeButton[0].isActive"
          @changeInputValue="setCurrentYear($event)"
          :params="{
            isSelect: true, 
            items: yearsData,
            placeholder: 'Выберите дату',
            class: 'exchangeDate' 
            }"
        />
          <div class="exchange-upload-btn active-btn" @click="prepareImportDebtors()">
            Загрузить файлы
          </div>
          <div class="exchange-upload-btn">
            <!-- Интеграция по апи -->
          </div>
        </div>
        <div class="exchange-inner-content">
          
          <div class="exchange-inner-content-head">
            <div class="exchange-inner-content-head__btns">
              <div class="exchange-inner-content-head__btn" 
              v-for="item in typeButton"
              :key="item.id"
              :class="{'active-btn-type': item.isActive}"
              @click="setExchageUploadType(item)"
              v-show="item.isShow"
              >
              {{item.name}}
              </div>
            </div>
            <!-- <div class="exchange-inner-content-head__inform" v-if="exchangeInfo">
              <div class="close__inform" @click="exchangeInfo = false">
                <icon-base>
                    <icon-close/>
                </icon-base>
              </div>
              <div class="inform__text">
                Табличный способ загрузки...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
              </div>
            </div> -->
          </div>

          <div class="exchange-cascad" v-if="typeButton[0].isActive">

        <!-- <div 
          class="btn btn-primary" 
          @click="makeCalculationsForce()"
          :class="{'is-disabled' : disabledImporting  }"
        >
          Обновить
        </div> -->
        
          <div class="main-container__row mt-20">
            <div v-for="(item, i) in monthData" class="main-container__col-3" :key="'asdasd' + i">
              <exchange-file-button
                :name="item.title"
                @fileSelect="addFile($event, i, item.index)"
                :disabled="disabledImporting || item.disabled"
                :key="updateContent"
              />
            </div>
          </div>
          

       

            <div class="exchange-toaster">
              <div class="exchange-toaster--loader" v-if="uploadingStatus || onLoadImport">
                {{ uploadingProgress }}% Загружено
                <div class="loader-inner" :style="{ width: uploadingProgress * 156 / 100 + 'px' }"></div>
                <div class="loader-outer"></div>
              </div>
            </div>

            <div class="exchange-toaster">
              <div class="exchange-toaster--loader" v-if="penaltyStatus">
                {{ penaltyProgress }}% Рассчитано
                <div class="loader-inner" :style="{ width: penaltyProgress * 156 / 100 + 'px' }"></div>
                <div class="loader-outer"></div>
              </div>
            </div>
          </div>
          <linear-upload v-else />
    </div>
  </div>
      <div class="exchange-download-lists">
        <div class="exchange-example-docs">
          <div class="exchange-example-docs-head">
            Скачайте на компьютер файл шаблона, сгенерированного программой Excel. Заполните его значениями
          </div>
          <div class="exchange-example-docs-download">
              <div class="exchange-example-docs-download-head">
                Табличные шаблоны
              </div>
              <div class="exchange-example-docs-download-lists">
                <div class="exchange-example-docs-download-list"
                v-for="(item, index) in exchangeExampleDocs"
                :key="index"
                :class="{'disable-example': item.disable}"
                >
                <span v-if="!item.disable"> <a :href="'/assets/files/debtorImportTemplate.'+item.type" download>{{item.name}}</a> </span>
                <span v-else>{{item.name}}</span>
                <span>Файл</span>
                </div>
              </div>
          </div>
          <div class="exchange-example-docs-download" style="margin-top:30px">
              <div class="exchange-example-docs-download-head">
                Линейные шаблоны
              </div>
              <div class="exchange-example-docs-download-lists">
                <div class="exchange-example-docs-download-list"
                v-for="(item, index) in exchangeExampleDocsLinear"
                :key="index"
                :class="{'disable-example': item.disable}"
                >
                <span v-if="!item.disable"> <a :href="'/assets/files/debtorImportTemplate.'+item.type" download>{{item.name}}</a> </span>
                <span v-else>{{item.name}}</span>
                <span>Файл</span>
                </div>
              </div>
          </div>
        </div>
            <div class="exchange__action-btn-wrapper">
              <div class="btn btn--out upload__data-btn" @click="clearFiles()" :class="{ 'is-disabled' : disabledImporting }">Отменить</div>
              <div class="btn btn-primary upload__data-btn" @click="prepareImportDebtors()" :class="{ 'is-disabled' : disabledImporting || onLoadImport }" :disabled="onLoadImport">Загрузить</div>
            </div>
      </div>

    </main-container>
  </exchangeWrapper>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { baseURL } from '@/settings/config'
import exchangeWrapper from '@/components/modules/exchange/ExchangeWrapper'
import exchangeFileButton from '@/components/modules/exchange/ExchangeFileButton'
import searchInput from '@/components/elements/SearchInput'
import selectGray from '@/components/elements/SelectGray'
import moment from 'moment';
import linear from './uploadLinear'

export default {
  name: 'ImportUpload',
  components: { exchangeWrapper, searchInput, selectGray,
    'linear-upload': linear,
    'exchange-file-button': exchangeFileButton
  },
  data () {
    return {
      updateContent: 0,
      error: false,
      currentOrg: null,
      currentYear: 2021,
      filesForImport: [], // от 1 до 12-ти
      regionError: false,
      expanded: true,
      onLoadImport: false,
      onUpdate: false,

      exchangeInfo: true,

      typeButton:[
        {
          id: 1,
          name: 'Табличный',
          isActive: false,
          isShow: false
        },
        {
          id: 2,
          name: 'Линейный',
          isActive: true,
          isShow: true
        }
      ],

      exchangeExampleDocs: [
        {
          type: 'csv',
          name: 'CSV',
          disable: false,
          file: ''
        },
        {
          name: 'XLS',
          type: 'xls',
          disable: true,
          file: ''
        },
        {
          name: 'XLSX',
          type: 'xlsx',
          disable: true,
          file: ''
        }
      ],
      exchangeExampleDocsLinear: [
        {
          type: 'csv',
          name: 'CSV',
          disable: true,
          file: ''
        },
        {
          name: 'XLS',
          type: 'xls',
          disable: true,
          file: ''
        },
        {
          name: 'XLSX',
          type: 'xlsx',
          disable: true,
          file: ''
        }
      ]
    }
  },
  mounted () {
    // Временное отключение табличного метода
    if (this.typeButton[0].isActive) {
      this.typeButton[0].isActive = false
      this.typeButton[1].isActive = true
    }
  },
  methods: {
    ...mapActions(['setPopupComponent', 'appLoadingChange', 'getPenaltyStatus', 'initPenaltyAction', 'importDebtors', 'toBase64']),
    ...mapMutations(['setUploading', 'setPenaltyStatus', 'setRegionSavingStatus', 'setNewUserStatus']),

    setCurrentYear(e) {
      this.currentYear = e.split(' ')[0]
    },

    setExchageUploadType (item) {
        this.typeButton.forEach ( tb => {
          tb.isActive = item.id === tb.id ? true : false
        })
    },

    /**
     * Подготовка формирование объекта документа перед загрузкой
     */
    prepareImportDebtors () {
      if (!this.selectedRegion) {
          this.setPopupComponent({ component: 'popupAlert', params: { title: 'Загрузка невозможна', text: 'Выберите регион' } })
      } else if (this.typeButton[0].isActive) {
      let data = {
        mode: 'table',
        year: this.currentYear
      }
      this.filesForImport.forEach(async e => {
        if (typeof e !== 'undefined') {
          data.month = e.month
          data.file = await this.toBase64(e.file)
          data.module = `${this.$route.query.action + 1}`,
          data.last = e.month === this.filesForImport.length ? true : false,
          data.name = `file-table-upload ${(new Date()).getFullYear()}-${(new Date()).getDay()}-${(new Date()).getDate()}`
          
          this.importDebtors(data)
        }
        index++
      })
      } else if (!this.typeButton[0].isActive) {
        events.$emit('load_doc_linear', {status:false, globalBtn: true})
      }
    },

    getCompanyStatus () {
      //
    },
    /**
     * Отслеживание прогресса загрузки статуса
     * @param promises - массив промисов
     * @param progressCallback - колбек вызываемый после резолва
     * @returns {Promise}
     */
    allProgress (promises, progressCallback) {
      let d = 0;
      progressCallback(0);
      for (const p of promises) {
        if(p != null && typeof p.then === 'function') {
          p.then(() => {
            d++;
            progressCallback((d * 100) / promises.length)
          })
        } else {
          console.log('not promise', p)
        }
      }
      return Promise.all(promises)
    },
    /**
     * Чтение и загрузка файлов для расчета
     * @returns {Promise}
     */
    uploadFiles () {
      this.setUploading({ progress: 0, status: true });
      // оборачиваем массив промисов для отслеживания статуса
      return this.allProgress(this.filesForImport.map((el, index) => {
        console.log('el and index while uploading', el, index)
        if (el) {
          const fileName = `${this.currentYear}.${this.twoSimbols(index + 1)}.csv`;
          return this.readFile(el, fileName)
        }
      }),
      (p) => {
        this.setUploading({ progress: p.toFixed() });
      }).catch(e => {
        this.setUploading({ progress: 0, status: false });
        this.clearFiles();
        console.error('Error while uploading files', e.response);
      }).finally(() => {
        this.setUploading({ progress: 100, status: false });
      })
    },
    
    /**
     * Отправить данные на расчет пени
     */
    makeCalculations () {
      //
    },
    /**
     * функция загрузки и расчета файлов
     */
    async importFiles () {
      if (this.validate) {
        this.onLoadImport = true
        await this.setRegion(); // установить регион
        await this.uploadFiles(); // загрузить файлы
        setTimeout(() => {
          this.initPenaltyAction();
        }, 500);
        await this.makeCalculations(); // начать расчет
        this.setNewUserStatus(false);
      }
    },
    /**
     * Обработчик для кнопки "обновить"
     */
    async makeCalculationsForce() {
      this.onUpdate = true
      setTimeout(() => {
        this.initPenaltyAction();
      }, 500);
      await this.makeCalculations(); // начать расчет
    },
    validate () {
      if (this.disabledImporting) {
        return false
      }
      if (this.penaltyStatus) {
        this.setPopupComponent({ component: 'popupAlert', params: { title: 'Загрузка невозможна', text: 'Проводится рассчет .csv файлов с данными на сервере' } })
        return false
      }
      if (this.currentOrg === null) {
        this.error = true
        this.updateContent++
        return false
      }
      if (this.filesForImport.length === 0) {
        this.setPopupComponent({ component: 'popupAlert', params: { title: 'Загрузка невозможна', text: 'Выберите фалы .csv с данными для загрузки на сервер' } })
        return false
      }
      return true
    },
    addFile (fileData, index, monthIndex) {
      this.filesForImport[index] = { file: fileData, month: index + 1 } 
    },
    /**
     * Очистка инпутов файлов импорта
     */
    clearFiles () {
      if (this.typeButton[0].isActive ) {
        this.filesForImport = [];
        this.updateContent++
      } else {
        events.$emit('clear_linear_file')
      }
    }
  },
  watch: {
    penaltyStatus: {
      handler (value) {
        this.setUploading(value);
        console.log(value)
      }
    },
    getCompaniesFullNames: {
      immediate: true,
      handler(val) {
        if (val !== undefined && Array.isArray(val) && val.length > 0) {
          this.updateContent++;
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'getCompaniesFullNames',
      'regionsList',
      'penaltyStatus',
      'penaltyProgress',
      'uploadingStatus',
      'uploadingProgress',
      'regionUploadingStatus',
      'selectedRegion'
    ]),
    companyId () {
      return this.$store.state.companies.exchangedCompany.id
    },
    disabledImporting () {
      return this.uploadingStatus || this.penaltyStatus || this.regionUploadingStatus || this.onLoadImport
    },
    monthData () {
      let startDate = this.datePeriod[0];
      let endDate = this.datePeriod[this.datePeriod.length - 1];
      let selectedYear = this.currentYear;
      const names = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
      function isDisabled (index) {
        const indexNow = moment().month();
        const dateNow = moment().date();
        if (index + 1 === indexNow && dateNow >= 10) {
          return true;
        } else if (index + 1 === indexNow && dateNow < 10) {
          return false
        } else if(index < indexNow) {
          return true;
        }
        return false;
      };
      function isDisabledForward (index) {
        const indexNow = moment().month();
        const dateNow = moment().date();
        if (index + 1 === indexNow && dateNow >= 10) {
          return false;
        } else if (index + 1 === indexNow && dateNow < 10) {
          return true
        } else if(index < indexNow) {
          return false;
        }
        return true;
      }
      switch (true) {
        case selectedYear === startDate.substring(0, 4) :
          return names.map((name, index) => {
            return {
              title: name,
              disabled: isDisabled(index)
            }
          });
          break

        case selectedYear < endDate.substring(0, 4):
          return names.map(name => {
            return {
              title: name,
              disabled: false
            }
          })
          break

        case selectedYear == endDate.substring(0, 4):
          return names.map((name, index) => {
            return {
              title: name,
              disabled: isDisabledForward(index)
            }
          });
          break
      }
    },
    yearsData () {
      return this.datePeriod.map(p => {
        return p.substring(0, 4);
      }).filter((p, index, array) => {
        return array.indexOf(p) === index
      }).map(p => `${p} Год`).reverse()
    },
    // вычисляет период в 4 года
    datePeriod() {
      let dateStart = moment().subtract(4, 'years');
      const dateNow = moment();
      let timeValues = [];

      while (dateNow > dateStart || dateStart.format('M') === dateNow.format('M')) {
        timeValues.push(dateStart.format('YYYY-MM-DD'));
        dateStart.add(1, 'month');
      }
      return timeValues;
    },
    title () {
      const partsNames = ['Досудебная практика', 'Cудебная практика', 'Исполнительное производство']
      return 'Загрузить лицевые счета должников в раздел «' + partsNames[this.$route.query.action] + '»'
    },
    organizationId () {
      return this.getCompaniesFullNames.findIndex(el => el === this.currentOrg)
    }
  }
}
</script>

