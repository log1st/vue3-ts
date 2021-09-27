<template>
  <ExchangeImportInstructions
    v-if="dataType === 'instruction'"
  />
  <ExchangeImportForm
    v-else
    :data-type="dataType"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { DataTypeKey } from '@/hooks/useExchange';
import ExchangeImportInstructions
  from '@/components/exchangeImportInstructions/ExchangeImportInstructions.vue';
import ExchangeImportForm from '@/components/exchangeImportForm/ExchangeImportForm.vue';

export default defineComponent({
  name: 'Index',
  components: { ExchangeImportForm, ExchangeImportInstructions },
  beforeRouteEnter(to, from, next) {
    if (!to.params.dataType) {
      next({ ...to, params: { ...to.params, dataType: DataTypeKey.instruction } });
      return;
    }
    next();
  },
  props: {
    dataType: String as PropType<DataTypeKey>,
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
