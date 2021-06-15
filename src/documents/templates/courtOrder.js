import Vue from "vue";

// шаблон Vue
const Component = Vue.extend({
    props: ['company', 'debtor'],
    template: `
    <div>
        <p style="margin: 0; text-align: right">№ 2-101-245/2020</p>

        <p style="margin: 0; text-align: center"><b>Именем Российской Федерации</b></p>
        <p style="margin: 0; text-align: center"><b>СУДЕБНЫЙ ПРИКАЗ</b></p>

        <table width="800px">
            <tbody>
                <tr style="width: 100%">
                    <td width="340" style="border: none; padding: 0">
                        <p style="margin: 0; text-align: left; font-size: 11pt"><b>{{ currentDate }}</b></p>
                    </td>
                    <td width="340" style="border: none; padding: 0">
                        <p style="margin: 0; text-align: right; font-size: 11pt"><b>город Москва</b></p>
                    </td>
                </tr>
            </tbody>
        </table>

        <br />
        <p style="margin: 0; text-align: justify; font-size: 11pt">
        <span style="color: white">____</span>Мировой судья {{ debtor.SudUch[0].FullRegionGenitive.toLowerCase() }} {{ debtor.SudUch[0].Magistrate }}, 
        </p>
        <p style="margin: 0; text-align: justify; font-size: 11pt">
        <span style="color: white">____</span>рассмотрев заявление взыскателя – {{ company.FullNameOrganization }}, адрес регистрации: {{ company.UrAddress }}, ИНН {{ company.INN }}, ОГРН {{ company.OGRN }}, КПП {{ company.KPP }},
        </p>

        <p style="margin: 0; text-align: justify; font-size: 11pt">
        <span style="color: white">____</span>к должнику: {{ debtor.ListResidents[0].FioDebtGenitive }}, {{ debtor.ListResidents[0].DateBirthDebt }} года рождения, место рождения: {{ debtor.ListResidents[0].PlaceBirthDebt }}, адрес регистрации: {{ debtor.Postal }}, {{ debtor.Adres }}, место работы: Неизвестно, ИНН {{ debtor.INN }},
        </p>

        <p style="margin: 0; text-align: justify; font-size: 11pt">
        <span style="color: white">____</span>о вынесении судебного приказа на взыскание задолженности по оплате коммунальных услуг за период с {{ indebtednessStart }} года по {{ indebtednessEnd }} года в размере {{ indebtednessInt }} рублей {{ indebtednessFloatEnd }} копеек, пеней за период с {{ peniStart }} года по {{ peniEnd }} года в размере {{ peniInt }} рублей {{ peniFloatEnd }} копеек, а также расходов по оплате государственной пошлины в размере 500 рублей 00 копеек,
        </p>

        <p style="margin: 0; text-align: justify; font-size: 11pt">
        <span style="color: white">____</span>исследовав сведения, изложенные в направленном взыскателем заявлении о вынесении судебного приказа и приложенных к нему документах,
        </p>

        <p style="margin: 0; text-align: justify; font-size: 11pt"><span style="color: white">____</span>на основании ст. ст. 153-155 ЖК РФ,</p>
        <p style="margin: 0; text-align: justify; font-size: 11pt"><span style="color: white">____</span>руководствуясь ст. ст. 121-127 ГПК РФ</p>

        <p style="margin: 1; text-align: center"><b>Р Е Ш И Л:</b></p>

        <p style="margin: 0; text-align: justify; font-size: 11pt">
        <span style="color: white">____</span>Взыскать с «{{ debtor.ListResidents[0].FioDebtGenitive }}», {{ debtor.ListResidents[0].DateBirthDebt }} года рождения, место рождения: {{ debtor.ListResidents[0].PlaceBirthDebt }}, адрес регистрации: {{ debtor.ListResidents[0].PlaceBirthDebt }}, адрес регистрации: {{ debtor.Postal }}, {{ debtor.Adres }}, место работы: Неизвестно, ИНН 020101101003 в пользу Товарищества собственников жилья «Десятый дом», адрес регистрации: 129164, г. Москва, ул. Мира, д. 1, ИНН 0260000085, ОГРН 1150280000000, КПП 006000001 задолженность за несвоевременную уплату коммунальных услуг за период с 01.01.2017 года по 01.01.2020 года в размере 10 000 рублей 10 копеек, пени за период с 01.01.2017 года по 01.01.2020 года в размере 10 000 рублей 10 копеек, а также расходы по оплате государственной пошлины в размере 500 рублей 00 копеек.
        </p>

        <p style="margin: 0; text-align: justify; font-size: 11pt">
        <span style="color: white">____</span>Должник вправе в десятидневный срок со дня получения копии судебного приказа представить возражения относительно его исполнения мировому судье, вынесшему судебный приказ. 
        </p>

        <table width="716">
            <tbody>
                <tr>
                    <td width="340" style="border: none; padding: 0">
                        <p style="margin: 0; text-align: left; font-size: 11pt">Мировой судья</p>
                    </td>
                    <td width="340" style="border: none; padding: 0">
                        <p style="margin: 0; text-align: right; font-size: 11pt"><b>{{ debtor.SudUch[0].Magistrate }}</b></p>
                    </td>
                </tr>
            </tbody>
        </table>
 
    </div>`,
    data() {
        return {
            months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь' ],
            monthsGenitive: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря' ]
        }
    },
    computed: {
        currentDate() {
            var dateObj = new Date();
            var year = dateObj.getFullYear();
            const month = dateObj.getMonth();
            var day = dateObj.getDate();
            return `${day} ${this.monthsGenitive[month]} ${year}`
        },
        indebtednessStart () {
            return this.debtor.Debt[0].DateStart
        },
        indebtednessEnd () {
            return this.debtor.Debt[this.debtor.Debt.length - 1].DateStop
        },
        indebtednessInt () {
            return this.debtor.TotalDebt.toString().split('.')[0];
        },
        indebtednessFloatEnd () {
            return this.debtor.TotalDebt.toString().split('.')[1];
        },
        // пеня 
        peniStart() {
            return this.debtor.Peni[0].Date
        },
        peniEnd() {
            return this.debtor.Peni[this.debtor.Peni.length - 1].Date
        },
        peniInt() {
            return this.debtor.PeniCsv.toString().split('.')[0];
        },
        peniFloatEnd () {
            return this.debtor.PeniCsv.toString().split('.')[1];
        }
    }
})

export default class courtOrder {
    constructor() {
        //
    }

    formatString (str) {
        return str.replace(/(<\/[^>]+>)/g, "$1\n\r");
    }

    async createTemplate (props) {
        const vm = new Component({
            propsData: {
              company: props.company,
              debtor: props.debtor
            }
        })
       
        let el; 
        if (typeof document !== 'undefined') {
            el = document.createElement('DIV')
        }
        vm.$mount(el)
        await vm.$nextTick()
      
        return this.formatString(vm.$el.outerHTML);
    }
}


