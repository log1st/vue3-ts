<template>
  <div :class="$style.actions">
    <div
      v-for="action in actions"
      :key="action.key"
      :class="[
        $style.action,
        action.notified && $style.notified
      ]"
    >
      <div :class="$style.trigger">
        <Icon :icon="action.icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Icon from '@/components/icon/Icon.vue';

type HeaderAction = {
  key: string;
  icon: string;
  notified?: boolean;
}

export default defineComponent({
  name: 'HeaderActions',
  components: { Icon },
  setup() {
    const actions = computed<Array<HeaderAction>>(() => ([
      {
        key: 'messages',
        icon: 'envelope',
      },
      {
        key: 'notifications',
        icon: 'bell',
        notified: true,
      },
    ]));

    return {
      actions,
    };
  },
});
</script>

<style lang="scss" module>
@import "./headerActions";
</style>
