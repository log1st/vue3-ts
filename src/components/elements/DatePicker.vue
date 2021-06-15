<template>
  <div class="datepicker" :class="{ active : params.active }" @click="changeData" :style="styleObject">
    <div class="datepicker__inner">
      <input type="text" v-model="value" placeholder="Выберите дату" readonly>
    </div>
    <div class="datepicker__icon">
      <icon-base
        width="15"
        height="15"
        iconColor="#828da5"
        ><icon-calendar />
      </icon-base>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import iconCalendar from '@/components/icons-svg/icons/IconCalendar'
export default {
  props: {
    params: Object
  },
  components: { iconCalendar },
  data () {
    return {
      value: '',
      awaitChangeData: false
      // timerId: null
    }
  },
  mounted () {
    if (this.params.value) this.value = this.params.value
  },
  methods: {
    ...mapActions(['setPopupComponent', 'setPopupState', 'setPopupDate']),
    changeData () {
      this.setPopupComponent({ component: 'calendar' })
      this.setPopupDate(null)
      this.awaitChangeData = true
    }
  },
  computed: {
    ...mapGetters(['getPopupDate', 'getPopupOpen']),
    popupDate () {
      return this.getPopupDate
    },
    popupState () {
      return this.getPopupOpen
    },
    styleObject () {
      return this.params.dpwidth ? `--dpwidth: ${this.params.dpwidth}px` : null
    }
  },
  watch: {
    popupDate (res) {
      if (this.awaitChangeData && res) {
        this.value = res
        this.$emit('changeDate', this.value)
        if (!this.popupState) this.awaitChangeData = false
        // this.timerId = setTimeout(() => {
        //   this.setPopupState(false)
        // }, 1000)
      }
    },
    popupState (val) {
      if (!val) this.awaitChangeData = false
    }
  }
  // beforeDestroy () {
  //   clearTimeout(this.timerId)
  // }
}
</script>
