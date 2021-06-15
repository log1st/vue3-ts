<template>
  <div class="main__content mt-20">
    <div class="main__content-row">
      <div class="main__content-col main__content-col--614">
        <mainContainer :title="'Общие данные клиента'">
          <template slot="nobody">
            <table class="panel-table panel-table--0">
              <tbody>
                <tr>
                  <td>Номер и дата договора</td>
                  <td>{{ userAllData.ContractNumberDate }}</td>
                </tr>
                <tr>
                  <td>Название организации</td>
                  <td>{{ userAllData.FullNameOrganization }}</td>
                </tr>
                <tr>
                  <td>Адрес</td>
                  <td>{{ userAllData.PostalAddressWithZipCode }}</td>
                </tr>
                <tr>
                  <td>Фамилия</td>
                  <td>{{ userAllData.Fio.split(' ')[0] }}</td>
                </tr>
                <tr>
                  <td>Имя</td>
                  <td>{{ userAllData.Fio.split(' ')[1] }}</td>
                </tr>
                <tr>
                  <td>Отчество</td>
                  <td>{{ userAllData.Fio.split(' ')[2] }}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{{ userAllData.Email1 }}</td>
                </tr>
                <tr>
                  <td>Email бухгалтерии</td>
                  <td>{{ userAllData.EmailBuh }}</td>
                </tr>
                <tr>
                  <td>Дата регистрации</td>
                  <td>{{ userAllData.DateRegistre.split("-").reverse().join("-") }}</td>
                </tr>
                <tr>
                  <td>Часовой пояс</td>
                  <td>{{ userAllData.TimeZoneCity }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </mainContainer>
      </div>
      <div class="main__content-col main__content-col--427">
        <mainContainer :title="'Баланс'">
          <template slot="nobody">
            <div class="panel-balans">
              <div class="panel-balans__image">
                <div class="panel-balans__image-outer">
                  <svg width="242px" height="242px" viewBox="0 0 242 242" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
                    <desc>Created with Lunacy</desc>
                    <defs>
                      <filter filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" id="filter_1">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dx="0" dy="-1" />
                        <feGaussianBlur stdDeviation="5" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.2862745 0 0 0 0 0.3607843 0 0 0 0 1 0 0 0 0.4784314 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect0_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect0_dropShadow" result="shape" />
                      </filter>
                    </defs>
                    <path d="M101 202C156.781 202 202 156.781 202 101C202 45.2192 156.781 0 101 0C45.2192 0 0 45.2192 0 101C0 156.781 45.2192 202 101 202Z" transform="translate(20 21)" id="Oval" fill="none" stroke="#F2F6FC" stroke-width="10" />
                    <g filter="url(#filter_1)">
                      <path d="M101 202C156.781 202 202 156.781 202 101C202 45.2192 156.781 0 101 0C45.2192 0 0 45.2192 0 101C0 156.781 45.2192 202 101 202Z" transform="translate(20 21)" id="Oval-Copy-4" fill="none" stroke="#495CFF" stroke-width="10" stroke-linecap="round" :stroke-dasharray="partOfAll" />
                    </g>
                  </svg>
                </div>
                <div class="panel-balans__image-inner">
                  <div class="panel-balans__data">{{ userAllData.Balance | sepnum(2) }} ₽</div>
                  <div class="panel-balans__date">Баланс на {{ new Date() | formatdate(true) }}</div>
                </div>
              </div>
              <div class="panel-balans__content">
                <p>Расчетная сумма расходов</p>
                <p>на текущий месяц <span class="text-primary">{{ userAllData.RecomendedBalance ? userAllData.RecomendedBalance : 0 | sepnum(2) }} ₽</span></p>
              </div>
              <div class="panel-balans__button">
                <div class="btn btn-primary" @click="redirectTo">Пополнить баланс</div>
              </div>
            </div>
          </template>
        </mainContainer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import mainContainer from '@/components/elements/MainContainer'
export default {
  components: { mainContainer },
  data () {
    return {
      partOfAll: '630 630'
    }
  },
  methods: {
    ...mapActions(['setPopupComponent', 'loadInfoINNSharedData']),
    redirectTo () {
      this.$emit('changePanel', { tab: 2 })
    },
    // setPartOfAll () {
    //   let result = this.userAllData.Balance / this.userAllData.RecomendedBalance * 630
    //   if (result > 630) result = 630
    //   this.partOfAll = result + ' 630'
    // }
  },
  computed: {
    ...mapGetters({
      userAllData: 'getInfoINNSharedData'
    })
  }
}
</script>
