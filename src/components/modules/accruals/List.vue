<template>
  <div class="list">
    <div class="list__page">
      <div class="list__head">
        <div class="list__head-logo" :style="{ backgroundImage: `url(${companyInfo.logo})` }"></div>
        <div class="list__head-text">
          <div class="list__head-text_col">
            <div class="list__head-text_string">ООО «К О М С Е Р В И С»</div>
            <div class="list__head-text_string">КПП 771701001, ИНН 9717015783, ОКВЭД 68.32,</div>
            <div class="list__head-text_string">ОКПО 53796298, ОГРН 1167746154916,</div>
            <div class="list__head-text_string">БИК 044525225</div>
            <div class="list__head-text_string">ПАО Сбербанк</div>
            <div class="list__head-text_string">р/с 40702810638000100065</div>
            <div class="list__head-text_string">к/с 30101810400000000225</div>
          </div>
          <div class="list__head-text_col">
            <div class="list__head-text_string">юридический адрес: 129626, г. Москва,</div>
            <div class="list__head-text_string">Проспект Мира,  д.102,стр.26, эт.2, оф.26</div>
            <div class="list__head-text_string">почтовый адрес: 129626, г. Москва,</div>
            <div class="list__head-text_string">Проспект Мира,  д.102,стр.26, а/я 39</div>
            <div class="list__head-text_string">e-mail: office@yk-komservice.ru</div>
            <div class="list__head-text_string">www.yk-komservice.ru</div>
            <div class="list__head-text_string">тел.: +7(495)235-05-20</div>
          </div>
        </div>
      </div>
      <div class="list__header">
        <div class="list__header-from">
          Исх. №__________<br>
          «___» ____________ 20__ г.
        </div>
        <div class="list__header-to">
          <div class="list__header-to_address">
            {{ debtorInfo.fullName }}<br>
            {{ debtorInfo.address.index }}, г. {{ debtorInfo.address.city }}, {{ debtorInfo.address.street }},<br>
            {{ debtorInfo.address.house }}
          </div>
          <div class="list__header-to_data">
            Лицевой счет: {{ debtorInfo.RashSchet }}<br>
            сумма задолженности: {{ summ(debtorInfo.debt) }}
          </div>
        </div>
      </div>
      <div class="list__body">
        <div class="list__body-title">
          Претензия
        </div>
        <div class="list__body-subtitle">
          (о несвоевременной оплате)
        </div>
        <div class="list__body-text">
          <p>Вы, <b>{{ debtorInfo.fullName }}</b>, проживающий по адресу: <b>г. {{ debtorInfo.address.city }}, {{ debtorInfo.address.street }}, {{ debtorInfo.address.house }}</b>, используете коммунальные услуги, поставляемые <b>ООО «Комсервис»</b>, для бытового потребления, согласно договора заключенному с Вами.</p>
          <p>По условиям данного договора Исполнитель обязуется поставлять абоненту (потребителю) коммунальные услуги, а абонент обязуется оплачивать их. Плата за жилое помещение и коммунальные услуги вносится потребителем не позднее 10-го числа месяца, следующего за расчетным периодом.</p>
          <p>Однако в нарушение условий договора оплата не производится. <b>В связи с этим Ваша задолженность по состоянию на 21.11.2017г.</b> перед <b>ООО «Комсервис»</b> составляет: <b>{{ summ(debtorInfo.debt) }}</b></p>
          <p>Согласно п. 2 ст. 15 ГК РФ, абонент, нарушивший обязательство по договору обязан возместить организации причиненный этим реальный ущерб.</p>
          <br>
          <p><b>Предлагаем Вам</b> в добровольном порядке в 10-дневный срок возместить организации причиненный ущерб.  В противном случае мы будем вынуждены взыскать сумму ущерба в принудительном порядке с учетом всех неустоек и судебных затрат.</p>
        </div>
        <div class="list__body-footer">
          <p>Представитель по доверенности:</p>
        </div>
      </div>
    </div>

    <div class="list__page">
      <div class="list__page-address">
        <div class="list__page-address--to">
          {{ debtorInfo.address.index }}, г. {{ debtorInfo.address.city }}<br>
          {{ debtorInfo.address.street }}, {{ debtorInfo.address.house }}<br>
          {{ debtorInfo.fullName }}
        </div>
        <div class="list__page-address--from">
          <pre>
            От кого: ООО «Комсервис»<br>
            129626, г. Москва,<br>
            Проспект Мира,  д.102, стр.26, эт.2, оф.26
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    params: Object
  },
  data () {
    return {
      companyInfo: {
        logo: '/assets/images/company-logo.jpg'
      },
      debtorInfo: {
        fullName: 'Гранкина Инга Викторовна',
        address: { index: '121351', city: 'Москва', street: 'ул. Молодогвардейская', house: 'д. 24, кв.15' },
        address1: '121351, г. Москва,',
        address2: 'ул. Молодогвардейская, д. 24, кв.15',
        RashSchet: '3130653839',
        debt: 12841.44
      }
    }
  },
  methods: {
    summ (sum) {
      return Math.trunc(sum) + ' рублей' + ' ' + Math.trunc((sum - Math.trunc(sum)) * 100) + ' коп.'
    },
    sklonenie (number) {
      const txt = ['рубль', 'рубля', 'рублей']
      const cases = [2, 0, 1, 1, 1, 2]
      return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
    }
  }
}
</script>
