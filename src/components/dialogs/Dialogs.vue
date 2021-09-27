<template>
  <div :class="$style.dialogs">
    <Dialog
      v-for="(dialog, index) in dialogs"
      :key="dialog.id"
      :class="[
        $style.dialog,
        hiddenDialogs.includes(dialog.id) && $style.hidden,
      ]"
      :component="dialog.component"
      :payload="dialog.payload"
      :is-current="index === (dialogs.length - 1) && !hiddenDialogs.includes(dialog.id)"
      @close="closeDialogById(String(dialog.id))"
      @hide="hideDialogById(String(dialog.id))"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import Dialog from '@/components/dialog/Dialog.vue';
import { IDialog, useDialog } from '@/hooks/useDialog';

export default defineComponent({
  name: 'Dialogs',
  components: { Dialog },
  setup() {
    const {
      dialogs,
      closeDialogById,
    } = useDialog();

    const hiddenDialogs = ref<Array<IDialog['id']>>([]);

    const hideDialogById = (id: IDialog['id']) => {
      hiddenDialogs.value.push(id);
    };

    const { currentRoute } = useRouter();

    watch(computed(() => (JSON.stringify({
      name: currentRoute.value?.name,
      params: currentRoute.value?.params,
    }))), (oldValue, newValue) => {
      if (oldValue === newValue) {
        return;
      }
      dialogs.value.forEach(({ id }) => closeDialogById(id));
    });

    return {
      dialogs,
      closeDialogById,
      hideDialogById,
      hiddenDialogs,
    };
  },
});
</script>

<style lang="scss" module>
@import "./dialogs";
</style>
