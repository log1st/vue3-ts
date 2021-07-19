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
        <template v-for="(newSub, index) in model.newSubstatuses">
          <TextInput
            :key="`new-${index}`"
            v-model="model.newSubstatuses[index].substatus" placeholder="Подстатус" :class="[$style.field, $style.primaryField]"
          />
          <TextInput
            :key="`newLabel-${index}`"
            v-model="model.newSubstatuses[index].substatus_label" placeholder="Комментарий" :class="$style.field" type="textarea" :rows="5"
          />
        </template>
        <Btn @click="addNewSubstatus" :class="$style.addSubstatus" label="Добавить подстатус"/>
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

    const getNewSubstatus = () => ({substatus: '', substatus_label: ''});

    const model = ref({
      status: null,
      substatus: '',
      substatusLabel: '',
      newSubstatuses: [
        getNewSubstatus(),
      ],
    });

    const addNewSubstatus = () => {
      model.value.newSubstatuses.push(getNewSubstatus())
    }

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
        await Promise.all((props.selectedItems || []).map(debtorId => new Promise(async resolve => {
          if(model.value.status === 'other') {
            await Promise.all(model.value.newSubstatuses.map(newSub => new Promise(res => {
              if(props.type === 'pretrial') {
                axios({
                  method: 'post',
                  url: `${baseURL}/pretrial/company/${store.getters['getDefaultCompanyId']}/debtor_status/`,
                  data: {
                    status: model.value.status,
                    substatus: model.value.newSubstatuses,
                    ...(props.allSelected ? {
                      filters: props.filters,
                      ...props.filters,
                    } : {
                      debtors: [debtorId],
                    }),
                  }
                }).then(res);
              } else {
                axios({
                  method: 'post',
                  url: `${baseURL}/debtor_status/`,
                  params: props.allSelected ? {...props.filters, filters: props.filters} : {},
                  data: {
                    ...(props.allSelected ? {
                      filters: props.filters,
                      ...props.filters,
                    } : {}),

                    [{
                      judicial: 'status',
                      pretrial: 'pretrial_status',
                    }[props.type]]: model.value.status,

                    production_type: props.type,

                    debtor: debtor.value || debtorId,

                    company_id: store.getters['getDefaultCompanyId'],

                    new_substatus: newSub.substatus,
                    new_substatus_label: newSub.substatusLabel,
                  }
                }).then(res)
              }
            })))
          } else {
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

                debtor: debtor.value || debtorId,

                company_id: store.getters['getDefaultCompanyId'],

                ...(model.value.status === 'other' ? {
                  new_substatus: model.value.substatus,
                  new_substatus_label: model.value.substatus_label,
                } : {})
              }
            }).then(resolve)
          }
        })))
      } else {
        if(model.value.status === 'other') {
          if(props.type === 'pretrial') {
            await axios({
              method: 'post',
              url: `${baseURL}/pretrial/company/${store.getters['getDefaultCompanyId']}/debtor_status/`,
              data: {
                status: model.value.status,
                substatus: model.value.newSubstatuses.map(({substatus, substatus_label}) => ({
                  substatus,
                  data: substatus_label,
                })),
                ...(props.allSelected ? {
                  filters: props.filters,
                  ...props.filters,
                } : {
                  debtors: [props.selectedItem],
                }),
              }
            })
          } else {
            await Promise.all(model.value.newSubstatuses.map(newSub => new Promise(res => {
              axios({
                method: 'post',
                url: `${baseURL}/debtor_status/`,
                params: props.allSelected ? {...props.filters, filters: props.filters} : {},
                data: {
                  status: model.value.status,
                  debtor: debtor.value,
                  company_id: store.getters['getDefaultCompanyId'],

                  production_type: props.type,

                  new_substatus: newSub.substatus,
                  new_substatus_label: newSub.substatus_label,
                }
              }).then(res)
            })))
          }
        } else {
          await axios({
            method: 'post',
            url: `${baseURL}/debtor_status/`,
            data: {
              status: model.value.status,
              debtor: debtor.value,
              company_id: store.getters['getDefaultCompanyId'],

              production_type: props.type,
            }
          })
        }
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

      addNewSubstatus,
    }
  }
});
</script>

<style lang="scss" module>
@import "./debtorsStatusDialog";
</style>
