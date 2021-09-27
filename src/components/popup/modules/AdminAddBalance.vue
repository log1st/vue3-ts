<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Добавление баланса для {{params.company.AbbreviatedName}}</p>
        </template>
        <div class="popup__status" v-if="!secure">
          <div class="my-3">
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>Доступная сумма {{params.company.balance}}.руб</span>
                </div>
            </div>
          </div>
          <span v-if="error" style="color:#db4c4c; font-weight:bold; font-size:13px">Поле суммы должно быть заполнено и не быть равным нулю или отрицательному числу!</span>
          <div class="my-3">
                 <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Сумма</span>
                    </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="number" placeholder="Введите сумму" v-model="balance">
                        </div>
                    </div>
                </div>
            </div>
            <div class="popup__status-button">
              <ur-btn
                  style="margin-bottom: 0.5em"
                  class="btn btn-primary"
                  :loading="loading"
                  @click="addBalanceSecure({status: true})"
                  :disabled="disabled"
              >
                  <span>Добавить</span>
              </ur-btn>
              <ur-btn
                  class="btn btn-primary"
                  :loading="loading"
                  @click="addBalanceSecure({status: false})"
                  :disabled="disabled"
              >
                  <span>Списать</span>
              </ur-btn>
            </div>
        </div>
        <div class="popup__status" v-else>
              <span>Введите пин код для подтверждения операции</span>
            <div class="add-balance__code">
              <div class="add-balance__item" v-for="(symbol, index) in code" :key="index">
                <div class="add-balance__item_inner">
                  <input type="text" maxlength="1" autocomplete="none" v-model="symbol.value">
                </div>
              </div>
            </div>
            <div class="popup__status-button">
              <ur-btn
                  class="btn btn-primary"
                  :loading="loading"
                  @click="validation()"
                  :disabled="disabled"
              >
                  <span>Применить</span>
              </ur-btn>
            </div>
        </div>
    </popup-wrapper>
</template>
<script>

import UrBtn from '@/components/elements/Button'
import { mapActions } from 'vuex'

export default {
    props:{
        params:{
            type: Object
        }
    },
    data () {
      return {
        secure: false,
        loading: false,
        disabled: false,
        balance: null,
        error: false,
        currentBalance: 0,

        status: null,

        code:[
          {value:null},
          {value:null},
          {value:null},
          {value:null},
          {value:null},
          {value:null},
          ]
      }
    },
    components: {
      'ur-btn': UrBtn,
      },
      methods:{
        ...mapActions(['setPopupState']),
        validation () {
          if ( this.status != null ) {
          let commandApi = this.status ? '/api/finance/admin/income/' : '/api/finance/admin/outcome/'
          this.disabled = true
          this.loading = true
          let codeSymbols = '';
          this.code.forEach(e => {
            codeSymbols += e.value
          }) 

          this.$http({
            method: 'POST',
            command: commandApi,
            data:{
              company: this.params.company.id,
              amount: parseInt(this.balance)
            }
          })
          .then(res => {
            if (res.RequestStatusCode === 200 || res.RequestStatusCode === 201) {
              events.$emit('newBalance', { balance: res.entries[0].income - res.entries[0].outcome})
                this.secure = false
                this.disabled = false
                this.loading = false
                this.balance = null
                this.error = false
                this.code.forEach(e => {
                   e.value = null
                })
                this.$toast.open({
                  message: `Баланс успешно изменен`,
                  type: 'success',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
                });

                events.$emit('update_data_company')
              this.setPopupState(false)
            }
            else {
                this.disabled = false
                this.loading = false
                this.$toast.open({
                  message: `${res}`,
                  type: 'error',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
                });
            }
          })

          }
        },
        addBalanceSecure ( payload ) {
          const { status } = payload
          this.status = status
          this.disabled = true
          this.loading = true
            if (this.balance == null || this.balance == 0) {
                this.disabled = false
                this.loading = false
                this.error = true
            } else if ( this.balance > 0) {
              this.secure = true
              this.disabled = false
              this.loading = false
            }
        }
      },
}
</script>