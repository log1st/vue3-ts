<template>
    <div class="adress__error-wrapper">
        <div class="main-container__head">
            <div class="main-container__title">Список адресов</div>
        </div>
        
        <div class="admin-adress__wrapper-table">
            <div class="admin-adress_add-btn">
                <label
                for="update-file1"
                class="btn btn-primary"
                >
                    Загрузить файл
                </label>
                <input style="display: none"
                multiple
                @change="uploadFile($event)" 
                type="file" 
                id="update-file1"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">

                <v-select
                    :options="adressFileList"
                    placeholder="Выберите один из загруженных файлов"
                    label="filename"
                    @input="getList()"
                    v-model="selectedFileList"
                >
                </v-select>
            </div>
            <div style="padding: 0 1em">
                <hr>
            </div>
            <!-- <div class="btn btn-primary" @click="getUploadedData({id: 33})">
                Получить данные
            </div> -->
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
                            
                        </div>
                        <div class="table__adress-row">
                            Нет
                        </div>
                        <div class="table__adress-row">
                            Нет
                        </div>
                        <div class="table__adress-row">
                            {{ fsspData (item.result.baliff) }}
                        </div>
                        <div class="table__adress-row">
                            Нет
                        </div>
                        <div class="table__adress-row btn__adress-status">
                            <span class="status__adress" v-bind:class="{'on-error': statusItem.errorStatus, 'on-success': statusItem.status}"   title="Статус адреса">
                                {{ adressStatus(item.status) }}
                            </span>
                            <button class="btn__adress-status-item access" @click="setStatusAdress({status: true,item: { id: item.id, data: item.result } })">
                                <icon-base width="20" height="20" viewBox="0 0 384.97 384.97" iconColor="#848aa1">
                                  <icon-accept />
                                </icon-base>
                            </button>
                            <button class="btn__adress-status-item decline" @click="setStatusAdress({status: false,item: { id: item.id, data: item.result } })">
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
            standUrl: 'https://stand.api-asj.urrobot.net',
            standUrlDev: 'https://stand.api-asj-test.urrobot.net',
            statusItem: {
                title:'Н/Д',
                status: false,
                errorStatus: false
                }
        }
    },
    computed: {
        ...mapGetters(['adressFileList']),

        adressStatus () {
            return payload => {
                let result;
                if (payload === 1) {
                    result = "Верный"
                } else if (payload === 0) {
                    result = "Ошибка"
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
        }
    },

    created () {
        this.getAdressFileLists()
    },

    methods:{
        ...mapActions([ 
        'setPopupComponent', 
        'toBase64',
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
            // console.log(this.selectedFileList)
            this.getUploadedData({id:this.selectedFileList.id})
        },

        setStatusAdress (payload) {
            const { status, item } = payload
            if (status) {
                this.statusItem.title = 'Верно'
                this.statusItem.status = true
            } else {
                this.statusItem.title = 'Ошибка'
                this.statusItem.status = false
                this.statusItem.errorStatus = true
                this.setPopupComponent({component: "AdminSetErrorAdress", params: { item: item}})
            }
        },

        getUploadedData ({id}) {
            return axios({
                url: `${this.standUrlDev}​/addresses/pack/${id}`,
                method: 'GET',
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'  //Токен всегда один ...
                },
            })
            .then( resp => {
                let resultArray = resp.data.map( (item) => {
                   return {
                        id: item.id,
                        id_file: item.id_file,
                        id_record: item.id_record,
                        result: item.result,
                        source: item.source,
                        status: item.status,
                        checked: false
                   }
                 })
                this.adressList = resultArray
            })
        },

      async uploadFile (event) {
            let files = event.target.files
            let filesArray = new Array
            let file = undefined
            let toReplace = 'data:application/octet-stream;base64,'
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    file = await this.toBase64(files[i])
                    file = file.replace(new RegExp('\\b' + toReplace + '\\b', 'g'), '');
                    filesArray.push({ content: file, name: files[i].name })
                }
            }
            await axios({
                url: `${this.standUrlDev}/datafile/upload`,
                method: 'POST',
                headers: {
                    Authorization: 'Bearer dar5byv3avE3UpBy'  //Токен всегда один ...
                },
                data: {
                    files: filesArray
                }
            })
            .then ( resp => {
                console.log(resp)
                this.$toast.open({
                    message: 'Документ загружен',
                    type: 'success'
                })
                this.getUploadedData({id: resp.data.file_id})
            })
        }
    }
}
</script>
