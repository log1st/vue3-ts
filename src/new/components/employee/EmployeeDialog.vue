<template>
  <div :class="$style.dialog">
    <div :class="$style.title">
      Добавление сотрудника
    </div>
    <form @submit.prevent="submit" :class="$style.form">
      <div :class="$style.firstName">
        <TextInput
          :state="['primary', 'dark']"
          v-model="model.first_name"
          label="Имя"
          :error="errorsMap.first_name"
        />
      </div>
      <div :class="$style.lastName">
        <TextInput
          :state="['primary', 'dark']"
          v-model="model.last_name"
          label="Фамилия"
          :error="errorsMap.last_name"
        />
      </div>
      <div :class="$style.email">
        <TextInput
          :state="['primary', 'dark']"
          v-model="model.email"
          label="Email"
          :error="errorsMap.email"
        />
      </div>
      <div :class="$style.phone">
        <TextInput
          :state="['primary', 'dark']"
          v-model="model.user_phone"
          label="Моб. телефон"
          :error="errorsMap.user_phone"
        />
      </div>
      <div :class="$style.position">
        <SelectInput
          :state="['primary', 'dark']"
          v-model="model.position"
          label="Должность"
          :options="employeePositions"
          :error="errorsMap.position"
        />
      </div>
      <div :class="$style.role">
        <SelectInput
          :state="['primary', 'dark']"
          v-model="model.employee_role"
          label="Выберите роль сотрудника"
          :options="employeeRoles"
          :error="errorsMap.employee_role || errorsMap.detail"
        />
      </div>
      <div :class="$style.companies">
        <SelectInput
          v-model="model.linked_companies"
          :state="['primary', 'dark']"
          label="Предоставить доступ следующим компаниям"
          :options="companies"
          is-multiple
          :error="errorsMap.linked_companies"
          display-value-template="{n, plural, =1{Одна компания} one{# компания} few{# компании} other{# компаний}}"
        />
      </div>
      <div :class="$style.submit">
        <Btn type="submit" label="Сохранить" :class="$style.submitAction"/>
      </div>
    </form>
  </div>
</template>

<script>
import Btn from "@/new/components/btn/Btn";
import TextInput from "@/new/components/textInput/TextInput";
import SelectInput from "@/new/components/selectInput/SelectInput";
import {useErrors} from "@/new/hooks/useErrors";
import {useDicts} from "@/new/hooks/useDicts";
import {baseURL} from "@/settings/config";
import {onMounted, ref} from "@vue/composition-api";
export default {
  name: "EmployeeDialog",
  components: {SelectInput, TextInput, Btn},
  props: {
    onSave: Function
  },
  setup(props, {emit}) {
    const model = ref({
      first_name: '',
      last_name: '',
      email: '',
      user_phone: '',
      position: null,
      employee_role: null,
      linked_companies: [],
      access_Rules: {},
    });

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors();

    const submit = async () => {
      clearErrors();

      try {
        await axios({
          method: 'post',
          url: `${baseURL}/api/account/employee/`,
          data: model.value,
        })
        props.onSave && props.onSave();
        emit('close');
      } catch (e) {
        if(e?.response?.data) {
          setErrors(
            Object.entries(e?.response?.data || {}).reduce((acc, [key, msg]) => ([
              ...acc,
              [key, typeof msg === 'string' ? msg : msg[0]]
            ]), [])
          )
        }
      }
    }

    const {
      employeePositions,
      employeeRoles,
    } = useDicts();

    const companies = ref([]);

    const fetchCompanies = async () => {
      const {data} = await axios({
        method: 'get',
        url: `${baseURL}/api/account/company/`,
      });

      companies.value = data.map(({id:value, name_full:label}) => ({
        value,
        label,
      }));
    }

    onMounted(fetchCompanies);

    return {
      model,
      submit,

      employeeRoles,
      employeePositions,

      errorsMap,

      companies,
    }
  }
}
</script>

<style lang="scss" module>
@import "./employeeDialog";
</style>
