import Vue           from "vue";
import pdfMake       from "pdfmake/build/pdfmake";
// import pdfFonts      from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import pdfFonts from "../fonts/custom-fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  TimesNewRoman: {
    normal: 'times.ttf',
    bold: 'timesbd.ttf',
    italics: 'timesi.ttf',
    bolditalics: 'timesbi.ttf'
  }
};

// pdfMake.fonts = {
//   Roboto: {
//     normal: 'Roboto-Regular.ttf',
//     bold: 'Roboto-Medium.ttf',
//     italics: 'Roboto-Italic.ttf',
//     bolditalics: 'Roboto-MediumItalic.ttf'
//   }
// };

function formatString (str) {
  const closedTags = str.replace(/(<\/[^>]+>)/g, "$1\n\r");
  // console.log(closedTags);
  return closedTags;
}

const template = `
<div>
      <!-- шапка заявления -->
        <table width="716" cellpadding="7" cellspacing="0">
          <tbody>
            <tr valign="top">
              <td width="258" height="43" style="border: none; padding: 0">
                <p style="margin: 0; text-align: center; font-size: 11pt"><b>{{ company.ShortNameOfTheOrganization || '__________' }}</b></p>
                <p style="margin: 0; text-align: center; font-size: 11pt">ИНН {{ company.INN || '__________' }}</p>
                <p style="margin: 0; text-align: center; font-size: 11pt">ОГРН {{ company.OGRN || '__________' }}</p>
                <p style="margin: 0; text-align: center; font-size: 11pt"><b>***</b></p>
              </td>
              <td width="90" style="border: none; padding: 0"></td>
              <td width="326" style="border: none; padding: 0">
                <p style="margin: 0; text-align: left; font-size: 11pt"><b>Мировому судье {{ fullRegionGenitive }} </b></p>
              </td>
            </tr>

            <tr valign="top">
              <td width="258" height="41" style="border: none; padding: 0">
                <p style="margin: 0; text-align: center; font-size: 11pt">адрес: {{ company.FactAddress }}</p>
              </td>
              <td width="90" style="border: none; padding: 0">
                <p style="margin: 0; text-align: center; font-size: 11pt"><u><b>Взыскатель:</b></u></p>
              </td>
              <td width="326" style="border: none; padding: 0">
                <p style="margin: 0; text-align: left; font-size: 11pt"><b>{{ company.ShortNameOfTheOrganization || '__________' }}</b></p>
                <p style="margin: 0; text-align: left; font-size: 11pt">{{ company.FactAddress }}.</p>
              </td>
            </tr>

            <tr valign="top">
              <td width="258" style="border: none; padding: 0"></td>
              <td width="90" style="border: none; padding: 0">
                <p style="margin: 0; text-align: right; font-size: 11pt"><u><b>Должник:</b></u></p>
              </td>
              <td width="326" style="border: none; padding: 0">
                <template v-for="item in debtor.ListResidents" >
                  <p style="margin: 0; text-align: left; font-size: 11pt"><b>{{ item.FioDebt }}</b></p>
                  <p style="margin: 0; text-align: left; font-size: 11pt">{{ debtor.Postal }}, {{ debtor.Adres }}</p>
                </template>
              </td>
            </tr>

            <tr valign="top">
              <td width="258" style="border: none; padding: 0cm"><p style="margin: 0; font-size: 11pt">№ <b>_______ от ______________</b></p></td>
              <td width="90" style="border: none; padding: 0cm"><p class="western" align="right"><br></p></td>
              <td width="326" style="border: none; padding: 0cm"></td>
            </tr>

          </tbody>
        </table>
      <!-- шапка заявления конец -->

    <p style="text-align: center; font-size: 11pt">
      <b>Заявление о выдаче судебного приказа <br> о взыскании задолженности за жилищно-коммунальные услуги</b>
    </p>

    <p style="margin:0; text-align: justify; font-size: 11pt">
      <span style="color: white">____</span>
      <template v-for="(item, index) in debtor.ListResidents"><b>{{ item.FioDebt }}{{ parseInt(index) + 1 == Object.values(debtor.ListResidents).length ? ' ' : ', ' }}</b></template>
      {{ Object.values(debtor.ListResidents).length > 1 ? ' обладают' : ' обладает' }} правом пользования жилого помещения, расположенного по адресу: 
      {{ debtor.Postal }}, {{ debtor.Adres }}.
    </p>

    <p style="margin:0; text-align: justify; font-size: 11pt; text-indent: 12pt">
      <span style="color: white">____</span>
      Согласно п. 3 ст. 30, п. 1 ст. 
      39, ст. 153, п.п. 2, 4 ст. 154, п.п. 1, 7, 8, 10, 11 ст. 155 ЖК РФ, а 
      также абз. г, д п. 19 Правил пользования жилыми помещениями (утв. 
      постановлением Правительства РФ от 21 января 2006 г. №25) 
      собственник обязан своевременно вносить плату за жилое помещение и 
      коммунальные услуги (плата за наём; плата за содержание и ремонт 
      жилого помещения, включающая в себя плату за услуги и работы по 
      управлению многоквартирным домом, содержанию и текущему ремонту 
      общего имущества в многоквартирном доме; плата за коммунальные 
      услуги) с момента приобретения права собственности на указанное жилое 
      помещение. 
    </p>

    <p style="margin:0; text-align: justify; font-size: 11pt">
      <span style="color: white">____</span>
      Кроме того, согласно п. 1 ст. 155 ЖК РФ плата за жилое помещение и 
      коммунальные услуги вносится ежемесячно до десятого числа месяца, 
      следующего за истекшим месяцем. 
    </p>

    <p style="margin:0; text-align: justify; font-size: 11pt">
      <span style="color: white">____</span>
      В соответствие с п. 3 ст. 31 
      ЖК РФ члены семьи собственника жилого помещения имеют равные с 
      собственником права и обязанности. Дееспособные и ограниченные судом 
      в дееспособности члены семьи собственника жилого помещения несут 
      солидарную с собственником ответственность по обязательствам. 
    </p>

    <p style="margin:0; text-align: justify; font-size: 11pt">
      <span style="color: white">____</span>
      Согласно п. 1 ст. 323 ГК РФ 
      при солидарной обязанности должников кредитор вправе требовать 
      исполнения как от всех должников совместно, так и от любого из них в 
      отдельности, притом как полностью, так и в части долга. 
    </p>

    <p style="margin:0; text-align: justify; font-size: 11pt">
      <span style="color: white">____</span>
      Ответчик систематически уклоняется от внесения указанных платежей, будучи от них не освобожденным. 
    </p>
    
    <p style="margin:0; text-align: justify; font-size: 11pt">
      <span style="color: white">____</span>
      Таким образом, размер задолженности ответчиков перед {{ company.ShortNameOfTheOrganization }}  
      за период с {{ dateStart }} по {{ dateEnd }} составляет {{ debtor.TotalDebt }} руб. 
      Неустойка за просрочку платежа на дату подачи заявления составляет {{ debtor.PeniCsv }} руб. 
    </p>

    <p style="margin:0; text-align: justify; font-size: 11pt">
      <span style="color: white">____</span>
      На основании вышеизложенного и в соответствии с ст.ст. 8, 11, 12, 307, 309 ГК РФ, ст.ст. 153-157 ЖК РФ, ст.ст. 3, 4 ГПК РФ. 
    </p>

    <p style="text-align: center; font-size: 11pt"><b>ПРОШУ СУД:</b></p>

    <p style="margin:0; text-align: justify; font-size: 11pt">
      <span style="color: white">____</span>
      <span>Вынести судебный приказ о {{ Object.values(debtor.ListResidents).length > 1 ? 'солидарном' : '' }} взыскании c </span>
      <span v-for="(item, index) in debtor.ListResidents">
        <b>{{ item.FioDebtGenitive }}</b> {{ item.DateBirthDebt || ' __.__.._____'}} года рождения, место рождения: {{ item.PlaceBirthDebt || '_______________________________' }}
        {{ parseInt(index) + 1 == Object.values(debtor.ListResidents).length ? '.' : ', ' }}
      </span>
    </p>

    <p style="margin:0; text-align: justify; font-size: 11pt">
        <span style="color: white">____</span>
        Зарегистрированн{{ Object.values(debtor.ListResidents).length > 1 ? 'ых' : 'ого' }} по адресу: {{ debtor.Postal }}, {{ debtor.Adres }}, в 
        пользу {{ company.ShortNameOfTheOrganization }}, ИНН/КПП {{ company.INN }}/{{ company.KPP }},<span style="color: white">__</span> ОГРН {{ company.OGRN }},<span style="color: white">__</span> на р/сч {{ company.RasSchet }},<span style="color: white">__</span> к/сч 
    </p>

    <p style="margin:0; text-align: justify; font-size: 11pt">
      {{ company.KorSchet }}, {{ company.FullNameBank }}, БИК: {{ company.BIC }} 
    </p>

    <p style="text-align: justify; font-size: 11pt">
      - плату за жилищно-коммунальные услуги (электроснабжение ОДН, Водоотведение, Холодное в/с, Содержание ж/ф) за период с 
        {{ dateStart }} г. по {{ dateEnd }} г. в размере <b>{{ debtor.TotalDebt }}</b><span style="color: white">_</span>руб.; <br>
      - неустойку за просрочку платежа в размере <b>{{ debtor.PeniCsv }}</b><span style="color: white">_</span>руб. <br>
      - расходы по оплате государственной пошлины по иску в размере {{ debtor.StateDuty }}  руб.
    </p>
    <p style="margin:0; text-align: justify; font-size: 11pt"><b>Приложение:</b></p>
      
    <ol style="margin-left: 16p; margin-top: 0; margin-bottom: 1pt">
      <li><p style="margin:0; font-size: 11pt">Выписка из домовой книги;</p></li>
      <li><p style="margin:0; font-size: 11pt">История начислений за период;</p></li>
      <li><p style="margin:0; font-size: 11pt">Расчет пени за коммунальные услуги;</p></li>
      <li><p style="margin:0; font-size: 11pt">Справка с сайта реформа ЖКХ об управлении домами {{ company.ShortNameOfTheOrganization }};</p></li>
      <li><p style="margin:0; font-size: 11pt">Платежное поручение об оплате госпошлины;</p></li>
      <li><p style="margin:0; font-size: 11pt">Копия выписки ЕГРЮЛ;</p></li>
      <li><p style="margin:0; font-size: 11pt">Копия доверенности.</p></li>
    </ol>
    <br>
    <p class="western" style="margin: 0">
      Генеральный директор (представитель по доверенности) ________________ {{ generalManagerShort }}
    </p>


</div>`;

const Component = Vue.extend({
  props: ['company', 'debtor'],
  template: template,
  created() {
    // console.log(this)
    // debugger
  },
  data() {
    return {
      months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь' ],
      monthsGenitive: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря' ]
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

      let last = Object.values(this.debtor.Accrued)
      last = last[last.length - 1];
      let yearLast = this.debtor.Accrued[0].date_start.substring(3, 7);
      const test = `${this.monthsGenitive[index - 1]} ` + (yearLast == year ? '' : `${year}г.`);
      return test 
    },
    dateEnd() {
      let last = Object.values(this.debtor.Accrued)
      last = last[last.length - 1];
      let index = parseInt(last.date_start.substring(0, 2));
      let year = this.debtor.Accrued[0].date_start.substring(3, 7);
      return `${this.months[index - 1]} ${year}`;
    },
    generalManagerShort(){
      let [ surname, name, patronymic ] = this.company.GeneralManager.split(' ');
      name = name.substring(0, 1).toUpperCase();
      patronymic = patronymic.substring(0, 1).toUpperCase();
      return `${surname} ${name}. ${patronymic}`
    }
  }
})

export default async (propsData) => {
  const { debtor, company } = propsData;
  let html, el; 
  if (typeof document !== 'undefined') {
       el = document.createElement('DIV')
  }

  const vm = new Component({
    propsData: {
      company: company,
      debtor: debtor
    }
  })

  vm.$mount(el)
  await vm.$nextTick(() => {
    html = vm.$el.outerHTML
  })
  // console.log(html);
  // debugger
  // return

  const data = htmlToPdfmake(formatString(html));

  const docDefinition = {
    content: [
      data
    ],
    defaultStyle: {
      font: 'TimesNewRoman'
    },
    pageMargins: [ 40, 14, 30, 12 ],
    // pageOrientation: 'landscape',
  };
  // pdfMake.createPdf(docDefinition).open();

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  // const getBase64 = (data) => ({ data });
  return new Promise((resolve, reject) => {
    pdfDocGenerator.getBase64(data => {
      resolve(data);
    });
  });
}
