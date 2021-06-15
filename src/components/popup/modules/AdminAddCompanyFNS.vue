<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Создание организации</p>
        </template>
            <div class="popup__status">
                <div class="my-3">
                    <div class="compib__row" title="По ИННу будет произведено добавление и сбор данных о организации">
                        <div class="compib__row-label">
                            <span>ИНН организации</span>
                        </div>
                        <div class="compib__input">
                            <div class="company-input">
                                <input type="text" placeholder="Введите наименование организации" v-model="company.inn">
                            </div>
                        </div>
                    </div>
                    <div class="compib__row">
                        <div class="compib__row-label">
                            <span>Владелец организации</span>
                        </div>
                        <div class="compib__input" style="height: 36px; width: 100%">
                            <div class="search-input">
                                <v-select label="id" :options="users" v-model="company.user_profile" @change="checkOrganizationType()"></v-select>
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
import { baseURL } from '@/settings/config'

export default {
    data () 
    {
        return {
            company: {
                inn: '',
                user_profile: ''
            },
            users: []
        }
    },
    
    methods: {
        ...mapActions(['getAdminCreateCompanyFNS']),
        // TODO: Сделать функцию отправки данных орнагизации на фнс (нужны тесты)
        createCompany () {
            const data = {
                id: this.company.user_profile.id,
                inn: this.company.inn
            }
            this.getAdminCreateCompanyFNS(data)
        }
    },
    created () {
        axios({
             method: 'GET',
             url: baseURL+'/api/account/user/',
         }).then ( res => {
             this.users = res.data
         })
    }
}
</script>