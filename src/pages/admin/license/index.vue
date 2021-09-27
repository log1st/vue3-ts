<template>
    <div class="main admin__wrapper">
        <div class="main__head">
            <div class="main__head-title mt-6">Центр лицензий</div>
        </div>
        <div class="main__content pt-20">
            <div class="admin__wrapper">
                <div class="admin__wrapper-license">
                    <div class="admin__wrapper-license-bar">
                        <ul class="admin__license-list">
                            <li style="text-decoretion: underline; font-weight: bold" @click="openCreateLicenseBlock()">
                                Создать лицензию
                            </li>
                            <li style="text-decoretion: underline; font-weight: bold" @click="changeServerConnect()">
                                Изменить данные подключения
                            </li>
                            <li v-for="(item, index) in licensList"
                            :key="index"
                            @click="getLicenseInfo({name: item.name})">
                                {{item.name}}
                            </li>
                            <li v-if="loadingList">
                                Лицензии загружаются
                            </li>
                        </ul>
                    </div>
                    <div class="admin__wrapper-license-workspace">
                        <div class="admin__license-public-info" v-if="!!selectedLicense && !editStatus && !recreateStatus && !createStatus">
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">Название:</div>
                                <div class="admin__license-public-info__data-value">{{selectedLicense.name}}</div>
                            </div>
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">Код:</div>
                                <div class="admin__license-public-info__data-value"><input disabled type="password" ref="hidenkey" v-model="selectedLicense.code"> <span @click="getHidenKey">Показать</span>  </div>
                            </div>
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">Дата:</div>
                                <div class="admin__license-public-info__data-value">{{selectedLicense.data}}</div>
                            </div>
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">Статус:</div>
                                <div class="admin__license-public-info__data-value">{{!!selectedLicense.is_active ? 'Активна' : 'Не активна'}}</div>
                            </div>
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">Создана:</div>
                                <div class="admin__license-public-info__data-value">{{selectedLicense.created_at}}</div>
                            </div>
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">Активно до:</div>
                                <div class="admin__license-public-info__data-value">{{selectedLicense.expired_at}}</div>
                            </div>
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-btn" @click="readyToEdit()"> Редактировать </div>
                                <div class="admin__license-public-info__data-btn" @click="recreateLicense()"> Пересоздать лицензию </div>
                                <div class="admin__license-public-info__data-btn delete" @click="deleteLicense()"> Удалить лицензию </div>
                            </div>
                        </div>
                        <div class="admin__license-public-info" v-else-if="editStatus">
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">[Редактирование] Колчиство дней:</div>
                                <div class="admin__license-public-info__data-value edited"><input type="number" v-model="editedData.days"> дней</div>
                            </div>
                            <div class="admin__license-public-info__data">                                
                                <div class="admin__license-public-info__data-btn" @click="saveEdit()"> Сохранить </div>
                                <div class="admin__license-public-info__data-btn delete" @click="decline()"> Отменить </div>
                            </div>
                        </div>
                        <div class="admin__license-public-info" v-else-if="recreateStatus">
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">[Пересоздание] Колчиство дней:</div>
                                <div class="admin__license-public-info__data-value edited"><input type="number" v-model="editedData.days"> дней</div>
                            </div>
                            <div class="admin__license-public-info__data">                                
                                <div class="admin__license-public-info__data-btn" @click="saveRecreateData()"> Пересоздать </div>
                                <div class="admin__license-public-info__data-btn delete" @click="decline()"> Отменить </div>
                            </div>
                        </div>
                        <div class="admin__license-public-info" v-else-if="createStatus">
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">Наименование: (минимум 8 символов)</div>
                                <div class="admin__license-public-info__data-value edited"><input type="text" v-model="newLicens.name"></div>
                            </div>
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">Продукт:</div>
                                <div class="admin__license-public-info__data-value edited"><input type="text" v-model="newLicens.product"></div>
                            </div>
                            <div class="admin__license-public-info__data">
                                <div class="admin__license-public-info__data-title">Дни:</div>
                                <div class="admin__license-public-info__data-value edited"><input type="text" v-model="newLicens.days"> дней</div>
                            </div>
                            <div class="admin__license-public-info__data">                                
                                <div class="admin__license-public-info__data-btn" @click="saveNewLicense()"> Создать </div>
                                <div class="admin__license-public-info__data-btn delete" @click="decline()"> Отменить </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import './licens.scss'
export default {
    name: 'AdminLicense',
    data () {
        return {
            licensList: [],
            selectedLicense: undefined,
            loadingList: false,
            editStatus: false,
            recreateStatus: false,
            createStatus: false,
            editedData: {
                days: 0
            },
            newLicens: {
                name: '',
                product: '',
                days: 0
            }
        }
    },
    computed: {
        ...mapGetters([
            'licens'
        ])
    },
    mounted () {
        this.$nextTick(() => {
            this.getLicens()
        })
    },
    methods: {
        ...mapActions([
            'setPopupComponent'
        ]),
        changeServerConnect () {
              this.setPopupComponent( {component: 'AdminLicenseServerConnect', params: { baseURL: this.licens.baseURL, token: this.licens.token } } )
        },
        getLicens () {
        this.loadingList = true
           return axios({
                url:`${this.licens.baseURL}/test/admin/license`,
                method: 'GET',
                headers: {
                    'X-Token': this.licens.token
                }
            })
            .then( resp => {
                this.licensList = resp.data.items
                this.loadingList = false
            })
            .catch( err => {
                this.loadingList = false
                console.log(err)
            })
        },
        decline () {
            this.editStatus = false
            this.recreateStatus = false
            this.createStatus = false
        },
        readyToEdit () {
            this.editStatus = true
            this.recreateStatus = false
            this.createStatus = false
        },
        recreateLicense () {
            this.editStatus = false
            this.createStatus = false
            this.recreateStatus = true
        },
        openCreateLicenseBlock () {
            this.editStatus = false
            this.recreateStatus = false
            this.createStatus = true
        },
        saveNewLicense () {
            return axios({
                url: `${this.licens.baseURL}/test/admin/license/`,
                method: 'POST',
                headers: {
                    'X-Token': this.licens.token
                },
                data: {
                    name: this.newLicens.name || 'unknowname',
                    product: this.newLicens.product || 'urrobot',
                    days: parseInt(this.newLicens.days) ||  7
                }
            })
            .then( resp => {
                this.getLicens()
                this.createStatus = false
                this.newLicens.name = ''
                this.newLicens.product = ''
                this.newLicens.days = 0
                this.$toast.open({
                    type: 'success',
                    message: 'Лицензия Создана'
                })
            })
            .catch( err => {
                this.createStatus = false
                this.$toast.open({
                    type: 'error',
                    message: err
                })
            })
        },
        deleteLicense () {
            return axios({
                url: `${this.licens.baseURL}/test/admin/license/${this.selectedLicense.name}`,
                method: 'DELETE',
                headers: {
                    'X-Token': this.licens.token
                }
            })
            .then( resp => {
                this.selectedLicense = undefined
                this.getLicens()
                this.$toast.open({
                    type: 'success',
                    message: 'Лицензия удалена'
                })
            }).catch( err => {
                this.editStatus = false
                this.$toast.open({
                    type: 'error',
                    message: err
                })
            })

        },
        saveRecreateData () {
            return axios({
                url: `${this.licens.baseURL}/test/admin/license/${this.selectedLicense.name}/recreate`,
                method: 'PATCH',
                headers: {
                    'X-Token': this.licens.token
                },
                data: {
                    days: parseInt( this.editedData.days)
                }
            })
            .then( resp => {
                this.getLicens()
                this.selectedLicense = undefined
                this.recreateStatus = false
                this.editStatus = false
                this.editedData.days = 0
                this.$toast.open({
                    type: 'success',
                    message: 'Лицензия сохранена'
                })
            })
            .catch( err => {
                this.editStatus = false
                this.$toast.open({
                    type: 'error',
                    message: err
                })
            })
        },
        saveEdit () {
            return axios({
                url: `${this.licens.baseURL}/test/admin/license/${this.selectedLicense.name}/`,
                method: 'PATCH',
                headers: {
                    'X-Token': this.licens.token
                },
                data: {
                    days: parseInt( this.editedData.days)
                }
            })
            .then( resp => {
                console.log(resp)
                this.getLicens()
                this.selectedLicense = undefined
                this.editStatus = false
                this.recreateStatus = false
                this.editedData.days = 0
                this.$toast.open({
                    type: 'success',
                    message: 'Лицензия сохранена'
                })
            })
            .catch( err => {
                this.editStatus = false
                this.$toast.open({
                    type: 'error',
                    message: err
                })
            })
        },
        getHidenKey () {
            if (this.$refs.hidenkey.type == 'password') this.$refs.hidenkey.type = 'text'
            else this.$refs.hidenkey.type = 'password'
        },
        getLicenseInfo (payload) {
            // this.getPublicInform(payload)
            this.getDetailInform(payload)
        },
        getDetailInform (payload) {
            const { name } = payload
            return axios({
                url: `${this.licens.baseURL}/test/admin/license/${name}/detail`,
                method: 'GET',
                headers: {
                    'X-Token': this.licens.token
                }
            })
            .then ( resp => {
                this.selectedLicense = resp.data
            })
        },
        getPublicInform (payload) {
            const { name } = payload
            return axios({
                url: `${this.licens.baseURL}/test/admin/license/${name}`,
                method: 'GET',
                headers: {
                    'X-Token': this.licens.token
                }
            })
            .then ( resp => {
                this.selectedLicense = resp.data
            })
        }
    }
}
</script>
