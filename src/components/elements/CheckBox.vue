<template>
  <div class="checkbox" @click="checkboxHandler($event)">
    <transition name="fade">
      <template>
        <div v-if="computedChecked" class="checkbox__inner">
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    checked: {
      type: [ Boolean, Number ],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    computedChecked() {
      let checked = this.disabled ? 0 : this.checked

      switch(true) {
        case typeof(checked) === 'string' && checked === '1': 
          return true;
          break
        case typeof(checked) === 'string' && checked === '0': 
          return false;
          break
        case typeof(checked) === 'number' && checked === 1: 
          return true;
          break
        case typeof(checked) === 'number' && checked === 0: 
          return false;
          break
        case typeof(checked) === 'boolean': 
          return checked;
          break
      } 
    }
  },
  methods: {
    checkboxHandler (e) {
      this.$emit('changeCheckbox', this.computedChecked); // TODO: заменить везде на нормальное название события!
      this.$emit('change', this.computedChecked);
    }
  }
}
</script>
