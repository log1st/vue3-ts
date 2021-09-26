<template>
  <form
    :class="[
      $style.dialog,
      $style.default
    ]"
    @submit.prevent="submit"
  >
    <div :class="$style.label">
      {{ t('title') }}
    </div>
    <TextInput
      v-model.number="localLimit"
      :class="$style.limit"
      :label="t('limit.label')"
      :hint="t('limit.hint')"
      state="primary"
    />
    <div :class="$style.drops">
      <div :class="$style.hint">
        {{ t('columns.order') }}
      </div>
      <div />
      <div :class="$style.hint">
        {{ t('columns.hidden') }}
      </div>
      <Draggable
        v-model="localVisibleColumns"
        :class="$style.drop"
        :filter="`.${$style.disabled}`"
        :group="{name: 'columns', pull: true}"
        :drag-class="$style.dragging"
        :item-key="item => item"
      >
        <template #item="{element: column}">
          <div
            :class="[
              $style.column,
              $style.active,
            ]"
          >
            <div :class="$style.handle">
              <Icon icon="drag-n-sort" />
            </div>
            <div :class="$style.name">
              {{ columnsMap[column]['label'] }}
            </div>
            <div :class="$style.status">
              <Icon icon="eye" />
            </div>
          </div>
        </template>
      </Draggable>
      <div :class="$style.delimiter">
        <Icon icon="exchanger" />
      </div>
      <Draggable
        v-model="localHiddenColumns"
        :class="$style.drop"
        :filter="`.${$style.disabled}`"
        :group="{name: 'columns', pull: true}"
        :drag-class="$style.dragging"
        :item-key="item => item"
      >
        <template #item="{element: column}">
          <div
            :class="[
              $style.column,
              columnsMap[column].isRequired && $style.disabled
            ]"
          >
            <div :class="$style.handle">
              <Icon icon="drag-n-sort" />
            </div>
            <div :class="$style.name">
              {{ columnsMap[column].label || column }}
            </div>
            <div :class="$style.status">
              <Icon :icon="columnsMap[column].isRequired ? 'office-pin' : 'eye'" />
            </div>
          </div>
        </template>
      </Draggable>
    </div>
    <div :class="$style.actions">
      <Btn
        :state="['tertiary', 'dark']"
        :label="t('reset')"
        :class="$style.action"
        @click="reset"
      />
      <Btn
        type="submit"
        :label="t('submit')"
        :class="$style.action"
      />
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref,
} from 'vue';
// @TODO написать наотивное решение
import Draggable from 'vuedraggable';
import { TableDisplaySettingsPayload } from '@/hooks/useDialog';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import TextInput from '@/components/textInput/TextInput.vue';
import { useLocalValue } from '@/hooks/useLocalValue';
import { ActiveTableColumn } from '@/hooks/useActiveTable';
import Icon from '@/components/icon/Icon.vue';
import Btn from '@/components/btn/Btn.vue';
import { SignalType, useSignal } from '@/hooks/useSignal';

export default defineComponent({
  name: 'TableDisplaySettingsDialog',
  components: {
    Btn, Icon, TextInput, Draggable,
  },
  props: {
    tableKey: {
      type: String as PropType<TableDisplaySettingsPayload['tableKey']>,
      required: true,
    },
    columns: {
      type: Array as PropType<TableDisplaySettingsPayload['columns']>,
      required: true,
    },
    visibleColumns: {
      type: Array as PropType<TableDisplaySettingsPayload['visibleColumns']>,
      required: true,
    },
    limit: {
      type: Number as PropType<TableDisplaySettingsPayload['limit']>,
      required: true,
    },
    defaultLimit: {
      type: Number as PropType<TableDisplaySettingsPayload['limit']>,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useLocalI18n('tableDisplaySettings');

    const localLimit = ref(props.limit);

    const columnsMap = computed<{
      [key: string]: Partial<ActiveTableColumn<any>>;
    }>(() => (props.columns.reduce((acc, column) => ({
      ...acc,
      [column.key]: column,
    }), {} as any)));

    const localVisibleColumns = ref(
      props.visibleColumns
        ?.filter((key) => !columnsMap.value[key as any].isRequired),
    );
    const localHiddenColumns = ref(
      props.columns?.filter(
        ({ key }) => columnsMap.value[key as any].isRequired
          || !localVisibleColumns.value.includes(key as any),
      ).map(({ key }) => key),
    );

    const {
      dispatchSignal,
    } = useSignal();

    const submit = () => {
      dispatchSignal(SignalType.tableSettings, {
        tableKey: props.tableKey,
        limit: localLimit.value,
        columns: [
          ...props.columns.filter(({ isRequired }) => isRequired).map(({ key }) => key),
          ...localVisibleColumns.value,
        ].filter((c, i, s) => s.indexOf(c) === i),
      });
      emit('close');
    };

    const reset = () => {
      localLimit.value = props.defaultLimit;
      localVisibleColumns.value = props.columns.map(({ key }) => key);
      submit();
    };

    return {
      t,
      localLimit,
      localVisibleColumns,
      localHiddenColumns,
      columnsMap,
      reset,
      submit,
    };
  },
});
</script>

<style lang="scss" module>
@import "./tableDisplaySettingsDialog";
</style>
