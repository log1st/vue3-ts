import Vue from "vue";

// шаблон Vue
const Component = Vue.extend({
    props: ['debtor', 'company', 'services', 'charges'],
  
    template: `
    <div>
        <p style="text-align: center; font-size: 20px"><b>Справка о финансовом состоянии ЛС</b></p>
        
        <table>
            <tbody>
                <tr style="border: none">
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0"><b>ФЛС №:</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0"><b>{{ debtor.RashSchet }}</b></p>
                    </td>
                </tr>
                <tr style="border: none">
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0"><b>Код плательщика:</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0"><b>{{ debtor.RashSchet }}</b></p>
                    </td>
                </tr>
                <tr style="border: none">
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: right"><b>Адрес:</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0"><b>{{ debtor.Postal }}, {{ debtor.Adres }}</b></p>
                    </td>
                </tr>
                <tr style="border: none">
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: right"><b>ОКС:</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0"><b>{{ debtor.FIO }}</b></p>
                    </td>
                </tr>
                <tr style="border: none" v-for="(item, index) in computedServices">
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: right"><b>{{ parseInt(index) === 0 ? 'Услуги:': '' }}</b></p>
                    </td>
                    <td colspan="1" rowspan="1" >
                        <p style="font-size: 10pt; margin: 0">{{ item }}</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table>
            <tbody>
                <!--tr>
                    <td colspan="3" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Организация</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Начальный остаток</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Начислено</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Оплачено</b></p>
                    </td>
                    <td colspan="2" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Конечный остаток</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Сумма просроченной задолженности</b></p>
                    </td>
                </tr-->
                <!--tr>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>№ кв.</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Лицевой счет</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Месяцев задолженности</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                    </td>
                    <td colspan="1" rowspan="1">
                    </td>
                    <td colspan="1" rowspan="1">
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Задолженность</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Конечный остаток</b></p>
                    </td>
                    <td colspan="1" rowspan="1">
                    </td>
                </tr-->
                <tr>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Период учета</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Вх. сальдо</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Начисления</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Начисления разовые</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Доп.корректировка</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Субсидии</b></p>
                    </td>
                    <!--td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Субсидии перерасчет</b></p>
                    </td-->
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Оплаты</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0; text-align: center"><b>Исх.сальдо</b></p>
                    </td>
                </tr>

                <tr v-for="(item, index) in debtor.Accrued" :key="index">
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0; text-align: center">{{ item.date_start }}</p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0">{{ charges[index][3].toFixed(2) | currencyFilter }}</p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0">{{ item.Accrued | currencyFilter }}</p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0">{{ item.Single | currencyFilter }}</p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0">{{ item.AdditionalAdjustment | currencyFilter }}</p>
                    </td>
                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0">{{ item.Subsidies | currencyFilter }}</p>
                    </td>

                    <!--td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0"></p>
                    </td-->

                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0">{{ debtor.Paid[index].Paid | currencyFilter }}</p>
                    </td>

                    <td colspan="1" rowspan="1">
                        <p style="font-size: 10pt; margin: 0">{{ charges[index][11].toFixed(2) | currencyFilter}}</p>
                    </td>
                </tr>
         
                <tr>
                    <td colspan="1" rowspan="1"  style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0"><b>Итого:</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <!-- p style="font-size: 10pt; margin: 0">{{ initialBalance.toFixed(2) }}</p -->
                        <p style="font-size: 10pt; margin: 0"><b>{{ charges[debtor.Accrued.length - 1][3].toFixed(2) }}</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0"><b>{{ totalAccrued.toFixed(2) | currencyFilter }}</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0"><b>{{ singleTotal.toFixed(2) | currencyFilter }}</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0"><b>{{ additionalAdjustmentTotal | currencyFilter }}</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0"><b>{{ finalBalance.toFixed(2) }}</b></p>
                    </td>
                    <!--td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0"><b></b></p>
                    </td-->
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0"><b>{{ paidTotal.toFixed(2) | currencyFilter }}</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="background-color: #eeeeee">
                        <p style="font-size: 10pt; margin: 0"><b>{{ charges[debtor.Accrued.length - 1][11].toFixed(2) }}</b></p>
                    </td>
                </tr>
            </tbody>
        </table>

        <table>
            <tbody>
                <tr style="border: none">
                    <td colspan="1" rowspan="1" style="width: 250px">
                    </td>
                    <td colspan="1" rowspan="1" style="width: 400px">
                    </td>
                </tr>
                <tr style="border: none">
                    <td colspan="1" rowspan="1" style="width: 250px" >
                    </td>
                    <td colspan="1" rowspan="1" style="width: 400px" >
                        <p style="font-size: 12pt; margin: 0; text-align: right"><b>Итоговая общая сумма задолженности {{ debtor.TotalDebt | currencyFilter }} рублей</b></p>
                    </td>
                </tr>
                <tr style="border: none">
                    <td colspan="1" rowspan="1" style="width: 250px">
                    </td>
                    <td colspan="1" rowspan="1" style="width: 400px">
                    </td>
                </tr>    
                <tr style="border: none">
                    <td colspan="1" rowspan="1" style="width: 250px">
                    </td>
                    <td colspan="1" rowspan="1" style="width: 400px">
                    </td>
                </tr>    
                <tr style="border: none">
                    <td colspan="1" rowspan="1" style="width: 250px">
                    </td>
                    <td colspan="1" rowspan="1" style="width: 400px">
                    </td>
                </tr>
                <tr style="border: none">
                    <td colspan="1" rowspan="1" style="width: 250px" >
                        <p style="font-size: 12pt; margin: 0"><b>Генеральный директор:</b></p>
                    </td>
                    <td colspan="1" rowspan="1" style="width: 400px" >
                        <p style="font-size: 12pt; margin: 0; text-align: right"><b>_______________ {{ generalManagerShort }}</b></p>
                    </td>
                </tr>
                <tr style="border: none">
                    <td colspan="1" rowspan="1" style="width: 250px">
                    </td>
                    <td colspan="1" rowspan="1" style="width: 400px">
                    </td>
                </tr>
                <tr style="border: none">
                    <td colspan="1" rowspan="1" style="width: 250px">
                    </td>
                    <td colspan="1" rowspan="1" style="width: 400px">
                        <p style="font-size: 12pt; margin: 0; text-align: center">М.П.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    filters: {
        currencyFilter(val) {
            if(val == undefined || val == '' || val == null) return '0,00'
            if(!val && val !== 0) return val
            if(val === 0) return '0,00'
            val = val.toString();
            val = val.replace('.', ',');
            try {
                if(val.split(',')[1].length === 1) {
                    return val + '0';
                } else {
                    return val
                }
            } catch (e) {
                console.log(val)
            }
            return val
        }
    },
    computed: {
        initialBalance() {
            let result = 0;
            Object.values(this.charges).forEach(i => result += i[3]); 
            return result;
        },
        arrearsBalance() {
            let result = 0;
            Object.values(this.charges).forEach(i => result += i[11]); 
            return result;
        },
        finalBalance() {
            let result = 0;
            Object.values(this.charges).forEach(i => result += i[12]); 
            return result;
        },
        arrearsTotal() {
            let result = 0;
            Object.values(this.charges).forEach(i => result += i[13]); 
            return result.toFixed(2);
        },
        singleTotal() {
            let result = 0;
            Object.values(this.debtor.Accrued).forEach(i => result += i.Single); 
            return result;
        },
        totalAccrued() {
            let result = 0;
            Object.values(this.debtor.Accrued).forEach(i => result += i.Accrued); 
            return result;
        },
        additionalAdjustmentTotal() {
            let result = 0;
            Object.values(this.debtor.Accrued).forEach(i => result += i.AdditionalAdjustment); 
            return result;
        },
        paidTotal() {
            let result = 0;
            Object.values(this.debtor.Paid).forEach(i => result += i.Paid); 
            return result;
        },
        generalManagerShort(){
            let [ surname, name, patronymic ] = this.company.GeneralManager.split(' ');
            name = name.substring(0, 1).toUpperCase();
            patronymic = patronymic.substring(0, 1).toUpperCase();
            return `${surname} ${name}. ${patronymic}`
        },
        computedServices() {
            // let services = [ 
            //     'Электроснабжение ОДН',
            //     'Водоотведение',
            //     'Газоснабжение',
            //     'Отопление',
            //     'Холодное в/с',
            //     'Горячее в/с',
            //     'Содержание ж/ф',
            //     'ТКО',
            // ];
            
            // let filteredServices = services.filter((i, index) => {
            //     if(this.services[index]) {
            //         return i;
            //     }
            // });
            console.log(this.services)
            debugger
            return this.services.filter(s => s.checked)
          }
    },
})

export default class SetOfCharges {
    constructor() {
        // this.html = '';
        // this.vm = '';
    }

    formatString (str) {
        // console.log(str)
        let strReplace = str.replace(/(<\/[^>]+>)/g, "$1\n\r").replace(/<!---->/g, '\n\r')
        return strReplace
    };
     getCharges (debtor) {
         $http({
            data:{
                comand: 'ListSetOfChargesDebtors',
                EnforcementProceeding: 1,
                CurrentDebtor: debtor.RashSchet
            }
        }).then( res => {
            debugger
            let findData = res.result[debtor.RashSchet]
            return findData;
        })
    };
    async createTemplate (props) {
        let e = ''
       await $http({
            data:{
                comand: 'ListSetOfChargesDebtors',
                EnforcementProceeding: 1,
                CurrentDebtor: props.debtor.RashSchet
            }
        }).then( res => {
            debugger
            let findData = res.result[props.debtor.RashSchet]
            const vm = new Component({
                propsData: {
                    debtor: props.debtor,
                    company: props.company,
                    services: props.services,
                    charges: findData
                }
            })
            e = findData
            debugger
            // const el = document.createElement('DIV');
            // vm.$mount(el)
            // vm.$nextTick()
            // return this.formatString(vm.$el.outerHTML);
        })
            const vm = new Component({
                propsData: {
                    debtor: props.debtor,
                    company: props.company,
                    services: props.services,
                    charges: e
                }
            })
            // console.log(e)
            debugger
            let el; 
            if (typeof document !== 'undefined') {
                 el = document.createElement('DIV')
            };
            vm.$mount(el)
            await vm.$nextTick()
            return this.formatString(vm.$el.outerHTML);
    };
    
}
