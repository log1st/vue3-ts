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
          <div class="print__item" @click="$emit('print', 'open'); closeHandler">
            <icon-base
              :hasStroke="false"
              :width="24"
              :height="24"
              iconColor="#818181"
              :viewBox="'0 0 20 20'"
            ><component is="icon-eye" />
            </icon-base>
            <!-- <span class="material-icons material-icons-outlined" style="font-size: 24px; color: #818181">visibility</span> -->
            <span>Просмотр и печать</span>
          </div>
          <!-- <div class="print__item" @click="$emit('print','zip'); closeHandler">
            <icon-base
              :hasStroke="false"
              :width="24"
              :height="24"
              iconColor="#818181"
              :viewBox="'0 0 20 20'"
            ><component is="icon-zip" />
            </icon-base>
            <span>Сохранить в архив</span>
          </div> -->
          <div class="print__item" @click="$emit('print','save'); closeHandler">
            <icon-base
              :hasStroke="false"
              :width="32"
              :height="24"
              iconColor="#818181"
              :viewBox="'0 0 20 20'"
            ><component is="icon-download2" />
            </icon-base>
            <span>Сохранить в <br>PDF</span>
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
        type: Array
      }
    },
    methods: {
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
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.outsideClickListener)
    }
      },
      removeClickListener() {
        if (typeof document !== 'undefined') {
          document.removeEventListener('click', this.outsideClickListener)
        } 
      },
    }
  }
</script>
