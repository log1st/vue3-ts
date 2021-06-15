<template>
    <div class="delete__data-wrapper d-data__content-row">
        <ur-btn
            class="btn btn-red"
            :loading="loading"
            @click="deleteCourtsData"
            :disabled="disabled"
        >
            <span>Удалить все судебные участки</span>
        </ur-btn>
        <ur-btn
            class="btn btn-red"
            :loading="loading"
            @click="deleteDebtorsAdressData"
            :disabled="disabled"
        >
            <span>Удалить все адреса должников</span>
        </ur-btn>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    data() {
        return {
            loading: false,
            disabled: false
        }
    },
    methods:{
      ...mapActions(['setPopupComponent', 'openPopup']),
            /**
             * Удаление судебных участков 
             */ 
            deleteCourtsData (bool) {
                this.loading = true
                this.disabled = true
                this.setPopupComponent({
                  component: 'QuestionPopup',
                  params: {
                    title: 'Внимание!',
                    description:'Вы уверене что хотите удалить все судебные участки? \n При удалении данные нельзя будет восстановить!',
                    comand: 'AdminRebuttingCourtSectionsDatabase'
                  }
                })
                if (bool == true) {
                this.$http({
                  data:{
                    comand: 'AdminRebuttingCourtSectionsDatabase',
                  }
                }).then(res => {
                    this.loading = false
                    this.disabled = false
                    console.log(res)
                  })
                }
            },

            /**
             * Удаление адресов задолжников
             */
             deleteDebtorsAdressData (bool) {
                this.loading = true
                this.disabled = true
                this.setPopupComponent({
                  component: 'QuestionPopup',
                  params: {
                    title: 'Внимание!',
                    description:'Вы уверене что хотите удалить все сохраненные адреса должников? \n При удалении данные нельзя будет восстановить!',
                    comand: 'AdminRebuttingDebtorsAddresses'
                  }
                })
                if (bool == true) {
                this.$http({
                  data:{
                    comand: 'AdminRebuttingDebtorsAddresses',
                  }
                }).then(res => {
                    this.loading = false
                    this.disabled = false
                    console.log(res)
                  })
                }
            }

    },
    mounted() {
        events.$on('popup_answer', data => {
      if (data.answer === true && data.question == 'AdminRebuttingCourtSectionsDatabase' ) {
        this.deleteCourtsData(data.answer)
        this.loading = false
        this.disabled = false 
      } else if (data.answer === true && data.question == 'AdminRebuttingDebtorsAddresses') {
        this.deleteDebtorsAdressData(data.answer)
        this.loading = false
        this.disabled = false
      } else if (!data.answer){
        this.loading = false
        this.disabled = false 
      }
    })
    },
}
</script>