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
                        <span>{{ sudLink ({item: params.item.data.court_name, court: 'court_name'}) }}
                             <a @click="setNewCourtData({type: 0})" href="#">Данные не корректны ?</a></span>
                    </div>
                </div>
            </div>

            <div class="compib__row">
                <div class="compib__row-label">
                    <span>Районанная подсудность</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <span>{{ sudLink ({item: params.item.data.court_link, court: 'district_court_link'}) }} <a @click="setNewCourtData({type: 1})" href="#">Данные не корректны ?</a> </span>
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
                <div class="compib__row-label">
                    <span>Установленый пристов</span>
                </div>
                <div class="compib__input">
                    <div class="search-input" v-show="!!fssp.name" style="display: flex; flex-direction: row">
                        <input type="text" placeholder="Введите альтернативный адресс" v-model="fssp.name">
                        <ur-btn
                        class="delete__template-btn"
                        title="Переназначить пристова"
                        @click="clearFSSP()"
                    >
                        X
                    </ur-btn>
                    </div>
                    <div class="search-input" v-show="!fssp.name">
                        <v-select
                        :options="fsspList"
                        placeholder="Выберите один из вариантов"
                        label="name"
                        v-model="rawFssp"
                        >
                        </v-select>
                    </div>
                    
                </div>
            </div>

            <!-- <div class="compib__row"> -->
                <div class="popup__status-button new-grid__btn">
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
                        @click="setNewFSSP()"
                        :disabled="disabled"
                    >
                        <span>Установить пристова</span>
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
            <!-- </div> -->
                
        </div>
    </popup-wrapper>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

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
            },

            jurisdiction: {
                court_name: false,
                district_court_link: false
            },

            fssp: {
                name: false,
                adress: false
            },

            rawFssp: undefined 
        }
    },

    props: {
        params: {
            type: Object
        }
    },

    created () {
            this.getCourtJurisdiction()
            this.getFSSPByAdress()
            this.getAlternativeAdress()
            // Получение данных о регионах идет из апи фронта 
            // this.getRegionList() 
        },

    computed: {
        ...mapGetters([
            'fsspList'
        ]),

        sudLink () {
            return payload => {
                const { item, court } = payload
                if (!!item) {
                    if (this.jurisdiction[court]) {
                        return item === this.jurisdiction[court] ? item : this.jurisdiction[court] 
                    }
                } else {
                    return !this.jurisdiction[court] ? 'Нет данных' : this.jurisdiction[court]
                }
            }
        },
    },
    
    methods: {     
        ...mapActions([
        'setPopupComponent',
        ]),

        clearFSSP () {
            this.fssp = {
                name: false,
                adress: false
            }
        },

        setNewFSSP () {
            this.validationsFSSP()
            .then( result => {
                const user = JSON.parse(localStorage.getItem("user"))
                this.loading = true
                this.disabled = true
                axios({
                    url: `${this.standUrlDev}/fssp/autotest`,
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer dar5byv3avE3UpBy'  //Токен всегда один ...
                    },
                    data: {
                        source_address: this.params.item.data.result,
                        fssp_address: this.rawFssp.address,
                        fssp_name: this.rawFssp.name,
                        user_id: user.id
                    }
                })
                .then( resp => {
                    this.loading = false
                    this.disabled = false
                    this.$toast.open({
                        message: 'Пристов установлен',
                        type: 'success',
                        posttion: 'right-top'
                    })
                })
                .catch( err => {
                    this.loading = false
                    this.disabled = false
                    this.$toast.open({
                        message: err,
                        type: 'error',
                        posttion: 'right-top'
                    })
                })
            })
        },

        validationsFSSP ( ) {
            return new Promise ((resolve, reject) => {
                if (!!this.rawFssp) {
                    resolve({status: true})
                } else {
                    reject({status: false})
                }
            })
        },

        errorAdress ({item}) {
            axios({
                url: `${this.standUrlDev}​/address_reference`,
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'  //Токен всегда один ...
                },
                method: 'POST',
                data: {
                    adr_id: item.id,
                    adr_file: item.id_file,
                    status: 1
                }
            })
            .then( resp => {
                events.$emit('reloadPackData')
            })
        },

        getFSSPByAdress () {
            return new Promise ((resolve, reject) => {
                let userJSON = localStorage.getItem('user')
                const user = JSON.parse(userJSON)
                axios({
                    url: `${this.standUrlDev}/fssp/autotest`,
                    headers: {
                        Authorization: 'Bearer dar5byv3avE3UpBy'  //Токен всегда один ...
                    },
                    method: 'GET',
                    params: {
                        user_id: user.id
                    }
                })
                .then( resp => {
                    console.log(resp)
                    if (resp.data.fssp_points.length === 0) reject({status: false})
                    else { 
                        let fsspAdress = resp.data.fssp_points.find( item => item.source_address === this.params.item.data.result)
                        this.fssp.adress = fsspAdress.address
                        this.fssp.name = fsspAdress.name
                        resolve({status: true})
                        }
                })
            })
        },

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
                // console.log(resp)
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
                this.errorAdress({item: this.params.item})
            })
        },

        addAlternativeAdress () {
            axios({
                url: `${this.standUrlDev}/address_alternative`,
                method: 'POST',
                data: {
                    formalname: this.params.item.data.result,
                    adr_record_id: this.params.item.id,
                    altername: this.adress.altername
                },
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'
                } 
            }).then( resp => {
                this.$toast.open({
                    message: 'Альтернативное имя установлено!',
                    type: 'success',
                    posttion: 'top-right'
                })
                this.adress.altername = resp.data.altername
            }).catch( err => {
                this.$toast.open({
                    message: err,
                    type: 'error',
                    posttion: 'top-right'
                })
            })
        },
        
        getAlternativeAdress () {
                axios({
                    url: `${this.standUrlDev}/address_alternative`,
                    method: 'GET',
                    params: {
                        adr_record_id: this.params.item.id,
                    },
                    headers: {
                        Authorization: 'Bearer dar5byv3avE3UpBy'
                    } 
                })
                .then( resp => {
                    // console.log(resp)
                    this.adress.altername = resp.data.alternames[resp.data.alternames.length].alter
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
                if (!!resp.data.court_name) {
                    this.jurisdiction.court_name = resp.data.court_name
                } 

                if (!!resp.data.district_court_link) {
                    this.jurisdiction.district_court_link
                }
                // console.log(resp)
            })
        },

        /**
        *
        * @description Апи сейчас не доступно
        *
        */
        getActiveRegion () {
            axios({
                url: `${this.jurisdictionUrl}/region/current`,
                method: "GET",
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'
                },
            })
            .then( resp => {
                // console.log(resp)
            })
        },
        
        setNewCourtData (payload) {
            const { type } = payload
            this.setPopupComponent({component: "AdminAdressGetCourt", params: {...this.params, type: type, region_code: false}})
        },

        getRegionList () {
            axios({
                url: `${this.jurisdictionUrl}/regions`,
                method: "GET",
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'
                },
            }).then( resp => {
                // console.log(resp)
            })
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
                padding: 1.5em;
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
        #vs5__listbox {
            max-height: 12em;
        }
    }
</style>