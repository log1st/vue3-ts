<template>
  <div class="wgroup">
    <div class="wgroup__head">
      <div class="wgroup__marker"></div>
      <div class="wgroup__check">
        <check-box :checked="true" @changeCheckbox.prevent="" />
      </div>
      <div class="wgroup__name">
        <span v-html="params.name"></span>
      </div>
    </div>
    <div class="wgroup__content">
      <div class="wgroup__items">
        <div v-for="(item, i) in params.wGroupItems" class="wgroup__item" :key="i + 'solt' + item">
          <check-box :checked="false" @changeCheckbox.prevent="" />
          <span v-html="item"></span>
        </div>
      </div>
      <div class="wgroup__button">
        <div class="btn btn-gray--outline">Создать должность</div>
      </div>
    </div>
  </div>
</template>

<script>
import checkBox from '@/components/elements/CheckBox'
export default {
  props: {
    params: Object
  },
  components: { checkBox }
}
</script>
