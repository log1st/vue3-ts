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

export default defineComponent({
  name: "DebtorsStatusDialog",
  components: {Btn, SelectInput},
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
    } = useDicts();

    const model = ref({
      status: null,
    });


    watch(computed(() => props.selectedItem), async id => {
      if(!id) {
        return;
      }
      const {data} = await axios({
        method: 'GET',
        url: `${baseURL}/debtor_status/${id}/`,
      })
      model.value.status = data.status;
    }, {
      immediate: true,
    });

    const isActive = computed(() => (
      props.allSelected
      || props.selectedItems?.length
      || props.selectedItem > -1
    ))

    const submit = async () => {
      if(!isActive.value) {
        return;
      }

      if(props.allSelected || props.selectedItems?.length) {
        await axios({
          method: 'post',
          url: `${baseURL}/api/debtors-data/${props.type}/status/`,
          params: props.allSelected ? {...props.filters, filters: props.filters} : {},
          data: {
            ...(props.allSelected ? {
              filters: props.filters,
              ...props.filters,
            } : {}),

            status: model.value.status,

            debtor_ids: props.selectedItems || [],

            company_id: localStorage.getItem('defaultCompany'),
          }
        })
      } else {
        await axios({
          method: 'patch',
          url: `${baseURL}/debtor_status/${props.selectedItem}/`,
          data: {
            status: model.value.status,
          }
        })
      }
      emit('close')
    }

    return {
      model,
      statuses: judicialStatuses,

      submit,

      isActive,
    }
  }
});
</script>

<style lang="scss" module>
@import "./debtorsStatusDialog";
</style>
