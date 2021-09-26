<template>
  <div :class="$style.container" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { ActiveFormField } from '@/hooks/useActiveForm';
import { Company } from '@/hooks/useCompanies';

export default defineComponent({
  name: 'PanelMainCompany',
  setup() {
    const {
      company,
    } = useDefaultCompany();

    const fields = computed<Array<ActiveFormField<Company>>>(() => ([
      {
        key: 'a',
      },
    ]));

    return {
      company,
    };
  },
});
</script>

<style lang="scss" module>
@import "./panelMainCompany";
</style>
