<template>
  <!-- этого нет в макете, но я добавил что бы не удалять сразу, а с подтверждением. пусть дизайнер дорисует как он это видит -->
  <div class="confirm confirm__company">
    <div class="confirm__title text-left">ИНН организации</div>
    <div class="confirm__body-input">
      <search-input
        :params="{ placeholder: 'Введите ИНН новой компании', onlynumber: true, class: error ? 'is-error' : null }"
        @changeInputValue="newCompanyINN = $event"
        @noerror="error = false"/>
      <div v-if="error" class="login__input-warning mt-6">Введите правильный ИНН (10 цифр)</div>
    </div>
    <div class="confirm__body">
      <div class="btn btn-primary" @click="confirm()">Подтвердить</div>
      <div class="btn btn-white" @click="$store.dispatch('setPopupState', false)">Отменить</div>
    </div>
  </div>
</template>

<script>
import searchInput from '@/components/elements/SearchInput'
export default {
  name: 'PopupConfirmNewCompany',
  props: {
    params: Object
  },
  data () {
    return {
      newCompanyINN: '',
      error: false
    }
  },
  components: { searchInput },
  methods: {
    confirm () {
      if (this.newCompanyINN.length !== 10) {
        this.error = true
      } else {
        this.$store.dispatch('uploadNewCompanyDataOnINN', this.newCompanyINN)
          .then((resp) => {
            // this.params.action(resp)
            this.$store.dispatch('setPopupState', false)
            this.$toast.open({
              message: 'Компания добавлена',
              type: 'success',
              duration: 5000,
              dismissible: true,
              position: 'top-right'
          });
          })
          .catch(err => {
            // console.log(err)
            this.$store.dispatch('setPopupComponent', { component: 'popupAlert', params: { title: 'Произошла ошибка', text: 'Проверьте правильность ИНН' } })
          })
      }
    }
  }
}
</script>
