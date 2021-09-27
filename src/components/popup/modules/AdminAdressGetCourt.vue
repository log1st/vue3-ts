<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Установка подсудности</p>
        </template>
        <div class="popup__status admin-error__popup">

            <div class="compib__row" v-show="!regionCode">
                <div class="compib__row-label">
                    <span>Выбор региона</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <v-select
                        :options="regionsList"
                        placeholder="Выберите один из регионов"
                        label="name"
                        v-model="selectedRegion"
                        @input="getCourtsList()"
                        >
                        </v-select>
                    </div>
                </div>
            </div>

            <div class="compib__row" v-show="(params.type === 0 && regionCode) || active.type === 0">
                <div class="compib__row-label">
                    <span>Мировая подсудность</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <v-select
                        :options="courtsList"
                        placeholder="Выберите один из судов"
                        label="link"
                        v-model="jurisdiction.mir"
                        >
                        </v-select>
                    </div>
                </div>
            </div>

            <div class="compib__row" v-show="(params.type == 1 && regionCode) || active.type === 1">
                <div class="compib__row-label">
                    <span>Районанная подсудность</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <v-select
                        :options="courtsList"
                        placeholder="Выберите один из судов"
                        label="link"
                        v-model="jurisdiction.dist"
                        >
                        </v-select>
                    </div>
                </div>
            </div>

            <div class="compib__row">
                <div class="popup__status-button">
                    <ur-btn
                        class="btn send__request"
                        style="height:50px"
                        :loading="loading"
                        @click="setJurisdiction()"
                        :disabled="disabled"
                    >
                        <span>{{titleJurisdictionBtn}}</span>
                    </ur-btn>
                    <!-- <ur-btn
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
                    </ur-btn> -->
                </div>
            </div>
                
        </div>
    </popup-wrapper>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        params: {
            type: Object
        }
    },

    data () {
        return {
            selectedRegion: undefined,
            jurisdiction: {
                mir: undefined,
                dist: undefined
            },
            loading: false,
            disabled: false,
            jurisdictionUrl: 'https://jury.api-asj-test.urrobot.net',
            courtsList: [],
            active: {
                array: [],
                type: false
            }
        }
    },

    computed: {
        ...mapGetters([
            'regionsList'
            ]),

            titleJurisdictionBtn () {
                if (this.params.type === 0) {
                    return 'Установка мировой подсудности'
                } else if (this.params.type === 1) {
                    return 'Установка районой подсудности'
                }
            },

            regionCode () {
                    if (!!this.params.item.data.region_code) {
                        return this.params.item.data.region_code
                    } else {
                        if (!!!this.selectedRegion) {
                            return false
                        } else {
                            return this.selectedRegion
                        }
                    }
            }     
    },

    created () {
        if (this.regionCode) {
            this.getCourtByFileCode()
        }
    },  

    methods: {
        validationJurisdiction () {
            return new Promise ((res, rej) => {
                if (this.params.type === 0) {
                    res({
                        court_link: this.jurisdiction.mir.link
                    })
                } else if (this.params.type === 1) {
                    res({
                        court_link: this.jurisdiction.dist.link
                    })
                } else {
                    rej({
                        msg: 'Не верный тип подсудности'
                    })
                }
            })
        },

        /**
         * Установка подсудности
         */
        setJurisdiction () {
            this.loading = true
            this.disabled = true
            this.validationJurisdiction()
            .then( res => {
                axios({
                    url: `${this.jurisdictionUrl}/jury/house/${this.params.item.data.houseid}`,
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer dar5byv3avE3UpBy'
                    },
                    data: {
                        ...res,
                        adr_record_id: this.params.item.id
                        }
                })
                .then( resp => {
                    console.log(resp)
                    this.loading = false
                    this.disabled = false
                    this.$toast.open({
                        message: 'Подсудность установлена',
                        type: 'success',
                        position: 'top-right'
                    })
                    events.$emit('reloadPackData')
                })
                .catch( err => {
                    this.$toast.open({
                        message: err,
                        type: 'error',
                        position: 'top-right'
                    })
                    this.loading = false
                    this.disabled = false
                })
            })
            .catch( err => {
                this.$toast.open({
                    message: err.msg,
                    type: 'error',
                    position: 'top-right'
                })
                this.loading = false
                this.disabled = false
            }) 
            
        },

        getCourtByFileCode () {
            axios({
                url: `${this.jurisdictionUrl}/known_courts`,
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'
                },
                params: {
                    region: this.regionCode
                },
                method: 'GET'
            })
            .then( resp => {
                this.active.type = this.params.type
                this.courtsList = resp.data
            })
        },

        /**
         * Получение списка судов
         */
        getCourtsList () {
            axios({
                url: `${this.jurisdictionUrl}/known_courts`,
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'
                },
                params: {
                    region: this.selectedRegion.code
                },
                method: 'GET'
            })
            .then( resp => {
                this.active.type = this.params.type
                this.courtsList = resp.data

            }) 
        }
    }
}
</script>