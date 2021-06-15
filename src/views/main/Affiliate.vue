<template>
  <div class="main">
    <div class="main__head">
      <div class="main__head-title mt-6">Организации</div>
      <div>
        <!-- <div class="btn btn-primary" @click="setPopupComponent({ component: 'company-cart', params: { mode: 'new' } })"><span class="fz-22">+</span> Создать организацию</div> -->
        <div class="btn btn-primary"
             @click="setPopupComponent({ component: 'popupConfirmNewCompany', params: { action: openCartNewCompany } })"
        >
          <span class="fz-22">+</span> Создать организацию
        </div>
        <div class="btn btn-white" @click="setAffliateDefault()">Организация по умолчанию</div>
      </div>
    </div>
    <div class="main__content mt-20">
      <companies />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import companies from '@/components/modules/Companies'
export default {
  name: 'Affiliate',
  components: { companies },
  methods: {
    ...mapActions(['setPopupComponent', 'setCompanyDefault']),
    /**
     * Установить организацию/филиал по умолчанию
     */
    setAffliateDefault () {
      this.setCompanyDefault();
      this.setPopupComponent({
        component: 'popupAlert',
        params: {
          title: 'Настройки изменены',
          text: `Организацией по умолчанию установлена:<br>${this.$store.getters.getDefaultCompanyFullName}`
        }
      })
    },
    openCartNewCompany () {
      this.setPopupComponent({ component: 'company-cart', params: { mode: 'new' } })
    }
  }
}
</script>
