<template>
  <div class="main__content mt-20">
    <div class="main__content-row">
      <div class="panel-filters">
        <selectNumbers :items="[2, 4, 8]" @changeDataTo="setPerPage($event)">
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
      <div class="main__content-col main__content-col--100">
        <mainContainer>
          <template slot="nobody">
            <table class="panel-table panel-table--2">
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <span class="is-sorted">Дата</span>
                  </th>
                  <th>
                    <span>Тип операции</span>
                  </th>
                  <th>
                    <span class="is-sorted">Сумма</span>
                  </th>
                  <th>
                    <span class="is-sorted">Комментарий</span>
                  </th>
                  <th><span>Акт оказанных услуг</span></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, i) in transactionsInner" 
                  :key="'pnl2tbl2' + i"
                  @mouseover="currentRowHovered = i"
                  @mouseleave="currentRowHovered = null"
                >
                  <td>
                    <checkBox :checked="item.checked"  @changeCheckbox="checkedOne(i)"/>
                  </td>
                  <td>{{ item.date | fromStampToDate }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.summ | sepnum(2) }} ₽</td>
                  <td>{{ item.coments }}</td>
                  <td>{{ item.act }}</td>
                  <td class="panel-table__actions">
                    <div>
                      <transition name="fade">
                        <rowHoverActions v-if="currentRowHovered == i" :icons="actionsIcons" :elClass="i % 2 == 1 ? 'is-dark' : null" @setRowHoverAction="runActions($event)" />
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
import mainContainer from '@/components/elements/MainContainer'
import checkBox from '@/components/elements/CheckBox'
import selectNumbers from '@/components/elements/SelectNumbers'

import { mapActions, mapGetters, mapMutations } from 'vuex'
import rowHoverActions from '@/components/elements/RowHoverActions'
import searchInput from '@/components/elements/SearchInput'
import animationSimple from '@/components/elements/AnimationSimple'
// шаблон
import InvoiceForPayment from '@/documents/templates/invoiceForPayment.js';
import WorkCertificate from '@/documents/templates/workCertificate.js';
import DocumentPDF from '@/documents/index.js';


export default {
  components: {
    mainContainer,
    checkBox,
    selectNumbers,
    rowHoverActions
  },
  data () {
    return {
      transactionsInner: [],
      currentRowHovered: null,

      actionsIcons: ['view', 'download'],
      currentRowHovered: null,

      currentPage: 1,
      itemsPerPage: 2,
    }
  },
  created() {
    this.initItems();
  },
  filters: {
    fromStampToDate: function (timestamp) {
      if (!timestamp) return ''
      timestamp = timestamp * 1000;
      return moment(timestamp).format('DD.MM.YYYY');
    }
  },
  watch: {
    transactions: {
      deep: true,
      handler() {
        this.initItems();
      }
    }
  },
  computed:{
    ...mapGetters([
      'getInfoINNSharedData',
      'getDefaultCompany',
      'transactions',
      'accounts',
      'checkedAccounts'
    ]),
    pages() {
      const test = Math.ceil(this.transactions.length/this.itemsPerPage);  
      return test;
    }
  },
  methods: {
    initItems() {
      this.transactionsInner = cloneDeep(this.transactions).reverse();
      this.transactionsInner = this.transactionsInner.slice(0, this.itemsPerPage)
    },
    setPerPage(e) {
      if(e === this.transactions.length) {
        this.itemsPerPage = e;
        this.transactionsInner = cloneDeep(this.transactions);
        return
      }
      // debugger
      this.itemsPerPage = e;
      this.transactionsInner = cloneDeep(this.transactions);
      let start = (this.currentPage - 1) * this.itemsPerPage;
      let end = (this.currentPage - 1) * this.itemsPerPage + this.itemsPerPage;
      this.transactionsInner = this.transactionsInner.slice(start, end)
    },
    changePageHandler(e) {
      this.currentPage = e;
      this.transactionsInner = cloneDeep(this.transactions);
      let start = (this.currentPage - 1) * this.itemsPerPage;
      let end = (this.currentPage - 1) * this.itemsPerPage + this.itemsPerPage;
      this.transactionsInner = this.transactionsInner.slice(start, end)
    },
    checkedOne (i) {
      this.$store.commit('checkAccount' ,i);
      // this.transaction[i].checked = !this.transaction[i].checked
    },
    updateTransactions () {
      this.transactionsInner = this.$store.getters.transactions;
    },
    async runActions (j) {
      const workCertificate = new WorkCertificate() // класс шаблона
      const documentPDF = new DocumentPDF();            // класс документа
      console.log('runActions', this.currentRowHovered, this.actionsIcons[j])
      if(this.checkedAccounts.length > 0) {

        let templates = []; 
        this.checkedAccounts.forEach(a => { 
              let template = workCertificate.createTemplate({ 
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

            if(this.actionsIcons[j] === 'view') {
                var url = URL.createObjectURL(blob)
                setTimeout(() => {
                    window.open(url, '_blank')
                }, 1000)
            } else if (this.actionsIcons[j] === 'download') {
                // create the blob object with content-type "application/pdf"
              if (typeof document !== 'undefined') {
                let a = document.createElement("a") 
                a.download = `${name}.pdf`
                a.href = blobURL
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
        });
      } else {
        let account = this.accounts.find(a => a.number === this.currentRowHovered);

        switch(true) {
          // просмотр
          case this.actionsIcons[j] === 'view':
            this.createPaymentInvoice(account.summ, 'view');
            break
          
          // скачать
          case this.actionsIcons[j] === 'download':
            this.createPaymentInvoice(account.summ, 'download');
            break
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
    }
  }
}
</script>
