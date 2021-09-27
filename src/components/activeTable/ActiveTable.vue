<template>
  <div
    :class="[
      $style.activeTable,
      ...(arrayFrom(state).map(s => $style[s]))
    ]"
  >
    <div
      v-if="actionsMap.default?.length || actionsMap.side?.length || actionsMap.line?.length"
      :class="$style.top"
    >
      <div
        v-for="[key, group] in Object.entries(actionsMap.default?.reduce((acc, action) => ({
          ...acc,
          [action.group || 1]: [...acc[action.group || 1] || [], action]
        }), {}) || {})"
        :key="key"
        :class="$style.defaultActions"
      >
        <component
          :is="action.hint ? 'TooltipWrapper' : 'div'"
          v-for="action in group"
          :key="action.key"
          :label="action.hint"
          :class="$style.actionWrapper"
        >
          <Btn
            :class="$style.action"
            data-role="action"
            :state="[
              {
                default: action.active ? 'secondary' : 'primary',
                tertiary: action.active ? 'primary' : 'secondary',
              }[state],
              arrayFrom(state).includes('secondary') && 'tertiary'
            ]"
            :label="[
              {}[state],
              arrayFrom(state).includes('secondary') && action.label
            ].find(Boolean)"
            :prepend-icon="{
              default: action.icon,
              tertiary: action.icon
            }[state]"
            @click="action.handler(actionPayload)"
          />
        </component>
      </div>
      <div
        v-if="actionsMap.line?.length"
        :class="$style.lineActions"
      >
        <button
          v-for="action in actionsMap.line"
          :key="action.key"
          type="button"
          :class="$style.action"
          @click="action.handler(actionPayload)"
        >
          {{ action.label }}
        </button>
      </div>
      <div
        v-if="withSummaries"
        :class="$style.summaries"
      >
        <div :class="$style.summary">
          {{ t('summaries.selected', {
            selected: wholeSelected ? total : (allSelected ? records.length : selectedItems.length),
            total: total
          }) }}
        </div>
        <div :class="$style.summary">
          {{ t('summaries.shown', {
            shown: records.length,
            total: total,
            from: (page - 1) * limit + 1,
            to: Math.min(page * limit, total)
          }) }}
        </div>
      </div>
      <div :class="$style.sideActions">
        <Btn
          v-for="action in actionsMap.side"
          :key="action.key"
          :class="$style.action"
          :state="[
            {
              default: action.active ? 'tertiary' : 'primary',
              simple: 'tertiary',
              tertiary: action.active ? 'primary' : 'secondary',
            }[state],
            arrayFrom(state).includes('secondary') && 'primary'
          ]"
          :label="[
            {
              default: action.label,
              simple: action.label,
            }[state],
            arrayFrom(state).includes('secondary') && action.label
          ].find(Boolean)"
          :prepend-icon="{
            default: action.icon,
            tertiary: action.icon,
            simple: !action.active && action.icon,
          }[state]"
          :append-icon="{
            simple: action.active && action.icon
          }[state]"
          @click="action.handler(actionPayload)"
        />
      </div>
      <ActiveForm
        v-if="isFiltersVisible && !!filters.length && arrayFrom(state).includes('tertiary')"
        v-model="localFiltersModel"
        v-model:active="isFiltersVisible"
        :class="$style.filters"
        :fields="filters"
        :emit-on-update="false"
        exclude-invisible
        :cancel-label="t('filters.reset')"
        :submit-label="t('filters.submit')"
      />
    </div>
    <div :class="$style.table">
      <div :class="$style.tableWrapper">
        <div
          v-if="`row-header(${getDeepField(records[0], keyField)})` in $slots"
          :class="$style.rowHeader"
        >
          <slot
            :name="`row-header(${getDeepField(records[0], keyField)})`"
            :record="records[0]"
            :index="0"
          />
        </div>
        <div
          :class="[
            $style.row,
            $style.header,
          ]"
          :style="{gridTemplateColumns: gridTemplate}"
        >
          <div
            v-for="column in computedColumns"
            :key="column.key"
            :class="[
              $style.cell,
              column.isSortable && $style.sortable
            ]"
            v-on="column.isSortable ? {
              click: () => sortColumn(column.key)
            } : {}"
          >
            <div :class="$style.cellLabel">
              <slot :name="`header(${column.key})`">
                {{ column.label }}
              </slot>
              <button
                v-if="column.isSortable"
                :class="[
                  $style.sort,
                  (column.key in sortMap) && $style[sortMap[column.key].direction]
                ]"
              >
                <Icon
                  :icon="{
                    tertiary: (column.key in sortMap) ? (
                      `sort-${sortMap[column.key].direction}`
                    ) : 'sort'
                  }[state] || 'chevron'"
                  data-role="icon"
                />
              </button>
            </div>
            <div
              v-if="isSelectable && !withUniqueSelection && (selectableColumn === column.key)"
              :class="$style.select"
            >
              <div
                v-if="['tertiary'].includes(state)"
                :class="$style.selectLabel"
              >
                {{ t('select') }}
              </div>
              <Checkbox
                v-model="allSelected"
                @update:modelValue="wholeSelected = false"
                @click.stop="selectedItems = []"
              />
            </div>
          </div>
        </div>
        <div :class="$style.body">
          <div
            v-if="state === 'default' && filters && isFiltersVisible"
            :class="[
              $style.row,
              $style.record,
            ]"
            :style="{gridTemplateColumns: gridTemplate}"
          >
            <div
              v-for="column in computedColumns"
              :key="column.key"
              :class="[
                $style.cell,
                $style.filter,
              ]"
            >
              <ActiveField
                v-if="column.key in filtersMap"
                v-model="localFiltersModel[column.key]"
                :class="$style.filterField"
                v-bind="filtersMap[column.key]"
                state="primary"
              />
            </div>
          </div>
          <template
            v-for="(record, index) in records"
            :key="getDeepField(record, keyField)"
          >
            <div
              v-if="index > 0 && (`row-header(${getDeepField(record, keyField)})` in $slots)"
              :class="$style.rowHeader"
            >
              <slot
                :name="`row-header(${getDeepField(record, keyField)})`"
                :record="record"
                :index="index"
              />
            </div>
            <Var
              :selected="(allSelected || wholeSelected || selectedItems.includes(
                getDeepField(record, keyField)
              ))"
            >
              <template #="{selected}">
                <div
                  :class="[
                    $style.row,
                    $style.record,
                    (onRowClick || isSelectable) && $style.hoverable,
                    selected && $style.selected
                  ]"
                  :style="{gridTemplateColumns: gridTemplate}"
                >
                  <div
                    v-for="column in computedColumns"
                    :key="column.key"
                    :class="$style.cell"
                    :data-cell="column.key"
                    @click="rowClick(record, column.key, $event)"
                  >
                    <div
                      v-if="column.key === '__actions'"
                      :class="$style.cellLabel"
                    >
                      <div :class="$style.recordActions">
                        <Btn
                          v-for="action in actionsMap.record.filter(({
                            check,
                          }) => (
                            check ? check({record, index}) : true
                          ))"
                          :key="action.key"
                          :prepend-icon="action.icon"
                          :class="$style.action"
                          :state="[
                            {
                              default: 'secondary',
                              simple: 'line',
                            }[state],
                            arrayFrom(state).includes('secondary') && (
                              arrayFrom(state).includes('staticActions') ? 'quinary' : 'secondary'
                            ),
                          ]"
                          :data-role="`action(${action.key})`"
                          @click.stop="action.handler({
                            selectedItems:[getDeepField(record, keyField)]
                          })"
                        />
                      </div>
                    </div>
                    <template v-else>
                      <div :class="$style.cellLabel">
                        <Var :value="formatValue(record, column, $i18n.locale)">
                          <template #="{value}">
                            <slot
                              :name="`cell(${column.key})`"
                              :record="record"
                              :index="index"
                              :fieldValue="value"
                            >
                              <template
                                v-if="![null, undefined].includes(
                                  getDeepField(record, column.field || column.key)
                                )"
                              >
                                {{ value }}
                              </template>
                              <NA v-else-if="!column.allowEmpty" />
                            </slot>
                          </template>
                        </Var>
                      </div>
                      <div
                        v-if="isSelectable && (selectableColumn === column.key)"
                        :class="$style.select"
                      >
                        <Checkbox
                          :model-value="selected"
                        />
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </Var>
          </template>
          <slot
            v-if="'footer' in $slots"
            name="footer"
            :classes="[$style.row]"
            :grid-template="gridTemplate"
          />
        </div>
        <div
          v-if="summariesFields?.length"
          :class="[$style.row, $style.footer]"
          :style="{gridTemplateColumns: gridTemplate}"
        >
          <div
            v-for="(column, index) in computedColumns"
            :key="column.key"
            :class="$style.cell"
          >
            <template v-if="index === 1">
              {{ t('total') }}
            </template>
            <template v-if="summariesFields.includes(column.key)">
              {{ formatMoney(computedSummaries[column.key], 'RUB', $i18n.locale) }}
            </template>
          </div>
        </div>
      </div>
    </div>
    <Pagination
      v-if="![undefined, null].includes(total) && (total / localLimit) > 1"
      v-model:page="localPage"
      v-model:limit="localLimit"
      :class="$style.pagination"
      :total="total"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onBeforeUnmount, PropType, ref, watch,
} from 'vue';
import {
  ActionType,
  ActiveTable,
  ActiveTableAction,
  ActiveTableActionPayload,
  ActiveTableColumn,
  ActiveTableColumnFormat,
} from '@/hooks/useActiveTable';
import { arrayFrom, getDeepField, isEqual } from '@/utils/object';
import { Order, OrderDirection, OrderMap } from '@/store/modules/api';
import { useLocalValue } from '@/hooks/useLocalValue';
import Icon from '@/components/icon/Icon.vue';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import { ActiveFormField, ActiveFormModel, IActiveForm } from '@/hooks/useActiveForm';
import ActiveField from '@/components/activeField/ActiveField.vue';
import Btn from '@/components/btn/Btn.vue';
import { useToggle } from '@/hooks/useToggle';
import NA from '@/components/na/NA.vue';
import { formatMoney, formatNumber, formatPhone } from '@/utils/string';
import { formatDate } from '@/utils/date';
import Pagination from '@/components/pagination/Pagination.vue';
import { IDialogComponent, useDialog } from '@/hooks/useDialog';
import ActiveForm from '@/components/activeForm/ActiveForm.vue';
import { SignalType, useSignal } from '@/hooks/useSignal';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import TooltipWrapper from '@/components/tooltip/TooltipWrapper.vue';

export default defineComponent({
  name: 'ActiveTable',
  components: {
    TooltipWrapper,
    ActiveForm,
    Pagination,
    NA,
    Btn,
    ActiveField,
    Checkbox,
    Icon,
  },
  props: {
    columns: Array as PropType<Array<ActiveTableColumn<any>>>,
    filters: Array as PropType<IActiveForm<any>['fields']>,
    filtersModel: Object as PropType<ActiveFormModel<any>>,
    actions: Array as PropType<Array<ActiveTableAction<any, any>>>,
    sort: Array as PropType<Array<Order<any>>>,
    state: [String, Array] as PropType<ActiveTable<any, any, any>['state']>,
    records: Array as PropType<Array<any>>,
    keyField: String as PropType<ActiveTable<any, any, any>['keyField']>,
    summaries: Object as PropType<ActiveTable<any, any, any>['summaries']>,
    summariesFields: Array as PropType<string[]>,
    limit: Number,
    defaultLimit: Number,
    page: Number,
    total: Number,
    isSelectable: Boolean,
    withUniqueSelection: Boolean,
    initiallySelectedItems: Array as PropType<string[]>,
    selectableColumn: String as PropType<string>,
    onRowClick: Function,
    withTableActions: Boolean,
    tableKey: {
      type: String,
      required: true,
    },
    withSummaries: Boolean,
  },
  emits: ['update:sort', 'update:limit', 'update:page', 'rowClick', 'update:filtersModel', 'select'],
  setup(props, { emit }) {
    const { t } = useLocalI18n('activeTable');

    const [isFiltersVisible, toggleFilters] = useToggle();

    const {
      showDialog,
    } = useDialog();

    const visibleColumns = ref<Array<ActiveTableColumn<any>['key']>>([]);
    watch(computed(() => props.columns), (columns) => {
      visibleColumns.value = columns?.map(({ key }) => key) || [];
    }, {
      deep: true,
      immediate: true,
    });

    const {
      subscribeToSignal,
    } = useSignal();

    const localPage = useLocalValue(props, 'page', emit);
    const localLimit = useLocalValue(props, 'limit', emit);

    onBeforeUnmount(
      subscribeToSignal(
        SignalType.tableSettings,
        (payload: {tableKey: string; columns: string[]; limit: number}) => {
          if (payload.tableKey === props.tableKey) {
            visibleColumns.value = payload.columns;
            localLimit.value = payload.limit;
          }
        },
      ),
    );

    const defaultFilter = computed(
      () => (props.filters || []).reduce((acc, cur) => ({
        ...acc,
        [cur.field]: JSON.parse(JSON.stringify(cur.defaultValue || null)),
      }), {}),
    );
    const isFilterApplied = computed(() => (
      !isEqual(
        defaultFilter.value,
        props.filtersModel,
      )
    ));
    const resetFilters = () => {
      emit('update:filtersModel', JSON.parse(JSON.stringify(defaultFilter.value)));
    };

    const visibleDefaultActions = ref<string[]>([]);
    watch(computed(() => props.actions?.length), () => {
      visibleDefaultActions.value = props.actions?.filter(
        ({ types }) => arrayFrom(types).includes(ActionType.default),
      ).map(({ key }) => key) || [];
    }, {
      immediate: true,
    });

    onBeforeUnmount(
      subscribeToSignal(SignalType.tableActions, ({
        tableKey,
        actions,
      }: {
        tableKey: string;
        actions: string[];
      }) => {
        if (props.tableKey === tableKey) {
          visibleDefaultActions.value = [...actions];
        }
      }),
    );

    const allSelected = ref(false);
    const wholeSelected = ref(false);
    const selectedItems = ref<Array<any>>(props.initiallySelectedItems || []);

    const localActions = computed<Array<ActiveTableAction<any, any>>>(() => ([
      ...props.actions || [],
      props.withTableActions && {
        key: 'display',
        icon: 'levels',
        hint: t('action.display'),
        types: [ActionType.default],
        group: 1.5,
        async handler() {
          await showDialog({
            component: IDialogComponent.tableDisplaySettings,
            payload: {
              limit: props.limit!,
              defaultLimit: props.defaultLimit!,
              visibleColumns: visibleColumns.value || [],
              columns: props.columns?.map(({ key, label, isRequired }) => ({
                key,
                label,
                isRequired,
              })) || [],
              tableKey: props.tableKey,
            },
          });
        },
      },
      props.withTableActions && {
        key: 'actions',
        icon: 'ellipsis',
        hint: t('action.actions'),
        types: [ActionType.default],
        group: 1.5,
        async handler() {
          await showDialog({
            component: IDialogComponent.actionsSelector,
            payload: {
              actions: localActions.value.filter(({
                types, group,
              }) => types.includes(ActionType.default) && (!group || !(group! % 1))),
              visibleActions: visibleDefaultActions.value,
              tableKey: props.tableKey,
            },
          });
        },
      },
      props.filters?.length && {
        key: 'filters',
        icon: isFiltersVisible.value ? 'close' : 'magnifier',
        active: isFiltersVisible.value,
        label: t('action.filters'),
        types: [({ tertiary: ActionType.side } as any)[props.state as any] || ActionType.default],
        handler: () => {
          toggleFilters();
        },
      },
      (props.filters?.length && isFilterApplied.value) && {
        key: 'resetFilters',
        icon: 'reset',
        label: t('action.resetFilters'),
        types: [({ tertiary: ActionType.side } as any)[props.state as any] || ActionType.default],
        handler: resetFilters,
      },
      arrayFrom(props.state).includes('tertiary') && {
        key: 'select',
        label: t(`action.${wholeSelected.value ? 'deselectAll' : 'selectAll'}`),
        types: [ActionType.line],
        handler: () => {
          wholeSelected.value = !wholeSelected.value;
          allSelected.value = false;
          selectedItems.value = [];
        },
      },
    ].filter(Boolean) as Array<ActiveTableAction<any, any>>));

    const actionsMap = computed<{
      [key in ActionType]: Array<ActiveTableAction<any, any>>
    }>(() => {
      const map = localActions.value.reduce((acc, { types }) => ({
        ...acc,
        ...arrayFrom(types).reduce((subAcc, type) => ({ ...subAcc, [type]: [] }), {}),
      }), {} as {
        [key in ActionType]: Array<ActiveTableAction<any, any>>
      });

      localActions.value.forEach((action) => {
        arrayFrom(action.types).forEach((type) => {
          map[type as keyof typeof map].push(action);
        });
      });

      if (map[ActionType.default]) {
        map[ActionType.default] = map[ActionType.default].filter(
          ({ key: k, group }) => visibleDefaultActions.value.includes(k)
            || (!group || (group === 1.5)),
        );
      }

      return map;
    });

    const computedColumns = computed<Array<ActiveTableColumn<any>>>(() => ([
      ...(props.columns?.filter(({ key }) => (visibleColumns.value.includes(key))) || []),
      ...(('record' in actionsMap.value) ? [
        {
          key: '__actions',
        },
      ] : []),
    ]));

    const gridTemplate = computed(() => (
      computedColumns.value.map(({ key, width }) => (
        key === '__actions' && arrayFrom(props.state).includes('secondary')
          ? 'minmax(150px, auto)'
          : (typeof width === 'string') ? width : `${width || 1}fr`
      )).join(' ')
    ));

    const localSort = useLocalValue(props, 'sort', emit);
    const sortMap = computed<OrderMap<any>>(() => (
      localSort.value?.reduce((acc, { key, direction }, order) => ({
        ...acc,
        [key]: {
          order,
          direction,
        },
      }), {} as OrderMap<any>) || ({} as OrderMap<any>)
    ));
    const sortColumn = (column: string) => {
      if (!localSort.value) {
        return;
      }
      const lSort = [...localSort.value];
      const index = lSort.findIndex(({ key }) => key === column);
      if (index > -1) {
        localSort.value = sortMap.value[column].direction === OrderDirection.desc
          ? lSort.filter((item, i) => i !== index)
          : lSort.map((item, i) => ((index === i) ? {
            ...item,
            direction: OrderDirection.desc,
          } : item));
      } else {
        localSort.value = [
          ...lSort || [],
          {
            key: column,
            direction: OrderDirection.asc,
          },
        ];
      }
    };
    watch(computed(() => props.initiallySelectedItems), (items) => {
      selectedItems.value = items || [];
    });
    const selectItem = (item: any) => {
      const index = selectedItems.value.indexOf(item);
      if (props.withUniqueSelection) {
        selectedItems.value = [item];
        return;
      }
      if (index > -1) {
        selectedItems.value.splice(index, 1);
      } else if (allSelected.value || wholeSelected.value) {
        selectedItems.value = (props.records
          ?.map((record) => getDeepField(record, props.keyField)) || [])
          .filter((i) => i !== item);
        allSelected.value = false;
      } else if (selectedItems.value.length === ((props.records?.length || 0) - 1)) {
        selectedItems.value = [];
        allSelected.value = true;
      } else {
        selectedItems.value.push(item);
      }
      wholeSelected.value = false;
    };

    const filtersMap = computed<{
      [key in ActiveFormField<any>['key']]: ActiveFormField<any>
    }>(() => (props.filters || []).reduce((acc, filter) => ({
      ...acc,
      [filter.key]: filter,
    }), {}));

    const localFiltersModel = useLocalValue(props, 'filtersModel', emit, true);
    watch(computed(() => ({
      page: localPage.value,
      limit: localLimit.value,
      filters: localFiltersModel.value,
      sort: localSort.value,
    })), () => {
      selectedItems.value = [];
      allSelected.value = false;
      wholeSelected.value = false;
    }, {
      deep: true,
    });

    const actionPayload = computed<ActiveTableActionPayload<any, any>>(() => ({
      selectedItems: allSelected.value
        ? props.records?.map((record) => getDeepField(record, props.keyField)) || []
        : [...selectedItems.value],
      allSelected: wholeSelected.value,
    }));

    const rowClick = (record: Record<any, any>, key: string, event: PointerEvent) => {
      if (props.isSelectable && key === props.selectableColumn) {
        const value = getDeepField(record, props.keyField);
        selectItem(value);
        emit('select', selectedItems.value);
      } else {
        emit('rowClick', { record, event });
      }
    };

    const formatValue = (
      record: Record<any, any>,
      column: ActiveTableColumn<any>,
      locale: string,
    ) => ({
      [ActiveTableColumnFormat.number]:
        () => formatNumber(getDeepField(record, column.field || column.key), locale),
      [ActiveTableColumnFormat.string]:
        () => getDeepField(record, column.field || column.key),
      [ActiveTableColumnFormat.date]:
        () => formatDate(getDeepField(record, column.field || column.key), locale),
      [ActiveTableColumnFormat.dateTime]:
        () => formatDate(getDeepField(record, column.field || column.key), locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          minute: '2-digit',
          hour: '2-digit',
          second: '2-digit',
        }),
      [ActiveTableColumnFormat.money]:
        () => formatMoney(+getDeepField(record, column.field || column.key), 'RUB', locale),
      [ActiveTableColumnFormat.phone]:
        () => formatPhone(getDeepField(record, column.field || column.key)),
    }[column.format || ActiveTableColumnFormat.string])();

    const recordsMap = computed(() => (
      props.records?.reduce((acc, cur) => ({
        ...acc,
        [getDeepField(cur, props.keyField)]: cur,
      }), {}) || {}
    ) as any);

    const computedSummaries = computed(() => (
      (props.summariesFields || []).reduce((acc, cur) => ({
        ...acc,
        [cur]: allSelected.value ? (
          props.records?.reduce((subAcc, record) => subAcc + getDeepField(record, cur) || 0, 0)
        ) : (
          selectedItems.value.length ? (
            selectedItems.value.reduce(
              (subAcc, keyField) => subAcc + getDeepField(recordsMap.value[keyField], cur) || 0,
              0,
            )
          ) : props.summaries?.[cur as keyof typeof props.summaries] || 0
        ),
      }), {})
    ));

    return {
      defaultFilter,
      isFilterApplied,

      computedSummaries,

      localPage,
      localLimit,

      t,

      arrayFrom,
      formatValue,

      computedColumns,
      gridTemplate,

      localSort,
      sortMap,

      sortColumn,

      allSelected,
      wholeSelected,
      selectedItems,
      selectItem,

      filtersMap,
      localFiltersModel,
      isFiltersVisible,

      actionsMap,
      actionPayload,

      rowClick,

      getDeepField,
      formatMoney,
    };
  },
});
</script>

<style lang="scss" module>
@import "./activeTable";
</style>
