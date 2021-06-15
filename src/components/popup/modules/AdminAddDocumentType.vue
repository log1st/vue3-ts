<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Создание нового типа документа</p>
        </template>
        <div class="popup__status">
            <div class="my-3">
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Наименование типа документа (использовать латиницу без пробелов)</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите наименование типа" v-model="docType.name">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span title="Поле отвечает за вывод наименования именно для человека">Описание типа документа</span>
                    </div>
                    <div class="compib__input">
                        <div class="company-input">
                            <input type="text" placeholder="Введите описание типа" v-model="docType.description">
                        </div>
                    </div>
                </div>
            </div>
            <div class="popup__status-button">
                  <ur-btn
                      class="btn btn-primary"
                      :loading="loading"
                      @click="createDocType"
                      :disabled="disabled"
                  >
                      <span>Создать</span>
                  </ur-btn>
                </div>
        </div>
    </popup-wrapper>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    data () {
        return {
            loading: false,
            disabled: false,

            docType: {
                name: '',
                description: ''
            }
        }
    },
    methods: {
        ...mapActions(['createDocumentType']),

        validationForm () {
            return new Promise ((resolve, reject) => {
                if (this.docType.name === '') {
                    reject({status: false, msg: 'наименование'})
                } else if (this.docType.description === '') {
                    reject({status: false, msg: 'описание'})
                } else {
                    resolve({status: true})
                }
            })
        },

        /**
        * Создание типа документа
        */
        createDocType () {
            this.loading = true
            this.disabled = true
            this.validationForm()
            .then( a => {
                if (a.status) {
                    this.createDocumentType(this.docType)
                    .then( result => {
                        if (result) {
                            this.$toast.open({
                                message: `Тип документа создан`,
                                type: 'success',
                                duration: 5000,
                                dismissible: true,
                                position: 'top-right'
                            })
                        }
                        this.loading = false
                        this.disabled = false
                    }) 
                }
            })
            .catch(err => {
                this.$toast.open({
                    message: `Поле ${err.msg} обязательно к заполнению`,
                    type: 'warning',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                })
                this.loading = false
                this.disabled = false
            })
        }
    }
}
</script>