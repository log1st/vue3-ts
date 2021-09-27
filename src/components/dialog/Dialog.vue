<template>
  <div
    :class="[
      $style.dialog,
      $style[component],
      payload?.wide && $style.wide,
    ]"
  >
    <div :class="$style.container">
      <div
        v-outside-click="outsideClose"
        :class="$style.body"
      >
        <Icon
          icon="close"
          :class="$style.close"
          @click="close"
        />
        <component
          :is="render"
          :class="$style.content"
          v-bind="payload"
          :is-current="isCurrent"
          @close="close"
          @hide="hide"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { IDialog, IDialogComponent } from '@/hooks/useDialog';
import Icon from '@/components/icon/Icon.vue';
import AddCompanyDialog from './dialogs/addCompany/AddCompanyDialog.vue';
import CompanyDialog from './dialogs/company/CompanyDialog.vue';
import AddEmployeeDialog from './dialogs/addEmployee/AddEmployeeDialog.vue';
import { awaitFrame } from '@/utils/window';
import ConfirmDialog from './dialogs/confirm/ConfirmDialog.vue';
import TableDisplaySettingsDialog
  from './dialogs/tableDisplaySettings/TableDisplaySettingsDialog.vue';
import ModelDialog from './dialogs/model/ModelDialog.vue';
import ActionsSelectorDialog
  from './dialogs/actionsSelector/ActionsSelectorDialog.vue';
import DebtorStatusDialog from './dialogs/debtorStatus/DebtorStatusDialog.vue';
import PrintDialog from '@/components/dialog/dialogs/print/PrintDialog.vue';
import FileDialog from '@/components/dialog/dialogs/file/FileDialog.vue';
import EgrnDialog from '@/components/dialog/dialogs/egrn/EgrnDialog.vue';
import DebtorDialog from '@/components/dialog/dialogs/debtor/DebtorDialog.vue';
import ListenDialog from '@/components/dialog/dialogs/listen/ListenDialog.vue';

export default defineComponent({
  name: 'Dialog',
  components: { Icon },
  props: {
    isCurrent: Boolean as PropType<boolean>,
    component: {
      type: String as PropType<IDialog['component']>,
      required: true,
    },
    payload: Object as PropType<IDialog['payload']>,
  },
  emits: ['close', 'hide'],
  setup(props, { emit }) {
    const render = computed(() => ({
      [IDialogComponent.addCompany]: AddCompanyDialog,
      [IDialogComponent.company]: CompanyDialog,
      [IDialogComponent.addEmployee]: AddEmployeeDialog,
      [IDialogComponent.confirm]: ConfirmDialog,
      [IDialogComponent.tableDisplaySettings]: TableDisplaySettingsDialog,
      [IDialogComponent.model]: ModelDialog,
      [IDialogComponent.actionsSelector]: ActionsSelectorDialog,
      [IDialogComponent.debtorStatus]: DebtorStatusDialog,
      [IDialogComponent.print]: PrintDialog,
      [IDialogComponent.file]: FileDialog,
      [IDialogComponent.egrn]: EgrnDialog,
      [IDialogComponent.debtor]: DebtorDialog,
      [IDialogComponent.listenFile]: ListenDialog,
    }[props.component]));

    const close = async () => {
      await awaitFrame();
      emit('close');
    };

    const hide = async () => {
      await awaitFrame();
      emit('hide');
    };

    const outsideClose = () => {
      if (props.isCurrent) {
        close();
      }
    };

    return {
      render,
      close,
      hide,
      outsideClose,
    };
  },
});
</script>

<style lang="scss" module>
@import "./dialog";
</style>
