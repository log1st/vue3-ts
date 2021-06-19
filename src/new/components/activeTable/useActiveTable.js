import {ref, watch} from "@vue/composition-api";
import axios from 'axios';

export const useActiveTable = ({
  filters = ref([]),
  sort = ref([]),
  actions = ref([]),
  contextActions = ref([]),
  columns = ref([]),
  fetch,
} = {}) => {
  const isFetching = ref(false);
  let cancelRequest = null;

  const total = ref(null);
  const limit = ref(1000);
  const page = ref(1);

  const records = ref([]);
  const summaries = ref({});

  const filtersModel = ref({});

  watch(filters, (newFilters) => {
    filtersModel.value = newFilters.reduce((acc, cur) => ({
      ...acc,
      [cur.field]: cur.defaultValue || null
    }), {})
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
        console.log('blya', e);
      }
    }
    isFetching.value = true;

    const response = await fetch({
      params: {
        ...filtersModel.value,
        limit: limit.value,
        offset: limit.value * (page.value - 1),
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
    immediate: true,
    deep: true,
  });
  watch(page, fetchData);
  watch(limit, fetchData);

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
  }
}
