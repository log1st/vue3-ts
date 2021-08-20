<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Установка нового адреса</p>
        </template>
        <div class="popup__status admin-error__popup">
            <div style="width: 100%">
                    <span style="font-weight: bold">Не корректный адресс {{params.item.data.source}}</span>
            </div>

            <div class="compib__row">
                <div class="compib__row-label">
                    <span>Мировая подсудность</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <span>{{params.item.data.court_link_msudrf  || "Нет данных"}}</span>
                    </div>
                </div>
            </div>

            <div class="compib__row">
                <div class="compib__row-label">
                    <span>Районанная подсудность</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <span>{{params.item.data.court_link || "Нет данных"}}</span>
                    </div>
                </div>
            </div>

            <div class="compib__row">
                <div class="compib__row-label">
                    <span>Новый адрес для поиска</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <input type="text" placeholder="Введите новый адресс" v-model="adress.newAdressTitle">
                    </div>
                </div>
            </div>

            <div class="compib__row">
                <div class="compib__row-label">
                    <span>Альтернативный адрес</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <input type="text" placeholder="Введите альтернативный адресс" v-model="adress.altername">
                    </div>
                </div>
            </div>

            <div class="compib__row">
                <div class="popup__status-button">
                    <ur-btn
                        class="btn send__request"
                        :loading="loading"
                        @click="sendAdressToNewStand()"
                        :disabled="disabled"
                    >
                        <span>Отправить на стандартизацию</span>
                    </ur-btn>
                    <ur-btn
                        class="btn send__request"
                        :loading="loading"
                        @click="sendAdressToTelegram()"
                        :disabled="disabled"
                    >
                        <span>Отправить в телеграм</span>
                    </ur-btn>
                    <ur-btn
                        class="btn send__request"
                        :loading="loading"
                        @click="addAlternativeAdress()"
                        :disabled="disabled"
                    >
                        <span>Установить альтернативное имя</span>
                    </ur-btn>
                </div>
            </div>
                
        </div>
    </popup-wrapper>
</template>
<script>
export default {
    data () {
        return {
            loading: false,
            disabled: false,

            standUrl: 'https://stand.api-asj.urrobot.net',
            standUrlDev: 'https://stand.api-asj-test.urrobot.net',
            jurisdictionUrl: 'https://jury.api-asj-test.urrobot.net',

            adress: {
                newAdressTitle: undefined,
                sendMessageToTelegram: false,
                resultAdressTitle: undefined,
                altername: undefined
            }
        }
    },

    props: {
        params: {
            type: Object
        }
    },
    created () {
            this.getCourtJurisdiction()
            this.getActiveRegion()
        },
    methods: {     
        sendAdressToNewStand () {
            axios({
                url: `${this.standUrlDev}​/standardize`,
                method: 'GET',
                params: {
                    address: this.adress.newAdressTitle
                },
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'
                }
            }).then( resp => {
                console.log(resp)
            }) 
        },

        sendAdressToTelegram () {
            axios({
                url: 'https://api.telegram.org/bot1389289925:AAFqrdhFsBU4-uHjy538ufXfWmgzaOBwJ1o/sendMessage',
                method: 'GET',
                params: {
                    chat_id: '-1001174320496',
                    text: `Адрес ${this.params.item.data.source} не корректный`
                }
            }).then( resp => {
                if (resp.data.ok === true) {
                    this.$toast.open({
                        type: 'success',
                        message: 'Сообщение отправлено в telegram канал'
                    })
                } else {
                    this.$toast.open({
                        type: 'error',
                        message: 'Сообщение не отправлено в telegram канал'
                    })
                }
                
                console.log(resp)
            })
        },

        addAlternativeAdress () {
            axios({
                url: `${this.standUrlDev}/address_alternative`,
                method: 'POST',
                data: {
                    formalname: this.params.item.data.result,
                    // aoguid: this.params.item.data.aoguid,
                    altername: this.adress.altername
                },
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'
                } 
            }).then( resp => {
                // console.log(resp)
                this.adress.altername = resp.data.altername
            })
        },

        getCourtJurisdiction () {
            axios({
                url: `${this.jurisdictionUrl}/jurisdiction`, 
                method: 'GET',
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'
                },
                params: {
                    address: this.params.item.data.result
                }
            })
            .then( resp => {
                console.log(resp)
            })
        },

        getActiveRegion () {
            axios({
                url: `${this.jurisdictionUrl}/region/current`,
                method: "GET",
            })
            .then( resp => {
                console.log(resp)
            })
        },

        setJurisdictionRegion () {

        }
    }
}
</script>

<style lang="scss">
    $backgroundColor: #00082f;
    .admin-error__popup {
        .search-input {
            height: 100% !important;
        }
        .compib__row {
            margin: 0.8em 0;
        }
        .btn {
            &.send__request {
                padding: 0.5em;
                background-color: var(--colorBlue3);
                transition: all .4s ease-in-out;
                span {
                    color: #fff !important;
                }
                &:hover {
                    background-color: var(--colorLightBlueActive);
                }
            }

        }
    }
</style>