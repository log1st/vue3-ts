<template>
  <form @submit.prevent="submit" :class="$style.residents" v-if="!isUpdating">
    <Btn :class="$style.update" @click.prevent="refreshData" state="primary" type="button">
      Обновить данные
    </Btn>
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
import {defineComponent, inject, computed, watch, ref, onBeforeUnmount} from "@vue/composition-api";
import DebtorCommonResidentsTabResident
  from "@/new/components/debtorDialog/tabs/common/tabs/residents/DebtorCommonResidentsTabResident";
import Btn from "@/new/components/btn/Btn";
import {cloneDeep} from "lodash";
import {baseURL} from "@/settings/config";
import {useErrors} from "@/new/hooks/useErrors";
import {useStore} from "@/new/hooks/useStore";
import {asyncAction} from "@/new/utils/asyncAction";
import {useToast} from "@/new/hooks/useToast";

export default defineComponent({
  name: "DebtorCommonResidentsTab",
  components: {Btn, DebtorCommonResidentsTabResident},
  setup() {
    const data = inject('data');
    const productionType = inject('productionType');
    const onSave = inject('onSave');

    const model = ref([]);

    const formatTenants = tenants => (
      tenants.map(tenant => {
        if(tenant.birth_date) {
          const [year, month, day] = tenant.birth_date.split('-');
          return {
            ...tenant,
            birth_date: new Date(Date.UTC(year, month - 1, day))
          }
        } else {
          return tenant
        }
      })
    )

    watch(data, d => {
      model.value = formatTenants(cloneDeep(d.debtor_tenant_profiles))
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
                birth_date: profile.birth_date ? (
                  [profile.birth_date.getFullYear(), profile.birth_date.getMonth() + 1, profile.birth_date.getDate()].join('-')
                ) : profile.birth_date
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
      if(!Object.keys(errorsMap.value).length) {
        await onSave();
        await reset();
      }
    }

    const isEdit = ref(1);

    const reset = async () => {
      clearErrors();
      toRemove.value = [];
      model.value = [];
      await new Promise(requestAnimationFrame)
      model.value = formatTenants(cloneDeep(data.value.debtor_tenant_profiles))
      isEdit.value = +!isEdit.value
    }

    const store = useStore();

    const {showToast} = useToast();

    let unsub;
    onBeforeUnmount(() => {
      unsub();
    });

    const isUpdating = ref(false);

    const refreshData = async () => {
      await showToast({
        message: `Обновление данных`,
        type: 'warning'
      });

      const {data: {uuid}} = await axios({
        method: 'post',
        url: `${baseURL}/debtor/update-inn/`,
        data: {
          production_type: productionType.value,
          payload: [data.value.debtor.pk],
          company: store.getters['defaultCompanyId']
        }
      });

      const {promise, unsubscribe} = asyncAction(
        async () => (await axios({
          method: 'get',
          url: `${baseURL}/api/datafile/status/${uuid}/`
        })).data,
        async(data) => {
          const {state, status_text} = [...data].sort((a, b) => new Date(a.updated_at).getTime() > new Date(b.updated_at).getTime() ? -1 : 1)[0];
          return {
            3: {status: true},
            4: {status: true, error: status_text},
          }[state] || {status: false}
        },
        1000,
      );

      unsub = unsubscribe;

      try {
        await promise;

        await showToast({
          message: `Данные успешно обновлены`,
          type: 'success'
        });
        isUpdating.value = true;
        await onSave();
        await new Promise(requestAnimationFrame);
        isUpdating.value = false;
      } catch (e) {
        await showToast({
          title: `Ошибка обновления данных`,
          message: e,
          type: 'error'
        });
      }
    }


    return {
      isUpdating,

      refreshData,

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
