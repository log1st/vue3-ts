import Vue from "vue";

// шаблон Vue
const Component = Vue.extend({
    props: ['company', 'debtor', 'services', 'ecp', 'documentsList'],
    template: `
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
                    <p style="margin: 0; text-align: right; font-size: 11pt"><u><b>Должник{{ Object.values(debtor.ListResidents).length > 1 ? 'и' : ''}}:</b></u></p>
                </td>
                <td width="326" style="border: none; padding: 0">
                    <template v-for="item in debtor.ListResidents" >
                    <p style="margin: 0; text-align: left; font-size: 11pt"><b>{{ item.FioDebt }}</b></p>
                    <p style="margin: 0; text-align: left; font-size: 11pt">{{ debtor.Postal }}, {{ debtor.Adres }}</p>
                    <!-- <p style="margin: 0; text-align: left; font-size: 11pt">{{ debtor.Postal }}, {{ debtor.Adres }}</p> -->
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
        <!-- {{ debtor.Postal }}, {{ debtor.ListResidents[0].LocationDebter }}, {{ debtor.Adres }}. -->
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
        за период с {{ dateStart }} по {{ dateEnd }} составляет {{ debtor.TotalDebt | currencyFormat }} руб. 
        Неустойка за просрочку платежа на дату подачи заявления составляет {{ debtor.PeniCsv | currencyFormat }} руб. 
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
            <b>{{ item.FioDebtGenitive }} </b> {{ item.DateBirthDebt || ' __.__.._____'}} года рождения, место рождения: {{ item.PlaceBirthDebt || '_______________________________' }}
            {{ parseInt(index) + 1 == Object.values(debtor.ListResidents).length ? '.' : ', ' }} 
        </span> 
            Зарегистрированн{{ Object.values(debtor.ListResidents).length > 1 ? 'ых' : 'ого' }} по адресу: {{ debtor.Postal }}, {{ debtor.Adres }}, в 
            пользу {{ company.ShortNameOfTheOrganization }}, ИНН/КПП {{ company.INN }}/{{ company.KPP }}, ОГРН {{ company.OGRN }}, на р/сч {{ company.RasSchet }}, к/сч {{ company.KorSchet }}, {{ company.FullNameBank }}, БИК: {{ company.BIC }} 
        </p>
  
        <p style="text-align: justify; font-size: 11pt">
        - плату за жилищно-коммунальные услуги 
        ({{ computedServices }}) 
       
        за период с {{ dateStart }} по {{ dateEnd }} в размере <b>{{ debtor.TotalDebt | currencyFormat }}</b><span style="color: white">_</span>руб.; <br>
        - неустойку за просрочку платежа в размере <b>{{ debtor.PeniCsv | currencyFormat }}</b><span style="color: white">_</span>руб. <br>
        - расходы по оплате государственной пошлины по иску в размере <b>{{ debtor.StateDuty | currencyFormat }}</b>  руб.
        </p>
        <p style="margin:0; text-align: justify; font-size: 11pt"><b>Приложение:</b></p>
        
        <ol style="margin-left: 16p; margin-top: 0; margin-bottom: 1pt">
        
        <li v-for="document in documentsList"><p style="margin:0; font-size: 11pt">{{ document.title }};</p></li>

        <!--li><p style="margin:0; font-size: 11pt">Выписка из домовой книги;</p></li>
        <li><p style="margin:0; font-size: 11pt">История начислений за период;</p></li>
        <li><p style="margin:0; font-size: 11pt">Расчет пени за коммунальные услуги;</p></li>
        <li><p style="margin:0; font-size: 11pt">Справка с сайта реформа ЖКХ об управлении домами {{ company.ShortNameOfTheOrganization }};</p></li>
        <li><p style="margin:0; font-size: 11pt">Платежное поручение об оплате госпошлины;</p></li>
        <li><p style="margin:0; font-size: 11pt">Копия выписки ЕГРЮЛ;</p></li>
        <li><p style="margin:0; font-size: 11pt">Копия доверенности.</p></li-->
        </ol>
        <br>
        <p class="western" style="margin: 0">
        Генеральный директор (представитель по доверенности) ________________ {{ generalManagerShort }}
        </p>
            <table style="font-size: 11pt" class="pdf-pagebreak-before" v-if="ecp">
                <thead>
                    <tr>
                        <td colspan="8" style="border: none">
                            <p>Заявление о выдаче судебного приказа о взыскании задолженности за жилищно-коммунальные услуги сформирована с использованием сервиса «ЮРРОБОТ» - облачная платформа по автоматизации взыскания задолженностей, размещенного на официальном сайте ООО «ЮРРОБОТ» в сети Интернет по адресу: https://app.urrobot.net<p> 
                            <p>Заявление о выдаче судебного приказа о взыскании задолженности за жилищно-коммунальные услуги в электронной форме, подписанная усиленной квалифицированной электронной подписью, равнозначна выписке на бумажнои носителе, подписанной собственноручной подписью должностного лица ООО «ЮРРОБОТ» и заверенной печатью ООО «ЮРРОБОТ»  (пункты 1 и 3 статьи 6 Федерального закона от 6 апреля 2011г. №63-ФЗ "Об электронной подписи").
                            </p>
                        </td>
                    </tr>
                </thead>
            </table>
    </div>`,
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
        let services = [ 
            'Электроснабжение ОДН',
            'Водоотведение',
            'Газоснабжение',
            'Отопление',
            'Холодное в/с',
            'Горячее в/с',
            'Содержание ж/ф',
            'ТКО',
        ];
        
        let filteredServices = services.filter((i, index) => {
            if(this.services[index]) {
                return i;
            }
        });
        return filteredServices.join(', ');
      }
    }
})

export default class JudicialOrderStatement {
    constructor() {
        // this.html = '';
        // this.vm = '';
        // this.el = document.createElement('DIV');
    }

    formatString (str) {
        return str.replace(/(<\/[^>]+>)/g, "$1\n\r");
    }

    async createTemplate (props) {
        const vm = new Component({
            propsData: {
              company: props.company,
              debtor: props.debtor,
              services: props.services,
              documentsList: props.documentsList,
              ecp: props.ecp
            }
        })
        // debugger
        let el; 
        if (typeof document !== 'undefined') {
             el = document.createElement('DIV')
        }
        vm.$mount(el)
        await vm.$nextTick()
        return this.formatString(vm.$el.outerHTML);
    }
}


