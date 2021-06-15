export const listener = {
  data: () => ({
    timerId: null
    // set this elements:
    // listenerElement: '.search-input__select', // блок с выпадающим меню
    // listenerValue: 'selectOpen' // переменная, которая меняется при открытии / закрытии выпадающего меню
  }),
  methods: {
    $_setListener (e) {
      if (typeof this.listenerElement === 'object') {
        let condition = 0
        this.listenerElement.forEach(el => {
          if (e.target.closest(el) == null) condition++
        })
        if (condition === this.listenerElement.length) this[this.listenerValue] = false
      } else {
        if (e.target.closest(this.listenerElement) == null) this[this.listenerValue] = false
      }
    }
  },
  computed: {
    $_getListenerValueName () {
      return this[this.listenerValue]
    }
  },
  watch: {
    $_getListenerValueName (value) {
      if (typeof value === 'number') value = true
      if (typeof document !== 'undefined') {
        if (value) {
          this.timerId = setTimeout(() => {
            document.addEventListener('click', this.$_setListener)
          }, 100)
        } else {
          document.removeEventListener('click', this.$_setListener)
          this.timerId = null
        }
      }
    }
  },
  beforeDestroy () {
    clearTimeout(this.timerId)
  }
}
