<template>
  <div class="print-modal" v-show="value" @click="outsideClickListener($event)">
    <div class="print-modal__inner" @click="outsideClickListener($event)">
      <div class="print">
        <div class="print__head">

          <span>Получение выписок из ЕГРН
</span>

          <div @click="closeHandler" >
            <i class="material-icons" style="color: #8c8ea2; cursor: pointer">close</i>
          </div>

        </div>

        <div class="print__body">
          
            <div class="">
              <p class="">
                Обращаем Ваше внимание, что произойдет списание с 
                Вашего лицевого счета суммы за услугу по получению выписки ЕГРН с 
                официального сайта Росреестра, согласно тарифному плану.
              </p>
            </div>
            <div class="checkbox__wrapper">
              <ul>
                 <li v-for="(item, i) in egrn" :key="'egrn'+i" :class="{ 'disable' : item.isDisabled }">
                   <span @click="updateEgrnCheck(i)"><checkBox :disabled="item.isDisabled" :checked="item.selected" ></checkBox></span>
                   {{item.name}}
                  </li>
               </ul>
            </div>
            <div class=" p-1" style="color: red; width: 100%; text-align: center">Важно!</div>
            <div class="" style="color: red">Мы не гарантируем корректную работа сайта Росреестра. Время получение выписки по регламенту Росреестра занимает до 5 дней.</div>

            <div class="col-12 d-flex justify-content-center mt-4">
                <button
                    class="btn btn-primary"
                    @click="getApplicationDischarge"
                >
                  Отправить запрос
                </button>
            </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import checkBox from '@/components/elements/CheckBox'
  export default {
    props: {
      value: Boolean
    },
    data () {
      return {
        egrn:[
          {
            name:'Выписка из ЕГРН (10 руб./шт.)',
            selected: true,
            isDisabled: false
          },
          {
            name:'Выписка из ЕГРН о переходе прав (10 руб./шт.)',
            selected: false,
            isDisabled: false
          }
        ]
      }
    },
    components: { checkBox },
    methods: {
        printDocument(e) {
            this.$emit(e); 
        },
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
        getApplicationDischarge() {
            this.$emit('print');
            this.$emit('input', false);
        },
        updateEgrnCheck(index){
          if (this.egrn[index].selected == true) {
            this.egrn[index].selected = false
            events.$emit('egrnrighttransfer', { egrnRightsTrasnfer: this.egrn[1].selected, egrnRequest:this.egrn[0].selected  })
          } else {
            this.egrn[index].selected = true
            events.$emit('egrnrighttransfer', { egrnRightsTrasnfer: this.egrn[1].selected, egrnRequest:this.egrn[0].selected  })
          }
          
        }

    },
  }
</script>

<style lang="scss">
    .print-modal__inner{ 
        min-width: 340px;
        max-width: 540px;
        min-height: 100px;
        background-color: #ffffff;
    }
    .checkbox__wrapper{
      .disable {
        color: #6f788f;
      }
      ul{
        list-style: none;
        padding: 0;
        li{
          display: flex;
          align-items: center;
          flex-direction: row;
          margin-bottom: 0.5em;
            span {
              display: flex;
              align-items: center;
              margin-right: 0.5em;
            }
        }
      }
    }
</style>
