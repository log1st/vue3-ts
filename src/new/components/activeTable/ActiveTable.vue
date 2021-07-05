<template>
  <div :class="[
    $style.container,
    $style[state],
  ]">
    <div :class="$style.controls">
      <Btn
        v-if="state === 'secondary'"
        :state="['primary', model.filters && 'active'].filter(Boolean)"
        @click="model.filters = !model.filters"
        :prepend-icon="model.filters ? 'close' : 'magnifier'"
        is-square
      />
      <Actions
        v-if="quickActions.length"
        :actions="quickActions"
        :class="$style.actions"
      />
      <Actions
        v-if="settingsActions.length && withActions"
        :actions="settingsActions"
        :class="$style.actions"
      />
      <Actions
        v-if="controlActions.length && withControls"
        v-model="model.controls"
        :actions="controlActions"
        :class="$style.actions"
      >
        <template v-for="action in controlActions" :slot="action.key" slot-scope="payload">
          <slot :name="`action(${action.key})`" v-bind="payload"/>
        </template>
      </Actions>
      <div :class="$style.linedActions" v-if="linedActions.length && withLinedActions">
        <div
          :class="[
            $style.linedAction,
            $style[action.state || 'primary']
          ]"
          v-for="action in linedActions"
          :key="action.key"
          @click="action.onClick"
        >
          {{action.label}}
        </div>
      </div>
      <template v-if="state === 'primary'">
        <div :class="$style.stats">
          <div :class="$style.stat">
            Выбрано {{
              wholeSelected ? ('всё') : (
                allSelected ? records.length : selectedItems.length
              )
            }} из {{total}}
          </div>
          <div :class="$style.stat">
            Показаны {{Math.min(limit, records.length)}} из {{total}} (с {{(page - 1) * limit + 1}} по {{Math.min(page * limit, total)}})
          </div>
        </div>
        <div :class="$style.filters">
          <Actions
            v-model="model.filters"
            :actions="[{
            key: 'filters',
            icon: 'magnifier',
            label: 'Фильтрация',
            align: 'end'
          }, isFilterApplied && {
            key: 'reset',
            icon: 'reset',
            label: 'Очистить',
            align: 'end',
            onClick: resetFilters
          }].filter(Boolean)"
          >
            <template #filters="{isActive, close}">
              <Filters
                v-if="isActive"
                v-model="localFilters"
                :filters="filters"
                @close="close"
              />
            </template>
          </Actions>
        </div>
      </template>
    </div>
    <div :class="$style.table">
      <div :class="[$style.header, $style.grid]" :style="{gridTemplateColumns: gridTemplate}">
        <template v-for="column in computedColumns">
          <template v-if="isSelectable && selectableColumn === column.field">
            <Checkbox
              v-if="!withUniqueSelection"
              :class="[$style.cell, $style.selectAll]"
              :key="column.field"
              :model-value="allSelected || wholeSelected"
              @update:modelValue="setAllSelected"
              pre-label="Выделить все"
            />
            <div v-else></div>
          </template>
          <div
            v-else-if="column.withTitle || (typeof column.withTitle === 'undefined')"
            :class="[$style.cell, column.isSortable && $style.sortable]"
            :key="column.field"
            v-on="column.isSortable ? {
              click: () => updateSort(column.field)
            } : {}"
          >
            <Icon
              v-if="column.isSortable"
              :class="$style.cellSort"
              :icon="column.field in sortsMap ? (`sort-${sortsMap[column.field]}`) : 'sort'"
            />
            <div :class="$style.cellLabel">
              {{column.label}}
            </div>
          </div>
        </template>
      </div>
      <div :class="[$style.inlineFilters]" :style="{gridTemplateColumns: gridTemplate}" v-if="model.filters && (state === 'secondary')">
        <div :class="[$style.inlineFilter, $style.cell]" v-for="column in computedColumns" :key="column.field">
          <template v-if="column.field in filtersMap">
            <FilterConfig
              :type="filtersMap[column.field].type"
              :props="filtersMap[column.field].props"
              v-model="localFilters[column.field]"
            />
          </template>
        </div>
      </div>
      <ContextMenu
        v-if="contextMenu.isActive && withContextMenu"
        @close="hideContextMenu"
        :class="$style.contextMenu"
        :actions="contextMenuActions"
        :style="{
          left: `${contextMenu.left}px`,
          top: `${contextMenu.top}px`,
        }"
        v-outside-click="hideContextMenu"
      />
      <div :class="$style.body">
        <DynamicScroller
          :items="records"
          key-field="index"
          :class="$style.scroller"
          :min-item-size="60"
        >
          <template v-slot="{item: record, index, active}">
            <DynamicScrollerItem
              :item="record"
              :active="active"
              :size-dependencies="[keyField]"
              :data-index="index"
            >
              <ActiveTableRecord
                :grid-template="gridTemplate"
                :grid-modifier="$style.grid"
                :cell-modifier="$style.cell"
                :is-selectable="isSelectable"
                :columns="computedColumns"
                :record="record"
                :selectable-column="selectableColumn"
                :is-selected="allSelected || wholeSelected || selectedItems.includes(index)"
                @select="selectItem(index)"
                :index="index"
                :class="$style.record"
                @contextmenu="showContextMenu(index, $event)"
                @rowClick="$emit('rowClick', {record, index})"
                :state="state"
              >
                <template #cell(__actions)="{record, index}">
                  <div :class="$style.recordActions">
                    <TooltipWrapper
                      position="left"
                      align="center"
                      :text="action.label"
                      :class="$style.recordAction"
                      v-for="action in recordActions"
                      :key="action.key"
                      @click="action.handler({record, index})"
                    >
                      <Icon :icon="action.icon"/>
                    </TooltipWrapper>
                  </div>
                </template>
                <template v-for="(slot, key) in $scopedSlots" :slot="key" slot-scope="data">
                  <slot :name="key" v-bind="data" />
                </template>
              </ActiveTableRecord>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
        <Icon
          v-if="isLoading"
          icon="loader"
          :class="$style.loader"
          spin
        />
      </div>
      <div :class="[$style.footer, $style.grid]" :style="{gridTemplateColumns: gridTemplate}" v-if="summariesFields.length">
        <div :class="$style.cell" v-for="column in computedColumns" :key="column.field">
          <div :class="$style.summaryLabel" v-if="column.field === summariesLabel">
            ИТОГО:
          </div>
          <template v-else-if="column.field in summariesMap">
            <slot :name="`summary(${column.field})`" :value="summariesMap[column.field]">
              {{summariesMap[column.field]}}
            </slot>
          </template>
        </div>
      </div>
    </div>
    <Pagination
      v-if="withPagination"
      :class="$style.pagination"
      :total="total"
      :page.sync="localPage"
      :limit="localLimit"
    />
  </div>
</template>

<script>
import {computed, defineComponent, ref, watch} from "@vue/composition-api";
import ActiveTableRecord from "@/new/components/activeTable/record/ActiveTableRecord";
import Icon from "@/new/components/icon/Icon";
import Checkbox from "@/new/components/checkbox/Checkbox";
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { DynamicScroller, DynamicScrollerItem, RecycleScroller } from 'vue-virtual-scroller'
import ContextMenu from "@/new/components/contextMenu/ContextMenu";
import Pagination from "@/new/components/pagination/Pagination";
import {getDeepField} from "@/new/utils/object";
import {useLocalProp} from "@/new/hooks/useLocalProp";
import Actions from "@/new/components/actions/Actions";
import Filters from "@/new/components/filters/Filters";
import {useDialog} from "@/new/hooks/useDialog";
import Btn from "@/new/components/btn/Btn";
import FilterConfig from "@/new/components/filter/FilterConfig";
import {usePersistedSetting} from "@/new/hooks/usePersistedSetting";
import TooltipWrapper from "@/new/components/tooltip/TooltipWrapper";
import {isEqual} from "lodash";

export default defineComponent({
  name: "ActiveTable",
  components: {
    TooltipWrapper,
    FilterConfig,
    Btn,
    Filters,
    Actions,
    ContextMenu,
    Checkbox,
    Icon,
    ActiveTableRecord,
    DynamicScroller,
    DynamicScrollerItem,
    Pagination,
    RecycleScroller,
  },
  props: {
    tableKey: String,
    state: {
      type: String,
      default: 'primary',
    },
    columns: Array,
    isLoading: Boolean,
    isSelectable: Boolean,
    selectableColumn: {
      type: String,
      default: 'pk',
    },
    keyField: {
      type: String,
      default: 'pk',
    },
    records: Array,
    summaries: {
      type: Object,
      default: () => ({}),
    },
    summariesFields: {
      type: Array,
      default: () => ([]),
    },
    summariesLabel: String,
    sort: Array,
    actions: Array,
    contextActions: Array,
    total: Number,
    page: Number,
    limit: Number,
    filters: Array,
    filtersModel: Object,
    withUniqueSelection: Boolean,
    withAllSelection: {
      type: Boolean,
      default: true,
    },
    withPagination: {
      type: Boolean,
      default: true,
    },
    withActions: {
      type: Boolean,
      default: true,
    },
    withControls: {
      type: Boolean,
      default: true,
    },
    withLinedActions: {
      type: Boolean,
      default: true,
    },
    withContextMenu: {
      type: Boolean,
      default: true,
    },
    recordActions: Array,
  },
  setup(props, {emit}) {
    const sortsMap = computed(() => (
      props.sort.reduce((acc, cur) => ({
        ...acc,
        [cur.field]: cur.direction
      }), {})
    ));

    const updateSort = (field) => {
      const newSort = [...props.sort];
      const index = props.sort.findIndex((item) => item.field === field);
      if(index === -1) {
        newSort.push({field, direction: 'asc'})
      } else {
        if(newSort[index]?.direction === 'asc') {
          newSort[index].direction = 'desc'
        } else {
          newSort.splice(index, 1);
        }
      }
      emit(
        'update:sort',
        newSort,
      )
    }

    const wholeSelected = ref(false);
    const allSelected = ref(false);
    const selectedItems = ref([]);

    const setAllSelected = (value) => {
      allSelected.value = value;
      wholeSelected.value = false;
      if(!allSelected.value) {
        selectedItems.value = [];
      }
    }

    const selectItem = (index) => {
      if(props.withUniqueSelection) {
        selectedItems.value = [
          selectedItems.value[0] === index ? null : index
        ].filter( i => i !== null);
        return;
      }
      const localIndex = selectedItems.value.findIndex((item) => item === index);
      wholeSelected.value = false;
      if(allSelected.value) {
        selectedItems.value = Array(props.records.length)
          .fill(null)
          .map((_, itemIndex) => itemIndex)
          .filter((i) => i !== index)
        allSelected.value = false;
        return;
      }
      if(localIndex === -1) {
        selectedItems.value.push(index);
      } else {
        selectedItems.value.splice(localIndex, 1);
      }
      if(selectedItems.value.length === props.records.length) {
        allSelected.value = true;
      }
    }

    const contextMenu = ref({
      isActive: false,
      left: 0,
      top: 0,
      index: -1,
    })
    const showContextMenu = (index, event) => {
      contextMenu.value.left = event.pageX;
      contextMenu.value.top = event.pageY;
      contextMenu.value.index = index;
      contextMenu.value.isActive = true;
    }
    const hideContextMenu = () => {
      contextMenu.value.isActive = false;
      contextMenu.value.index = -1;
    }

    const getActionPayload = () => ({
      allSelected: wholeSelected.value,
      selectedItems: allSelected.value ? props.records.map((_, index) => index) : selectedItems.value,
      index: contextMenu.value.index,
    })

    const contextMenuActions = computed(() => ([
      !allSelected.value && {
        key: 'selectAll',
        label: 'Выделить всё',
        onClick: () => {
          allSelected.value = true
        },
      },
      (selectedItems.value.length || allSelected.value) && {
        key: 'unselectAll',
        label: 'Снять выделение',
        onClick: () => {
          allSelected.value = false;
          selectedItems.value = [];
        }
      },
      ...(props.contextActions || []).map((action) => ({
        key: action.key,
        label: action.label,
        onClick: () => {
          action.handler && action.handler(getActionPayload())
        }
      })),
    ].filter(Boolean)));

    const summariesMap = computed(() => (
      wholeSelected.value || (!allSelected.value && !selectedItems.value.length) ? props.summaries :
      props.summariesFields.reduce((summariesAcc, summaryField) => ({
        ...summariesAcc,
        [summaryField]: (
          allSelected.value ? props.records : selectedItems.value.map(index => props.records[index])
        ).reduce((summary, record) => (summary + Number(getDeepField(record, summaryField))), 0)
      }), {})
    ));

    const localLimit = useLocalProp(props, emit, 'limit');
    const localPage = useLocalProp(props, emit, 'page');
    const localFilters = useLocalProp(props, emit, 'filtersModel');

    const defaultFilter = computed(() => (
      props.filters.reduce((acc, cur) => ({
        ...acc,
        [cur.field]: JSON.parse(JSON.stringify(cur.defaultValue || null))
      }), {})
    ))

    const isFilterApplied = computed(() => (
      !isEqual(
        localFilters.value,
        defaultFilter.value,
      )
    ));

    const resetFilters = () => {
      localFilters.value = JSON.parse(JSON.stringify(defaultFilter.value))
    }

    watch(localPage, () => {
      setAllSelected(false);
    });
    watch(localLimit, () => {
      setAllSelected(false);
    });

    const {
      showDialog,
    } = useDialog();

    const visibleQuickActions = usePersistedSetting(
      computed(() => `table-${props.tableKey}-quick-actions`),
      props.actions
        .filter(({asQuick}) => asQuick)
        .map(({key}) => key)
    );

    watch(computed(
      () => props.actions
        .filter(({asQuick}) => asQuick)
        .map(({key}) => key)
    ), newVisibleActions => {
      visibleQuickActions.value = newVisibleActions;
    }, {
      deep: true,
    })

    const visibleColumns = usePersistedSetting(computed(() => `table-${props.tableKey}-columns`), props.columns.map(({field}) => field));

    watch(computed(
      () => props.columns.map(({field}) => field)
    ), newVisibleColumns => {
      visibleColumns.value = newVisibleColumns;
    }, {
      deep: true,
    });

    const computedVisibleColumns = computed(() => (
      props.columns.filter(
        ({field, isRequired}) => visibleColumns.value.includes(field) || isRequired
      ).map(({field}) => field)
    ))

    const resetTableSettings = () => {
      emit('reset');
      visibleColumns.value = props.columns.map(({field}) => field);
    }

    const settingsActions = computed(() => ([
      {
        key: 'display',
        icon: 'levels',
        label: 'Настройки отображения',
        onClick() {
          showDialog({
            component: 'activeTableSettings',
            payload: {
              columns: props.columns,
              modelValue: {
                limit: localLimit.value,
                columns: [...visibleColumns.value],
              },
              onSubmit({limit, columns}) {
                visibleColumns.value = [...columns];
                localLimit.value = limit;
              },
              onReset() {
                resetTableSettings();
              }
            }
          })
        }
      },
      {
        key: 'actions',
        icon: 'ellipsis',
        label: 'Быстрые клавиши',
        onClick() {
          showDialog({
            component: 'activeTableActions',
            payload: {
              actions: props.actions.filter(({asQuick, isFixed}) => asQuick && !isFixed),
              modelValue: visibleQuickActions.value,
              onSubmit(actions) {
                visibleQuickActions.value = props.actions.filter(({key, asQuick, isFixed}) => asQuick && (isFixed || actions.includes(key))).map(({key}) => key);
              }
            }
          })
        }
      },
    ]));

    const actions = computed(() => props.actions.map((action) => ({
      ...action,
      onClick: () => {
        action.handler && action.handler(getActionPayload())
      }
    })))
    const quickActions = computed(() => actions.value.filter(
      ({key}) => visibleQuickActions.value.includes(key)
    ));
    const linedActions = computed(() => ([
      ...actions.value.filter(({asLined}) => asLined),
      props.withAllSelection && !wholeSelected.value && {
        key: '_selectAll',
        label: 'Выбрать всё',
        onClick: () => {
          wholeSelected.value = true;
        },
      },
      props.withAllSelection && wholeSelected.value && {
        key: '_unselectAll',
        label: 'Снять выделение',
        onClick: () => {
          wholeSelected.value = false;
          allSelected.value = false;
          selectedItems.value = [];
        }
      }
    ].filter(Boolean)));
    const controlActions = computed(() => actions.value.filter(
      ({asControl}) => asControl
    ).map(action => ({
      ...action,
      position: 'right',
      align: 'start',
    })));

    const computedColumns = computed(() => ([
      ...props.columns
        .filter(({field}) => computedVisibleColumns.value.includes(field))
        .sort(({field: a}, {field: b}) => computedVisibleColumns.value.indexOf(a) > computedVisibleColumns.value.indexOf(b) ? 1 : -1),
      ...(props.recordActions?.length ? [{
        field: '__actions',
        withLabel: false,
        width: '30px',
      }] : [])
    ]));

    const gridTemplate = computed(() => (
      computedColumns.value.map(({width}) => typeof width === 'string' ? width: `${width || 1}fr`).join(' ')
    ));

    const model = ref({
      filters: null,
      actions: null,
      controls: null,
      lined: null,
    });

    const filtersMap = computed(() => (
      props.filters.reduce((acc, filter) => ({
        ...acc,
        [filter.field] : filter
      }), {})
    ))

    return {
      filtersMap,

      model,

      gridTemplate,
      sortsMap,

      updateSort,

      allSelected,
      selectedItems,
      selectItem,

      setAllSelected,

      contextMenu,
      showContextMenu,
      hideContextMenu,
      contextMenuActions,

      summariesMap,

      localLimit,
      localPage,

      settingsActions,

      quickActions,
      linedActions,
      controlActions,

      wholeSelected,

      localFilters,

      computedColumns,

      isFilterApplied,
      resetFilters,
    }
  }
})
</script>

<style lang="scss" module>
@import "./activeTable";
</style>
