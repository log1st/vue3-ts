<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Беревод баланса</p>
        </template>
        <div class="popup__status">
            <div class="my-3">
                <div class="compib__row">
                  <div class="compib__row-label">
                      <span>Доступная сумма {{params.company.balance}}.руб</span>
                    </div>
                </div>
            </div>
            <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Организация (От куда)</span>
                    </div>
                    <div class="compib__input">
                        <div class="search-input no-select-input">
                            <v-select label="inn" :options="getAdminUserListArray" v-model="transfer.from" @change="checkOrganizationType()"></v-select>
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Организация (Куда)</span>
                    </div>
                    <div class="compib__input">
                        <div class="search-input no-select-input">
                            <v-select label="inn" :options="getAdminUserListArray" v-model="transfer.to" @change="checkOrganizationType()"></v-select>
                        </div>
                    </div>
                </div>
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
                      class="btn btn-primary"
                      :loading="loading"
                      @click="transferBalance"
                      :disabled="disabled"
                  >
                      <span>Перевести</span>
                  </ur-btn>
                </div>
        </div>
    </popup-wrapper>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'

export default {
    props: {
        params:{
            type: Object
        }
    },
    data () {
        return {
            companies: [],
            transfer: {
                from: null,
                to: null
            },
            loading: false,
            disabled: false,
            balance: 0
        }
    },
    computed: {
        ...mapGetters(['getAdminUserListArray'])
    },
    methods:{

        transferBalance () {
            this.loading = true
            this.disabled = true
            this.validation(this.transfer)
            .then( res => {
                if ( res.validation === true ) {
                    this.$http({
                        command: '/api/finance/transfer/',
                        data: {
                            amount: this.balance,
                            company_from: this.transfer.from,
                            company_to: this.transfer.to
                        }
                    })
                    .then( resp => {
                        if (resp.RequestStatusCode === 200 || resp.RequestStatusCode === 201) {
                            this.$toast.open({
                                message: 'Средства переведены',
                                type: 'success',
                                duration: 5000,
                                dismissible: true,
                                position: 'top-right'
                            })
                            this.loading = false
                            this.disabled = false
                        } else {
                            this.$toast.open({
                                message: resp,
                                type: 'warning',
                                duration: 5000,
                                dismissible: true,
                                position: 'top-right'
                            })
                        }
                    } )
                } else {
                    this.$toast.open({
                        message: res,
                        type: 'warning',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                    this.loading = false
                    this.disabled = false
                }
            })
            .catch( error => {
                this.$toast.open({
                        message: error,
                        type: 'warning',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                    this.loading = false
                    this.disabled = false
            })
        },
        /**
         * @param payload принимаем данные из `transferBalance`, а именно (`this.trasnfer`)
         * @returns Promise<any>
         */
        validation (payload) {
            return new Promise ((resolve, reject) => {
                const { to, from } = payload
                if ( to === from ) {
                    reject('Выберите разные организации')
                }

                else if (this.params.company.balance <= 0) {
                    reject(`Баланс равен ${this.params.company.balance}, баланс компании должен быть больше 0 для совершения перевода!`)
                }

                else if (this.balance <= 0) {
                    reject('Введите сумму перевода большую 0')
                }
                // На этот счет нужно уточнить потому что скорее всего нужно будет проверять именно ющера
                // else if (this.balance > from) {
                //     reject('Недостаточно средств')
                // }

                else {
                    resolve({validation: true})
                }
            })
        }
    },

    // created () {    
    //     this.$http({
    //         command: `/api/account/user/companies/${this.params.company.owner}/`,
    //         method: 'GET'
    //     })
    //     .then ( res => {
    //         this.companies = res
    //     }) 
    // }
}
</script>
<style lang="scss">
    .no-select-input {
        display: flex;
        align-items: center;
        width: 100%;
        .v-select {
            width:  100%;
            .vs__dropdown-toggle {
            min-height: 27px;
            }
        }
        .vs__search {
            display: none;
        }
    }

</style>