<template>
  <transition-group
    tag="div"
    :enter-active-class="$style.enterActive"
    :leave-active-class="$style.leaveActive"
    :leave-to-class="$style.leaveTo"
    :enter-class="$style.enter"
  >
    <Dialog
      v-for="(dialog, index) in dialogs"
      v-bind="dialog"
      :key="`${hidden.includes(dialog.id) ? 'hidden' : 'shown'}-${dialog.id}`"
      @close="hideDialogById(dialog.id)"
      @hide="hide(index)"
      @show="show(index)"
    />
  </transition-group>
</template>

<script>
import {defineComponent, ref} from '@vue/composition-api';
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

    const hidden = ref([]);

    const hide = (id) => {
      if(!hidden.value.includes(id)) {
        hidden.value.push(id)
      }
    }

    const show = (id) => {
      hidden.value.splice(hidden.value.indexOf(id), 1)
    }

    return {
      dialogs,
      hideDialogById,

      hide,
      show,
      hidden,
    }
  }
});
</script>

<style lang="scss" module>
@import "./dialogs";
</style>
