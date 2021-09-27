<template>
  <Checkbox
    v-model="theme"
    true-value="light"
    false-value="dark"
    state="switch"
  >
    <template #checked>
      <Icon
        data-role="icon"
        icon="sun"
      />
    </template>
    <template #unchecked>
      <Icon
        data-role="icon"
        icon="crescent"
      />
    </template>
  </Checkbox>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLayout } from '@/hooks/useLayout';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import Icon from '@/components/icon/Icon.vue';

export default defineComponent({
  name: 'ThemeSwitcher',
  components: { Icon, Checkbox },
  setup() {
    const {
      theme,
    } = useLayout();

    return {
      theme,
    };
  },
});
</script>
