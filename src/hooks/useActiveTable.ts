import {
  computed, ref, Ref, watch,
} from 'vue';
import {
  ListingRequestSource, ListingResponse, Order, OrderDirection,
} from '@/store/modules/api';
import { IActiveForm, ActiveFormModel } from '@/hooks/useActiveForm';

export enum ActiveTableColumnFormat {
  string = 'string',
  date = 'date',
  dateTime = 'dateTime',
  money = 'money',
  number = 'number',
  phone = 'phone',
}

export type ActiveTableColumn<T extends Record<any, any>> = {
  key: string | keyof T | 'index';
  field?: keyof T | string | 'index';
  isSortable?: boolean;
  isRequired?: boolean;
  width?: number | string;
  label?: string;
  format?: ActiveTableColumnFormat;
  allowEmpty?: boolean;
}

export enum ActionType {
  default = 'default',
  subDefault = 'subDefault',
  line = 'line',
  side = 'side',
  record = 'record',
  context = 'context',
}

export type ActiveTableActionPayload<T extends Record<any, any>, KeyField extends keyof T> = {
  selectedItems: Array<T[KeyField]>;
  allSelected: boolean;
}

export type ActiveTableAction<T extends Record<any, any>, KeyField extends keyof T> = {
  key: string;
  label?: string;
  hint?: string;
  icon?: string;
  active?: boolean;
  types: Array<ActionType> | ActionType;
  group?: number;
  handler?(params: ActiveTableActionPayload<T, KeyField>): Promise<void> | void;
  check?(params: {record: T; index: number}): boolean;
}

export enum ActiveTableState {
  default = 'default'
}

export type ActiveTable<
  T extends Record<any, any>,
  RecordT extends Record<any, any>,
  KeyField extends keyof T
> = {
  state?: ActiveTableState | Array<ActiveTableState>;
  keyField: KeyField;
  columns?: Ref<Array<ActiveTableColumn<T>>>;
  filters?: Ref<IActiveForm<T>['fields']>;
  actions?: Ref<Array<ActiveTableAction<T, KeyField>>>;
  defaultSort?: Ref<Array<Order<T>>>;
  defaultLimit?: Ref<number>;
  defaultPage?: Ref<number>;
  fetch(params: {
    params: ListingRequestSource<T>;
    signal?: AbortSignal;
  }): Promise<ListingResponse<RecordT>>;
  resetOnQuery?: boolean;
  summaries?: Ref<Array<Partial<keyof RecordT>>>;
}

export const useActiveTable = <
  T extends Record<any, any>,
  RecordT extends Record<any, any>,
  KeyField extends keyof RecordT,
  >({
    keyField,
    columns,
    actions = ref<Array<ActiveTableAction<T, KeyField>>>([]),
    filters = ref<IActiveForm<T>['fields']>([]),
    defaultLimit = ref(0),
    defaultPage = ref(1),
    fetch,
    defaultSort = ref<Array<Order<T>>>([]),
    resetOnQuery,
    summaries: summariesFields,
  }: ActiveTable<T, RecordT, KeyField> = {} as ActiveTable<T, RecordT, KeyField>) => {
  const records = ref<Array<RecordT>>([]);

  const summaries = ref<Record<keyof Partial<RecordT> & any, number>>({});

  const limit = ref(defaultLimit?.value || 0);
  watch(defaultLimit, (newLimit) => {
    limit.value = newLimit;
  });
  const page = ref(defaultPage?.value || 1);
  watch(defaultPage, (newPage) => {
    page.value = newPage;
  });
  const total = ref(0);

  const sort = ref<Array<Order<T>>>(defaultSort?.value || [{
    key: keyField,
    direction: OrderDirection.asc,
  }]);
  watch(defaultSort, (newSort) => {
    sort.value = newSort as typeof sort.value;
  });

  const calcFiltersModel = <T>(localFilters: IActiveForm<T>['fields']): ActiveFormModel<T> => (
    localFilters.reduce((acc, cur) => ({
      ...acc,
      [cur.key]: cur.defaultValue ?? null,
    }), {} as ActiveFormModel<T>)
  );
  const filtersModel = ref<ActiveFormModel<T>>(calcFiltersModel(filters?.value || []));
  watch(filters, (newFilters) => {
    filtersModel.value = calcFiltersModel(newFilters || []) as typeof filtersModel.value;
  }, {
    deep: true,
  });

  let abortController: AbortController | null;

  const isLoading = ref(false);
  const isLoaded = ref(false);

  const fetchData = async () => {
    if (resetOnQuery) {
      records.value = [];
    }
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();
    isLoading.value = true;
    isLoaded.value = false;
    try {
      const { count, results, total: summariesTotal } = await fetch({
        params: {
          limit: limit.value,
          page: page.value,
          ordering: sort.value,
          filters: filtersModel.value as ActiveFormModel<T>,
        },
        signal: abortController?.signal,
      });
      records.value = results as typeof records.value;
      total.value = count;
      if (summariesTotal) {
        summaries.value = summariesTotal;
      }
    } catch (e) {
      console.log(e);
      // Possibly aborted, who knows...
    }

    isLoading.value = false;
    isLoaded.value = true;
  };

  watch(limit, async () => {
    if (page.value !== 1) {
      page.value = 1;
    } else {
      await fetchData();
    }
  }, {
    immediate: true,
  });
  watch(page, fetchData);
  watch(sort, fetchData, { deep: true });
  watch(
    computed(() => JSON.stringify(filtersModel.value)),
    async (newValue, oldValue) => {
      if (newValue === oldValue) {
        return;
      }
      if (page.value !== 1) {
        page.value = 1;
      } else {
        await fetchData();
      }
    },
    { deep: true },
  );

  return {
    keyField,
    records,
    columns,
    filters,
    filtersModel,
    actions,
    limit,
    defaultLimit,
    page,
    total,
    sort,
    fetchData,
    summariesFields,
    summaries,
    isLoading,
    isLoaded,
  };
};

export const getDefaultListingRequestSource = <T>(key?: keyof T): ListingRequestSource<T> => ({
  page: 1,
  limit: 100000,
  ordering: key ? [{ key, direction: OrderDirection.asc }] : [],
  filters: {} as ActiveFormModel<T>,
});

export const formatListingRequest = <T>({
  ordering,
  page,
  limit,
  filters,
}: ListingRequestSource<T>) => ({
    ordering: ordering?.reduce(
      (acc, cur) => (
        `${acc},${cur.direction === 'asc' ? '' : '-'}${cur.key}`
      ), '',
    )?.replace(/^,/, '') || '',
    limit,
    offset: (page - 1) * limit,
    ...filters,
  }) || '';

export const formatListingResponse = <T>({
  count, results, total,
}: ListingResponse<T>): ListingResponse<T> => ({
    count,
    results: results?.map?.((result, index) => ({
      ...result,
      index: (result as any).index ?? (index + 1),
    })) || [],
    total,
  });
