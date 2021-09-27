<template>
  <div :class="$style.na">
    <slot name="na">
      {{ t('other.na') }}
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'NA',
  setup() {
    const { t } = useI18n();

    return {
      t,
    };
  },
});
</script>

<style lang="scss" module>
@import "./na";
</style>
