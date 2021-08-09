<template>
  <div :class="$style.dialog">
    <div :class="$style.title">
      Статус работы с {{
        allSelected || (selectedItems ? selectedItems.length : false) ? 'должниками' : 'должником'
      }}
    </div>
    <form
      v-if="isActive"
      @submit.prevent="submit"
      :class="$style.form"
    >
      <SelectInput
        :options="history"
        placeholder="Статус"
        :class="$style.field"
        v-model="activeHistoryValue"
        display-prop="label"
        value-prop="status"
      />
      <template v-if="activeHistory">
        <template v-if="activeHistoryValue === 'other'">
          <template
            v-for="(item, index) in activeHistory.substatus"
          >
            <TextInput
              :key="`${index}-value`"
              placeholder="Подстатус"
              :model-value="item.substatus"
              @update:modelValue="updateSubstatus(index, 'substatus', $event)"
              :class="$style.field"
              :is-disabled="!!item.updated_at"
            />
            <TextInput
              :key="`${index}-data`"
              placeholder="Комметарий"
              :model-value="item.data"
              @update:modelValue="updateSubstatus(index, 'data', $event)"
              :class="$style.field"
              :is-disabled="!!item.updated_at"
            />
          </template>
          <Btn @click="addSubstatus" :class="$style.addSubstatus" label="Добавить подстатус"/>
        </template>
        <template v-else>
          <template
            v-for="(item, index) in activeHistory.substatus"
          >
            <SelectInput
              :key="`${index}-value`"
              :options="activeHistoryItems"
              placeholder="Подстатус"
              :class="$style.field"
              v-model="item.substatus"
              is-disabled
            />
            <TextInput
              :key="`${index}-data`"
              v-model="item.data"
              v-if="item.data"
              :class="$style.field"
              placeholder="Комментарий"
              is-disabled
            />
          </template>
        </template>
      </template>
      <Btn
        state="primary"
        type="submit"
        :class="$style.submit"
        :is-disabled="!isSubmitAvailable"
      >
        Применить
      </Btn>
    </form>
    <div :class="$style.hint" v-else>
      Выберите должника
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, ref, watch} from '@vue/composition-api';
import SelectInput from "@/new/components/selectInput/SelectInput";
import {useDicts} from "@/new/hooks/useDicts";
import Btn from "@/new/components/btn/Btn";
import {baseURL} from "@/settings/config";
import {useStore} from "@/new/hooks/useStore";
import TextInput from "@/new/components/textInput/TextInput";

export default defineComponent({
  name: "DebtorsStatusDialog",
  components: {TextInput, Btn, SelectInput},
  props: {
    allSelected: Boolean,
    selectedItems: Array,
    selectedItem: Number,
    type: String,
    filters: Object,
    debtorId: Object,
  },
  setup(props, {emit}) {
    const store = useStore();
    const companyId = computed(() => (
      store.getters['defaultCompanyId']
    ))
    const {
      judicialStatuses,
      judicialStatusesMap,
      judicialSubStatuses,
      pretrialStatuses,
      pretrialStatusesMap,
      pretrialSubStatuses,
    } = useDicts();

    const history = ref([]);
    const activeHistoryValue = ref(null);
    const activeSubHistoryValue = ref(null);
    const activeHistory = computed(() => (
      history.value?.find(({status}) => status === activeHistoryValue.value) || null
    ));
    const activeHistoryItems = computed(() => (
      props.type === 'judicial' ? (
        judicialSubStatuses.value
      ) : (
        props.type === 'pretrial' ? (
          pretrialSubStatuses.value
        ) : []
      )
    ));
    const isSubmitAvailable = computed(() => (
      ['new', 'in_progress', 'other'].includes(activeHistoryValue.value)
    ))
    const fetchHistory = async () => {
      const id = props.selectedItem || (props.selectedItems.length === 1 ? props.selectedItems[0] : null) || null;
      if(!id) {
        return;
      }
      if(props.type === 'pretrial') {
        const {data: debtorData} = await axios({
          method: 'get',
          url: `${baseURL}/api/debtors-data/${id}`,
          params: {
            company_id: companyId.value,
            production_type: 'pretrial',
          }
        });
        history.value = [
          ...(debtorData.debtor.pretrial_status || [])
            .map(status => ({
              ...status,
              substatus: status.substatus?.map(substatus => ({
                ...substatus,
                data: substatus.data ? (typeof substatus.data === 'string' ? substatus.data : JSON.stringify(substatus.data)) : ''
              })) || []
            })),
          ...pretrialStatuses.value
            .filter(({value}) => !(debtorData.debtor.pretrial_status || []).map(({status}) => status).includes(value))
            .map(({value}) => ({
              status: value,
              production_type: props.type,
              substatus: [],
              updated_at: (new Date).toISOString()
            }))
        ].map((status) => ({
          ...status,
          label: pretrialStatusesMap.value[status.status]
        }));
        history.value.sort((a, b) => (
          pretrialStatuses.value.map(({value}) => value).indexOf(a.status) >
          pretrialStatuses.value.map(({value}) => value).indexOf(b.status) ? 1 : -1
        ));
        activeHistoryValue.value = (debtorData.debtor.pretrial_status || [])[0]?.status || null;
        activeSubHistoryValue.value = (debtorData.debtor.pretrial_status || [])[0]?.substatus?.[0]?.substatus;
      }   else if(props.type === 'judicial') {
        const {data} = await axios({
          method: 'get',
          url: `${baseURL}/debtor_status/`,
          params: {
            // production_type: props.type,
            debtor_id: id,
          }
        });
        history.value = [
          ...data,
          ...judicialStatuses.value
            .filter(({value}) => !data.map(({status}) => status).includes(value))
            .map(({value}) => ({
              status: value,
              production_type: props.type,
              substatus: [],
              updated_at: (new Date).toISOString()
            }))
        ].map((status) => ({
          ...status,
          label: judicialStatusesMap.value[status.status]
        }));
        history.value.sort((a, b) => (
          judicialStatuses.value.map(({value}) => value).indexOf(a.status) >
          judicialStatuses.value.map(({value}) => value).indexOf(b.status) ? 1 : -1
        ))
        activeHistoryValue.value = data[0]?.status || null;
        activeSubHistoryValue.value = data[0]?.substatus?.[0]?.substatus;
      }
    }
    watch(computed(() => (
      props.selectedItem || (props.selectedItems.length === 1 ? props.selectedItems[0] : null) || null
    )), () => {
      history.value = [];
      requestAnimationFrame(fetchHistory);
    }, {
      immediate: true,
    });

    const updateSubstatus = (index, field, value) => {
      try {
        history.value.find(({status}) => status === activeHistoryValue.value).substatus[index][field] = value;
      } catch (e) {
        console.log('e', e);
      }
    };

    const addSubstatus = () => {
      history.value.find(({status}) => status === activeHistoryValue.value)?.substatus?.push({
        updated_at: '',
        substatus: '',
        data: '',
      })
    }

    const isActive = computed(() => (
      props.allSelected
      || props.selectedItems?.length
      || props.selectedItem > -1
    ));

    const submit = async () => {
      if(!isActive.value) {
        return;
      }

      if(!isSubmitAvailable.value) {
        return;
      }

      const requests = props.allSelected ? [{...props.filters}] : (
        props.selectedItem ? [{debtor: props.selectedItem}] : (props.selectedItems?.map(debtor => ({debtor})) || [])
      )

      if(props.type === 'pretrial') {
        if(!props.allSelected) {
          await Promise.all(requests.map(async request => {
            await axios({
              method: 'post',
              url: `${baseURL}/pretrial/debtor/${history.value.find(({id}) => !!id)?.id}/debtor_status/`,
              data: {
                ...activeHistory.value,
                substatus: activeHistory.value.status === 'other' ? (
                  activeHistory.value.substatus.map(substatus => ({
                    ...substatus,
                    updated_at: substatus.updated_at || (new Date).toISOString()
                  }))
                ) : activeHistory.value.substatus
              },
            })
          }))
        }
      } else if(props.type === 'judicial') {

        await Promise.all(requests.map(async request => {
          await axios({
            method: 'post',
            url: `${baseURL}/debtor_status/`,
            data: {
              ...request,
              status: activeHistory.value.status,
              production_type: props.type,
            }
          });
          if(activeHistoryValue.value === 'other') {
            await Promise.all(
              activeHistory.value.substatus.filter(({updated_at}) => !updated_at)
                .map(({substatus, data}) => axios({
                  method: 'post',
                  url: `${baseURL}/debtor_status/`,
                  data: {
                    ...request,
                    status: activeHistory.value.status,
                    production_type: props.type,
                    new_substatus: substatus,
                    new_substatus_label: data,
                  }
                }))
            )
          }
        }))
      }

      emit('close');
    }

    return {
      statuses: {
        judicial: judicialStatuses,
        pretrial: pretrialStatuses,
      }[props.type] || [],
      substatuses: {
        judicial: judicialSubStatuses,
        pretrial: pretrialSubStatuses,
      }[props.type] || [],

      submit,

      isActive,

      history,
      activeHistoryValue,
      activeHistory,
      activeHistoryItems,
      activeSubHistoryValue,

      isSubmitAvailable,
      updateSubstatus,
      addSubstatus,
    }
  }
});
</script>

<style lang="scss" module>
@import "./debtorsStatusDialog";
</style>
