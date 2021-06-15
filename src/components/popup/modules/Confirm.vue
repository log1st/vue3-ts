<template>
  <!-- этого нет в макете, но я добавил что бы не удалять сразу, а с подтверждением. пусть дизайнер дорисует как он это видит -->
  <div class="confirm">
    <div v-if="!params.no_title" class="confirm__title" v-html="params.title ? params.title : 'Удалить? Действие необратимо.'"></div>
    <div class="confirm__body">
      <div v-if="!params.no_btnConfirm" class="btn btn-primary" @click="execute(true)">{{ params.btnConfirm ? params.btnConfirm : 'Да, давно пора' }}</div>
      <div v-if="!params.no_btnCancel" class="btn btn-white" @click="execute(false)">{{ params.btnCancel ? params.btnCancel : 'Торопиться не надо...' }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    params: Object
  },
  methods: {
    execute (event) {
      if (!this.params.data && this.params.data !== 0) this.params.action(event)
      else if (event) {
        this.params.action(this.params.data)
      }
      this.$store.dispatch('setPopupState', false)
    }
  }
}
</script>
