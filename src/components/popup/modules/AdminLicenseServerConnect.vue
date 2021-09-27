<template>
    <popup-wrapper>
      <template v-slot:header>
              <p class="m-0">Подключение к серверу лицензий</p>
      </template>
        <div class="popup__status admin-licens">
            <div class="my-3">
                <div class="compib__row" >
                    <div class="compib__row-label">
                        <span>URL: {{params.baseURL}}</span>
                    </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите наименование" v-model="newBaseURL">
                        </div>
                    </div>
                </div>
                <div class="compib__row" >
                    <div class="compib__row-label">
                        <span>Токен: {{params.token}}</span>
                    </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите токен" v-model="token">
                        </div>
                    </div>
                </div>
                <div class="popup__status-button">
                      <ur-btn
                          class="btn btn-primary"
                          @click="setNewLicensConnections"
                      >
                          <span>Применить</span>
                      </ur-btn>
                    </div>
            </div>
        </div>
    </popup-wrapper>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
    props: {
        params: {
            type: Object
        }
    },
    data: () => ({
        newBaseURL: undefined,
        token: undefined
    }),
    methods: {
        ...mapMutations([
            'updateLicensData'
        ]),
        setNewLicensConnections () {
            if (!!!this.newBaseURL || this.newBaseURL === '' || this.newBaseURL.length < 3) {
                this.$toast.open({
                    message: 'Поле URL не должно быть пустым! Минимальная длина, 3 символа!',
                    type: 'warning'
                })
            } else if (!!!this.token || this.token === '') {
                this.$toast.open({
                    message: 'Поле токен не должно быть пустым!',
                    type: 'warning'
                })
            } else if (this.newBaseURL.length >= 3 && this.token.length > 0) {
                this.updateLicensData({baseURL: this.newBaseURL, token: this.token})
                this.$toast.open({
                    message: 'Данные обновлены',
                    type: 'success'
                })
            }
        }
    }
}
</script>
<style lang="scss">
    .admin-licens {
        .search-input {
            height: 100% !important;
        }
    }
</style>