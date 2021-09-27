<template>
  <div :class="$style.stats">
    <div
      v-for="stat in stats"
      :key="stat.key"
      :class="$style.stat"
    >
      <div :class="$style.statValue">
        {{ stat.value }}
      </div>
      <div :class="$style.statLabel">
        {{ stat.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';

export default defineComponent({
  name: 'HeaderStats',
  setup() {
    const {
      stats,
    } = useDefaultCompany();

    return {
      stats,
    };
  },
});
</script>

<style lang="scss" module>
@import "./headerStats";
</style>
