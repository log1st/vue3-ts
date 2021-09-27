<template>
    <div class="adress__error-wrapper">
        <div class="main-container__head">
            <div class="main-container__title adress__previous-div">Список адресов</div>
            <div class="adress__error-tabs">
                <div class="adress__error-tab" :class="{'active-tab': !!selectedFileList && (selectedFileList.id === tab.id) ? true : false}" v-for="(tab, index) in adressFileList" :key="index">
                    <div class="adress__error-tab__name" @click="selectedFileList = tab, getList()"> {{tab.filename}}</div>
                    <div class="adress__error-tab__close" @click="validationDelete({item: tab})">X</div> 
                </div>
            </div>
        </div>
        <hr>

        <div class="admin-adress__wrapper-table">
            <div class="admin-adress_add-btn">
                <label
                for="update-file1"
                class="btn btn-primary"
                >
                    Загрузить файл
                </label>
                <input style="display: none"
                ref="fileInput"
                multiple
                @change="uploadFile($event)" 
                type="file" 
                id="update-file1"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">

                <div class="admin-adress_select-wrapper">
                    <!-- Этот селект ранее использовался для выбора файла -->
                    <!-- <v-select
                        :options="adressFileList"
                        placeholder="Выберите один из загруженных файлов"
                        label="filename"
                        @input="getList()"
                        v-model="selectedFileList"
                    >
                    </v-select> -->
                </div>

                <div class="title__select-number">
                Выберите регион: 
                </div>
                <div class="admin-adress_select-wrapper">
                    <v-select
                        :options="regionsList"
                        autocomplete
                        placeholder="Выберите регион"
                        label="name"
                        v-model="selectedRegion"
                    >
                    </v-select>
                </div>


            </div>
            <div style="padding: 0 1em">
                <hr>
            </div>
            <div class="admin-adress__supbtn-wrapper">
                <ur-btn
                class="btn btn-primary"
                :loading="loading"
                :disabled="disabled"
                @click="validationFileStandartization()"
                >
                    Повторная страндартизация файла
                </ur-btn>
            </div>
            <div style="padding: 0 1em">
                <hr>
            </div>
            <div class="table__adress">
                <div class="table__adress-head">
                    <div></div>
                    <div>Исходный адрес</div>
                    <div>Альтернативный</div>
                    <div>Мировая подсудность</div>
                    <div>Районная подсудность</div>
                    <div>ФССП</div>
                    <div>Дадата</div>
                    <div>Статус</div>
                </div>
                <div class="table__adres-rows-wrapper">
                    <div class="table__adress-rows" v-for="(item, index) in adressList" :key="index">
                        <div class="table__adress-row" @click='checkedAdress({index, item})'>
                            <checkBox :checked="item.checked"></checkBox>
                        </div>
                        <div class="table__adress-row">
                            {{item.result.result}}
                        </div>
                        <div class="table__adress-row">
                            {{item.alternames[0] || 'Нет данных'}}
                        </div>
                        <div class="table__adress-row">
                            {{ courtName({name: item.result.court_name, courtType: 'court_name'}) }}
                        </div>
                        <div class="table__adress-row">
                            {{ courtName({name: item.result.district_court_name, courtType: 'district_court_name'}) }}                        
                        </div>
                        <div class="table__adress-row">
                            {{ fsspData (item.result.bailiff) }}
                        </div>
                        <div class="table__adress-row">
                            {{ !!item.result.country_iso_code ? 'Используется' : 'Не используется' }}
                        </div>
                        <div class="table__adress-row btn__adress-status">
                            <span class="status__adress" v-bind:class="{'on-error': statusItem.errorStatus, 'on-success': statusItem.status}"   title="Статус адреса">
                                {{ adressStatus(item.status) }}
                            </span>
                            <button class="btn__adress-status-item access" @click="setStatusAdress({status: true,item: { id: item.id, id_file: item.id_file, data: item.result } })">
                                <icon-base width="20" height="20" viewBox="0 0 384.97 384.97" iconColor="#848aa1">
                                  <icon-accept />
                                </icon-base>
                            </button>
                            <button class="btn__adress-status-item decline" @click="setStatusAdress({status: false,item: { id: item.id, id_file: item.id_file, data: item.result } })">
                                <icon-base width="20" height="20" viewBox="0 0 511.995 511.995" iconColor="#848aa1">
                                  <icon-decline />
                                </icon-base>
                            </button>
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
import './static.scss'
import checkBox from '@/components/elements/CheckBox'

export default {
    components: {
        checkBox
    },
    data () {
        return {
            selectedFileList: undefined,
            adressList: [],
            loading: false,
            disabled: false,
            standUrl: 'https://stand.api-asj.urrobot.net',
            standUrlDev: 'https://stand.api-asj-test.urrobot.net',
            statusItem: {
                title:'Н/Д',
                status: false,
                errorStatus: false
            },
            selectedRegion: undefined,
            activePack: false
        }
    },
    computed: {
        ...mapGetters([
            'regionsList', 
            'adressFileList',
            'fsspList'
            ]),

        adressStatus () {
            return payload => {
                let result;
                if (payload === 1) {
                    result = "Ошибка"
                } else if (payload === 0) {
                    result = "Верный"
                } else if (payload === 2) {
                    result = "Установлено Альт.имя"
                } else {
                    result = 'Н/Д'
                }
                return result
            }
        },

        fsspData () {
           return payload => {
               if (payload?.name) {
                    return payload.name
                } else {
                    return "Нет данных"
                }
           }
        },

        courtName () {
            return payload => {
                const { name, courtType } = payload
                if (!!!name) {
                    return courtType === 'court_name' ? 'Мир.суд не назначен' : 'Район.суд не назначен' 
                } else {
                    return name
                }
            }
        }
    },

    created () {
        this.getAdressFileLists()
        .then( resp => {
            if (resp.items.length > 0) {
            this.selectedFileList = resp.items[0]
            this.getUploadedData({id:this.selectedFileList.id})
            this.getFSSP({regionCode: this.selectedFileList.region_code})
            }
        })
        .catch( err => this.$toast.open({message: 'Загрузите файл!', type: 'warning'}))
        this.getRegionsList()
    },

    mounted () {
        events.$on('reloadPackData', () => {
            if (this.activePack) {
                this.getUploadedData({id: this.activePack})
            }
        })
    },

    methods:{
        ...mapActions([
        'getFSSP',
        'setPopupComponent', 
        'toBase64',
        'getRegionsList',
        'getAdressFileLists'
        ]),

        checkedAdress ({index, item}) {
            this.adressList[index].checked = !this.adressList[index].checked
        },

        getAdressList () {
            this.loading = true
            this.axios({
                url: `${this.standUrl}/standardize`,
                method: 'GET',
            }).then(res => {
                this.list = res.result
                console.log(res)
                this.loading = false
            })
        },

        getList () {
            this.getUploadedData({id:this.selectedFileList.id})
        },

        setStatusAdress (payload) {
            const { status, item } = payload
            if (status) {
                this.statusItem.title = 'Верно'
                this.acceptAdress({item: item})
            } else {
                this.statusItem.title = 'Ошибка'
                this.setPopupComponent({component: "AdminSetErrorAdress", params: { item: item}})
            }
        },

        getUploadedData ({id}) {
            this.activePack = id
            this.lodaing = true
            this.disabled = true
            return axios({
                url: `${this.standUrlDev}​/addresses/pack/${id}`,
                method: 'GET',
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'  //Токен всегда один ...
                },
            })
            .then( resp => {
                this.$toast.open({
                    message: 'Файл подгружен!',
                    type: 'success',
                    position: 'top-right'
                })
                let resultArray = resp.data.map( (item) => {
                   return {
                        id: item.id,
                        id_file: item.id_file,
                        id_record: item.id_record,
                        result: item.result,
                        source: item.source,
                        status: item.status,
                        alternames: item.alternames,
                        checked: false
                   }
                 })
                resultArray.sort((a, b) => {
                    a.source.localeCompare(b.source)
                    })
                this.adressList = resultArray
                this.lodaing = false
                this.disabled = false
            })
            .catch( err => {
                this.lodaing = false
                this.disabled = false
            })
        },

        validationUpload () {
            return new Promise ((res, rej) => {
                if (!!!this.selectedRegion) {
                    rej({msg: 'Регион не выбран', item: this.selectedRegion, status: false})
                    this.$refs.fileInput.type = ''
                    this.$refs.fileInput.type = 'file'

                } else {
                    res({msg: 'Регион не выбран', item: this.selectedRegion, status: true})
                }
            })
        },

        validationDelete (payload) {
            const {item} = payload
            this.setPopupComponent({component: 'confirm',
                params: {
                  title: `Вы уверены что хотите удалить файл ${item.filename}?`,
                  btnConfirm: 'Подтвердить',
                  btnCancel: 'Отмена',
                  action: this.deleteFile,
                  data: payload
                }}) 
        },

        deleteFile (payload) {
            const { item } = payload
            console.log(item)
            axios({
                url: `${this.standUrlDev}/addresses/pack/${item.id}`,
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'  //Токен всегда один ...
                },
                method: 'DELETE'
            })
            .then( resp => {
                this.getAdressFileLists()
                this.$toast.open({
                     message: 'Файл удален!',
                     type: 'success'
                })
            })
            .catch( err => {
                this.getAdressFileLists()
                this.$toast.open({
                     message: err,
                     type: 'error'
                })
            })
        },

        validationFileStandartization () {
            if (!!this.selectedFileList) {
                this.reStandartization()
            } else {
                this.$toast.open({
                    message: 'Выберите файл что бы запустить стандартизацию',
                    type: 'warning'
                })
            }
        },

        acceptAdress ({item}) {
            axios({
                url: `${this.standUrlDev}​/address_reference`,
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'  //Токен всегда один ...
                },
                method: 'POST',
                data: {
                    adr_id: item.id,
                    adr_file: item.id_file,
                    status: 0
                }
            })
            .then ( resp => {
                this.getUploadedData({id: this.activePack})
            })
            .catch( err => {
                console.log(err)
            })
        },

        reStandartization () {
            this.loading = true
            this.disabled = true
            axios({
                url: `${this.standUrlDev}/addresses/pack/${this.selectedFileList.id}/recalculate`,
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'  //Токен всегда один ...
                },
                method: 'PATCH',
            }).then( resp => {
                this.loading = false
                this.disabled = false
                this.$toast.open({
                    message: 'Стнадратизация прошла успешно',
                    type: 'success'
                })
            })
            .catch( err => {
                this.loading = false
                this.disabled = false
                this.$toast.open({
                    message: err,
                    type: 'error'
                })
            })
        },

        uploadFile (event) {
        this.validationUpload ()
        .then (async resp => {
            this.$toast.open({
                message: `Файл грузиться на сервер`,
                position: 'top-right',
                type: 'warning'
            })
            this.loading = true
            this.disabled = true
            let user = localStorage.getItem('user')
            user = JSON.parse(user)
            let files = event.target.files
            let filesArray = new Array
            let file = undefined
            let toReplace = 'data:application/octet-stream;base64,'
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    file = await this.toBase64(files[i])
                    file = file.replace(new RegExp('\\b' + toReplace + '\\b', 'g'), '');
                    filesArray.push({ content: file, name: files[i].name, user_id: user.id, region_code: this.selectedRegion.code})
                }
            }
            
            await axios({
                url: `${this.standUrlDev}/datafile/upload`,
                method: 'POST',
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'  //Токен всегда один ...
                },
                data: {
                    files: filesArray,
                }
            })
            .then ( resp => {
                this.getAdressFileLists()
                this.$toast.open({
                    message: 'Документ загружен',
                    position: 'top-right',
                    type: 'success'
                })
                this.loading = false
                this.disabled = false
                this.getUploadedData({id: resp.data.file_id})
            })
        })
        .catch( err => {
            this.loading = false
            this.disabled = false
            this.$toast.open({
                message: `${err.msg}`,
                position: 'top-right',
                type: 'error'
            })
        })
        }
    }
}
</script>
