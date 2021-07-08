<template>
  <form @submit.prevent="submit" :class="$style.owners">
    <div :class="$style.title">Сведения о характеристиках объекта недвижимости</div>
    <table :class="$style.table">
      <tbody>
      <tr>
        <th v-for="column in characteristicsColumns" :key="column.key">
          {{column.label}}
        </th>
      </tr>
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
        <tr :key="`${characteristic.id}-data`">
          <td v-for="column in characteristicsColumns" :key="column.key">
            <template v-if="getDeepField(characteristic, column.key)">
              <template v-if="column.key.includes('date') && getDeepField(characteristic, column.key)">
                {{formatDate(getDeepField(characteristic, column.key))}}
              </template>
              <template v-else>
                {{getDeepField(characteristic, column.key)}}
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
      <tr>
        <th v-for="column in ownersColumns" :key="column.key">
          {{column.label}}
        </th>
      </tr>
      <template v-for="group in owners">
        <tr :key="`${group.date_from}-header`">
          <td :colspan="ownersColumns.length">
            <div :class="$style.fields">
              <div :class="$style.field">
                <div :class="$style.fieldLabel">Период владения</div>
                <div :class="$style.fieldValue">
                  <template v-if="!group.date_to">с</template>
                  {{formatDbDate(group.date_from)}}
                  <template v-if="group.date_to">
                    - {{formatDbDate(group.date_to)}}
                  </template>
                  <template v-else>по настоящее время</template>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr v-for="owner in group.data" :key="`${group.date_from}-${owner.id}-data`">
          <td v-for="column in ownersColumns" :key="column.key">
            <template v-if="getDeepField(owner, column.key)">
              <template v-if="column.key.includes('date') && getDeepField(owner, column.key)">
                {{formatDate(getDeepField(owner, column.key))}}
              </template>
              <template v-else>
                {{getDeepField(owner, column.key)}}
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
import {formatDate, formatDbDate} from "@/new/utils/date";
import {getDeepField} from "@/new/utils/object";

export default defineComponent({
  name: "DebtorCommonOwnersTab",
  setup() {
    const data = inject('data');

    const characteristics = ref([]);
    const fetchCharacteristics = async () => {
      const response = await axios({
        method: 'get',
        url: `${baseURL}/rosreestr/estate_objects_characteristics/`,
        params: {
          debtor_id: data.value.debtor.pk,
          active: 1,
        }
      })
      characteristics.value = response.data;
    }

    const owners = ref([]);
    const fetchOwners = async () => {
      const response = await axios({
        method: 'get',
        url: `${baseURL}/rosreestr/estate_object_ownership_movement/groupped`,
        params: {
          debtor_id: data.value.debtor.pk,
          active: 1,
        }
      })
      owners.value = response.data;
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
      {key: 'debtor_data.tenants.0.birth_date', label: 'Дата рождения'},
      {key: 'debtor_data.tenants.0.birth_place', label: 'Место рождения'},
      {key: 'debtor_data.tenants.0.num_of_passport', label: 'Серия и № паспорта'},
      {key: 'debtor_data.tenants.0.date_of_passport_issue', label: 'Дата выдачи'},
      {key: 'debtor_data.tenants.0.passport_issued_by', label: 'Кем выдан'},
      {key: 'debtor_data.tenants.0.inn', label: 'ИНН'},
      {key: 'registered_ownership_type', label: 'Вид зарегестрированного права'},
      {key: 'fraction_in_ownership', label: 'Доля в праве'},
      {key: 'ownership_registration_date', label: 'Дата рег-ции права'},
      {key: 'ownership_registration_number', label: '№ рег-ции права'},
    ]));

    const ownersColumns = computed(() => ([
      {key: 'owner_name', label: 'Собственник'},
      {key: 'debtor_data.tenants.0.birth_date', label: 'Дата рождения'},
      {key: 'debtor_data.tenants.0.birth_place', label: 'Место рождения'},
      {key: 'debtor_data.tenants.0.num_of_passport', label: 'Серия и № паспорта'},
      {key: 'debtor_data.tenants.0.date_of_passport_issue', label: 'Дата выдачи'},
      {key: 'debtor_data.tenants.0.passport_issued_by', label: 'Кем выдан'},
      {key: 'debtor_data.tenants.0.inn', label: 'ИНН'},
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
      formatDbDate,
      getDeepField,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorCommonOwnersTab";
</style>
