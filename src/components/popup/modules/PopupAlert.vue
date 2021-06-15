<template>
  <popupWrapper :title="params.title" :popupWidth="373">
    <div class="popup__alert">
      <div class="popup__alert-message" v-html="params.text"></div>
      <div class="popup__alert-button">
        <button class="btn btn-primary" @click="$store.dispatch('setPopupState', false)">Закрыть</button>
      </div>
    </div>
  </popupWrapper>
</template>

<script>
import popupWrapper from '@/components/popup/modules/PopupWrapper'
export default {
  name: 'PopapAlert',
  props: {
    params: Object
  },
  components: { popupWrapper }
}
</script>
