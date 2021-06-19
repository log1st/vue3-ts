<template>
  <div :class="$style.container">
    <div :class="$style.controls">
      <Actions :actions="quickActions" :class="$style.actions"/>
      <Actions :actions="settingsActions" :class="$style.actions"/>
      <Actions :actions="controlActions" :class="$style.actions"/>
      <div :class="$style.linedActions">
        <div :class="$style.linedAction" v-for="action in linedActions" :key="action.key" @click="action.onClick">
          {{action.label}}
        </div>
      </div>
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
          }]"
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
    </div>
    <div :class="$style.table">
      <div :class="[$style.header, $style.grid]" :style="{gridTemplateColumns: gridTemplate}">
        <template v-for="column in columns">
          <Checkbox
            v-if="isSelectable && selectableColumn === column.field"
            :class="[$style.cell, $style.selectAll]"
            :key="column.field"
            :model-value="allSelected || wholeSelected"
            @update:modelValue="setAllSelected"
            pre-label="Выделить все"
          />
          <div
            v-else
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
      <ContextMenu
        v-if="contextMenu.isActive"
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
                :columns="columns"
                :record="record"
                :selectable-column="selectableColumn"
                :is-selected="allSelected || wholeSelected || selectedItems.includes(index)"
                @select="selectItem(index)"
                :index="index"
                :class="$style.record"
                @contextmenu="showContextMenu(index, $event)"
              >
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
      <div :class="[$style.footer, $style.grid]" :style="{gridTemplateColumns: gridTemplate}">
        <div :class="$style.cell" v-for="column in columns" :key="column.field">
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

export default defineComponent({
  name: "ActiveTable",
  components: {
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
    summaries: Object,
    summariesFields: Array,
    summariesLabel: String,
    sort: Array,
    actions: Array,
    contextActions: Array,
    total: Number,
    page: Number,
    limit: Number,
    filters: Array,
    filtersModel: Object,
  },
  setup(props, {emit}) {
    const gridTemplate = computed(() => (
      props.columns.map(({width}) => typeof width === 'string' ? width: `${width || 1}fr`).join(' ')
    ));

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

    watch(localPage, () => {
      setAllSelected(false);
    });
    watch(localLimit, () => {
      setAllSelected(false);
    });

    const settingsActions = computed(() => ([
      {
        key: 'display',
        icon: 'levels',
        label: 'Настройки отображения',
        onClick() {
          alert('settings');
        }
      },
      {
        key: 'actions',
        icon: 'ellipsis',
        label: 'Быстрые клавиши',
        onClick() {
          alert('actions');
        }
      },
    ]));

    const actions = computed(() => props.actions.map((action) => ({
      ...action,
      onClick: () => {
        action.handler && action.handler(getActionPayload())
      }
    })))
    const quickActions = computed(() => actions.value.filter(({asQuick}) => asQuick));
    const linedActions = computed(() => ([
      ...actions.value.filter(({asLined}) => asLined),
      !wholeSelected.value && {
        key: '_selectAll',
        label: 'Выбрать всё',
        onClick: () => {
          wholeSelected.value = true;
        },
      },
      wholeSelected.value && {
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

    const model = ref({
      filters: null,
    });

    return {
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
    }
  }
})
</script>

<style lang="scss" module>
@import "./activeTable";
</style>
