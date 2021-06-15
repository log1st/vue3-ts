<template>
  <div class="calendar">
    <div class="calendar__head">
      <span>Сформировать приложение</span>
    </div>
    <div class="calendar__wrapp">
      <div class="calendar__btn">
        <div class="btn btn-gray--outline" @click="selectNowDate()">На текущую дату</div>
      </div>
      <div class="calendar__slider">
        <div class="calendar__slider-arrow calendar__slider-arrow--left" @click="loadNext(-1)">
          <icon-base
            width="10"
            height="10"
            iconColor="#494e62"
            ><icon-arrow />
          </icon-base>
        </div>
        <div class="calendar__slider-month">
          <span v-html="arr[date.getMonth()] + '&nbsp;&nbsp;' + date.getFullYear()"></span>
        </div>
        <div class="calendar__slider-arrow" @click="loadNext(1)">
          <icon-base
            width="10"
            height="10"
            iconColor="#494e62"
            ><icon-arrow />
          </icon-base>
        </div>
      </div>
      <div class="calendar__table">
        <header class="calendar__table-header">
          <div class="calendar__table-row">
            <div v-for="item in ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']" class="calendar__table-cell" :key="item">{{ item }}</div>
          </div>
        </header>
        <div class="calendar__table-body" ref="calendar" @click="setDate"></div>
      </div>
    </div>
    <div class="calendar__footer">
      <button class="btn btn-primary" :disabled="!selectedDate" @click="execute()">{{ params.btnName ? params.btnName : 'Закрыть'}}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import iconArrow from '@/components/icons-svg/icons/IconArrow'
export default {
  name: 'Calendar',
  props: {
    params: Object
  },
  components: { iconArrow },
  data () {
    return {
      date: new Date(),
      selectedDate: null,
      arr: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    }
  },
  mounted () {
    if (typeof document !== 'undefined') {
      this.info = document.getElementById('info')
    }
    this.calendar = this.$refs.calendar
    this.loadNow()
  },
  methods: {
    execute () {
      if (this.selectedDate === null) {
        alert('Выберите дату')
      }
      if (this.params.action) this.params.action(this.selectedDate)
      this.$store.dispatch('setPopupState', false)
    },
    setDate (e) {
      if (e.target.closest('.calendar__table-cell.is-selectable')) {
        const oldElem = this.$refs.calendar.querySelector('.is-selected')
        if (oldElem) {
          oldElem.classList.remove('is-selected')
          oldElem.classList.add('is-selectable')
        }
        e.target.classList.remove('is-selectable')
        e.target.classList.add('is-selected')
        this.selectedDate = this.setTwoDigits(e.target.innerHTML) + '.' + this.setTwoDigits(this.date.getMonth() + 1) + '.' + this.date.getFullYear()
      }
    },
    setTwoDigits (str) {
      str = '0' + str
      return str.slice(-2)
    },
    loadNext (delta) {
      this.date = new Date(this.date.getFullYear(), (this.date.getMonth() + delta), 1)
      this.loadMonth(this.date.getFullYear(), this.date.getMonth())
    },
    loadMonth (year, month, nowDate = false) {
      this.calendar.innerHTML = ''
      // debugger
      let thisMonth = true
      const d = 33 - new Date(year, month, 33).getDate()
      let prime = (new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay()) - 1
      if (prime === -1) {
        prime = 6 // first day
      }
      const colTr = Math.ceil((d + prime) / 7) // rows
      for (let i = 0, tmpD = 1; i < colTr; i++) { //
      if (typeof document !== 'undefined') {
        const newTr = document.createElement('div')
        newTr.classList.add('calendar__table-row')
        for (let j = 0; j < 7; j++) {
          const newSpan = document.createElement('div')
          newSpan.classList.add('calendar__table-cell', 'is-selectable')
          if (j >= prime || tmpD >= 2) {
            if (tmpD <= d) {
              newSpan.innerHTML = tmpD
              if (tmpD === new Date().getDate() && this.date.getMonth() === new Date().getMonth() && this.date.getFullYear() === new Date().getFullYear()) {
                newSpan.classList.add('is-now')
                if (nowDate) newSpan.classList.add('is-selected')
              }
            } else {
              tmpD = 1
              newSpan.innerHTML = tmpD
              thisMonth = false
            }
            tmpD++
          } else {
            newSpan.innerHTML = this.daysInMonth(year, (month - 1)) - prime + j + 1
            newSpan.classList.remove('is-selectable')
          }
          if (newSpan.innerHTML) {
            if (!thisMonth) {
              newSpan.classList.remove('is-selectable')
              if (newSpan.classList.contains('is-selected')) newSpan.classList.remove('is-selected')
            }
            newTr.appendChild(newSpan)
          }
        }
        this.calendar.append(newTr)
        } 
      }
    },
    selectNowDate () {
      this.date = new Date()
      this.loadMonth(this.date.getFullYear(), this.date.getMonth(), true)
      this.selectedDate = this.setTwoDigits(this.setTwoDigits(this.date.getDate())) + '.' + this.setTwoDigits(this.date.getMonth() + 1) + '.' + this.date.getFullYear()
    },
    loadNow () {
      this.loadMonth(this.date.getFullYear(), this.date.getMonth())
    },
    daysInMonth (m, y) {
      return m === 2 ? y & 3 || !(y % 25) & y & 15 ? 28 : 29 : 30 + (m + (m >> 3) & 1)
    }
  },
  computed: {
    ...mapGetters(['getPopupComponent'])
  }
}
</script>
