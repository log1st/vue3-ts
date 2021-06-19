<template>
  <transition-group
    tag="div"
    :enter-active-class="$style.enterActive"
    :leave-active-class="$style.leaveActive"
    :leave-to-class="$style.leaveTo"
    :enter-class="$style.enter"
  >
    <Dialog
      v-for="dialog in dialogs"
      v-bind="dialog"
      :key="dialog.id"
      @close="hideDialogById(dialog.id)"
    />
  </transition-group>
</template>

<script>
import {defineComponent} from '@vue/composition-api';
import {useDialog} from "@/new/hooks/useDialog";
import Dialog from "@/new/components/dialog/Dialog";

export default defineComponent({
  name: "Dialogs",
  components: {Dialog},
  setup() {
    const {
      dialogs,
      hideDialogById,
    } = useDialog();

    return {
      dialogs,
      hideDialogById,
    }
  }
});
</script>

<style lang="scss" module>
@import "./dialogs";
</style>
