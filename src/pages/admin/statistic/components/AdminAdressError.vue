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
            </div>
            <div class="table__adress">
                <div class="table__adress-head">
                    <div>Исходный адрес</div>
                    <div>Стандартизированный</div>
                    <div>Мировая подсудность</div>
                    <div>Районная подсудность</div>
                    <div>Использовалась ли Дадата</div>
                    <div>Статус</div>
                </div>
                <div class="table__adres-rows-wrapper">
                    <div class="table__adress-rows" v-for="(item, index) in list" :key="index">
                        <div class="table__adress-row">
                            Тестовый адрес Х
                        </div>
                        <div class="table__adress-row">
                            Тестовый адрес А
                        </div>
                        <div class="table__adress-row">
                            Тест
                        </div>
                        <div class="table__adress-row">
                            Тест 2
                        </div>
                        <div class="table__adress-row">
                            Нет
                        </div>
                        <div class="table__adress-row btn__adress-status">
                            <span class="status__adress" v-bind:class="{'on-error': statusItem.errorStatus, 'on-success': statusItem.status}"   title="Статус адреса">
                                {{statusItem.title}}
                            </span>
                            <button class="btn__adress-status-item access" @click="setStatusAdress({status: true,item: { id: 1, title: 'Тестовый адрес Х', court: 'Данные мир суда', court_local: 'Данные районого суда и тд' } })">
                                <icon-base width="20" height="20" viewBox="0 0 384.97 384.97" iconColor="#848aa1">
                                  <icon-accept />
                                </icon-base>
                            </button>
                            <button class="btn__adress-status-item decline" @click="setStatusAdress({status: false,item: { id: 1, title: 'Тестовый адрес Х', court: 'Данные мир суда', court_local: 'Данные районого суда и тд' } })">
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
import { mapActions } from 'vuex'
import axios from 'axios'

export default {
    data () {
        return {
            list: [
                {
                  "fias_level": 0,
                  "region": "string",
                  "region_type": "string",
                  "region_with_type": "string",
                  "region_fias_id": "string",
                  "region_code": "string",
                  "okrug": "string",
                  "okrug_type": "string",
                  "okrug_with_type": "string",
                  "okrug_fias_id": 0,
                  "area": "string",
                  "area_type": "string",
                  "area_with_type": "string",
                  "area_fias_id": "string",
                  "MO": "string",
                  "MO_type": "string",
                  "city": "string",
                  "city_type": "string",
                  "city_with_type": "string",
                  "city_fias_id": "string",
                  "inner_settlement": "string",
                  "inner_settlement_type": "string",
                  "inner_settlement_with_type": "string",
                  "inner_settlement_fias_id": "string",
                  "settlement": "string",
                  "settlement_type": "string",
                  "settlement_with_type": "string",
                  "settlement_fias_id": "string",
                  "plan_struct": "string",
                  "plan_struct_type": "string",
                  "plan_struct_with_type": "string",
                  "plan_struct_fias_id": "string",
                  "street": "string",
                  "street_type": "string",
                  "street_with_type": "string",
                  "street_fias_id": "string",
                  "court_link": "string",
                  "court_link_msudrf": "string",
                  "source": "string",
                  "result": "string",
                  "postal_code": "string",
                  "okato": "string",
                  "oktmo": "string",
                  "aoguid": "string",
                  "ifns_ul": "string",
                  "district_court": "string",
                  "house": "string",
                  "block": "string",
                  "block_type": "string",
                  "flat": 0,
                  "is_suggested_house": true,
                  "mirsud_court_reqs": {
                    "id": 0,
                    "parsed_date": "string",
                    "Name": "doggie",
                    "EmailCourt": "string",
                    "Address": "string",
                    "duty_url": "string",
                    "AssistantJusticeOfThePeace": "string",
                    "BIC": "string",
                    "FullRegion": "string",
                    "HeadOfTheOffice": "string",
                    "INN": "string",
                    "KBK": "string",
                    "KPP": "string",
                    "Magistrate": "string",
                    "NamePaymentRecipient": "string",
                    "NameRecipientBank": "string",
                    "OKTMO": "string",
                    "RecipientAaccountNumber": "string",
                    "Secretary": "string"
                  },
                  "district_court_reqs": {
                    "id": 0,
                    "parsed_date": "string",
                    "Name": "doggie",
                    "EmailCourt": "string",
                    "Address": "string",
                    "duty_url": "string",
                    "AssistantJusticeOfThePeace": "string",
                    "BIC": "string",
                    "FullRegion": "string",
                    "HeadOfTheOffice": "string",
                    "INN": "string",
                    "KBK": "string",
                    "KPP": "string",
                    "Magistrate": "string",
                    "NamePaymentRecipient": "string",
                    "NameRecipientBank": "string",
                    "OKTMO": "string",
                    "RecipientAaccountNumber": "string",
                    "Secretary": "string",
                    "district_judges": [
                      {
                        "id": 0,
                        "court_id": 0,
                        "fio": "string"
                      }
                    ]
                  }
                }
            ],
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
    mounted () {
        // this.$nextTick(this.getAdressList())
    },
    
    methods:{
        ...mapActions([ 
        'setPopupComponent', 
        'toBase64'
        ]),
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
      async uploadFile (event) {
            let files = event.target.files
            let filesArray = new Array
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    filesArray.push({ content: await this.toBase64(files[i]), name: files[i].name })
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
            })
        }
    }
}
</script>
<style lang="scss">
    $accessGreen: rgba(70, 233, 78, 0.726);
    $declineRed: rgba(233, 70, 70, 0.726);

    .btn__adress-status {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        &-item {
            cursor: pointer;
            border: none;
            background: transparent;
            border-radius: 0.4rem;
            transition: all .4s ease-in-out;

            svg > g {
                fill: #ffff;
            }
            &.access {
                margin: 0 0.2em;
                padding: 0.5em;
                background-color: $accessGreen;

                &:hover {
                    background-color: darken($accessGreen, 15%);
                }
            }

            &.decline {
                margin: 0 0.2em;
                padding: 0.5em;
                background-color: $declineRed;
                &:hover {
                    background-color: darken($declineRed, 15%);
                }
            }
        }

    }
    .table__adres-rows-wrapper {
        max-height: 500px;
        overflow-y: auto;
    }
    .table__adress-rows {
        padding: 1em 22px;
        max-height: 10em;
        overflow-y: auto;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 0.5fr 0.5fr 0.5fr;
    }
    .table__adress-row {
        display: flex;
        align-items: center;

        .status__adress {
            min-width: 90px;

            &.on-error {
                font-weight: bold;
                color: $declineRed;
            }

            &.on-success {
                font-weight: bold;
                color: darken($accessGreen, 20%);
            }
        }
    }
    .table__adress-head {
        padding: 1em 22px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 0.5fr 0.5fr 0.5fr;
        border-bottom: 0.5px solid #f2f6fc;
        div {
            color: #5e6476;
            font-weight: bold;
        }
    }
    .admin {
        &-adress {
            &_add-btn {
                padding: 0 14px;
            }
        }
    }
</style>