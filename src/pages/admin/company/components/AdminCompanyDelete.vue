<template>
    <div>
        <div class="main-container__head">
            <div class="main-container__title">Удаление</div>
        </div>
        <div class="delete__csv-wrapper d-data__content-row">
            <ur-btn
                class="btn btn-red"
                :loading="loading"
                @click="validationPopup({type: 2})"
                :disabled="disabled"
                >
                <span>Удалить организацию</span>
            </ur-btn>
            </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    props: {
        selectedCompany: {
            type: Object,
        }
    },
    data () {
        return {
            loading: false,
            disabled: false,

            deleteTypes: [
                {
                    description: 'Вы уверене что хотите удалить все csv документы пользователя? \n При удалении данные нельзя будет восстановить!',
                    comand: 'DeleteAllCsvDebtorFiles'
                },
                {
                    description:'Вы уверене что хотите удалить все приложения должников? \n При удалении данные нельзя будет восстановить!',
                    comand: 'AdminDeleteAllApplication'
                },
                {
                    description: 'Вы уверене что хотите удалить организацию? \n При удалении данные нельзя будет восстановить!',
                    comand: 'DeleteCompany'
                }
            ]

        }
    },
    mounted () {
        events.$on('popup_answer', data => {
      if (data.answer === true && data.question == 'DeleteAllCsvDebtorFiles' ) {
        this.deleteDocuments(data.answer)
        this.loading = false
        this.disabled = false 
      } else if (data.answer === true && data.question == 'AdminDeleteAllApplication') {
        this.deleteDebtorsApplications(data.answer)
        this.loading = false
        this.disabled = false
      } else if (data.answer === true && data.question == 'DeleteCompany') {
        this.deleteCompany(data.answer)
        this.loading = false
        this.disabled = false
      } else if (!data.answer){
        this.loading = false
        this.disabled = false 
      }
    })
    },
    methods: {
        ...mapActions(['setPopupComponent', 'openPopup']),
        validationPopup ( {type} ) {

            this.setPopupComponent({
            component: 'QuestionPopup',
            params: {
                title: 'Внимание!',
                ...this.deleteTypes[type]
            }
          })
        },
         /**
         * Удаление всех csv файлов у пользователя (расчет пени)
         * @param {Boolean} bool ответ пользователя на проверку действий по удалению документов
         */
        deleteDocuments (bool) {
          this.loading = true
          this.disabled = true
          
          if (bool == true) {
            this.$http({
            data:{
              comand: 'DeleteAllCsvDebtorFiles',
              PhoneUser:this.selectedCompany.Phone, 
              EmailUser:this.selectedCompany.Email,
            }
          }).then(res => {
              this.loading = false
              this.disabled = false
              console.log(res)
            })
          }
        },

        /**
         * Удаление всех приложений* задолжника
         * @param {Boolean} bool ответ пользователя на проверку действий по удалению приложений
         */
        deleteDebtorsApplications (bool) {
          this.loading = true
          this.disabled = true
        if (bool == true) {
          this.$http({
            data:{
              comand: 'AdminDeleteAllApplication',
              PhoneUser:this.selectedCompany.Phone, 
              EmailUser:this.selectedCompany.Email,
            }
          }).then(res => {
              this.loading = false
              this.disabled = false
              console.log(res)
            })
          }
        },

        /**
         * Удаление компании
         * @param {Boolean} bool ответ пользователя на проверку действий по удалению компании
         */
        deleteCompany (bool) {
        this.loading = true
        this.disabled = true
        if (bool == true) {

          this.$http({
            method: 'DELETE',
            command: `/api/account/company/${this.selectedCompany.id}/`
          })
          .then ( res => {
            this.loading = false
            this.disabled = false
            console.log(res)
          })

        }
        },
    }
}
</script>