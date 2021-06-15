import Vue   from "vue";
// шаблон Vue
Vue.component('table-title', {
    props: ['row', 'hasDate'],
    template: `
      <div>
      <tr style="border-bottom: none">
        <td colspan="8" style="text-align: left"><b>{{ hasDate ? formatDate(row.Tema) : row.Tema }}</b></td>
      </tr>
      </div>
    `,
    methods: {
      formatDate (str) {
        let strArr = str.split(' ');
        let date = strArr.pop();
        date = date.split('.').reverse().join('.');
        strArr.push(date);
        strArr = strArr.join(' ');
        return strArr; 
      }
    },
  })
  
  Vue.component('table-header', {
    template: `
        <div>
        <tr>
          <td rowspan="2" style="background-color: #eeeeee; text-align: center; width: 90px">Задолженность</td>
          <td colspan="3" style="background-color: #eeeeee; text-align: center; width: 180px">Период просрочки</td>
          <td rowspan="2" style="background-color: #eeeeee; text-align: center; width: 50px">Ставка</td>
          <td rowspan="2" style="background-color: #eeeeee; text-align: center; width: 50px">Доля ставки</td>
          <td rowspan="2" style="background-color: #eeeeee; text-align: center; width: 160px">Формула</td>
          <td rowspan="2" style="background-color: #eeeeee; text-align: center; width: 75px">Пени</td>
        </tr>
        <tr>
          <td style="background-color: #eeeeee; text-align: center; width: 60px">с</td>
          <td style="background-color: #eeeeee; text-align: center; width: 60px">по</td>
          <td style="background-color: #eeeeee; text-align: center; width: 60px">дней</td>
        </tr>
      </div>
    `,
    props: ['row'],
  })
  
  Vue.component('table-default-row', {
    props: ['row'],
    template: `
    <div>
      <tr>
        <td style="text-align: center">{{ row.Zadolgennost | formatCurrency }}</td>
        <td style="text-align: center">{{ row.DateStart }}</td>
        <td style="text-align: center">{{ row.DateStop }}</td>
        <td style="text-align: center"><span style="text-align: center">{{ row.Days }}</span></td>
        <td style="text-align: center">{{ row.Stawka }}%</td>
        <td style="text-align: center">1/{{ row.Doly_stawki }}</td>
        <td style="text-align: center">{{ row.Formula | formatFormula }}</td>
        <td style="text-align: center">{{ row.Peny | formatCurrency }} руб.</td>
      </tr>
    </div>
    `,
    filters: {
      formatCurrency: function (value) {
        if (!value && value !== 0) return ''
        value = value.toString()
        if(!value.includes('.')) value = value + '.00'  
        value = value.replace('.', ','); // 17,5 17,12
        try {
          if(value.split(',')[1].length === 1) {
            return value + '0';
          } else {
            return value
          }
        } catch (e) {
          console.log(value)
          debugger
        }

        // console.log('value NUM', parseInt(value.split(',')[1]), parseInt(value.split(',')[1]) >= 10, typeof parseInt(value.split(',')[1]))
        // value = parseInt(value.split(',')[1]) >= 10 ? value : value + '0'
      },
      formatFormula: function (value) {
        if (!value) return ''
        value = value.toString()
        value = value.replace('.', ','); // 17,5 17,12
        return value
      }
    }
  })
  
  Vue.component('table-debt-off-row', {
    props: ['row'],
    template: `
    <div>
      <tr>
        <td style="background-color: #feefc4; text-align: right">{{ row.Zadolgennost | formatCurrency }}</td>
        <td style="background-color: #feefc4; text-align: right">{{ row.DateStart }}</td>
        <td colspan="6" style="background-color: #feefc4; text-align: left"><b>{{ row.Tema }}</b></td>
      </tr>
    </div>`,
    filters: {
      formatCurrency: function (value) {
        if (!value) return ''
        value = value.toString()
        if(!value.includes('.')) value = value + '.00'  
        value = value.replace('.', ','); // 17,5 17,12
        try {
          if(value.split(',')[1].length === 1) {
            return value + '0';
          } else {
            return value
          }
        } catch (e) {
          console.log(value)
          debugger
        }
        // value = value.split(',')[1] >= 10 ? value : value + '0'
        // return value
      }
    }
  })

  Vue.component('table-total-row', {
    props: ['row'],
    template: `
    <div>
      <tr>
        <td colspan="7" style="text-align: right"><b>Итого</b></td>
        <td><b>{{ row.Peny | formatCurrency }} руб.</b></td>
      </tr>
    </div>`,
    filters: {
      formatCurrency: function (value) {
        if (!value && value !== 0) return ''
        // if (!value) return ''
        value = value.toString()
        if(!value.includes('.')) value = value + '.00'  
        value = value.replace('.', ','); // 17,5 17,12
        try {
          if(value.split(',')[1].length === 1) {
            return value + '0';
          } else {
            return value
          }
        } catch (e) {
          console.log(value)
          debugger
        }
        // value = value.split(',')[1] >= 10 ? value : value + '0'
        // return value
      }
    }
  })

  Vue.component('table-total-all-row', {
    props: ['row'],
    template: `
    <div>
      <tr>
        <td colspan="8" style="text-align: right; font-size: 12pt"><b>Сумма основного долга: {{ row.Zadolgennost | formatCurrency }} руб</b></td>
      </tr>
      <tr>
        <td colspan="8" style="text-align: right; font-size: 12pt"><b>Сумма пеней по всем задолженностям: {{ row.Peny | formatCurrency }} руб</b></td>
      </tr>
    </div>`,
    filters: {
      formatCurrency: function (value) {
        if (!value) return ''
        value = value.toString()
        if(!value.includes('.')) value = value + '.00'  
        value = value.replace('.', ','); // 17,5 17,12
        try {
          if(value.split(',')[1].length === 1) {
            return value + '0';
          } else {
            return value
          }
        } catch (e) {
          console.log(value)
          debugger
        }
        // value = value.split(',')[1] >= 10 ? value : value + '0'
        // return value
      }
    }
  })
  
  const Component = Vue.extend({
    props: ['company', 'debtor', 'peniLogs'],
    template: `
    <div>
      <div v-for="(page, pageIndex) in preparedArray">
      <template v-if="pageIndex == 0">
        <table>
          <tr>
            <td colspan="8" style="border: none; border-bottom: 1px">Расчет пени за коммунальные услуги (ст 155 ЖК РФ)</td>
          </tr>
          <tr>
            <td colspan="2" style="border: none">Номер ЛС</b></td>
            <td colspan="6" style="border: none"><b>{{ debtor.RashSchet }}</b></td>
          </tr>
          <tr>
            <td colspan="2" style="border: none">Адрес</td>
            <td colspan="6" style="border: none"><b>{{ debtor.Postal ? debtor.Postal + ',' : '' }} {{ debtor.Adres }}</b></td>
          </tr>
          <tr>
              <td colspan="2" style="border: none">{{ Object.values(debtor.ListResidents).length > 1 ? 'Должники' : 'Должник' }}</td>

              <td colspan="6" style="border: none">
                <b v-for="(item, index) in debtor.ListResidents">
                  {{ item.FioDebt }}{{ debtor.ListResidents[parseInt(index) + 1] ? ', ' : '' }}
                </b>
              </td>
            </tr>
        </table>
      </template>
  
      <table style="font-size: 10pt" :class="{ 'pdf-pagebreak-before': pageIndex > 0}">
        <thead>
          <template v-for="(row, index) in page">
            <template v-if="index == 0 && pageIndex > 0">
              <tr>
                <td colspan="8" style="border: none">Расчет пени за коммунальные услуги (страница {{ pageIndex + 1 }})</td>
              </tr>
            </template>
            
            <template v-if="row.Tema.split(' ')[0] === 'Расчёт'">
              <table-title :row="row" :hasDate="true" />
              <table-header :row="row" />
            </template>
    
            <template  v-if="row.Tema.split(' ')[0] === 'Изменилась' || row.Tema.split(' ')[0] === 'Мораторий'" >
              <table-default-row :row="row" />
              <table-title :row="row" />
            </template>
            
            <table-default-row :row="row" v-if="row.Tema.length <= 0" />
            
            <table-debt-off-row :row="row" v-if="row.Tema.split(' ')[0] === 'Погашение'" />
    
            <table-total-all-row :row="row" v-if="row.Tema === 'Итого пени и задолженности за весь период'" />
  
            <table-total-row :row="row" v-else-if="row.Tema.split(' ')[0] === 'Итого'"/>
            
          </template>
        </thead>
      </table>
      </div>
    </div>`,
    created () {
      this.prepareArray()
    },
    methods: {
      prepareArray () {
        const paniArray = Object.values(this.peniLogs);
        // let test4  = chunk(paniArray, 24)
        // первая страница
        let firstCount = 40;
        let firstPage = [];
        // каждая страница
        let allPage = [];

        paniArray.forEach(row => {
          // 40 
          if(row.Tema.split(' ')[0] === 'Расчёт') { // занимает 3 строки
            // debugger
            if(firstCount >= 0) {
              firstPage.push(row);
              firstCount = firstCount - 3
            } else {
              allPage.push(row)
            }

          } else if(row.Tema.split(' ')[0] === 'Изменилась') { // занимает 2 строки
            // debugger
            if(firstCount >= 0) {
              firstPage.push(row);
              firstCount = firstCount - 2
            } else {
              allPage.push(row)
            }

          } else { // занимает 1 строки
            // debugger
            if(firstCount >= 0) {
              firstPage.push(row);
              firstCount = firstCount - 1
            } else {
              allPage.push(row)
            }
          }
        });
        let test2 = [];
        let page = [];
        let pageCount = 44; 
        allPage.forEach((row, index, allPapgeArray) => {
          // debugger
          if(index === allPapgeArray.length - 1) {
            // debugger
            test2.push(page);
          }

          if(pageCount < 0) {
            // debugger
            test2.push(page);
            page = [];
            pageCount = 44; 
          }

          if(row.Tema.split(' ')[0] === 'Расчёт') { // занимает 3 строки
            if(pageCount >= 0) {
              // debugger
              page.push(row);
              pageCount = pageCount - 3
            }
          } else if(row.Tema.split(' ')[0] === 'Изменилась') { // занимает 2 строки
            if(pageCount >= 0) {
              // debugger
              page.push(row);
              pageCount = pageCount - 2
            }
          } else { // занимает 1 строки
            if(pageCount >= 0) {
              // debugger
              page.push(row);
              pageCount = pageCount - 1
            } 
          }
        })
        // debugger
        this.preparedArray = [firstPage, ...test2 ]
      },
      formatDate (str) {
        const strArr = str.split(' ');
        let date = strArr.pop();
        date = date.split('.').reverse().join('.');
        strArr = strArr.push(data);
        return strArr; 
      }
    },
    data () {
      return {
        rowsPerPage: 5,
        preparedArray: []
      }
    },
    filters: {
      formatCurrency: function (value) {
        if (!value) return ''
        value = value.toString()
        value = value.replace('.', ',');
        return value
      }
    }
  })

export default class CalculationPeni {
    constructor() {
        // this.html = '';
        // this.vm = '';
        // this.el = document.createElement('DIV');
    }

    formatString (str) {
        return str.replace(/(<\/[^>]+>)/g, "$1\n\r").replace(/<!---->/g, '\n\r')
    };

    async createTemplate (props) {
        // const peniLogs = await this.getDebtorDefaultReport(props.debtor.RashSchet, { DateFiltrStart: props.DateFiltrStart, DateFiltrStop: props.DateFiltrStop })
        const peniLogs = await $http({
          data: {
            command: 'DefaultReport',
            rasShet: props.debtor.RashSchet
          }
        }).then(res => {
          return res.result.PeniLogs  
        }) 

        const vm = new Component({
            propsData: {
                company: props.company,
                debtor: props.debtor,
                peniLogs: peniLogs
            }
        })
        const el = document.createElement('DIV');
        vm.$mount(el)
        await vm.$nextTick() 

        return this.formatString(vm.$el.outerHTML);
    }
}