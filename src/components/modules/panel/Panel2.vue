/* eslint-disable promise/param-names */
<template>
  <div class="main__content mt-20">
    <div class="main__content-row">
      <div class="panel-filters">
        <selectNumbers :items="[2, 4, 15]"
          @changeDataTo="setPerPage($event)"
        >
          Показывать записей
        </selectNumbers>
        <!-- <div class="panel-btn">
          <icon-base
            width="10"
            height="10"
            iconColor="#41485d"
            ><icon-filtr />
          </icon-base>
          <span>Фильтр</span>
        </div> -->
      </div>
    </div>
    <div class="main__content-row">
      <div class="panel-text">
        <!-- <div class="panel-text__wrapp">
          <p><b>Для создания счета, пожалуйста, укажите свои реквизиты в разделе «Панель управления» во вкладке «Договоры».</b></p>
        </div> -->

        <div class="panel-text__bill">
          <span>Создать счет</span>
          <div class="panel-text__bill-select">
            <search-input
              :params="paymentMethodInput"
              @changeInputValue="paymentMethodInput.value = $event"
              :key="updateContent"
            />
          </div>
          <span>На сумму</span>
          <div class="panel-text__bill-summ">
            <ur-input 
                placeholder="Сумма оплаты"
                v-model="amount"
                type="text"
                :mask="currencyMask"
                :rules="[
                  val => !!val || 'Поле оязательно'
                ]"  
              />
            <!-- <search-input :params="billSummInput"
              @blur="paymentFocused = false"
              @focused="paymentFocused = true"
              @changeInputValue="billSummInput.value = $event"
              :key="updateContent"
            /> -->
          </div>
          <div v-if="!createBillStatus" class="btn btn-primary btn-primary--small" @click="createBill">Создать</div>
          <animationSimple v-else />
          <!-- <button @click="createPaymentInvoiceWrap">счет</button> -->
          <!-- <button @click="createWorkCertificate">акт</button> -->
        </div>
      </div>
    </div>
    <div class="main__content-row">
      <div class="main__content-col main__content-col--100">
        <mainContainer>
          <template slot="nobody">
            <table class="panel-table panel-table--2">
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <span class="">Номер</span>
                  </th>
                  <th>
                    <span class="">Дата счета</span>
                  </th>
                  <th>
                    <span class="">Сумма</span>
                  </th>
                  <th>
                    <span class="">Назначение</span>
                  </th>
                  <th><span class="">Сумма оплаты</span></th>
                  <th><span class="">Дата оплаты</span></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in accountsInner"
                  @mouseover="currentRowHovered = i"
                  @mouseleave="currentRowHovered = null"
                  :key="'pnl2tbl2' + i"
                >
                  <td>
                    <checkBox :checked="item.checked"  @changeCheckbox="checkedOne(i)"/>
                  </td>
                  <td>{{ item.id }}</td> <!--Выводим созданый id из accounts  -->  
                  <td>{{ item.date | fromStampToDate }}</td>
                  <td>{{ item.summ | sepnum(2) }} ₽</td>
                  <td>{{ item.use === 'True' ? 'Оплачено' : 'Не оплачено' }}</td>
                  <td>{{ item.pays === '' ? 0 : item.pays | sepnum(2) }} ₽</td>
                  <td>{{ item.datePays === '' ? '' : item.datePays | fromStampToDate }}</td>
                  <td class="panel-table__actions">
                    <div>
                      <transition name="fade">
                        <rowHoverActions v-if="currentRowHovered == i" :icons="actionsIcons" :elClass="i % 2 == 1 ? 'is-dark' : null" @setRowHoverAction="runActions({ e: $event, item: item })" />
                      </transition>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <pagination :pages="pages" @changeCurrentPage="changePageHandler($event)" :currentPage="currentPage" />
          </template>
        </mainContainer>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import { mapActions, mapGetters, mapMutations } from 'vuex'
import mainContainer from '@/components/elements/MainContainer'
import checkBox from '@/components/elements/CheckBox'
import rowHoverActions from '@/components/elements/RowHoverActions'
import searchInput from '@/components/elements/SearchInput'
import animationSimple from '@/components/elements/AnimationSimple'
import selectNumbers from '@/components/elements/SelectNumbers'
// шаблон
import InvoiceForPayment from '@/documents/templates/invoiceForPayment.js';
import WorkCertificate from '@/documents/templates/workCertificate.js';
import DocumentPDF from '@/documents/index.js';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
  const currencyMask = createNumberMask({
    prefix: '',
    // suffix: '₽',
    decimalSymbol: ',',
    allowDecimal: true,
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ' ',
    allowNegative: false,
  });

export default {
  components: { mainContainer, checkBox, rowHoverActions, searchInput, animationSimple, selectNumbers },
  data () {
    return {
      accountsInner: [],
      updateContent: 0,
      actionsIcons: ['view', 'download'],
      currentRowHovered: null,
      paymentMethodInput: { placeholder: 'Способ оплаты', isSelect: true, items: [ 'Безналичная оплата' ], value: 'Безналичная оплата' },
      paymentFocused: false,
      billSummInput: { placeholder: 'Сумма оплаты', onlynumber: true, value: null },
      createBillStatus: false,
      coast: 0, // сумма оплаты
      currencyMask: currencyMask,
      currentPage: 1,
      itemsPerPage: 2,

      amount: null,
    }
  },
  computed:{
    ...mapGetters([
      'getInfoINNSharedData',
      'getDefaultCompany',
      'accounts',
      'checkedAccounts'
    ]),
    pages() {
      return Math.ceil(this.accounts.length/this.itemsPerPage);  
    }
  },
  created() {
    this.initItems();
  },
  filters: {
    fromStampToDate: function (timestamp) {
      if (!timestamp) return '-'
      timestamp = timestamp * 1000;
      return moment(timestamp).format('DD.MM.YYYY');
    }
  },
  methods: {
    ...mapActions([
      'setServiceMessageOpen',
      'createAccount'
    ]),
    ...mapMutations([
      'checkAccount'
    ]),
    initItems() {
      this.accountsInner = cloneDeep(this.accounts);
      if (typeof window !== 'undefined') {
        const itemsPerPage = localStorage.getItem('itemsPerPage');
        if(!itemsPerPage) {
          localStorage.setItem('itemsPerPage', 2)
        }
      } else {
        const itemsPerPage = 0
      }
      
      this.itemsPerPage = parseInt(itemsPerPage);
      this.accountsInner = this.accountsInner.slice(0, this.itemsPerPage)
    },
    setPerPage(e) {
      if(e === this.accounts.length) {
        this.itemsPerPage = e;
        if (typeof window !== 'undefined') {
          localStorage.setItem('itemsPerPage', e)
        }
        this.accountsInner = cloneDeep(this.accounts);
        return
      }
      // debugger
      this.itemsPerPage = e;
      if (typeof window !== 'undefined') {
          localStorage.setItem('itemsPerPage', e)
        }
      this.accountsInner = cloneDeep(this.accounts);
      let start = (this.currentPage - 1) * this.itemsPerPage;
      let end = (this.currentPage - 1) * this.itemsPerPage + this.itemsPerPage;
      this.accountsInner = this.accountsInner.slice(start, end)
    },
    changePageHandler(e) {
      this.currentPage = e;
      this.accountsInner = cloneDeep(this.accounts);
      let start = (this.currentPage - 1) * this.itemsPerPage;
      let end = (this.currentPage - 1) * this.itemsPerPage + this.itemsPerPage;
      this.accountsInner = this.accountsInner.slice(start, end)
    },
    checkedOne (i) {
      this.checkAccount(i);
      // this.bills[i].checked = !this.bills[i].checked
    },
    async runActions (payload) {
      const { e, item } = payload;
      
      const invoiceForPayment = new InvoiceForPayment() // класс шаблона
      const documentPDF = new DocumentPDF();            // класс документа
      if(this.checkedAccounts.length > 0) {

        let templates = []; 
        this.checkedAccounts.forEach(a => { 
              let template = invoiceForPayment.createTemplate({ 
                  company: this.getDefaultCompany,
                  companySharedData: this.getInfoINNSharedData,
                  coast: a.summ
              });
            templates.push(template);
        });

        templates = await Promise.all(templates);
        
        templates = templates.map(template => documentPDF.generate(template, 'Счет на оплату', { tableAutoSize: true }) );


        templates = await Promise.all(templates);

        templates = templates.map(str => str.replace(/=/g, "*"));

        templates = Object.assign({}, templates);

        // dispatch('appLoadingChange', true, { root: true });
        return this.$store.dispatch("mergePDF", templates).then(async (res) => {
            
            var binary = atob(res.replace(/\s/g, ''))
            var len = binary.length
            var buffer = new ArrayBuffer(len)
            var view = new Uint8Array(buffer)
            for (var i = 0; i < len; i++) {
              view[i] = binary.charCodeAt(i)
            }
            
            var blob = new Blob([view], { type: 'application/pdf' })

            let blobURL = URL.createObjectURL(blob);

            if(this.actionsIcons[e] === 'view') {
              
                this.createPaymentInvoice(item.summ, 'view');
                // var url = URL.createObjectURL(blob)
                // console.log(url)
                // setTimeout(() => {
                //     window.open(url, '_blank')
                // }, 1000)
            } else if (this.actionsIcons[e] === 'download') {
                // create the blob object with content-type "application/pdf"
                this.createPaymentInvoice(item.summ, 'download');

                // let a = document.createElement("a") 
                // a.download = `${name}.pdf`
                // a.href = blobURL
                // document.body.appendChild(a)
                // a.click()
                // document.body.removeChild(a)
            }
        });
      } else {
        console.log(this.accountsInner, this.currentRowHovered);
        // debugger
      // let account = this.accounts.find(a => a.number === this.currentRowHovered);
      
      switch(true) {
        // просмотр
        case this.actionsIcons[e] === 'view':
          this.createPaymentInvoice(item.summ, 'view');
          break
        
        // скачать
        case this.actionsIcons[e] === 'download':
          this.createPaymentInvoice(item.summ, 'download');
          break
      }
      }

    },
    createBill () {
      
      let amountFloat = cloneDeep(this.amount).replace(/\s/g, '');
      const test = amountFloat.split('').includes(',');
      if(!test) amountFloat = amountFloat + ',00'; 
      amountFloat = amountFloat.replace(/,/g, '.')
      // if (this.paymentMethodInput.value === null) {
      //   this.paymentMethodInput.class = 'is-error'
      //   this.updateContent++
      // }
      // if (!this.billSummInput.value) {
      //   this.billSummInput.class = 'is-error'
      //   this.updateContent++
      // }
      // if (this.paymentMethodInput.value && this.billSummInput.value) {
        this.createBillStatus = true
          this.createAccount({
            // Amount: this.amount, 
            Amount: amountFloat, 
            TypePayment: this.paymentMethodInput.value, 
            Comments: 'comments' 
          }).then(() => {
            this.setServiceMessageOpen('Счет успешно создан!')
            // this.paymentMethodInput.value = ''
            // this.billSummInput.value = null
            this.amount = null
            this.createBillStatus = false
            this.updateContent++
          })
      // }
    },
    async createPaymentInvoice(coast, format) {
       // класс шаблона заявления
      const invoiceForPayment = new InvoiceForPayment() // класс шаблона
      const documentPDF = new DocumentPDF();            // класс документа
      let template = await invoiceForPayment.createTemplate({ 
        company: this.getDefaultCompany,
        companySharedData: this.getInfoINNSharedData,
        coast: coast
      });
      template = await documentPDF.generate(template, 'Счет на оплату', { tableAutoSize: true });
      // console.log(template)
      var binary = atob(template.replace(/\s/g, ''))
      var len = binary.length
      var buffer = new ArrayBuffer(len)
      var view = new Uint8Array(buffer)
      for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i)
      }
      var blob = new Blob([view], { type: 'application/pdf' })

      if (format === 'view') {
        var url = URL.createObjectURL(blob)
        setTimeout(() => {
            window.open(url, '_blank')
        }, 1000)
      } else if (format === 'download') {
        var blobURL = URL.createObjectURL(blob) // Не сохранялся файл из за то что в ссылку помещался объект
      if (typeof document !== 'undefined') {
        let a = document.createElement("a") 
        a.download = `Счет_на_оплату.pdf`
        a.href = blobURL
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
      }
  },
  async createWorkCertificate () {
      // класс шаблона акта
      const workCertificate = new WorkCertificate() // класс шаблона
      const documentPDF = new DocumentPDF();            // класс документа
      // console.log('test', this)
      let template = await workCertificate.createTemplate({ 
        company: this.getDefaultCompany,
        companySharedData: this.getInfoINNSharedData,
        coast: this.coast
      });
      // debugger
      template = await documentPDF.generate(template, 'Счет на оплату', { tableAutoSize: true });

      var binary = atob(template.replace(/\s/g, ''))
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
    },
  },
  watch: {
    paymentFocused (val) {
      if (this.paymentSumm === null) return false
      if (!val && !!this.billSummInput.value) {
        this.coast = this.billSummInput.value;
        this.billSummInput.value = this.$options.filters.sepnum(parseInt(this.billSummInput.value).toFixed(0)) + '.00 ₽'
        this.updateContent++
      }
    },
    accounts: {
      deep: true,
      handler() {
        this.initItems()
      }
    }
  },
  mounted(){
    this.$nextTick(this.setPerPage(2))
  }
}
</script>
