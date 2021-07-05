<template>
  <form @submit.prevent="submit" :class="$style.owners">
    <div :class="$style.title">Сведения о характеристиках объекта недвижимости</div>
    <table :class="$style.table">
      <tbody>
      <template  v-for="(characteristic, index) in characteristics">
        <tr :key="`${characteristic.id}-header`" v-if="index === 0">
          <td :colspan="characteristicsColumns.length">
            <div :class="$style.fields">
              <div :class="$style.field">
                <div :class="$style.fieldLabel">Кадастровый номер</div>
                <div :class="$style.fieldValue">{{characteristic.cadastral_number}}</div>
              </div>
              <div :class="$style.field">
                <div :class="$style.fieldLabel">Дата запроса</div>
                <div :class="$style.fieldValue">
                  <template v-if="characteristic.request_date">
                    {{characteristic.request_date}}
                  </template>
                  <span :class="$style.na" v-else>N/A</span>
                </div>
              </div>
              <div :class="$style.field">
                <div :class="$style.fieldLabel">Дата последнего запроса</div>
                <div :class="$style.fieldValue">
                  <template v-if="characteristic.last_request_date">
                    {{characteristic.last_request_date}}
                  </template>
                  <span :class="$style.na" v-else>N/A</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="index === 0">
          <th v-for="column in characteristicsColumns" :key="column.key">
            {{column.label}}
          </th>
        </tr>
        <tr :key="`${characteristic.id}-data`">
          <td v-for="column in characteristicsColumns" :key="column.key">
            <template v-if="characteristic[column.key]">
              <template v-if="['ownership_registration_date', 'birth_date'].includes(column.key) && characteristic[column.key]">
                {{formatDate(characteristic[column.key])}}
              </template>
              <template v-else>
                {{characteristic[column.key]}}
              </template>
            </template>
            <span v-else :class="$style.na">
            N/A
          </span>
          </td>
        </tr>
      </template>
      </tbody>
    </table>

    <div :class="$style.title">Сведения о переходе прав объекта недвижимости</div>
    <table :class="$style.table">
      <tbody>
      <template  v-for="(owner, index) in owners">
        <tr :key="`${owner.id}-header`" v-if="index === 0">
          <td :colspan="ownersColumns.length">
            <div :class="$style.fields">
              <div :class="$style.field">
                <div :class="$style.fieldLabel">Период владения</div>
                <div :class="$style.fieldValue">
                  <template v-if="owner.ownership_period">
                    {{owner.ownership_period}}
                  </template>
                  <span :class="$style.na" v-else>N/A</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="index === 0">
          <th v-for="column in ownersColumns" :key="column.key">
            {{column.label}}
          </th>
        </tr>
        <tr :key="`${owner.id}-data`">
          <td v-for="column in ownersColumns" :key="column.key">
            <template v-if="owner[column.key]">
              <template v-if="['ownership_registration_date', 'birth_date'].includes(column.key) && owner[column.key]">
                {{formatDate(owner[column.key])}}
              </template>
              <template v-else>
                {{owner[column.key]}}
              </template>
            </template>
            <span v-else :class="$style.na">
            N/A
          </span>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </form>
</template>

<script>
import {defineComponent, inject, computed, watch, ref} from "@vue/composition-api";
import {baseURL} from "@/settings/config";
import {formatDate} from "@/new/utils/date";

export default defineComponent({
  name: "DebtorCommonOwnersTab",
  setup() {
    const data = inject('data');

    const residents = computed(() => data.value.debtor_tenant_profiles.reduce((acc, resident) => ({
      ...acc,
      [resident.full_name]: resident
    }), {}));

    const characteristics = ref([]);
    const fetchCharacteristics = async () => {
      const response = await axios({
        method: 'get',
        url: `${baseURL}/rosreestr/estate_objects_characteristics/`,
        params: {
          debtor_id: data.value.debtor.pk,
        }
      })
      characteristics.value = response.data.map(record => ({
        ...(residents.value[record.owner_name] || {}),
        ...record,
      }));
    }

    const owners = ref([]);
    const fetchOwners = async () => {
      const response = await axios({
        method: 'get',
        url: `${baseURL}/rosreestr/estate_object_ownership_movement/`,
        params: {
          debtor_id: data.value.debtor.pk,
        }
      })
      owners.value = response.data.map(record => ({
        ...(residents.value[record.owner_name] || {}),
        ...record,
      }));
    }

    watch(computed(() => data.value.debtor.pk), async() => {
      await new Promise(requestAnimationFrame);
      await fetchCharacteristics();
      await fetchOwners();
    }, {
      immediate: true,
    });

    const characteristicsColumns = computed(() => ([
      {key: 'owner_name', label: 'Собственник'},
      {key: 'birth_date', label: 'Дата рождения'},
      {key: 'birth_place', label: 'Место рождения'},
      {key: 'num_of_passport', label: 'Серия и № паспорта'},
      {key: 'date_of_passport_issue', label: 'Дата выдачи'},
      {key: 'registered_ownership_type', label: 'Вид зарегестрированного права'},
      {key: 'fraction_in_ownership', label: 'Доля в праве'},
      {key: 'ownership_registration_date', label: 'Дата рег-ции права'},
      {key: 'ownership_registration_number', label: '№ рег-ции права'},
    ]));

    const ownersColumns = computed(() => ([
      {key: 'owner_name', label: 'Собственник'},
      {key: 'birth_date', label: 'Дата рождения'},
      {key: 'birth_place', label: 'Место рождения'},
      {key: 'num_of_passport', label: 'Серия и № паспорта'},
      {key: 'date_of_passport_issue', label: 'Дата выдачи'},
      {key: 'registered_ownership_type', label: 'Вид зарегестрированного права'},
      {key: 'fraction_in_ownership', label: 'Доля в праве'},
      {key: 'ownership_registration_date', label: 'Дата рег-ции права'},
      {key: 'ownership_registration_number', label: '№ рег-ции права'},
    ]));

    return {
      owners,
      ownersColumns,

      characteristics,
      characteristicsColumns,

      formatDate,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorCommonOwnersTab";
</style>
