<template>
  <form
    :class="[
      $style.dialog,
      $style.default
    ]"
    @submit.prevent="submit"
  >
    <div :class="$style.caption">
      {{ t('title') }}
    </div>
    <div :class="$style.actions">
      <button
        v-for="action in actions"
        :key="action.key"
        :class="[
          $style.action,
          value.includes(action.key) && $style.active,
        ]"
        type="button"
        @click="selectAction(action.key)"
      >
        <Icon
          :icon="action.icon"
          :class="$style.icon"
        />
        <span :class="$style.label">
          {{ action.label || action.hint }}
        </span>
      </button>
    </div>
    <Btn
      :class="$style.submit"
      :label="t('submit')"
      type="submit"
    />
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, watch,
} from 'vue';
import { ActiveTableAction } from '@/hooks/useActiveTable';
import Icon from '@/components/icon/Icon.vue';
import Btn from '@/components/btn/Btn.vue';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { SignalType, useSignal } from '@/hooks/useSignal';

export default defineComponent({
  name: 'ActionsSelectorDialog',
  components: { Btn, Icon },
  props: {
    actions: Array as PropType<Array<ActiveTableAction<any, any>>>,
    visibleActions: {
      type: Array as PropType<string[]>,
      required: true,
    },
    tableKey: String,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const value = ref(props.visibleActions);
    watch(computed(() => props.visibleActions), (newActions) => {
      value.value = newActions;
    }, {
      immediate: true,
      deep: true,
    });

    const selectAction = (actionKey: string) => {
      const index = value.value.indexOf(actionKey);
      if (index === -1) {
        value.value.push(actionKey);
      } else {
        value.value.splice(index, 1);
      }
    };

    const {
      dispatchSignal,
    } = useSignal();

    const submit = () => {
      dispatchSignal(
        SignalType.tableActions,
        {
          tableKey: props.tableKey,
          actions: [...value.value],
        },
      );
      emit('close');
    };

    const { t } = useLocalI18n('actionsSelector');

    return {
      t,
      value,
      submit,
      selectAction,
    };
  },
});
</script>

<style lang="scss" module>
@import "./actionsSelectorDialog";
</style>
