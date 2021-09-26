<template>
  <div :class="$style.templates">
    <Btn
      v-for="template in templates"
      :key="template.key"
      state="quaternary"
      :class="$style.template"
      @click="downloadFile(template.url)"
    >
      {{ template.label }}
    </Btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Btn from '@/components/btn/Btn.vue';
import { downloadFile } from '@/hooks/useFileManager';
import { ExchangeTemplate } from '@/components/exchangeTemplates/useExchangeTemplates';

export default defineComponent({
  name: 'ExchangeTemplates',
  components: { Btn },
  props: {
    templates: Array as PropType<Array<ExchangeTemplate>>,
  },
  setup() {
    return {
      downloadFile,
    };
  },
});
</script>

<style lang="scss" module>
@import "exchangeTemplates";
</style>
