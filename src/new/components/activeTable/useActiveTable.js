import {ref, watch} from "@vue/composition-api";
import axios from 'axios';
import {isSameObject} from "@/new/utils/object";

export const useActiveTable = ({
  filters = ref([]),
  sort = ref([]),
  actions = ref([]),
  contextActions = ref([]),
  columns = ref([]),
  fetch,
  isImmediate = true,
  defaultLimit = ref(5),
  defaultPage = ref(1),
} = {}) => {
  const isFetching = ref(false);
  let cancelRequest = null;

  const resetSettings = () => {
    limit.value = defaultLimit.value;
  }

  const total = ref(null);
  const limit = ref(defaultLimit.value);
  const page = ref(defaultPage.value);

  const records = ref([]);
  const summaries = ref({});

  const filtersModel = ref();

  watch(filters, (newFilters) => {
    const newModel = newFilters.reduce((acc, cur) => ({
      ...acc,
      [cur.field]: JSON.parse(JSON.stringify(cur.defaultValue || null))
    }), {});
    if(!isSameObject(newModel, filtersModel.value)) {
      filtersModel.value = newModel;
    }
  }, {
    immediate: true,
    deep: true,
  })

  const fetchData = async () => {
    await new Promise(requestAnimationFrame);
    if(isFetching.value) {
      try {
        cancelRequest()
      } catch (e) {
        console.log('Unable to fetch', e);
      }
    }
    isFetching.value = true;

    const response = await fetch({
      params: {
        ...filtersModel.value,
        limit: limit.value,
        offset: limit.value * (page.value - 1),
        o: sort.value.map(({field, direction}) => `${direction === 'asc' ? '' : '-'}${field}`).join(','),
      },
      cancelToken: new axios.CancelToken(token => {
        cancelRequest = token;
      }),
    });

    total.value = response.data.count;
    records.value = response.data.results;
    summaries.value = response.data.summaries;

    isFetching.value = false;
    cancelRequest = null;
  }

  watch(filtersModel, fetchData, {
    immediate: isImmediate,
    deep: true,
  });
  watch(sort, fetchData, {
    deep: true,
  });
  watch(page, fetchData);
  watch(limit, fetchData);

  const dropRecords = () => {
    records.value = [];
  }

  return {
    isFetching,
    fetchData,

    total,
    page,
    limit,

    records,

    columns,

    filters,
    filtersModel,

    sort,

    actions,
    contextActions,

    summaries,

    resetSettings,

    dropRecords,
  }
}
