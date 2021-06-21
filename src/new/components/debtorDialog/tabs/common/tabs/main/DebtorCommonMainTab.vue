<template>
  <form @submit.prevent="submit" :class="$style.form" v-if="data">
    <div :class="$style.field" v-for="field in fields" :key="field.key">
      <div :class="$style.fieldLabel">
        {{field.label}}
      </div>
      <TextInput v-if="isEdit" :class="$style.fieldValue" v-model="model[field.key]" :placeholder="field.label"/>
      <div v-else :class="$style.fieldValue">
        {{model[field.key]}}
      </div>
    </div>
    <div :class="$style.actions">
      <Btn v-if="!isEdit" state="quaternary" @click="toggle" prepend-icon="pencil" :class="[$style.action, $style.editAction]"/>
      <template v-else>
        <Btn state="secondary" @click="reset" :class="[$style.action, $style.saveAction]" label="Отменить"/>
        <Btn state="primary" type="submit" :class="[$style.action, $style.saveAction]" label="Сохранить"/>
      </template>
    </div>
  </form>
</template>

<script>
import {defineComponent, ref, computed, watch, inject} from "@vue/composition-api";
import Btn from "@/new/components/btn/Btn";
import TextInput from "@/new/components/textInput/TextInput";
import {baseURL} from "@/settings/config";

export default defineComponent({
  name: "DebtorCommonMainTab",
  components: {TextInput, Btn},
  setup() {
    const data = inject('data');
    const productionType = inject('productionType')
    const onSave = inject('onSave')

    const fields = computed(() => ([
      {
        key: 'full_name',
        label: 'ФИО',
      },
      {
        key: 'address',
        label: 'Адрес',
      },
      {
        key: 'registration_address',
        label: 'Адрес регистрации',
      },
      {
        key: 'phone_number',
        label: 'Телефон',
      },
      {
        key: 'email',
        label: 'Email',
      },
    ]));

    const model = ref({});

    watch(data, d => {
      model.value = fields.value.reduce((acc, {key}) => ({
        ...acc,
        [key]: d.debtor_main_profile[key]
      }), {})
    }, {
      immediate: true,
      deep: true,
    })

    const submit = async () => {
      const response = await axios({
        method: 'put',
        url: `${baseURL}/debtor/main_profile/${data.value.debtor_main_profile.id}/`,
        data: {
          ...model.value,
          production_type: productionType.value,
        },
      });
      if(response.data.id) {
        isEdit.value = false;
        await onSave();
      }
    }

    const isEdit = ref(false);
    const toggle = async () => {
      await new Promise(requestAnimationFrame);
      isEdit.value = !isEdit.value;
    }
    const reset = async () => {
      model.value = fields.value.reduce((acc, {key}) => ({
        ...acc,
        [key]: data.value.debtor_main_profile[key]
      }), {});
      await new Promise(requestAnimationFrame);
      isEdit.value = false;
    }

    return {
      model,
      submit,

      fields,

      isEdit,
      toggle,
      reset,

      data,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorCommonMainTab";
</style>
