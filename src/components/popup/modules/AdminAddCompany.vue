<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Создание организации</p>
        </template>
        <div class="popup__status">
            <div class="my-3">
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Наименование организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите наименование организации" v-model="company.name_short">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Полное наименование организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите полное наименование организации" v-model="company.name_full">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>ИНН организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="number" placeholder="Введите ИНН" v-model="company.inn">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>ОКОПФ организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="number" placeholder="Введите ОКПФ" v-model="company.okopf">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>КПП организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="number" placeholder="Введите КПП организации" v-model="company.kpp">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>ОГРН организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="number" placeholder="Введите ОГРН организации" v-model="company.ogrn">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Тип организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <v-select :options="types" v-model="company.type" @change="checkOrganizationType()"></v-select>
                            <!-- <input type="number" placeholder="Введите КПП организации" v-model="company.type"> -->
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Дата регистрации ОГРН организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="date" placeholder="Введите КПП организации" v-model="company.ogrn_data_reg">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Директор организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите ФИО директора" v-model="company.director">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Фактический адрес организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите Фактический адрес" v-model="company.physical_address">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Юредический адрес организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите Юредический адрес" v-model="company.legal_address">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Почтовый адрес и зип код организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите Почтовый адрес и зип код" v-model="company.postal_address_zip_code">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>E-mail организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="email" placeholder="Введите email" v-model="company.email">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>E-mail бухгалтера организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите E-mail бухгалтера" v-model="company.email_buh">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Часовой пояс организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите Часовой пояс" v-model="company.timezone">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Тип расчета пени организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите Тип расчета пени" v-model="company.type_peni_calculation">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Владелец организации</span>
                    </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <v-select label="id" :options="users" v-model="company.user_profile" @change="checkOrganizationType()"></v-select>
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Компания по умолчанию</span>
                    </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="checkbox" v-model="company.is_active">
                        </div>
                    </div>
                </div>
                <div class="popup__status-button">
                  <ur-btn
                      class="btn btn-primary"
                      :loading="loading"
                      @click="createCompany"
                      :disabled="disabled"
                  >
                      <span>Создать</span>
                  </ur-btn>
                </div>
            </div>
        </div>
    </popup-wrapper>
</template>
<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import { baseURL } from '@/settings/config'

export default {
    data () {
        return {
            loading: false,
            disabled: false,
            company: {
                name_short: null,
                name_full: null,
                inn: null,
                okopf: null,
                kpp: null,
                ogrn: null,
                type: null,
                ogrn_data_reg: null,
                director: null,
                physical_address: null,
                legal_address: null,
                postal_address_zip_code: null,
                email: null,
                email_buh: null,
                // signers: [],
                timezone: null,
                type_peni_calculation: null,
                is_active: false,
                user_profile: null
            },
            types:['коммерческая организация'],
            users:[]
        }
    },
     methods:{
         ...mapActions(['GetAdminCreateCompany', 'setPopupState']),
         createCompany () {
             this.loading  = true
             this.disabled = true
             this.GetAdminCreateCompany(this.company)
             this.setPopupState(false)
         }
     },
     created () {
         axios({
             method: 'GET',
             url: baseURL+'/api/account/user/',
         }).then ( res => {
             this.users = res.data
         })
     },
     mounted () {
         events.$on('CompanyWasCreated', e => {
             if (e === true) {
                 this.loading  = false
                 this.disabled = false
             }
         })
     }
}
</script>
<style lang="scss">
.popup {
    overflow: auto;
}
    .company-input {
        position: relative;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 40px;
        padding: 2px 12px;
        border-radius: 4px;
        transition: border-color .3s linear;
        input {
            width: 100%;
            height: 100%;
            color: #6f788f;
            font-size: 12px;
            font-weight: 500;
            line-height: 21px;
            border: 1px solid #eee;
            border-radius: .4rem;
            outline: none;
            text-overflow: ellipsis;
        }
    
    }
    
</style>