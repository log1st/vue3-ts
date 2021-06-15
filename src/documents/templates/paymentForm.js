import Vue from "vue";

// шаблон Vue
const Component = Vue.extend({
    props: ['debtor'],
    template: `
        <table>
        <tbody>
         <tr>
            <td colspan="1" rowspan="1" style="border-bottom-width: 0pt;"></td>
            <td colspan="4" rowspan="1" style="border-bottom-width: 0pt"><p style="margin:0; text-align: right; font-size: 10pt">Форма № ПД-4сб (налог)</p></td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-bottom-width: 0pt; border-top-width: 0pt">
               <p style="margin: 0; text-align: center; font-size: 10pt"><b>Извещение</b></p>
            </td>
            <td colspan="3" rowspan="1" style="border-right-width: 0pt; border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Наименование получателя платежа: </b></p>
            </td>
            <td colspan="1" rowspan="1" style="border-left-width: 0pt; border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt">{{ debtor.SudUch[0].NamePaymentRecipient }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>ИНН/КПП: </b>{{ debtor.SudUch[0].INN }}/{{ debtor.SudUch[0].INN }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Код ОКАТО: </b>{{ debtor.SudUch[0].OKTMO }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Номер счета получателя платежа: </b>{{ debtor.SudUch[0].RecipientAaccountNumber }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Наим.банка: </b>{{ debtor.SudUch[0].NameRecipientBank }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="1" rowspan="1" style="border-right-width: 0pt; border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>БИК: </b>{{ debtor.SudUch[0].BIC }}</p>
            </td>
            <td colspan="3" rowspan="1" style="border-left-width: 0pt; border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>КБК: </b> {{ debtor.SudUch[0].KBK }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Фамилия И.О.: </b><b>{{ debtor.FIO }}</b></p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Адрес: </b><b>{{ debtor.Postal || '_____' }} {{ debtor.ListResidents[0].LocationDebter }} {{ debtor.Adres }}</b></p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Наименование платежа: </b>Оплата госпошлины</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Дата: </b>{{ dateFormatted.day }}.{{ dateFormatted.month }}.{{ (dateFormatted.year + '').substring(2) }} <b>Итого к уплате: </b>{{ debtor.StateDuty.toString().split('.')[0] }} руб.<span style="text-decoration:underline">{{ debtor.StateDuty.toString().split('.')[1] || '00' }} коп. </span></p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="text-align: left; font-size: 10pt"><b>Плательщик (подпись): </b>________________________</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-bottom-width: 0pt"></td>
            <td colspan="4" rowspan="1" style="border-bottom-width: 0pt"><p style="margin:0; text-align: right; font-size: 10pt">Форма № ПД-4сб (налог)</p></td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-bottom-width: 0pt; border-top-width: 0pt">
               <p style="margin:0; text-align: center; font-size: 10pt"><b>Квитанция</b></p>
            </td>
            <td colspan="3" rowspan="1" style="border-right-width: 0pt; border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Наименование получателя платежа: </b></p>
            </td>
            <td colspan="1" rowspan="1" style="border-left-width: 0pt; border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt">{{ debtor.SudUch[0].NamePaymentRecipient }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>ИНН/КПП: </b>{{ debtor.SudUch[0].INN }}/{{ debtor.SudUch[0].INN }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Код ОКАТО: </b>{{ debtor.SudUch[0].OKTMO }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Номер счета получателя платежа: </b>{{ debtor.SudUch[0].RecipientAaccountNumber }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Наим.банка: </b>{{ debtor.SudUch[0].NameRecipientBank }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="1" rowspan="1" style="border-right-width: 0pt; border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>БИК: </b>{{ debtor.SudUch[0].BIC }}</p>
            </td>
            <td colspan="3" rowspan="1" style="border-left-width: 0pt; border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>КБК: </b> {{ debtor.SudUch[0].KBK }}</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Фамилия И.О.: </b><b>{{ debtor.FIO }}</b></p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Адрес: </b><b>{{ debtor.Postal || '_____' }} {{ debtor.ListResidents[0].LocationDebter }} {{ debtor.Adres }}</b></p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Наименование платежа: </b>Оплата госпошлины</p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt; border-bottom-width: 0pt">
               <p style="margin:0; text-align: left; font-size: 10pt"><b>Дата: </b>{{ dateFormatted.day }}.{{ dateFormatted.month }}.{{ (dateFormatted.year + '').substring(2) }} <b>Итого к уплате: </b>{{ debtor.StateDuty.toString().split('.')[0] }} руб.<span style="text-decoration:underline">{{ debtor.StateDuty.toString().split('.')[1] || '00' }} коп.</span></p>
            </td>
         </tr>
         <tr>
            <td colspan="1" rowspan="1" style="border-top-width: 0pt">
            </td>
            <td colspan="4" rowspan="1" style="border-top-width: 0pt">
               <p style="text-align: left; font-size: 10pt"><b>Плательщик (подпись): </b>________________________</p>
            </td>
         </tr>
      </tbody>
   </table>`,
    created () {
        //console.log(this)
    },
    computed: {
        dateFormatted() {
            const dateObj = new Date();
            const month = dateObj.getMonth() >= 10 ? dateObj.getMonth() : "0" + dateObj.getMonth()
            const day = dateObj.getDate() >= 10 ? dateObj.getDate() : "0" + dateObj.getDate()
            return {
                year: dateObj.getFullYear(),
                day: day,
                month: month
            }
        }
    }
})

export default class PaymentForm {
    constructor() {
      //   this.html = '';
      //   this.vm = '';
      //   this.el = document.createElement('DIV');
    }

    formatString (str) {
        return str.replace(/(<\/[^>]+>)/g, "$1\n\r").replace(/<!---->/g, '\n\r')
    };

    async createTemplate (props) {
         const vm = new Component({
            propsData: {
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

