<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Добавление приложения</p>
        </template>
        <div class="popup__status">
            <div class="my-3">
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Наименование приложения</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите наименование" v-model="attachment.name">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Модуль приложения</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <!-- <input type="text" placeholder="Введите наименование" v-model="attachment.name"> -->
                            <v-select :options="modules" placeholder="Выберите модуль приложения" label="title" v-model="attachment.module"></v-select>
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Файл приложения - загрузить</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="file" placeholder="Введите наименование" @change="setAttchmentFile($event)">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Файл приложения - выбрать</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <v-select :options="documents" label="name" v-model="attachment.file"></v-select>
                            <!-- <input type="file" placeholder="Введите наименование" @change="setAttchmentFile($event)"> -->
                        </div>
                    </div>
                </div>
                <div class="popup__status-button">
                  <ur-btn
                      class="btn btn-primary"
                      :loading="loading"
                      @click="createAttachment"
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

export default {
    props: {
        params: {
            type: Object
        }
    },
    data () {
        return {
            loading: false,
            disabled: false,

            attachment: {
                module: '',
                name: '',
                file: '',
                mode: 'user',
            },
            modules:[
                {
                    name: 'pretrial',
                    title: 'Досудебный модуль'
                },
                {
                    name: 'judicial',
                    title: 'Судебный модуль'
                },
                {
                    name: 'executive',
                    title: 'Исполнительный модуль'
                },
            ]
        }
    },

    methods: {
        ...mapActions(['toBase64', 'addCompanyAttachment', '']),
        async setAttchmentFile ( e ) {
            console.log(e)
            let file = await this.toBase64(e.target.files[0])

            this.attachment.file = file
        },
        createAttachment () {
            this.loading = true
            this.disabled = true
            this.addCompanyAttachment({attachment: this.attachment})
            .then( result => {
                this.loading = false
                this.disabled = false
            })
            .catch( err => {
                this.loading = false
                this.disabled = false
            })
        }
    }
}
</script>