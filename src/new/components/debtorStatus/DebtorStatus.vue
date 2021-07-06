<template>
  <div
    v-if="computedStatus"
    :class="[$style.status, $style[computedStatus.color]]"
    @click="$emit('click', $event)"
  >
    <div :class="$style.label">
      {{computedStatus.label || 'N/A'}}
    </div>
    <div :class="$style.hint" v-if="computedSubStatus">
      {{computedSubStatus}}
    </div>
    <Icon icon="chevron-down" :class="$style.icon"/>
  </div>
</template>

<script>
import {defineComponent, computed} from "@vue/composition-api";
import Icon from "@/new/components/icon/Icon";
import {useDicts} from "@/new/hooks/useDicts";

export default defineComponent({
  name: "DebtorStatus",
  components: {Icon},
  props: {
    status: Object,
    type: String,
  },
  setup(props) {
    const {
      judicialStatuses,
      judicialSubStatusesMap,
      pretrialStatuses,
      pretrialSubStatusesMap,
    } = useDicts();

    const computedStatuses = computed(() => (
      ({
        judicial: judicialStatuses,
        pretrial: pretrialStatuses,
      }[props.type]).value.reduce((acc, cur) => ({
        ...acc,
        [cur.value]: {
          ...cur,
          color: {
            new: 'blue',
            in_progress: 'gray',
            ready_to_court: 'green',
            filed_in_court: 'purple',
            transfer_to_proceed: 'cyan',
            error: 'red',
            send: 'gray',
            notsend: 'error',
            delivered: 'green',
            failed: 'red',
            unknown: 'cyan',
            ready: 'purple',
            in_work: 'purple',
            court: 'green',
            machine: 'cyan',
            none: 'red',
          }[cur.value] || 'gray'
        },
      }), {})
    ));

    const computedStatus = computed(() => computedStatuses.value[props.status?.status]);

    const computedSubStatus = computed(() => (
      props.status?.status === 'other' ? (
        props.status?.substatus[0]?.substatus
      ) : (
        ({
          judicial: judicialSubStatusesMap,
          pretrial: pretrialSubStatusesMap,
        }[props.type]).value[props.status?.substatus[0]?.substatus] || null
      )
    ))

    return {
      computedStatus,
      computedSubStatus,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorStatus";
</style>
