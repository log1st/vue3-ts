<template>
  <transition-group
    tag="div"
    :class="$style.toasts"
    :enter-active-class="$style.enterActive"
    :leave-active-class="$style.leaveActive"
    :leave-to-class="$style.leaveTo"
    :enter-class="$style.enter"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="$style.toast"
    >
      <Toast
        v-bind="toast"
        @hide="hideToastById(toast.id)"
      />
    </div>
  </transition-group>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api';
import Toast from '@/new/components/toast/Toast.vue';
import { useToast } from '@/new/hooks/useToast';

export default defineComponent({
  name: 'Toasts',
  components: { Toast },
  setup() {
    const { toasts, hideToastById } = useToast();

    const computedToasts = computed(() => (
      toasts.value.slice().reverse() || []
    ));

    return {
      toasts: computedToasts,
      hideToastById,
    };
  },
});
</script>

<style lang="scss" module>
@import "toasts";
</style>
