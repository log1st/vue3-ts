<template>
  <tr>
    <td v-for="column in columns" :key="column.key">
      <template v-if="column.key === 'controls'">
        <div :class="$style.controls">
          <Btn :class="$style.control" state="quaternary" prepend-icon="pencil" @click="toggle" v-if="!isEdit"/>
          <Btn :class="$style.control" state="quaternary" prepend-icon="close" @click="remove" v-if="!isEdit"/>
          <Btn :class="$style.control" state="quaternary" prepend-icon="save" @click="submit" v-if="isEdit"/>
          <Btn :class="$style.control" state="quaternary" prepend-icon="rollback" @click="reset" v-if="isEdit"/>
        </div>
      </template>
      <template v-else>
        <template v-if="isEdit || (
          ['registration', 'relationships'].includes(column.key)
        )">
          <TextInput
            :state="['primary', 'dark']"
            v-if="['full_name', 'birth_place', 'citizenship', 'num_of_passport', 'inn', 'passport_issued_by', 'birth_date', 'registration_date', 'date_of_passport_issue'].includes(column.key)"
            v-model="model[column.key]"
            :placeholder="column.label"
            :error="errorsMap[column.key]"
          />
          <SelectInput
            :state="['primary', 'dark']"
            v-else-if="column.key === 'registration'"
            v-model="model[column.key]"
            :placeholder="column.label"
            :options="registrations"
            @update:modelValue="partialSubmit('registration')"
            :error="errorsMap[column.key]"
          />
          <SelectInput
            :state="['primary', 'dark']"
            v-else-if="column.key === 'relationships'"
            v-model="model[column.key]"
            is-multiple
            :placeholder="column.label"
            :options="relationships"
            display-value-template="{n, plural, =1{Одна связь} one{# связь} few{# связи} other{# связей}}"
            @update:modelValue="partialSubmit('relationships')"
            :error="errorsMap[column.key]"
          />
        </template>
        <template v-else>
          <template v-if="model[column.key]">
            <template v-if="column.key === 'registration'">
              {{registrationsMap[model[column.key]]}}
            </template>
            <template v-else-if="column.key === 'relationships'">
              {{model[column.key].map(i => relationshipsMap[i]).join(', ')}}
            </template>
            <template v-else>
              {{model[column.key]}}
            </template>
          </template>
          <span :class="$style.na" v-else>N/A</span>
        </template>
      </template>
    </td>
  </tr>
</template>

<script>
import {defineComponent, ref, computed} from "@vue/composition-api";
import {useLocalProp} from "@/new/hooks/useLocalProp";
import Btn from "@/new/components/btn/Btn";
import TextInput from "@/new/components/textInput/TextInput";
import DateInput from "@/new/components/dateInput/DateInput";
import SelectInput from "@/new/components/selectInput/SelectInput";
import {cloneDeep} from "lodash";
import {formatDate} from "@/new/utils/date";

export default defineComponent({
  name: "DebtorCommonResidentsTabResident",
  components: {SelectInput, DateInput, TextInput, Btn},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    modelValue: Object,
    columns: Array,
      errorsMap: Object,
  },
  setup(props, {emit}) {
    const model = useLocalProp(props, emit, 'modelValue', true);

    const isEdit = ref(false);
    const toggle = () => {
      isEdit.value = !isEdit.value;
    }
    const submit = async () => {
      await new Promise(requestAnimationFrame);
      emit('update:modelValue', model.value);
      isEdit.value = false;
    }

    const partialSubmit = key => {
      emit('update:modelValue', {
        ...props.modelValue,
        [key]: model.value[key]
      })
    }

    const remove = async () => {
      await new Promise(requestAnimationFrame);
      emit('remove');
    }
    const reset = async () => {
      await new Promise(requestAnimationFrame);
      isEdit.value = false;
      model.value = cloneDeep(props.modelValue);
    }

    const registrations = ref([{value: 1, label: 'Постоянная'}, {value: 2, label: 'Временная'}]);
    const registrationsMap = computed(() => registrations.value.reduce((acc, {value, label}) => ({
      ...acc,
      [value]: label
    }), {}));

    const relationships = ref(["Брат", "Сестра", "Отец", "Мать", "Сын", "Сестра"].map((label, value) => ({
      value,
      label,
    })));
    const relationshipsMap = computed(() => relationships.value.reduce((acc, {value, label}) => ({
      ...acc,
      [value]: label
    }), {}));

    return {
      model,

      isEdit,
      toggle,
      remove,
      submit,
      partialSubmit,
      reset,

      registrations,
      registrationsMap,

      relationships,
      relationshipsMap,

      formatDate,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorCommonResidentsTab";
</style>
