<template>
  <div :class="$style.container">
    <div :class="$style.title">
      {{ t('characteristic.title') }}
    </div>
    <CadastralSelector
      v-if="isCharacteristicLoaded && !characteristicRecords.length && debtor?.debtor?.pk"
      :id="+debtor.debtor.pk"
      :class="$style.cadastralSelector"
    />
    <ActiveTable
      :columns="characteristicColumns"
      :records="characteristicRecords"
      key-field="id"
      table-key="debtor-owner-characteristics"
      :state="['secondary', 'tiny', 'stripeless']"
      :class="$style.table"
    >
      <template
        v-for="id in characteristicsRowHeaderIds"
        :key="id"
        #[`row-header(${id})`]="{record}"
      >
        <div :class="$style.data">
          <div :class="$style.item">
            <div :class="$style.label">
              {{ t('characteristic.cadastral_number') }}
            </div>
            <div :class="$style.value">
              <template v-if="record.cadastral_number">
                {{ record.cadastral_number }}
              </template>
              <NA v-else />
            </div>
          </div>
          <div :class="$style.item">
            <div :class="$style.label">
              {{ t('characteristic.request_date') }}
            </div>
            <div :class="$style.value">
              {{ formatDate(record.request_date, $i18n.locale) }}
            </div>
          </div>
          <div :class="$style.item">
            <div :class="$style.label">
              {{ t('characteristic.last_request_date') }}
            </div>
            <div :class="$style.value">
              {{ formatDate(record.last_request_date, $i18n.locale) }}
            </div>
          </div>
        </div>
      </template>
    </ActiveTable>
    <div :class="$style.title">
      {{ t('movement.title') }}
    </div>
    <ActiveTable
      :columns="movementColumns"
      :records="movementRecords"
      key-field="id"
      table-key="debtor-owner-movements"
      :state="['secondary', 'tiny', 'stripeless']"
      :class="$style.table"
    >
      <template
        v-for="id in movementsRowHeaderIds"
        :key="id"
        #[`row-header(${id})`]="{record}"
      >
        <div :class="$style.data">
          <div :class="$style.item">
            <div :class="$style.label">
              {{ t('movement.date_from') }}
            </div>
            <i18n-t
              tag="div"
              :keypath="`other.${record.date_to ? 'dateFromTo' : 'dateFromNow'}`"
              :class="$style.value"
            >
              <template #from>
                {{ formatDate(record.date_from, $i18n.locale) }}
              </template>
              <template #to>
                {{ formatDate(record.date_to, $i18n.locale) }}
              </template>
            </i18n-t>
          </div>
        </div>
      </template>
    </ActiveTable>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, toRefs,
} from 'vue';
import { Debtor } from '@/hooks/useDebtors';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { ActiveTableColumnFormat, useActiveTable } from '@/hooks/useActiveTable';
import {
  RosreestrEstateObjectCharacteristic as Characteristic,
  RosreestrEstateObjectMovement as Movement,
  useRosreestr,
} from '@/hooks/useRosreestr';
import { ActiveFormFieldType } from '@/hooks/useActiveForm';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import { formatDate } from '@/utils/date';
import CadastralSelector from '@/components/cadastralSelector/CadastralSelector.vue';
import NA from '@/components/na/NA.vue';

export default defineComponent({
  name: 'DebtorCommonOwnersTab',
  components: { NA, CadastralSelector, ActiveTable },
  props: {
    debtor: {
      type: Object as PropType<Debtor>,
    },
  },
  setup(props) {
    const { t } = useLocalI18n('debtor.common.owners');
    const { debtor } = toRefs(props);

    const {
      fetchEstateObjectCharacteristics,
      fetchEstateObjectMovements,
    } = useRosreestr();

    const columns = computed(() => ([
      { key: 'owner_name', width: 2 },
      { key: 'debtor_data.tenants.0.birth_date' },
      { key: 'debtor_data.tenants.0.birth_place' },
      { key: 'debtor_data.tenants.0.num_of_passport' },
      { key: 'debtor_data.tenants.0.date_of_passport_issue' },
      { key: 'debtor_data.tenants.0.passport_issued_by' },
      { key: 'debtor_data.tenants.0.inn' },
      { key: 'registered_ownership_type', width: 1.5 },
      { key: 'fraction_in_ownership' },
      { key: 'ownership_registration_date', format: ActiveTableColumnFormat.date },
      { key: 'ownership_registration_number', width: 2 },
    ].map((column) => ({
      ...column,
      field: column.key,
      label: t(`column.${column.key.split('.').pop()}`),
    }))));

    const filters = computed(() => ([
      {
        key: 'debtor_id',
        field: 'debtor_id',
        type: ActiveFormFieldType.input,
        defaultValue: debtor.value?.debtor?.pk,
      },
      {
        key: 'active',
        field: 'active',
        type: ActiveFormFieldType.input,
        defaultValue: true,
      },
    ]));

    const {
      columns: characteristicColumns,
      records: characteristicRecords,
      isLoaded: isCharacteristicLoaded,
    } = useActiveTable<Characteristic, Characteristic, 'id'>({
      keyField: 'id',
      fetch: async ({ params, signal }) => {
        if (!params.filters?.debtor_id) {
          return {
            count: 0,
            results: [],
          };
        }
        const { response } = await fetchEstateObjectCharacteristics({ ...params, signal });

        return response;
      },
      columns,
      filters,
    });

    const {
      columns: movementColumns,
      records: movementRecords,
    } = useActiveTable<Movement, Movement, 'id'>({
      keyField: 'id',
      fetch: async ({ params, signal }) => {
        if (!params.filters?.debtor_id) {
          return {
            count: 0,
            results: [],
          };
        }
        const { response } = await fetchEstateObjectMovements({ ...params, signal });

        return response;
      },
      columns,
      filters,
    });

    const characteristicsRowHeaderIds = computed(() => ([
      characteristicRecords.value[0]?.id,
    ].filter(Boolean)));

    const movementsRowHeaderIds = computed(() => (
      movementRecords.value.filter(({ date_from }) => !!date_from).map(({ id }) => id)
    ));

    return {
      t,

      isCharacteristicLoaded,
      characteristicsRowHeaderIds,
      characteristicColumns,
      characteristicRecords,

      movementsRowHeaderIds,
      movementColumns,
      movementRecords,
      formatDate,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorCommonOwnersTab";
</style>
