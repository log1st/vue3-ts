<template>
  <div class="panel-services">
    <div class="panel-services__head">
      <div class="panel-services__title" v-html="params.title"></div>
      <div class="panel-services__status">
        <statusLabel :status="params.status">{{ params.status ? 'Подключена' : 'Не подключена' }}</statusLabel>
      </div>
    </div>
    <div v-if="params.items" class="panel-services__body">
      <div v-for="(item, i) in params.items" class="panel-services__item" :key="'qwe33' + i">
        <div class="panel-services__item-text" v-html="item.data"></div>
        <div class="panel-services__status">
          <statusLabel :status="item.status">{{ item.status ? 'Подключена' : 'Не подключена' }}</statusLabel>
        </div>
      </div>
    </div>
    <div class="panel-services__footer">
      <div class="panel-services__details">
        <span>Стоимость:</span>
        {{ params.befTax | sepnum }} ₽/лиц. счет
      </div>
      <div
        class="btn"
        :class="[!params.status ? 'btn-primary' : 'btn-red' ]"
        @click="$emit('change-status')"
      >
        {{ !params.status ? 'Подключить' : 'Отключить' }}
      </div>
    </div>
  </div>
</template>

<script>
import statusLabel from '@/components/elements/StatusLabel'
export default {
  name: 'PanelServices',
  props: {
    params: Object
  },
  components: { statusLabel }
}
</script>
