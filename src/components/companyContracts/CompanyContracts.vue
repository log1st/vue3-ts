<template>
  <div :class="$style.container">
    <div :class="$style.title">
      {{ t('title') }}
    </div>
    <div :class="$style.contracts">
      <a
        v-for="contract in contracts"
        :key="contract.key"
        target="_blank"
        :href="contract.url"
        :class="$style.contract"
      >
        <div :class="[$style.icon, $style[contract.type]]" />
        <div :class="$style.label">
          {{ contract.label }}
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { Company } from '@/hooks/useCompanies';
import { useLocalI18n } from '@/hooks/useLocalI18n';

export default defineComponent({
  name: 'CompanyContracts',
  props: {
    company: Object as PropType<Company>,
  },
  setup() {
    const { t } = useLocalI18n('panel.index.contracts');
    const contracts = computed(() => ([
      {
        key: 'agreement',
        label: t('agreement'),
        url: '#',
        type: 'pdf',
      },
      {
        key: 'agreement2',
        label: t('agreement'),
        url: '#',
        type: 'pdf',
      },
      {
        key: 'agreement3',
        label: t('agreement'),
        url: '#',
        type: 'pdf',
      },
    ]));

    return {
      t,
      contracts,
    };
  },
});
</script>

<style lang="scss" module>
@import "./companyContracts";
</style>
