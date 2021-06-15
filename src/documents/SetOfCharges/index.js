import Vue           from "vue";
import pdfMake       from "pdfmake/build/pdfmake";
import pdfFonts      from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function formatString (str) {
  const closedTags = str.replace(/(<\/[^>]+>)/g, "$1\n\r");
  //console.log(closedTags);
  return closedTags;
}


const template = `
<div>

<table class="c8">
      <tbody>
         <tr class="c4">
            <td class="c29" colspan="2" rowspan="1">
               <p class="c28 c31"><span class="c6">&nbsp; Свод начислений по лицевому счету</span></p>
            </td>
         </tr>
         <tr class="c3">
            <td class="c10" colspan="1" rowspan="1" style="height: 8pt">
               <p class="c2" style="font-size: 8pt"><span class="c6">Номер лицевого счета</span></p>
            </td>
            <td class="c15" colspan="1" rowspan="1" style="height: 8pt">
               <p class="c22"><span class="c33">321456321456</span></p>
            </td>
         </tr>
         <tr class="c38">
            <td class="c10" colspan="1" rowspan="1">
               <p class="c2"><span class="c6">Адрес</span></p>
            </td>
            <td class="c15" colspan="1" rowspan="1">
               <p class="c22"><span class="c33">г. Москва ул. Ленина 15</span></p>
            </td>
         </tr>
         <tr class="c34">
            <td class="c10" colspan="1" rowspan="1">
               <p class="c2"><span class="c6">ФИО</span></p>
            </td>
            <td class="c15" colspan="1" rowspan="1">
               <p class="c22"><span class="c33">Иванов Иван Иванович</span></p>
            </td>
         </tr>
      </tbody>
   </table>
   <table class="c30">
      <tbody>
         <tr class="c42">
            <td class="c24" colspan="3" rowspan="1">
               <p class="c9"><span class="c6">Организация</span></p>
            </td>
            <td class="c44" colspan="1" rowspan="1">
               <p class="c9"><span class="c6">Начальный остаток</span></p>
            </td>
            <td class="c17" colspan="1" rowspan="1">
               <p class="c9"><span class="c6">Начислено</span></p>
            </td>
            <td class="c36" colspan="1" rowspan="1">
               <p class="c9"><span class="c6">Оплачено</span></p>
            </td>
            <td class="c1" colspan="2" rowspan="1">
               <p class="c9"><span class="c6">Конечный остаток</span></p>
            </td>
            <td class="c39" colspan="1" rowspan="1">
               <p class="c9"><span class="c6">Сумма просроченной задолженности</span></p>
            </td>
         </tr>
         <tr class="c42">
            <td class="c50" colspan="1" rowspan="1">
               <p class="c9 c31"><span class="c6">№ кв.</span></p>
            </td>
            <td class="c14" colspan="1" rowspan="1">
               <p class="c9"><span class="c6">Лицевой счет</span></p>
            </td>
            <td class="c5" colspan="1" rowspan="1">
               <p class="c9"><span class="c6">Месяцев задолженности</span></p>
            </td>
            <td class="c47" colspan="1" rowspan="1">
               <p class="c7"><span class="c6"></span></p>
            </td>
            <td class="c43" colspan="1" rowspan="1">
               <p class="c7"><span class="c6"></span></p>
            </td>
            <td class="c48" colspan="1" rowspan="1">
               <p class="c7"><span class="c6"></span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c9"><span class="c6">Задолженность</span></p>
            </td>
            <td class="c23" colspan="1" rowspan="1">
               <p class="c9"><span class="c6">Конечный остаток</span></p>
            </td>
            <td class="c0" colspan="1" rowspan="1">
               <p class="c9 c40"><span class="c6"></span></p>
            </td>
         </tr>
         <tr class="c42">
            <td class="c24" colspan="3" rowspan="1">
               <p class="c9"><span class="c6">Период взаиморасчетов</span></p>
            </td>
            <td class="c19" colspan="1" rowspan="1">
               <p class="c7"><span class="c6"></span></p>
            </td>
            <td class="c49" colspan="1" rowspan="1">
               <p class="c7"><span class="c6"></span></p>
            </td>
            <td class="c45" colspan="1" rowspan="1">
               <p class="c7"><span class="c6"></span></p>
            </td>
            <td class="c35" colspan="1" rowspan="1">
               <p class="c7"><span class="c6"></span></p>
            </td>
            <td class="c11" colspan="1" rowspan="1">
               <p class="c7"><span class="c6"></span></p>
            </td>
            <td class="c21" colspan="1" rowspan="1">
               <p class="c9 c40"><span class="c6"></span></p>
            </td>
         </tr>

     <tr class="c42">
        <td class="c24" colspan="3" rowspan="1">
           <p class="c9"><span class="c6">asdas</span></p>
        </td>
        <td class="c25" colspan="1" rowspan="1">
           <p class="c28"><span class="c6">0.00</span></p>
        </td>
        <td class="c37" colspan="1" rowspan="1">
           <p class="c18"><span class="c6">2 500.94</span></p>
        </td>
        <td class="c46" colspan="1" rowspan="1">
           <p class="c18"><span class="c6">2 500.94</span></p>
        </td>
        <td class="c26" colspan="1" rowspan="1">
           <p class="c18"><span class="c6">0.00</span></p>
        </td>
        <td class="c12" colspan="1" rowspan="1">
           <p class="c18"><span class="c6">0.00</span></p>
        </td>
        <td class="c27" colspan="1" rowspan="1">
           <p class="c18"><span class="c6">0.00</span></p>
        </td>
     </tr>

         <tr class="c42">
            <td class="c24 c16" colspan="3" rowspan="1">
               <p class="c28"><span class="c6">Итого:</span></p>
            </td>
            <td class="c16 c25" colspan="1" rowspan="1">
               <p class="c18"><span class="c6">0.00</span></p>
            </td>
            <td class="c16 c37" colspan="1" rowspan="1">
               <p class="c18"><span class="c6">16 660.73</span></p>
            </td>
            <td class="c13" colspan="1" rowspan="1">
               <p class="c18"><span class="c6">7 188.10</span></p>
            </td>
            <td class="c16 c26" colspan="1" rowspan="1">
               <p class="c18"><span class="c6">0.00</span></p>
            </td>
            <td class="c12 c16" colspan="1" rowspan="1">
               <p class="c18"><span class="c6">0.00</span></p>
            </td>
            <td class="c27 c16" colspan="1" rowspan="1">
               <p class="c18"><span class="c6">0.00</span></p>
            </td>
         </tr>
      </tbody>
   </table>
   </div>

`;

let html, el; 
  if (typeof document !== 'undefined') {
       el = document.createElement('DIV')
  }
// wrapper
// const  vm = new Vue({
//   template: '<div>{{ title }}</div>',
//   data() {
//     return {
//       title: 'Title'
//     }
//   }
//   // add data that the component needs as well ...
// })

const Component = Vue.extend({
  props: ['msg'],
  template: template
})

const vm = new Component({
  propsData: {
    msg: 'hello'
  }
})

vm.$mount(el)
vm.$nextTick(() => {
  html = vm.$el.outerHTML
})

export default (template) => {
  //console.log('html from vue', html);

  const data = htmlToPdfmake(formatString(html));

  const docDefinition = {
    content: [
      data
    ],
    pageOrientation: 'landscape',
  };
  pdfMake.createPdf(docDefinition).open();
}
