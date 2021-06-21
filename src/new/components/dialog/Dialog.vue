<template>
  <div ref="rootRef" :class="[
    $style.dialog,
    isWide && $style.isWide,
  ]" data-role="dialog">
    <div :class="$style.container" data-role="dialog-content">
      <div :class="$style.body" v-outside-click="close">
        <Icon :class="$style.close" v-if="isCloseable" icon="close" @click="close"/>
        <component
          :is="componentInstance"
          :class="$style.instance"
          v-bind="payload"
          @close="close"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, computed} from '@vue/composition-api';
import Icon from "@/new/components/icon/Icon";
import DebtorsStatusDialog from "@/new/components/debtorsStatusDialog/DebtorsStatusDialog";
import ActiveTableActionsDialog from "@/new/components/activeTableActionsDialog/ActiveTableActionsDialog";
import ActiveTableSettingsDialog from "@/new/components/activeTableSettingsDialog/ActiveTableSettingsDialog";
import PrintDebtorsDialog from "@/new/components/printDebtorsDialog/PrintDebtorsDialog";
import DownloadFileDialog from "@/new/components/downloadFileDialog/DownloadFileDialog";
import SetOfChargesDialog from "@/new/components/setOfChargesDialog/SetOfChargesDialog";
import DutyFormDialog from "@/new/components/dutyFormDialog/DutyFormDialog";
import ExtractFromEgrnDialog from "@/new/components/extractFromEgrnDialog/ExtractFromEgrnDialog";
import DebtorDialog from "@/new/components/debtorDialog/DebtorDialog";

export default defineComponent({
  name: "Dialog",
  components: {Icon},
  props: {
    component: String,
    isCloseable: Boolean,
    payload: Object,
    closeHandler: Function,
    isWide: Boolean,
  },
  setup(props, {emit}) {
    const close = () => {
      props.closeHandler && props.closeHandler();
      emit('close');
    };

    const rootRef = ref();
    const closeOutside = ({ target }) => {
      if (!props.isCloseable) {
        return;
      }
      if ((target).closest('[data-role="dialog"]') && target !== rootRef.value) {
        return;
      }
      close();
    };

    const componentsMap = {
      debtorsStatus: DebtorsStatusDialog,
      activeTableActions: ActiveTableActionsDialog,
      activeTableSettings: ActiveTableSettingsDialog,
      printDebtors: PrintDebtorsDialog,
      downloadFile: DownloadFileDialog,
      setOfCharges: SetOfChargesDialog,
      dutyForm: DutyFormDialog,
      extractFromEgrn: ExtractFromEgrnDialog,
      debtorDialog: DebtorDialog,
    };

    const componentInstance = computed(() => (
      componentsMap[props.component]
    ));

    return {
      close,
      closeOutside,
      componentInstance,

      rootRef,
    };
  }
});
</script>

<style lang="scss" module>
@import "./dialog";
</style>
