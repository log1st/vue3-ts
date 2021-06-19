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
        placeholder="Подстатус"
        :options="statuses"
        :class="$style.field"
      />
    </form>
  </div>
</template>

<script>
import {defineComponent, ref} from '@vue/composition-api';
import SelectInput from "@/new/components/selectInput/SelectInput";

export default defineComponent({
  name: "DebtorsStatusDialog",
  components: {SelectInput},
  props: {
    allSelected: Boolean,
    selectedItems: Array,
  },
  setup() {
    const statuses = [
      {
        value: 'new',
        label: 'Новый',
      },
      {
        value: 'posted',
        label: 'Подано в суд',
      },
      {
        value: 'decision',
        label: 'Вынесено решение',
      },
      {
        value: 'inWork',
        label: 'В работе',
      },
    ];

    const model = ref({
      status: null,
      subStatus: null,
    })

    const submit = async () => {
      console.log(model.value)
    }

    return {
      model,
      statuses,

      submit,
    }
  }
});
</script>

<style lang="scss" module>
@import "./debtorsStatusDialog";
</style>
