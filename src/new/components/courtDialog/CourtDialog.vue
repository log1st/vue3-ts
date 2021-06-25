<template>
  <form @submit.prevent="submit" :class="$style.dialog">
    <div :class="$style.field" v-for="field in fields" :key="field.key">
      <div :class="$style.label">{{field.label}}</div>
      <div :class="$style.value" v-if="!isEdit || [
        'name',
        'address',
        'payment_recipient_name',
        'bic',
        'payment_recipient_account',
        'inn',
        'kpp',
        'oktmo',
        'payment_recipient_bank',
        'kbk'
      ].includes(field.key)">
        {{court[field.key]}}
      </div>
      <TextInput
        v-else
        :placeholder="field.label"
        :error="errorsMap[field.key]"
        v-model="court[field.key]"
        :state="['primary', 'dark']"
        :class="$style.input"
      />
    </div>
    <Icon icon="loader" :class="$style.loader" spin v-if="isLoading"/>
    <div :class="$style.actions">
      <Btn :class="$style.action" prepend-icon="pencil" state="quaternary" @click="toggleEdit" label="Редактировать" v-if="!isEdit"/>
      <Btn :class="$style.action" state="secondary" @click="reset" label="Сбросить" v-if="isEdit"/>
      <Btn :class="$style.action" state="primary" type="submit" label="Сохранить" v-if="isEdit"/>
    </div>
  </form>
</template>

<script>
import {defineComponent, ref, watch, computed} from "@vue/composition-api";
import Icon from "@/new/components/icon/Icon";
import {baseURL} from "@/settings/config";
import {useErrors} from "@/new/hooks/useErrors";
import TextInput from "@/new/components/textInput/TextInput";
import Btn from "@/new/components/btn/Btn";

export default defineComponent({
  name: "CourtDialog",
  components: {Btn, TextInput, Icon},
  props: {
    id: Number,
    type: String,
  },
  setup(props, {emit}) {
    const isLoading = ref(false);
    const court = ref({});

    const fetchData = async () => {
      if(!props.id) {
        return;
      }
      isLoading.value = true;
      await new Promise(requestAnimationFrame);

      const response = await axios({
        method: 'get',
        url: `${baseURL}/reference_books/${props.type}_court_place/${props.id}`
      });

      court.value = response.data;
      isLoading.value = false;
    }

    watch(computed(() => props.id), fetchData, {
      immediate: true,
    })
    watch(computed(() => props.type), fetchData)

    const fields = ref([
      {key: 'name', label: 'Наименование'},
      {key: 'address', label: 'Адрес'},
      {key: 'magistrate', label: 'ФИО судьи'},
      {key: 'phone_number_secretary', label: 'Секретарь судьи, телефон'},
      {key: 'phone_number_assistant', label: 'Помощник мирового судьи, телефон'},
      {key: 'phone_number_head_of_dep', label: 'Начальник управления, телефон'},
      {key: 'email', label: 'Электронная почта'},
      {key: 'payment_recipient_name', label: 'Получатель платежа'},
      {key: 'bic', label: 'БИК'},
      {key: 'payment_recipient_account', label: 'Счет получателя платежа'},
      {key: 'inn', label: 'ИНН'},
      {key: 'kpp', label: 'КПП'},
      {key: 'oktmo', label: 'ОКТМО'},
      {key: 'payment_recipient_bank', label: 'Банк получателя платежа'},
      {key: 'kbk', label: 'КБК'},
    ]);

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors();

    const isEdit = ref(false);
    const toggleEdit = async () => {
      await new Promise(requestAnimationFrame);
      isEdit.value = !isEdit.value;
    }
    const reset = async () => {
      await new Promise(requestAnimationFrame);
      isEdit.value = false;
      await fetchData();
    }
    const close = () => {
      emit('close');
    }
    const submit = async () => {
      clearErrors();

      isLoading.value = true;
      try {
        await axios({
          method: 'put',
          url: `${baseURL}/reference_books/${props.type}_court_place/${props.id}/`,
          data: court.value,
        });

        close();
      } catch (e) {
        setErrors(
          Object.entries(e.response.data).reduce((acc, [key, [message]]) => ([
            ...acc,
            [key, message]
          ]), [])
        )
      }
      isLoading.value = false;
    }

    return {
      fields,

      isLoading,
      court,

      reset,
      isEdit,
      toggleEdit,

      errorsMap,

      submit,
    }
  }
})
</script>

<style lang="scss" module>
@import "./courtDialog";
</style>
