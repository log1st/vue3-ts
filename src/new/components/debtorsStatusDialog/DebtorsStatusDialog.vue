<template>
  <div :class="$style.dialog">
    <div :class="$style.title">
      Статус работы с должником
    </div>
    <form
      @submit.prevent="submit"
      :class="$style.form"
    >
      <SelectInput
        v-model="model.status"
        placeholder="Статус"
        :options="statuses"
        :class="$style.field"
      />
      <SelectInput
        v-model="model.subStatus"
        placeholder="Подстатус 1"
        :options="statuses"
        :class="$style.field"
      />
      <SelectInput
        v-model="model.subStatus2"
        placeholder="Подстатус 2"
        :options="statuses"
        :class="$style.field"
      />
      <TextInput
        v-model="model.caseNumber"
        label="Номер дела"
        :class="$style.field"
      />
      <DateInput
        v-model="model.registerDate"
        label="Дата регистрация"
        :class="$style.field"
      />
    </form>
  </div>
</template>

<script>
import {defineComponent, ref} from '@vue/composition-api';
import SelectInput from "@/new/components/selectInput/SelectInput";
import {useDicts} from "@/new/hooks/useDicts";
import TextInput from "@/new/components/textInput/TextInput";
import DateInput from "@/new/components/dateInput/DateInput";

export default defineComponent({
  name: "DebtorsStatusDialog",
  components: {DateInput, TextInput, SelectInput},
  props: {
    allSelected: Boolean,
    selectedItems: Array,
    selectedItem: Object,
  },
  setup() {
    const {
      judicialStatuses,
    } = useDicts();

    const model = ref({
      status: null,
      subStatus: null,
      subStatus2: null,
      caseNumber: '',
      registerDate: null,
    })

    const submit = async () => {
      console.log(model.value)
    }

    return {
      model,
      statuses: judicialStatuses,

      submit,
    }
  }
});
</script>

<style lang="scss" module>
@import "./debtorsStatusDialog";
</style>
