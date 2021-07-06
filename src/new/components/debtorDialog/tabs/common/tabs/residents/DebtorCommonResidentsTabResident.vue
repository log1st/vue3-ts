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
            :options="tenantRelationships"
            display-value-template="{n, plural, =1{Одна связь} one{# связь} few{# связи} other{# связей}}"
            @update:modelValue="partialSubmit('relationships')"
            :error="errorsMap[column.key]"
          />
        </template>
        <template v-else>
          <span :class="[
            $style.passport,
            model.passport_is_invalid && $style.invalid,
            model.passport_is_valid && $style.valid,
            (!model.passport_is_invalid && !model.passport_is_valid) && $style.checking
          ]" v-if="column.key === 'num_of_passport'">
            <template v-if="model[column.key]">
              {{model[column.key]}}
              <TooltipWrapper :class="$style.passportHint" position="top" align="center" :text="(
                model.passport_is_invalid ? 'Паспорт недействителен' : (
                  model.passport_is_valid ? 'Паспорт подтверждён' : ('На проверке')
                )
              )">
                <Icon :class="$style.passportHintIcon" :icon="(
                model.passport_is_invalid ? 'close-rounded' : (
                  model.passport_is_valid ? 'check-rounded' : ('question-rounded')
                )
              )"/>
              </TooltipWrapper>
            </template>
            <span v-else :class="$style.na">
              N/A
            </span>
          </span>
          <template v-else-if="model[column.key]">
            <template v-if="column.key === 'birth_date'">
              {{formatDbDate(model[column.key])}}
            </template>
            <template v-else-if="column.key === 'registration'">
              {{registrationsMap[model[column.key]]}}
            </template>
            <template v-else-if="column.key === 'relationships'">
              {{model[column.key].map(i => tenantRelationshipsMap[i]).join(', ')}}
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
import {formatDate, formatDbDate} from "@/new/utils/date";
import {useDicts} from "@/new/hooks/useDicts";
import Icon from "@/new/components/icon/Icon";
import TooltipWrapper from "@/new/components/tooltip/TooltipWrapper";

export default defineComponent({
  name: "DebtorCommonResidentsTabResident",
  components: {TooltipWrapper, Icon, SelectInput, DateInput, TextInput, Btn},
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

    const {
      tenantRelationships,
      tenantRelationshipsMap,
    } = useDicts();

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

      tenantRelationships,
      tenantRelationshipsMap,

      formatDate,
      formatDbDate,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorCommonResidentsTab";
</style>
