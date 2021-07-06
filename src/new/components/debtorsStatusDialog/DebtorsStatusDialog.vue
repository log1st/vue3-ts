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
        v-model="model.status"
        placeholder="Статус"
        :options="statuses"
        :class="$style.field"
      />
      <template v-if="model.status === 'other'">
        <TextInput
          v-for="substatus in [...substatusesList].reverse()"
          :key="substatus.substatus"
          :model-value="substatus.substatus"
          :class="$style.field"
          is-disabled
        />
        <TextInput v-model="model.substatus" placeholder="Подстатус" :class="[$style.field, $style.primaryField]"/>
        <TextInput v-model="model.substatus_label" placeholder="Комментарий" :class="$style.field" type="textarea" :rows="5"/>
      </template>
      <template v-else>
        <SelectInput
          v-for="substatus in substatusesList"
          :key="substatus.substatus"
          :model-value="substatus.substatus"
          :options="substatuses"
          :class="$style.field"
          is-disabled
        />
      </template>
      <Btn
        state="primary"
        type="submit"
        :class="$style.submit"
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
  },
  setup(props, {emit}) {
    const {
      judicialStatuses,
      judicialSubStatuses,
      pretrialStatuses,
      pretrialSubStatuses,
    } = useDicts();

    const model = ref({
      status: null,
      substatus: '',
      substatusLabel: '',
    });

    const debtor = ref();
    const substatusesList = ref();

    watch(computed(() => props.selectedItem), async id => {
      if(!id) {
        return;
      }
      const {data} = await axios({
        method: 'GET',
        url: `${baseURL}/debtor_status/${id}/`,
      })
      model.value.status = data.status;
      debtor.value = data.debtor;
      substatusesList.value = data.substatus;
    }, {
      immediate: true,
    });

    const isActive = computed(() => (
      props.allSelected
      || props.selectedItems?.length
      || props.selectedItem > -1
    ));

    const store = useStore();

    const submit = async () => {
      if(!isActive.value) {
        return;
      }

      if(props.allSelected || props.selectedItems?.length) {
        await Promise.all((props.selectedItems || []).map(status => new Promise(resolve => {
          axios({
            method: 'post',
            url: `${baseURL}/debtor_status/`,
            params: props.allSelected ? {...props.filters, filters: props.filters} : {},
            data: {
              ...(props.allSelected ? {
                filters: props.filters,
                ...props.filters,
              } : {}),

              status: model.value.status,

              production_type: props.type,

              debtor: debtor.value || status,

              company_id: store.getters['getDefaultCompanyId'],

              ...(model.value.status === 'other' ? {
                new_substatus: model.value.substatus,
                new_substatus_label: model.value.substatusLabel,
              } : {})
            }
          }).then(resolve)
        })))
      } else {
        await axios({
          method: 'post',
          url: `${baseURL}/debtor_status/`,
          data: {
            status: model.value.status,
            debtor: debtor.value,
            company_id: store.getters['getDefaultCompanyId'],

            production_type: props.type,

            ...(model.value.status === 'other' ? {
              new_substatus: model.value.substatus,
              new_substatus_label: model.value.substatusLabel,
            } : {})
          }
        })
      }
      emit('close')
    }

    watch(computed(() => model.value.status), (newStatus, oldStatus) => {
      if(!!oldStatus) {
        substatusesList.value = []
      }
    })

    return {
      model,
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
      substatusesList,
    }
  }
});
</script>

<style lang="scss" module>
@import "./debtorsStatusDialog";
</style>
