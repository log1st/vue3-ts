<template>
  <div class="print-modal" v-show="value" @click="outsideClickListener($event, false)">
    <div class="print-modal__inner"  @click="outsideClickListener($event, true)">
      <div class="print">
        <div class="print__head">
          <span>Работа с формой подписания и отправки</span>
          <div @click="closeHandler" >
            <i class="material-icons" style="color: #8c8ea2; cursor: pointer">close</i>
          </div>
        </div>
        <div class="print__body">
          <div class="row">
            <div class="col-12">
              <!-- <div> -->
                <span class="m-0 print-modal-service-type" style="padding: 12px 6px">1. Выбор услуги</span>
                <span class="m-0 print-modal-check-all" @click="toggleAll">{{ selectAllButton ? 'Выбрать всех' : 'Снять выделение со всех' }}</span>
              <!-- </div> -->
            </div>
            <div class="col-6">
              <div  :key="servicesCheckboxes" style="padding: 12px 6px">
                <div class="service-tab">
                  <ur-checkbox
                    :checked="services[0]"
                    @change="handlerHeaderCheckbox(0)"
                  />
                  <span>Электроснабжение ОДН</span>
                </div>
                <div class="service-tab">
                  <ur-checkbox
                    :checked="services[1]"
                    @change="handlerHeaderCheckbox(1)"
                  />
                  <span>Водоотведение</span>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div :key="servicesCheckboxes" style="padding: 12px 6px">
                <div class="service-tab">
                  <ur-checkbox
                    :checked="services[2]"
                    @change="handlerHeaderCheckbox(2)"
                  />
                  <span>Холодное в/с</span>
                </div>
                <div class="service-tab">
                  <ur-checkbox
                    :checked="services[3]"
                    @change="handlerHeaderCheckbox(3)"
                  />
                  <span>Содержание ж/ф</span>
                </div>
              </div>
            </div>

            <div class="col-12 d-flex justify-content-center mt-4">
            <button
                class="btn btn-primary"
                @click="selectType"
                :disabled="buttonDisabled"
                >Подписать и отправить</button>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import cloneDeep from 'lodash/cloneDeep';

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
      /**
       * Закрыть модальное окно
       */
      closeHandler () {
        this.$emit('input', false);
        this.$store.commit('clearServices');
        this.services = {
            0: true, // Электроснабжение ОДН
            1: true, // Водоотведение
            2: true, // Холодное в/с
            3: true // Содержание ж/ф
        }
      },
      //Закрытие модального окна кликом вне рабочей области 
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
      selectType() {
        if(this.buttonDisabled) return
        this.$emit('print');
        this.$emit('input', false);
        this.$store.commit('clearServices');
      },
      handlerHeaderCheckbox(index) {
        // debugger
        this.$store.commit('setService', { value: !this.services[index], index: index });
        this.services[index] = !this.services[index];
        // this.servicesCheckboxes++
      },
      toggleAll() {
        if(this.selectAllButton) {
          this.services = {
            0: true, // Электроснабжение ОДН
            1: true, // Водоотведение
            2: true, // Холодное в/с
            3: true // Содержание ж/ф
          }
          this.$store.commit('setService', { value: true, index: 0 });
          this.$store.commit('setService', { value: true, index: 1 });
          this.$store.commit('setService', { value: true, index: 2 });
          this.$store.commit('setService', { value: true, index: 3 });
        } else if(!this.selectAllButton) {
          this.services = {
            0: false, // Электроснабжение ОДН
            1: false, // Водоотведение
            2: false, // Холодное в/с
            3: false // Содержание ж/ф
          }
          this.$store.commit('setService', { value: false, index: 0 });
          this.$store.commit('setService', { value: false, index: 1 });
          this.$store.commit('setService', { value: false, index: 2 });
          this.$store.commit('setService', { value: false, index: 3 });
        }
      }
    },
    data() {
      return {
        servicesCheckboxes: 0,
        services: {
          0: true, // Электроснабжение ОДН
          1: true, // Водоотведение
          2: true, // Холодное в/с
          3: true // Содержание ж/ф
        },
        buttonDisabled: true,
        selectAllButton: false
      }
    },
    watch: {
      services: {
        deep: true,
        immediate: true,
        handler(val) {
          const checkboxes = Object.values(val);
          if(checkboxes.every(c => !c)) {
            this.buttonDisabled = true;
            this.selectAllButton = true; 
          } else if(checkboxes.every(c => c)) {
            this.buttonDisabled = false;
            this.selectAllButton = false; 
          } else if(checkboxes.some(c => c)) {
            this.selectAllButton = false; 
            this.buttonDisabled = false;
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .disabled-epc {
    opacity: 0.4;
  }
  .service-tab {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span {
      margin-left: 4px
    }
  }
  .print-modal__inner{ 
    min-width: 300px;
    max-width: 500px;
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
