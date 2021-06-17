<template>
  <popup-wrapper :popupWidth="600">
    <template v-slot:header>
      <div class="align-items-center justify-content-between">
        <p class="m-0 print-modal__header">Работа с печатной формой свода начислений.</p>
      </div>
    </template>

    <template>
        <div class="px-4 pb-4">
            <div class="col-12">
                <p class="m-0 print-modal-service-type" style="padding: 12px 6px">Выбор печатной формы</p>
            </div>

            <div class="col-12 row justify-content-center">
                <div class="print__item"  @click="printSetOfCharges('print')"> 
                    <icon-base :hasStroke="false" :width="24" :height="24" iconColor="#818181" :viewBox="'0 0 20 20'">
                        <icon-eye />
                    </icon-base>
                    <span>Просмотр и печать</span>
                </div>
                
                <!-- <div class="print__item" @click="printSetOfCharges('zip')">
                    <icon-base :hasStroke="false" :width="24" :height="24" iconColor="#818181" :viewBox="'0 0 20 20'">
                        <icon-zip />
                    </icon-base>
                    <span>Сохранить в архив</span>
                </div>

                <div class="print__item" @click="printSetOfCharges('download')">
                    <icon-base :hasStroke="false" :width="32" :height="24" iconColor="#818181" :viewBox="'0 0 20 20'">
                        <icon-download2 />
                    </icon-base>
                    <span>Сохранить в <br>PDF</span>
                </div> -->

            </div>
        </div>
    </template>
  </popup-wrapper>
</template>

<script>
  import { mapGetters } from 'vuex'
  import cloneDeep from 'lodash/cloneDeep';
  /**
   * Вообще эту модалку нужно сделать универсальной для всех видов одиночной печати
   * @todo Модернизировать модальное окно
   */
  export default {
    props: {
      params: {
        type: [ Object, Array ],
        default: () => {},
      }
    },
    methods: {
      /**
       * Печать Свод начислений по ЛС
       */
      async printSetOfCharges(format) {
        let companyId = localStorage.getItem('defaultCompany')
        this.$toast.open({
          message: `Формирование свода начислений ...`,
                  type: 'warning',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
        })
        let debtorArr = this.params.checkedDebtors.map( debt => debt.debtor.pk )
        this.$http({
          command: '/constructor/render',
          method: 'POST',
          data: {
            company_id: companyId,
            production_type: 'judicial',
            template_type_id: 3,
            debtor_ids: debtorArr
          }
        })
        .then (resp => {
         // не совсем понял зачем условие на 50 и более должников на печать если все равно выводим всех
         
        if (this.params.checkedDebtors.length <= 50) {
           this.$toast.open({
            message: `Свод начилений готов!`,
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
        })
          setTimeout(() => {
          window.open(resp.document.file, '_blank')
          }, 1000)
        } else {
           this.$toast.open({
            message: `Свод начилений готов и отправлен вам на почту!`,
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
        })
          window.open(resp.document.file, '_blank')
        }
        
          console.log(resp)
        })
        console.log(this.params.checkedDebtors.id)
        
      },
    },
    computed: {
      ...mapGetters('statementsJudical', ['services']),
      ...mapGetters(['getDefaultCompany']),
      /**
       * Список документов на печать
       */
      documentsList: {
        get() {
          return this.$store.getters['statementsJudical/documentsList'];
        },
        set(value) {
          this.$store.commit('statementsJudical/setDocumentsOrder', value);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .print-modal__header {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: #5e6476;
  }
  .print-modal-service-type {
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    color: #5e6476;
  }
</style>