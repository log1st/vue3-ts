<template>
  <div :class="$style.toasts">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      v-bind="toast"
      :class="$style.toast"
      @close="closeToastById(toast.id)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/toast/Toast.vue';

export default defineComponent({
  name: 'Toasts',
  components: { Toast },
  setup() {
    const {
      toasts,
      closeToastById,
    } = useToast();

    const { currentRoute } = useRouter();

    watch(computed(() => (JSON.stringify({
      name: currentRoute.value?.name,
      params: currentRoute.value?.params,
    }))), (oldValue, newValue) => {
      if (oldValue === newValue) {
        return;
      }
      toasts.value.forEach(({ id }) => closeToastById(id));
    }, {
      deep: true,
    });

    return {
      toasts,
      closeToastById,
    };
  },
});
</script>

<style lang="scss" module>
@import "./toasts";
</style>
