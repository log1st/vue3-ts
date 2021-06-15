<template>
  <div class="main__content mt-20">
    <div class="main__content-row">
      <div class="panel-title"><b>Подключенные услуги</b></div>
    </div>
    <div class="main__content-row">

      <div class="main__content-col main__content-col--510">
        <panelServices
          :params="debtorsModules[1]"
          @change-status="changeStatus(1)"
          :key="'pnlsdrv0' + i"
        />
        <!-- <panelServices
          v-for="(item, i) in debtorsModules"
          :params="item"
          @change-status="changeStatus(i)"
          :key="'pnlsdrv0' + i"
        /> -->
      </div>

      <div class="main__content-col main__content-col--642">
        <mainContainer :title="'Стоимость услуги на следующий месяц'">
          <template slot="nobody">
            <table class="panel-table panel-table--4">
              <thead>
                <tr>
                  <th>Услуга</th>
                  <th>Кол-во</th>
                  <th>Цена</th>
                  <th>Сумма&nbsp;без&nbsp;скидки</th>
                  <th>Скидка</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, i) in debtorsModules">
                  <tr v-if="item.status" :key="'pnl4-2td' + i">
                    <td>{{ item.title }}</td>
                    <td>{{ item.proceedingsDebtors | sepnum }}</td>
                    <td>{{ item.befTax | sepnum(2) }}&nbsp;₽</td>
                    <td>{{ (item.befTax * item.proceedingsDebtors) | sepnum(2) }}&nbsp;₽</td>
                    <td>{{ getDiscount(item.proceedingsDebtors, item.befTax) | sepnum(2) }}&nbsp;₽</td>
                    <td>{{ (item.befTax * item.proceedingsDebtors - getDiscount(item.proceedingsDebtors, item.befTax)) | sepnum(2) }}&nbsp;₽</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
        </mainContainer>
        <mainContainer :title="'Скидки на услуги '">
          <template>
            <div class="panel-text">
              <p>Скидки на услуги <b>«{{ debtorsModules[0].title }}»</b> и <b>«{{ debtorsModules[1].title }}»</b></p>
            </div>
            <div class="panel-discount__wrapper">
              <div v-for="(item, i) in discountData" class="panel-discount" :key="'ddtasvg' + i">
                <div class="panel-discount__outer">
                  <svg width="151px" height="151px" viewBox="0 0 151 151" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
                    <g id="Group-10" transform="translate(3 3)">
                      <path d="M51.5 103C79.9427 103 103 79.9427 103 51.5C103 23.0573 79.9427 0 51.5 0C23.0573 0 0 23.0573 0 51.5C0 79.9427 23.0573 103 51.5 103Z" transform="translate(20.62305 20.62317)" id="Oval" fill="none" stroke="#F2F6FC" stroke-width="6" />
                      <path d="M51.5 103C79.9427 103 103 79.9427 103 51.5C103 23.0573 79.9427 0 51.5 0C23.0573 0 0 23.0573 0 51.5C0 79.9427 23.0573 103 51.5 103Z" transform="matrix(-0.7986355 0.6018151 -0.6018151 -0.7986355 144.2463 82.25943)" id="Oval-Copy-4" fill="none" :stroke="item.color" stroke-width="6" stroke-linecap="round" stroke-dasharray="120 120" />
                    </g>
                  </svg>
                  <div class="panel-discount__inner">
                    <span :style="`color: ${item.color};`">{{ item.percent }}%</span>
                  </div>
                </div>
                <div class="panel-discount__text" v-html="item.text">
                  От <b>1 000</b> до <b>4 999</b> лицевых счетов
                </div>
              </div>
            </div>
          </template>
        </mainContainer>
      </div>
    </div>
  </div>
</template>

<script>
import { discountData } from '@/settings/config'
import { mapGetters, mapActions } from 'vuex'
import mainContainer from '@/components/elements/MainContainer'
import panelServices from '@/components/modules/panel/PanelServices'
export default {
  components: { mainContainer, panelServices },
  data () {
    return {
      discountData
    }
  },
  methods: {
    ...mapActions(['changeStatusService', 'setPopupComponent']),
    changeStatus (id) {
      const tmpText = this.debtorsModules[id].status ? 'Подтвердите отключение услуги<br>' + this.debtorsModules[id].title : 'Потвердите подключение услуги<br>' + this.debtorsModules[id].title
      this.setPopupComponent({
        component: 'confirm',
        params: {
          title: tmpText,
          btnConfirm: 'Подтвердить',
          btnCancel: 'Отмена',
          action: this.changeStatusService,
          data: id
        }
      })
    },
    getDiscount (proceedingsDebtors, befTax) {
      let coef = 0
      if (proceedingsDebtors >= 1000 && proceedingsDebtors < 5000) coef = 0.1
      if (proceedingsDebtors >= 5000 && proceedingsDebtors < 10000) coef = 0.2
      if (proceedingsDebtors >= 10000) coef = 0.3
      return proceedingsDebtors * befTax * coef
    }
  },
  computed: {
    ...mapGetters(['debtorsModules'])
  }
}
</script>
