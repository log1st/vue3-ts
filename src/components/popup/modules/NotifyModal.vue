<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0"> {{title}} </p>
        </template>
        <div class="popup__status">
            <div class="popup__status-button">
                  <ur-btn
                      class="btn btn-primary"
                      :loading="loading"
                      @click="sendNotify"
                      :disabled="disabled"
                  >
                      <span>Отправить уведомление</span>
                  </ur-btn>
                </div>
        </div>
    </popup-wrapper>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    props: {
        params: {
            type: Object
        }
    },
    data () {
        return {
            loading: false,
            disabled: false
        }
    },
    methods: {
        ...mapActions(['setPopupState']),
        sendNotify () {
            this.loading = true
            this.disabled = true
            const uri = this.mode === 1 ? `/pretrial/sms/` : `/pretrial/voice/`
            const companyId = parseInt(localStorage.getItem('defaultCompany'))
            this.$http({
                command: uri,
                method: 'POST',
                data: {
                    company: companyId,
                    payload: this.debtorsId
                }
            })
            .then( resp => {
                this.loading = false
                this.disabled = false
                this.$toast.open({
                    message: `Запрос отправлен на обработку`,
                    type: 'success',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                })
                this.setPopupState(false)
                console.log(resp)
            })
            .catch( err => {
                console.log(err)
                this.$toast.open({
                    message: `Серверная ошибка`,
                    type: 'error',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                })
                this.setPopupState(false)
                this.loading = false
                this.disabled = false
            })
        }
    },
    computed: {
        debtorsId () {
            return this.params.checkDebtors.map( d => d.debtor.pk)
        },
        mode () {
            const mode = this.params.mode === 'sms' ? 1 : 2
            return mode
        },
        title () {
            if (this.params.mode === 'sms') {
                return 'Отправка сообщения'
            } else {
                return 'Отправка голосового сообщения'
            }
        }
    }
}
</script>