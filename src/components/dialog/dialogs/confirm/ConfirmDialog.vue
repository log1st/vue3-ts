<template>
  <div
    :class="[
      $style.dialog,
      $style.default
    ]"
  >
    <div
      v-if="title"
      :class="$style.label"
    >
      {{ title }}
    </div>
    <div
      v-if="message"
      :class="$style.message"
    >
      {{ message }}
    </div>
    <div
      v-if="buttons"
      :class="$style.actions"
    >
      <Btn
        v-for="button in buttons.filter(({
          isVisible
        }) => isVisible || (typeof isVisible === 'undefined'))"
        :key="button.key"
        :class="$style.action"
        :label="button.label"
        :state="button.state"
        :prepend-icon="button.icon"
        @click="onClick(button)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onBeforeUnmount, PropType, toRefs,
} from 'vue';
import { ConfirmDialogButton, ConfirmDialogPayload } from '@/hooks/useDialog';
import Btn from '@/components/btn/Btn.vue';
import { awaitFrame } from '@/utils/window';

export default defineComponent({
  name: 'ConfirmDialog',
  components: { Btn },
  props: {
    title: String as PropType<ConfirmDialogPayload['title']>,
    message: String as PropType<ConfirmDialogPayload['message']>,
    buttons: Array as PropType<ConfirmDialogPayload['buttons']>,
    cancelButton: String as PropType<ConfirmDialogPayload['cancelButton']>,
  },
  setup(props) {
    const { buttons, cancelButton } = toRefs(props);
    onBeforeUnmount(() => {
      const cancelAction = buttons.value?.find(({ key }) => key === cancelButton.value);
      if (!cancelAction?.onClick) {
        return;
      }
      cancelAction.onClick();
    });

    const onClick = async ({ onClick }: ConfirmDialogButton) => {
      await awaitFrame();
      onClick && onClick();
    };

    return {
      onClick,
    };
  },
});
</script>

<style lang="scss" module>
@import "./confirmDialog";
</style>
