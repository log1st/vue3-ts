export const template = `
<div>
<table width="716" cellpadding="7" cellspacing="0">
    <tbody>
        <tr>
            <td style="border: none; padding: 0"></td>
            <td style="border: none; padding: 0">Мировому судье {{ fullRegionGenitive }}</td>
        </tr>
        <tr>
            <td style="border: none; padding: 0; text-align: right; width: 50%">Адрес:</td>
            <td style="border: none; padding: 0; width: 50%">{{ company.FactAddress }}</td>
        </tr>
        <tr>
            <td style="border: none; padding: 0; text-align: right; width: 50%"><b>Взыскатель</b></td>
            <td style="border: none; padding: 0; width: 50%">{{ company.ShortNameOfTheOrganization || '__________' }}<br>
                ИНН {{ company.INN || '__________' }} // 
                ОГРН {{ company.OGRN || '__________' }}
            </td>
        </tr>
        <tr>
            <td style="border: none; padding: 0; text-align: right; width: 50%">Юридический адрес:</td>
            <td style="border: none; padding: 0; width: 50%">{{ company.UrAddress }}</td>
        </tr>
        <tr>
            <td style="border: none; padding: 0; text-align: right; width: 50%">Адрес для корреспонденции:</td>
            <td style="border: none; padding: 0; width: 50%">{{ company.PochtAddress }}</td>
        </tr>
        <tr>
            <td style="border: none; padding: 0; text-align: right; width: 50%"><b>Должник{{ Object.values(debtor.ListResidents).length > 1 ? 'и' : '' }}:</b></td>
            <td style="border: none; padding: 0; width: 50%">
                <template v-for="item in debtor.ListResidents">
                    <p style="margin: 0; text-align: left"><b>{{ item.FioDebt || '_____________' }}</b></p>
                    <p style="margin: 0; text-align: left">{{ item.DateBirthDebt || '_____________' }} г.р</p>
                </template>
            </td>
        </tr>
        <tr>
            <td style="border: none; padding: 0; text-align: right; width: 50%">Адрес:</td>
            <td style="border: none; padding: 0; width: 50%">
                <p style="margin: 0; text-align: left">{{ debtor.Adres }}</p>
            </td>
        </tr>
        <tr>
            <td style="border: none; padding: 0; text-align: right; width: 50%">Сумма взыскания:</td>
            <td style="border: none; padding: 0; width: 50%">{{ debtor.TotalDebt | currencyHumanReadableFilter }}</td>
        </tr>
        <tr>
            <td style="border: none; padding: 0; text-align: right; width: 50%">Госпошлина:</td>
            <td style="border: none; padding: 0; width: 50%">{{ debtor.StateDuty | currencyHumanReadableFilter }}</td>
        </tr>
    </tbody>
</table>


<p style="text-align: center; font-size: 11pt; margin: 0pt">ЗАЯВЛЕНИЕ</p>
<p style="text-align: center; font-size: 11pt">о выдаче судебного приказа на взыскание задолженности по оплате коммунальной услуги по <br> обращению с твердыми коммунальными отходами</p>

<p style="margin:0; text-align: justify; font-size: 11pt; text-indent: 12pt">
    <span style="color: white">____</span>
    В силу п.4 Правил обращения с твердыми коммунальными отходами (Далее по тексту – ТКО), утвержденными Постановлением Правительства Российской Федерации от 12.11.2016 года № 1156 обращение с твердыми коммунальными отходами на территории субъекта Российской Федерации обеспечивается региональными операторами в соответствии с региональной программой в области обращения с отходами, в том числе с твердыми коммунальными отходами, и территориальной схемой обращения с отходами (далее - схема обращения с отходами) на основании договоров на оказание услуг по обращению с твердыми коммунальными отходами, заключенных с потребителями.
</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    {{ company.FullNameOrganization }} наделено статусом регионального оператора по обращению с твердыми коммунальными отходами по результатам конкурсного отбора, проведенного в соответствие с требованиями Федерального закона от 24.06.1998 г. № 89-ФЗ «Об отходах производства и потребления» и Постановления Правительства Российской Федерации от 05.09.2016 № 811 «О проведении уполномоченными органами исполнительной власти субъектов Российской Федерации конкурсного отбора региональных операторов по обращению с твердыми коммунальными отходами» Министерством экологии Челябинской области.
</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    По результатам конкурсного отбора, 05.03.2018 г. с Министерством экологии Челябинской области подписано 
    Соглашение об организации деятельности по обращению с твердыми коммунальными отходами на территории 
    Челябинского кластера Челябинской области, в соответствие с условиями которого {{ company.ShortNameOfTheOrganization }} приступил 
    к исполнению обязательств по данному соглашению с 01.01.2019 года.
</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    Приказом Министерства экологии от 24.12.2018 г. № 1562 утверждена территориальная схема обращения с отходами на территории Челябинской области.
</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    Населенный пункт, на территории которого проживают должники, включен в территориальную схему обращения с ТКО.
</p>

<p style="margin:0; text-align: justify; font-size: 11pt"><b>
    {{ Object.values(debtor.ListResidents).length > 1 ? 'Собственниками ' : 'Собственником '}}
    жилого помещения, расположенного по адресу: 
    {{ debtor.Adres }}, 
    на праве {{ Object.values(debtor.ListResidents).length > 1 ? 'совместной ' : ''}} собственности 
    {{ Object.values(debtor.ListResidents).length > 1 ? 'являются ' : 'являeтся '}} 
    <template v-for="(item, index) in debtor.ListResidents">
        <span><b>{{ item.FioDebt || '_____________' }}</b></span> <span style="color: white">_</span>
        <span>{{ item.DateBirthDebt || '_____________' }} г.р</span>
        {{ debtor.ListResidents[Number(index) + 1] ? ',' : '.' }}
    </template>
    </b>
</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    По вышеуказанному адресу 
    {{ Object.values(debtor.ListResidents).length > 1 ? 'зарегистрированы ' : 'зарегистрирован'}} <span style="color: white">_</span>
    <template v-for="(item, index) in debtor.ListResidents">
        <span><b>{{ item.FioDebt || '_____________' }}</b></span> <span style="color: white">_</span>
        <span>{{ item.DateBirthDebt || '_____________' }} г.р</span>
        {{ debtor.ListResidents[Number(index) + 1] ? ',' : '.' }}
    </template>
</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    В соответствие с пунктом 1 статьи 153 Жилищного кодекса РФ граждане и организации обязаны своевременно и полностью вносить плату за жилое помещение и коммунальные услуги.
</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    Согласно ч.1 ст.155 ЖК РФ плата за коммунальные услуги вносится ежемесячно до десятого числа месяца, следующего за истекшим.
</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    На основании п.2 Постановления Правительства РФ от 06.05.2011 г. № 354 «О предоставлении коммунальных услуг собственникам и пользователям жилых помещений в многоквартирных домах и жилых домов» (далее-Правила), к коммунальной услуге относится услуга по обращению с твердыми коммунальными отходами.
</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    В соответствии с п.148 (11) Правил, коммунальную услугу по обращения с ТКО оказывает региональный оператор по обращению с ТКО.
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    Поскольку письменный договор между сторонами отсутствует, то в соответствии с п.п.148 (1), 148 (2) Правил, договор заключен путем совершения конклюдентных действий. Договор, содержащий положения о предоставлении коммунальной услуги по обращению с твердыми коммунальными отходами, заключенный путем совершения потребителем конклюдентных действий, считается заключенным на условиях, предусмотренных Правилами. 
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    Ст. 249 ГК РФ устанавливает, каждый участник долевой собственности обязан соразмерно со своей долей участвовать в уплате налогов, сборов и иных платежей по общему имуществу, а также в издержках по его содержанию и сохранению.
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    Постановлением Министерства тарифного регулирования и энергетики Челябинской области № 42/1 от 31.08.2017 г. 
    «Об утверждении нормативов накопления ТКО на территории Челябинской области» утвержден норматив накопления ТКО в 
    расчёте на 1 проживающего в год - 2,088 куб.м (МКД).
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    Пунктом 148(28) Правил предусмотрено, что размер платы за коммунальную услугу по обращению с твердыми коммунальными отходами рассчитывается исходя из цены, определенной в пределах утвержденного единого тарифа на услугу регионального оператора, установленного региональному оператору по обращению с твердыми коммунальными отходами.
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    Постановлением Министерства тарифного регулирования и энергетики Челябинской области от 24 декабря 2018 года № 87/1 
    «Об утверждении производственной программы и предельного единого тарифа на услугу регионального оператора по обращению с 
    твердыми коммунальными отходами на территории Челябинского кластера Челябинской области для 
    {{ company.ShortNameOfTheOrganization || '__________' }}
    на 2019 год» на территории Челябинского кластера Челябинской области установлен единый тариф на услугу регионального 
    оператора по обращению с ТКО в размере 388,43 руб./куб.м.
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    Постановлением Министерства тарифного регулирования и энергетики Челябинской области от 26 июня 2019 года № 50/4 
    «Об утверждении производственной программы и предельного единого тарифа на услугу регионального оператора по обращению с 
    твердыми коммунальными отходами – 
    {{ company.ShortNameOfTheOrganization || '__________' }} 
    на территории Челябинского кластера Челябинской области на 2019 год» на территории Челябинского кластера Челябинской области установлен единый тариф на услугу регионального оператора по обращению с ТКО в размере 383,19 руб./куб.м.
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    Постановлением Министерства тарифного регулирования и энергетики Челябинской области от 20 декабря 2019 г. №98/9 
    «Об утверждении предельных единых тарифов на услугу регионального оператора по обращению с твердыми коммунальными отходами – 
    {{ company.FullNameOrganization }} 
    на территории Челябинского кластера Челябинской области на 2020-2022 годы» 
    установлены следующие тарифы:
</p>

<table width="716" cellpadding="7" cellspacing="0">
    <tbody>
        <tr>
            <td style="text-align: center">Год</td>
            <td style="text-align: center">Периоды календарной разбивки</td>
            <td style="text-align: center">Предельные единые тарифы на услугу регионального оператора по обращению с ТКО. (руб./куб.м)</td>
            <td style="text-align: center">МКД плата за вывоз ТКО за одного человека</td>
        </tr>
        <tr>
            <td style="text-align: center">2019</td>
            <td style="text-align: center">с 01.01.2019г. по 30.06.2019г</td>
            <td style="text-align: center">388,43</td>
            <td style="text-align: center">67,59</td>
        </tr>
        <tr>
            <td style="text-align: center">2019</td>
            <td style="text-align: center">с 01.07.2019г. по 31.12.2019г</td>
            <td style="text-align: center">383,19</td>
            <td style="text-align: center">66,68</td>
        </tr>
        <tr>
            <td style="text-align: center">2019</td>
            <td style="text-align: center">с 10.09.2019г. по 31.12.2019г</td>
            <td style="text-align: center">382,73</td>
            <td style="text-align: center">66,60</td>
        </tr>
        <tr>
            <td style="text-align: center">2020</td>
            <td style="text-align: center">с 01.01.2020г. по 31.12.2020г</td>
            <td style="text-align: center">469,05</td>
            <td style="text-align: center">81,61</td>
        </tr>
    </tbody>
</table>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    <b>Формула расчета:</b> МКД плата за вывоз ТКО за одного человека = единый тариф на услугу регионального оператора (руб./куб.м) Х норматив накопления ТКО на одного проживающего в год 2,088 куб./м: 12 месяцев.
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    <b>В соответствии с п. 148.34. Правил размер платы за коммунальную услугу по обращению с твердыми коммунальными отходами 
    рассчитывается в соответствии с настоящими Правилами, исходя из числа постоянно проживающих и временно проживающих потребителей в жилом помещении. 
    </b>
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    Пунктом 148.36. Правил предусмотрено, что при отсутствии постоянно и временно проживающих в жилом помещении граждан объем коммунальной услуги по обращению с твердыми коммунальными отходами рассчитывается с учетом количества собственников такого помещения.
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    В соответствии со справкой о начислениях и оплате по лицевому счету жилья по указанному выше жилому помещению у 
    <template v-for="item in debtor.ListResidents">
        <span><b>{{ item.FioDebtGenitive || '_____________' }}</b></span>,
        <span>{{ item.DateBirthDebt || '_____________' }} г.р.</span>,
    </template>
    имеется задолженность за период с {{ dateStart }} по {{ dateEnd }} в размере 
    <b>{{ debtor.TotalDebt | currencyHumanReadableFilter }}. </b>  ({{ rubles(debtor.TotalDebt) }}). 
</p>
<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    На основании вышеизложенного и руководствуясь ст.ст.153,155 ЖК РФ, 148(1), 148(2), 148(11), 148 (28), 148(34) Правил обращения с ТКО, ст.122, 126 ГПК РФ,
</p>

<p style="text-align: center; font-size: 11pt">ПРОШУ:</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    1. Вынести судебный приказ о взыскании {{ Object.values(debtor.ListResidents).length > 1 ? 'в солидарном порядке ' : ''}} с 
    <template v-for="(item, index) in debtor.ListResidents">
        <span><b>{{ item.FioDebtGenitive || '_____________' }}</b></span>, 
        <span>{{ item.DateBirthDebt || '_____________' }} г.р.</span>
        {{ debtor.ListResidents[Number(index) + 1] ? ',' : ' ' }}
    </template>
    в пользу {{ company.ShortNameOfTheOrganization }}: <br>
    - задолженности по оплате коммунальной услуги по обращению с ТКО за период с {{ dateStart }} по {{ dateEnd }} в размере <b>{{ debtor.TotalDebt | currencyHumanReadableFilter }}. </b> ({{ rubles(debtor.TotalDebt) }}); <br>
    - расходов по уплате госпошлины в сумме {{ debtor.StateDuty | currencyHumanReadableFilter }}.  ({{ rubles(debtor.StateDuty) }}). 
    Таким образом, общая сумма, подлежащая взысканию, составляет {{ (Number(debtor.TotalDebt) + Number(debtor.StateDuty)) | currencyHumanReadableFilter }}.  ({{ rubles(Number(debtor.TotalDebt) + Number(debtor.StateDuty)) }}). <br>
</p>

<p style="margin:0; text-align: justify; font-size: 11pt">
    <span style="color: white">____</span>
    <b>2. Произвести выдачу судебного приказа нарочно представителю {{ company.ShortNameOfTheOrganization || '__________' }},  
    не осуществлять направление судебного приказа почтовой корреспонденцией.</b>
</p>

<p style="text-align: justify; font-size: 11pt"><b>Приложение:</b></p>

<ol style="margin-left: 16p; margin-top: 0; margin-bottom: 1pt">
    <li v-for="document in documentsList"><p style="margin:0; font-size: 11pt">{{ document.title }};</p></li>

    <!--li><p style="margin:0; font-size: 11pt">Платежное поручение об уплате государственной пошлины; - 5 пункт в старом формате </p></li>
    <li><p style="margin:0; font-size: 11pt">Справка о начислениях и оплате по лицевому счету жилья; - История начислений за период ЛС 2 название новое взять везде</p></li>
    
    <li><p style="margin:0; font-size: 11pt">3. Пени добавить;</p></li>

    <li><p style="margin:0; font-size: 11pt">3. Выписка из Единого государственного реестра недвижимости о переходе прав на объект недвижимости; ЕГРН</p></li>

    <li><p style="margin:0; font-size: 11pt">4. Свидетельство о государственной регистрации ООО «ЦКС» (копия); - Брать из вкладки организации</p></li>
    <li><p style="margin:0; font-size: 11pt">5. Выписка из устава ООО «ЦКС» (копия); - Брать из вкладки организации</p></li>
    <li><p style="margin:0; font-size: 11pt">6. Протокол внеочередного общего собрания участников ООО «ЦКС» (копия); - Брать из вкладки организации</p></li>
    <li><p style="margin:0; font-size: 11pt">7. Доверенность на представителя (копия). - Брать из вкладки организации</p></li-->
</ol>
<br>
<p class="western" style="margin: 0">
    Представитель по доверенности ________________ {{ company.RepresentativePowerAttorney }}
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
</div>`