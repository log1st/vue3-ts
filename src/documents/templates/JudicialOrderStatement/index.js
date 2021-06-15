import Vue from "vue";
var rubles = require('rubles').rubles;
import { template as defaultTemplate }              from "./templateDefault";
import { template as chelyabinskDolyTemplate }      from "./templateChelyabinskDoly";
import { template as chelyabinskSozhiteliTemplate } from "./templateChelyabinskSozhiteli";

// шаблон Vue
const Component = Vue.extend({
    props: ['company', 'debtor', 'services', 'ecp', 'documentsList', 'equityРolders', 'court'],
    template: defaultTemplate,
    data() {
      return {
        months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь' ],
        monthsGenitive: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря' ]
      }
    },
    filters: {
        currencyFormat: function (value) {
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
          }
        },
        currencyHumanReadableFilter: function(value) {
            if (!value) return ''
            value = value.toString()
            if(!value.includes('.')) value = value + '.00'  
            // if(!value.includes('.')) value = value + '.00'  
            value = value.replace('.', ','); // 17,5 17,12
            return value.split(',')[0] +  ' руб. ' + value.split(',')[1] + ' коп';
        }
    },
    created() {
      console.log('Заявление this', this);
    },
    methods: {
      rubles(value) {
        if(!value) return 
        return rubles(value);
      },
      calcDoly(doly, totalDebt) {
        let [int, last] = doly.split('/');
        int = Number(int);
        last = Number(last);
        // debugger
        totalDebt = Number(totalDebt);
        let test = (int / last) * totalDebt
        // debugger
        return test.toFixed(2);
      }
    },
    computed: {
      fullRegionGenitive() {
        let str = this.debtor.SudUch[0].FullRegionGenitive;
        const lower = str.charAt(0).toLowerCase() + str.substring(1);
        return lower;
      },
      dateStart() {
        let index = parseInt(this.debtor.Accrued[0].date_start.substring(0, 2));
        let year = this.debtor.Accrued[0].date_start.substring(3, 7);
        let yearLast = this.debtor.Accrued[this.debtor.Accrued.length - 1].date_start.substring(3, 7);
        
        const test = `${this.monthsGenitive[index - 1]} ` + (yearLast == year ? '' : `${year}г.`);
        return test 
      },
      dateEnd() {
        let last = this.debtor.Accrued[this.debtor.Accrued.length - 1];
        let index = parseInt(last.date_start.substring(0, 2));
        let year = last.date_start.substring(3, 7);
        return `${this.months[index - 1]} ${year}г.`;
      },
      generalManagerShort(){
        let [ surname, name, patronymic ] = this.company.GeneralManager.split(' ');
        name = name.substring(0, 1).toUpperCase();
        patronymic = patronymic.substring(0, 1).toUpperCase();
        return `${surname} ${name}. ${patronymic}`
      },
      computedServices() {
        let filteredServices = this.services.filter(s => s.checked);
        return filteredServices.join(', ');
      }
    }
})

export default class JudicialOrderStatement {
    /**
     * Форматирует строку html для генерации в pdf в последующем
     * @param {String} строка сгенеренной html верстки 
     */
    formatString (str) {
        return str.replace(/(<\/[^>]+>)/g, "$1\n\r");
    }
    /**
     * Возвращает стандартный шаблон заявления
     * @param {} props 
     */
    async createDefaultTemplate (props) {

        const vm = new Component({
            propsData: {
              company: props.company,
              debtor: props.debtor,
              services: props.services,
              documentsList: props.documentsList,
              ecp: props.ecp
            },
            template: defaultTemplate
        })

        let el; 
            if (typeof document !== 'undefined') {
                 el = document.createElement('DIV')
            };
        vm.$mount(el)
        await vm.$nextTick()
        return this.formatString(vm.$el.outerHTML);
    }
    /**
     * Возвращает шаблон заявления для Челябинска в формате дольщиков
     * @param {} props 
     */
    async createChelyabinskDolyTemplate (props) {
        
        const vm = new Component({
            propsData: {
              company: props.company,
              court: props.court,
              debtor: props.debtor,
              services: props.services,
              documentsList: props.documentsList,
              ecp: props.ecp,
              equityРolders: props.equityРolders 
            },
            template: chelyabinskDolyTemplate
        })

        let el; 
            if (typeof document !== 'undefined') {
                 el = document.createElement('DIV')
            };
        vm.$mount(el)
        await vm.$nextTick()
        return this.formatString(vm.$el.outerHTML);
    }
    /**
     * Возвращает шаблон заявления для Челябинска в формате долей
     * @param {} props 
     */
    async createChelyabinskSozhiteliTemplate (props) {

        const vm = new Component({
            propsData: {
              company: props.company,
              debtor: props.debtor,
              services: props.services,
              documentsList: props.documentsList,
              ecp: props.ecp
            },
            template: chelyabinskSozhiteliTemplate
        })

        let el; 
            if (typeof document !== 'undefined') {
                 el = document.createElement('DIV')
            };
        vm.$mount(el)
        await vm.$nextTick()
        return this.formatString(vm.$el.outerHTML);
    }
}

