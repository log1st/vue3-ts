<template>
  <div class="print-modal" v-show="value" @click="outsideClickListener($event, false)">
    <div class="print-modal__inner" @click="outsideClickListener($event, true)">
      <div class="print">
        <div class="print__head">
          <span>Работа с печатной формой</span>
          <div @click="closeHandler" >
            <i class="material-icons" style="color: #8c8ea2; cursor: pointer">close</i>
          </div>
        </div>
        <div class="print__body">
          <div class="row">
         
          <div class="col-12">
            <p class="m-0 print-modal-service-type" style="padding: 12px 6px">1 Выбор печатной формы</p>
          </div>

            <div class="col-12 row justify-content-center">

                <div class="print__item"  @click="printDocument('print','open')">
                    <icon-base :hasStroke="false" :width="24" :height="24" iconColor="#818181" :viewBox="'0 0 20 20'">
                        <icon-eye />
                    </icon-base>
                    <span>Просмотр и печать</span>
                </div>
                
                <div class="print__item" @click="printDocument('print','zip')">
                    <icon-base :hasStroke="false" :width="24" :height="24" iconColor="#818181" :viewBox="'0 0 20 20'">
                        <icon-zip />
                    </icon-base>
                    <span>Сохранить в архив</span>
                </div>

                <div class="print__item" @click="printDocument('print','download')">
                    <icon-base :hasStroke="false" :width="32" :height="24" iconColor="#818181" :viewBox="'0 0 20 20'">
                        <icon-download2 />
                    </icon-base>
                    <span>Сохранить в <br>PDF</span>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: Boolean,
      /**
       * Список кнопок
       */
      items: {
        type: Array,
      }
    },
  
    methods: {
      printDocument(e, format) {
        this.$emit(e, format); 
      },
      /**
       * Закрыть модальное окно
       */
      closeHandler () {
        this.$emit('input', false);
      },
      outsideClickListener (event, status) {
      //  console.log(event, status)
       let element
        if (event.srcElement.className == "print-modal") {
        this.closeHandler(); 
        this.removeClickListener(); 
        }
      document.addEventListener('click', this.outsideClickListener)
      },
      removeClickListener() {
          document.removeEventListener('click', this.outsideClickListener)
      },
    },
    data() {
      return {
          //
      }
    }
  }
</script>

<style lang="scss">
  .expanded-period-icon {
    cursor: pointer;
    background: #4b5eff;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 6px;
  }

  .service-tab {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span {
      margin-left: 4px
    }
  }
  .print-modal__inner { 
    min-width: 340px;
    max-width: 540px;
    min-height: 100px;
    background-color: #ffffff;
  }

  .print-modal-check-all {
    font-size: 14px;
    font-weight: 400;
    color: #949baf;
    border-bottom: 1px dashed #99a2bb;
    cursor: pointer;
  }
  .print-modal-service-type {
    font-size: 16px;
    font-weight: 500;
    line-height: 21px;
    color: #5e6476;
  }
</style>
