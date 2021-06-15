<template>
  <div class="main">
    <template v-if="getDebtorsModuleActive === -1">
      <div class="main__head">
        <div class="main__head-title mt-6">Услуги не подключены111</div>
      </div>
    </template>
    <template v-else>
      <div class="main__head">
        <btn-group
          :buttons="debtorsModulesButtons"
          :active="currentActive"
          @currentActive="currentActive = $event"
        />
        <main-select :items="actionsForSelectItem(currentActive)"
                     @selectAction="debtIsChecked > 0 ? runAction($event) : setPopupComponent({ component: 'popupAlert', params: { title: 'Действие отмененно', text: 'Выберите пожалуйста должников' } })" />
      </div>
      <div class="main__content main__content--wrapp">
        <div class="main__content-header">
          <div class="main__content-title">Список должников</div>
          <div v-if="allDebtors" class="main__content-shows">
            Показаны <span>{{ showDebtors }} </span> из <span>{{ allDebtors }}</span>
          </div>
        </div>
        <keep-alive>
<!--          <main-table-->
<!--            @send-action="runAction"-->
<!--            :key="updateContent"-->
<!--            @printItem="printStatementsJudicalModule"-->
<!--          />-->
        </keep-alive>
      </div>
    </template>
    <div ref="wrapfabtest">
      <div class="adBanner"></div >
    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import exportHTMLToPDF from '@/functions/exportToPdf.js'
// import download from 'downloadjs'
import { mapGetters, mapActions } from 'vuex'
import btnGroup from '@/components/elements/ButtonsGroup'
import mainSelect from '@/components/elements/MainSelect'
import mainTable from '@/components/modules/MainTable'
import getHTMLStatementsJudicalModule from '@/functions/getHTMLStatementsJudicalModule.js'
import getHTMLNotificationAction from '@/functions/getHTMLNotificationAction.js'
import getHTMLSetOfCharges from '@/functions/getHTMLSetOfCharges.js'
import getHtmlFileEGRUL from '@/functions/getHtmlFileEGRUL.js'
// import list from '@/components/modules/accruals/List'
export default {
  name: 'Debtors',
  components: { btnGroup, mainSelect, mainTable },
  data () {
    return {
      updateContent: 0,
      timerId: null
    }
  },
  methods: {
    ...mapActions(['setDebtorsModuleActive', 'setDebtorsDate', 'setPopupComponent']),
    setNotification () { // сформировать уведомление - выбрать дату
      this.setPopupComponent({ component: 'calendar', params: { btnName: 'Сформировать', action: this.setNotificationAction } })
    },
    setFirstPanelActive () {
      this.currentActive = this.debtorsModulesButtons.find(el => el.status === true)
    },
    calcFine () { // расчет пени, пока отключен, но нужен
      console.log('расчет пени')
      if (!this.debtIsChecked) {
        this.setPopupComponent({ component: 'popupAlert', params: { title: 'Действие отмененно', text: 'Выберите пожалуйста должников' } })
        // alert('Выберите пожалуйста должников')
        return false
      }
      window.open(this.$router.resolve({ path: '/accruals/fine' }).href, '_blank')
    },
    runAction ({ action, data }) {
      this[action](data)
    },
    getSetOfCharges () { // свод начислений по л.с. getHTMLSetOfCharges
      let html = ''
      if (!this.debtorsChecked.length) {
        this.setPopupComponent({
          component: 'popupAlert',
          params: {
            title: 'Печать невозможна',
            text: 'Выберите должников'
          }
        })
        return false
      }
      this.checkAddBlock()
        .then(() => {
          Promise.all(
            this.debtorsChecked.map(el => {
              return getHTMLSetOfCharges(el)
            })
          )
            .then(res => { html += res })
            .then(() => {
              html2pdf().set({ html2canvas: { logging: false }, jsPDF: { orientation: 'landscape' } }).from(html).toPdf().get('pdf').then(function (pdf) {
                window.open(pdf.output('bloburl'), '_blank')
              })
            })
        })
    },
    printStatementsJudicalModule () { // печать заявлений судебный модуль
      this.checkAddBlock()
      const debtors = this.getDebtors.filter(el => el.checked)
      const alertPopup = (title = 'Печать невозможна', text) => {
        this.setPopupComponent({
          component: 'popupAlert',
          params: {
            title: title,
            text: text
          }
        })
      }
      // минимальные валидации
      if (!debtors.length) {
        alertPopup(undefined, 'Выберите должников')
        return false
      }

      // const opt = {
      //   margin: [0,0],
      //   filename: 'docIdpdf.pdf',
      //   image: { type: 'jpeg', quality: 0.98 },
      //   html2canvas: { dpi: 192, letterRendering: true },
      //   jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      // }
      // формирование html по должнику
      const delayedLog = async (item) => {
        let html = ''
        html += await getHTMLStatementsJudicalModule(item, this.getDefaultCompany)
        return html
      }
      const processArray = async (array) => {
        try {
          // формируем html из всех задолжников
          const result = await Promise.all(array.map(delayedLog))
          console.time('s')
          // console.log(result.join('\r\n'))
          // let result = ''
          // for (const item of array) {
          //   result += await delayedLog(item)
          //   // console.log(item.FIO, result.length)
          // }
          // паралельно формируем ЕГРЮЛ
          getHtmlFileEGRUL(this.getDefaultCompany.FileEGRUL)
          // загружаем всё в pdf
          // const pdf = await html2pdf()
          //   .set(opt)
          //   .from(result.join(''))
          //   .toPdf()
          //   .get('pdf')
          // window.open(pdf.output('bloburl'), '_blank');
          const newDiv = document.createElement('div')
          newDiv.innerHTML = result.join('').trim()
          const pages = newDiv.querySelectorAll('.list')
          await exportHTMLToPDF(pages)
          //this.$store.dispatch('appLoadingChange', false)
          console.timeEnd('s')
        } catch (error) {
          console.log(error)
          //this.$store.dispatch('appLoadingChange', false)
          alertPopup('Ошибка сервера', 'Что-то пошло не так, попробуйте позже')
          // alertPopup(undefined, 'Недостаточно средств')
          // ToDo проверка баланса
        }
      }
      //this.$store.dispatch('appLoadingChange', true)
      processArray(debtors)
    },
    setNotificationAction (date) { // сформировать уведомление
      this.checkAddBlock()
        .then(() => {
          const debtors = this.getDebtors.filter(el => el.checked)
          let html = ''
          debtors.forEach(el => {
            html += getHTMLNotificationAction(date, el)
          })
          html2pdf().set({ html2canvas: { logging: false } }).from(html).toPdf().get('pdf').then(function (pdf) {
            window.open(pdf.output('bloburl'), '_blank')
          })
        })
      // window.open(this.$router.resolve({ path: '/accruals/pdf' }).href, '_blank')
    },
    checkAddBlock () {
      return new Promise((resolve, reject) => {
        if (this.$refs.wrapfabtest.clientHeight > 0) resolve()
        else {
          this.timerId = setTimeout(() => {
            this.setPopupComponent({ component: 'popupAlert', params: { title: 'Обнаружен AddBlock', text: 'Плагин AddBlock блокирует открытие вспомогательных окон. Для корректной работы приложения необходимо его отключить и перезагрузить страницу.' } })
            const error = { error: true }
            reject(error)
          }, 100)
        }
      })
    },
    generateDebtorApp (data) {
      this.setPopupComponent({ component: 'calendar', params: { btnName: 'Сформировать' } })
    },
    func (data) {
      console.log(data)
    }
  },
  computed: {
    ...mapGetters([
      'allDebtors',
      'showDebtors',
      'getDisplaySettingsEdit',
      'debtIsChecked',
      'getDebtors',
      'actionsForSelectItem',
      'debtorsModulesButtons',
      'getDebtorsModuleActive',
      'getDefaultCompany'
    ]),
    statusPopupDisplaySettings () {
      return this.getDisplaySettingsEdit
    },
    currentActive: {
      set (event) {
        this.updateContent++
        this.setDebtorsModuleActive(event)
      },
      get () {
        return this.getDebtorsModuleActive
      }
    },
    debtorsChecked () {
      return this.getDebtors.filter(el => el.checked)
    }
  },
  watch: {
    statusPopupDisplaySettings (val) {
      if (!val) this.updateContent++
    }
  },
  beforeDestroy () {
    clearTimeout(this.timerId)
  },
  created() {
    console.log('asdas');
    debugger
  }
}
</script>
