<template>
  <div
    :class="[
      $style.container,
      $style[productionType],
      $style[status],
      $style[substatus],
    ]"
    @click="$emit('click', $event)"
  >
    <div :class="$style.content">
      <div :class="$style.status">
        {{ statusLabel }}
      </div>
      <div
        v-if="substatus"
        :class="$style.substatus"
      >
        {{ substatusLabel }}
      </div>
    </div>
    <Icon
      :class="$style.icon"
      icon="chevron"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, toRefs,
} from 'vue';
import Icon from '@/components/icon/Icon.vue';
import { DebtorStatus } from '@/hooks/useDebtors';
import { DictType, useDicts } from '@/hooks/useDicts';
import { ProductionType } from '@/hooks/useConstructor';

export default defineComponent({
  name: 'DebtorStatus',
  components: { Icon },
  props: {
    statuses: {
      type: Array as PropType<Array<DebtorStatus>>,
      required: true,
    },
    productionType: {
      type: String as PropType<ProductionType>,
      required: true,
    },
  },
  emits: ['click'],
  setup(props) {
    const { statuses, productionType } = toRefs(props);

    const {
      getDictMap,
    } = useDicts();

    const status = computed(() => ([...statuses.value].sort((a, b) => (
      new Date(a.updated_at) < new Date(b.updated_at) ? 1 : -1
    ))[0]));
    const substatus = computed(() => [...status.value?.substatus || []].sort((a, b) => (
      new Date(a.updated_at!) < new Date(b.updated_at!) ? 1 : -1
    ))[0]);

    const statusLabel = computed(() => (getDictMap(
      productionType.value === ProductionType.pretrial
        ? DictType.debtorPretrialStatuses
        : DictType.debtorStatuses,
    ).value as any)[status.value.status]);

    const substatusLabel = computed(() => (
      substatus?.value?.substatus ? (
        status.value.status === 'other'
          ? substatus.value.substatus
          : (getDictMap(
            productionType.value === ProductionType.pretrial
              ? DictType.debtorPretrialSubstatuses
              : DictType.debtorSubstatuses,
          ).value as any)[substatus.value?.substatus]
      ) : null
    ));

    return {
      status: status.value.status,
      substatus: substatus.value?.substatus,
      statusLabel,
      substatusLabel,
      statuses_: getDictMap(DictType.debtorStatuses).value,
      substatuses_: getDictMap(DictType.debtorSubstatuses).value,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorStatus";
</style>
