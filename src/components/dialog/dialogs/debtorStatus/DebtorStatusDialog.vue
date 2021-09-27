<template>
  <form
    :class="[
      $style.dialog,
      $style.default
    ]"
    @submit.prevent="submit"
  >
    <div :class="$style.caption">
      {{ t('title') }}
    </div>
    <div :class="$style.fields">
      <SelectInput
        v-model="activeEntryKey"
        :options="statuses"
        :state="['primary', 'white']"
        :class="$style.field"
        :placeholder="t('selectEntry')"
      />
      <template
        v-for="subEntry in subEntries"
        :key="subEntry.updated_at"
      >
        <template v-if="activeEntryKey !== 'other'">
          <SelectInput
            v-model="subEntry.substatus"
            :options="substatuses"
            :state="['primary', 'white']"
            :class="$style.field"
            is-disabled
          />
        </template>
        <template v-else>
          <TextInput
            v-model="subEntry.substatus"
            :state="['primary', 'white']"
            :placeholder="t('subEntryValue')"
            :class="$style.field"
            :is-disabled="!!subEntry.updated_at"
          />
          <TextInput
            v-model="subEntry.data"
            :state="['primary', 'white']"
            :placeholder="t('subEntryComment')"
            :class="$style.field"
            :is-disabled="!!subEntry.updated_at"
          />
        </template>
      </template>
      <Btn
        v-if="activeEntryKey === 'other'"
        :label="t('addSubEntry')"
        :class="$style.addSubEntry"
        @click="addSubEntry"
      />
      <Btn
        :label="t('submit')"
        :class="$style.submit"
        type="submit"
        :is-disabled="!['other', 'new', 'in_progress'].includes(activeEntryKey)"
      />
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, watch,
} from 'vue';
import { DebtorStatusPayload } from '@/hooks/useDialog';
import { DictType, useDicts } from '@/hooks/useDicts';
import { ProductionType } from '@/hooks/useConstructor';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import {
  Debtor, DebtorStatus, DebtorSubstatus, useDebtors,
} from '@/hooks/useDebtors';
import { awaitFrame } from '@/utils/window';
import SelectInput from '@/components/selectInput/SelectInput.vue';
import TextInput from '@/components/textInput/TextInput.vue';
import Btn from '@/components/btn/Btn.vue';
import { SignalType, useSignal } from '@/hooks/useSignal';

export default defineComponent({
  name: 'DebtorStatusDialog',
  components: { Btn, TextInput, SelectInput },
  props: {
    productionType: {
      type: String as PropType<DebtorStatusPayload['productionType']>,
      required: true,
    },
    debtorIds: Array as PropType<DebtorStatusPayload['debtorIds']>,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useLocalI18n('debtorStatus');
    const {
      getDict,
    } = useDicts();

    const statuses = computed(() => getDict({
      [ProductionType.pretrial]: DictType.debtorPretrialStatuses,
      [ProductionType.judicial]: DictType.debtorStatuses,
    }[props.productionType]).value);

    const substatuses = computed(() => getDict({
      [ProductionType.pretrial]: DictType.debtorPretrialSubstatuses,
      [ProductionType.judicial]: DictType.debtorSubstatuses,
    }[props.productionType]).value);

    const {
      fetchDebtorStatusEntries,
      updateDebtorStatusEntries,
    } = useDebtors();

    const entries = ref<Array<DebtorStatus>>([]);
    const activeEntryKey = ref<DebtorStatus['status']>();
    const debtorId = computed<Debtor['pk'] | null>(() => (
      props.debtorIds?.length === 1 ? props.debtorIds[0] : null));
    const fetchEntries = async () => {
      activeEntryKey.value = undefined;
      const {
        status,
        response,
      } = await fetchDebtorStatusEntries({
        debtorId: debtorId.value!,
        productionType: props.productionType,
      });
      if (status) {
        entries.value = response.entries;
        activeEntryKey.value = response.activeEntryKey;
      }
    };

    const subEntries = computed<Array<DebtorSubstatus>>(
      () => ([...entries.value.find(
        ({ status }) => status === activeEntryKey.value,
      )?.substatus || []]).sort((a, b) => (
        new Date(a.updated_at!) > new Date(b.updated_at!) ? 1 : -1
      )),
    );

    const addSubEntry = () => {
      entries.value.find(
        ({ status }) => status === activeEntryKey.value,
      )?.substatus.push({
        updated_at: null,
        substatus: null,
        data: '',
      });
    };

    watch(debtorId, async (newId) => {
      entries.value = [];
      if (newId) {
        await awaitFrame();
        await fetchEntries();
      }
    }, {
      immediate: true,
    });

    const {
      dispatchSignal,
    } = useSignal();

    const submit = async () => {
      await Promise.all(
          props.debtorIds?.map(async (id) => updateDebtorStatusEntries({
            id,
            productionType: props.productionType,
            entries: entries.value,
            activeEntryKey: activeEntryKey.value,
          })) || [],
      );
      await dispatchSignal(SignalType.debtorsUpdated, {
        ids: props.debtorIds || [],
        all: !props.debtorIds?.length,
      });
      emit('close');
    };

    return {
      statuses,
      substatuses,
      t,

      entries,
      activeEntryKey,
      subEntries,

      addSubEntry,
      submit,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorStatusDialog";
</style>
