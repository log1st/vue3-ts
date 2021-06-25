<template>
  <form @submit.prevent="submit" :class="$style.residents">
    <table :class="$style.table">
      <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">
          {{column.label}}
        </th>
      </tr>
      </thead>
      <tbody>
      <DebtorCommonResidentsTabResident
        v-model="model[index]"
        :columns="columns"
        v-for="(tenant, index) in model"
        :key="`${tenant.id || `index${index}`}-${isEdit ? '1' : '0'}`"
        @remove="remove(index)"
        :errors-map="Object.entries(errorsMap).filter(([key]) => key.startsWith(`${index}-`)).reduce((acc, [key, value]) => ({...acc, [key.replace(`${index}-`, '')]: value}), {})"
      />
      </tbody>
      <tfoot>
      <tr>
        <th :colspan="columns.length - 1"></th>
        <th>
          <Btn
            state="quaternary"
            :class="$style.control"
            prepend-icon="add"
            @click="add"
          />
        </th>
      </tr>
      </tfoot>
    </table>
    <div :class="$style.actions">
      <Btn state="secondary" @click="reset" label="Отменить" :class="$style.action"/>
      <Btn state="primary" type="submit" label="Сохранить" :class="$style.action"/>
    </div>
  </form>
</template>

<script>
import {defineComponent, inject, computed, watch, ref} from "@vue/composition-api";
import DebtorCommonResidentsTabResident
  from "@/new/components/debtorDialog/tabs/common/tabs/residents/DebtorCommonResidentsTabResident";
import Btn from "@/new/components/btn/Btn";
import {cloneDeep} from "lodash";
import {baseURL} from "@/settings/config";
import {useErrors} from "@/new/hooks/useErrors";

export default defineComponent({
  name: "DebtorCommonResidentsTab",
  components: {Btn, DebtorCommonResidentsTabResident},
  setup() {
    const data = inject('data');
    const productionType = inject('productionType');
    const onSave = inject('onSave');

    const model = ref([]);

    watch(data, d => {
      model.value = cloneDeep(d.debtor_tenant_profiles)
    }, {
      immediate: true,
      deep: true,
    });

    const toRemove = ref([]);

    const columns = computed(() => ([
      {key: 'full_name', label: 'ФИО'},
      {key: 'birth_date', label: 'Дата рождения'},
      {key: 'birth_place', label: 'Место рождения'},
      {key: 'citizenship', label: 'Граж-во'},
      {key: 'num_of_passport', label: 'Серия и № паспорта'},
      {key: 'inn', label: 'ИНН'},
      {key: 'date_of_passport_issue', label: 'Дата выдачи'},
      {key: 'passport_issued_by', label: 'Кем выдан паспорт'},
      {key: 'registration', label: 'Регистрация'},
      {key: 'registration_date', label: 'Дата рег-ции'},
      {key: 'relationships', label: 'Род. отношения'},
      {key: 'controls', label: ''},
    ]));

    const remove = async (index) => {
      if(model.value[index].id) {
        toRemove.value.push(model.value[index].id);
      }
      model.value.splice(index, 1);
    }

    const add = async () => {
      model.value.push(columns.value.reduce((acc, {key}) => ({
        ...acc,
        [key]: key === 'relationships' ? [] : null
      }), {}));
    }

    const {clearErrors, addErrors, errorsMap} = useErrors();

    const submit = async () => {
      clearErrors();
      await Promise.all([
        ...toRemove.value.map(async (id) => {
          await axios({
            url: `${baseURL}/debtor/tenant/${id}`,
            method: 'delete',
          })
        }),
        ...model.value.map(async (profile, index) => {
          try {
            const isNew = !profile.id;
            await axios({
              url: `${baseURL}/debtor/tenant/${isNew ? '' : `${profile.id}/`}`,
              method: isNew ? 'post' : 'put',
              data: {
                ...profile,
                production_type: productionType.value,
                ...(isNew ? {
                  debtor: data.value.debtor.pk,
                } : {}),
              },
            })
          } catch (e) {
            addErrors(
              Object.entries(e.response.data).reduce((acc, [key, [message]]) => ([
                ...acc,
                [`${index}-${key}`, message]
              ]), [])
            )
          }
        }),
      ])
      toRemove.value = [];
      if(!Object.keys(errorsMap).length) {
        await onSave();
      }
    }

    const isEdit = ref(1);

    const reset = async () => {
      clearErrors();
      toRemove.value = [];
      model.value = cloneDeep(data.value.debtor_tenant_profiles)
      isEdit.value = +!isEdit.value
    }

    return {
      model,
      columns,

      remove,
      add,

      reset,
      submit,

      isEdit,
      errorsMap,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorCommonResidentsTab";
</style>
