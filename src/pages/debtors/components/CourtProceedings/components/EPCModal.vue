<template>
  <div class="print-modal" v-show="value"  @click="outsideClickListener($event, false)">
    <div class="print-modal__inner"  @click="outsideClickListener($event, true)">
      <div class="print">
        <div class="print__head">
          <span>Работа с формой подписания и отправки</span>

          <div @click="closeHandler" >
            <i class="material-icons" style="color: #8c8ea2; cursor: pointer">close</i>
          </div>
        </div>
        <div class="print__body">
          <div style="padding: 12px 6px">
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
        <div class="print__footer">
          <button
            class="btn btn-primary"
            @click="printEPC"
          >Подписать и отправить</button>
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
      },
      hasServices: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      /**
       * Закрыть модальное окно
       */
      closeHandler () {
        this.$emit('input', false);
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
      printEPC() {
        this.$emit('print');
      },
      handlerHeaderCheckbox(index) {
        // debugger
        this.$store.commit('setService', { value: !this.services[index], index: index });
        this.services[index] = !this.services[index];
        // this.servicesCheckboxes++
      }
    },
    data() {
      return {
        servicesCheckboxes: 0,
        services: {
          0: false, // Электроснабжение ОДН
          1: false, // Водоотведение
          2: false, // Холодное в/с
          3: false // Содержание ж/ф
        }
      }
    }
  }
</script>

<style lang="scss">
  .service-tab {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span {
      margin-left: 4px
    }
  }
</style>
