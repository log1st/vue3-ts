<template>
  <div :class="$style.tab">
    <div :class="$style.header">
      <div :class="$style.title">Сотрудники</div>
      <Btn
        @click="addEmployee"
        append-icon="add"
        state="secondary"
        label="Добавить сотрудника"
        :class="$style.add"
      />
    </div>
    <table :class="$style.table">
      <thead>
      <tr>
        <th>ФИО</th>
        <th>Должность</th>
        <th>Моб. телефон</th>
        <th>Email</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <OrganizationEmployeeTabEmployee
        v-for="(employee, index) in employees"
        :key="employee.id"
        v-model="employees[index]"
      />
      </tbody>
    </table>
  </div>
</template>

<script>
import Btn from "@/new/components/btn/Btn";
import {computed, inject, ref, watch} from "@vue/composition-api";
import {baseURL} from "@/settings/config";
import Icon from "@/new/components/icon/Icon";
import TextInput from "@/new/components/textInput/TextInput";
import OrganizationEmployeeTabEmployee
  from "@/new/components/organization/tabs/employees/employee/OrganizationEmployeeTabEmployee";
import {useDialog} from "@/new/hooks/useDialog";
export default {
  name: "OrganizationEmployeesTab",
  components: {OrganizationEmployeeTabEmployee, TextInput, Icon, Btn},
  setup() {
    const data = inject('data');
    const isEditing = inject('isEditing');
    const onSave = inject('onSave');

    const employees = ref([]);

    const fetchData = async () => {
      const {data: foundEmployees} = await axios({
        method: 'get',
        url: `${baseURL}/api/account/company/${data.value.id}/employees/`
      });
      employees.value = foundEmployees
    }

    watch(computed(() => data.value.id), fetchData, {
      immediate: true
    });

    const {
      showDialog,
    } = useDialog()

    const addEmployee = async () => {
      await showDialog({
        component: 'employee',
        payload: {
          onSave: async () => {
            await onSave();
            await fetchData();
          },
        }
      })
    }

    return {
      addEmployee,
      employees,
      isEditing,
    }
  }
}
</script>

<style lang="scss" module>
@import "./organizationEmployeesTab";
</style>
