<template>
  <popup-wrapper :popupWidth="373">
    <template v-slot:header>
        <p class="m-0">Статус работы с должником</p>
    </template>
    <div class="popup__status">
      <div class="my-3">
        <v-select :options="newStatusesDebtorsInner" label="title" v-model="selected"></v-select>
        <div v-if="selected !== null && selected.fields.length > 0">
          <ur-input 
            v-for="(field, index) in selected.fields" :key="index"
            :value="field.value"
            @input="field.value = $event"
            type="text"
          />
        </div>

      </div>
      <div class="my-3">
        <v-select :options="selected.subStatuses" v-model="selected2" label="title" v-if="selected !== null && selected.subStatuses.length > 0"></v-select>
        <div v-if="selected2 && selected2.fields.length > 0" >
          <div v-for="(field, index) in selected2.fields" :key="index" class="my-3">
          <span style="font-size: 14px" class="p-2">{{ field.label }}</span>
          <ur-input 
            :value="field.value"
            @input="field.value = $event"
            type="text"
          />
          </div>
        </div>
      </div>
    
      <div class="popup__status-button">
        <!-- :class="[ newStatus ? 'btn-primary' : 'btn-indigo']" -->
        <button
          class="btn btn-primary"
          @click="getNewStatus"

        >Применить</button>
      </div>
    </div>
  </popup-wrapper>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import searchInput from '@/components/elements/SearchInput'

export default {
  components: { searchInput },
  data () {
    return {
      selected: null, // выбранный статус 1 уровня
      selected2: null,

      inpt: { placeholder: 'Выберите статус', isSelect: true, items: [] },

      options: ['asda'],

      statuses: [],

      newStatusesDebtorsInner: []
    }
  },
  watch: {
    selected: {
      deep: true,
      handler(val) {
        // console.log(val)
        if(val.number !== "4") {
        this.selected2 = null
        }
      }
    },
    newStatusesDebtors: {
      immediate: true,
      deep: true,
      handler(val) {
        if(val) {
          this.newStatusesDebtorsInner = cloneDeep(val)
        }
      }
    },
    getPopupComponent: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log(val.debtors)

        if(val && val.debtors.length === 1) {
          // Старый формат
          if(typeof(val.debtors[0].Status) === 'string') {
            switch (true) {
              case val.debtors[0].Status === 'Новый':
                this.selected = this.newStatusesDebtorsInner[0]; 
                break;
              case val.debtors[0].Status === 'В работе':
                this.selected = this.newStatusesDebtorsInner[1]; 
                break;
            }
          } else if(!isEmpty(val.debtors[0].Status)) {
            try {
              this.selected = JSON.parse(val.debtors[0].Status.Status).find(s => s.selected);
              this.selected2 = this.selected.subStatuses.find(s => s.selected);
            } catch (e) {
              switch (true) {
                case val.debtors[0].Status.Status === 'Новый':
                  this.selected = this.newStatusesDebtorsInner[0]; 
                  break;
                case val.debtors[0].Status.Status === 'В работе':
                  this.selected = this.newStatusesDebtorsInner[1]; 
                  break;
              }
            }
          }
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'getNewStatusChecked',
      'getNewStatusOne',
      'setPopupState',
      'addHistoryNote'
    ]),
    getNewStatus () {
      if (this.getPopupComponent.all) {
        // debugger
        // this.getNewStatusChecked(this.newStatus)
      }
      if (this.getPopupComponent.one) {
        this.getPopupComponent.debtors.forEach(d => {
          // формируем новый статус 1го уровня
          this.newStatusesDebtorsInner.forEach(s => {
            if(this.selected.number === s.number) {
              s.selected = true;
              // формируем статусы 2го уровня
              if(s.subStatuses.length > 0) {
                  s.subStatuses.forEach(subs => {
                    if(subs.number === this.selected2.number) {
                      subs.fields = this.selected2.fields;
                      subs.selected = true
                    } 
                    else subs.selected = false 
                  })
              }
            } else {
              s.selected = false
            } 
            return s
          })

          const status = {
            id: d._id,
            status: this.newStatusesDebtorsInner,
            debtRaschSchet: d.RashSchet
          }
          // console.log(status)
          // debugger
          this.getNewStatusOne(status).then(() => {
            // записываем в историю
            // this.addHistoryNote({
            //   Names: 'Смена статуса должника',
            //   DataTime: new Date(),
            //   Status: this.newStatus,
            //   PaymentAccount: d.RashSchet
            // });
          }).catch(e => {
            console.error(e, 'Ошибка запроса смены статуса компонент PopupChangeStatusDebtor');
          })

        })
      }
      this.setPopupState(false)
    }
  },
  computed: {
    ...mapState(['statusesDebtors']),
    ...mapGetters(['getPopupComponent', 'newStatusesDebtors'])
  }
}
</script>
<style lang="scss">
  .vs__search {
    display: none;
  }
  .vs__selected-options {
     min-height: 28px;
  }
</style>
