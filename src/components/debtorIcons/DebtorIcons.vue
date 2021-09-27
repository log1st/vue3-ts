<template>
  <div :class="$style.icons">
    <TooltipWrapper
      v-for="icon in icons"
      :key="icon.key"
      :label="icon.label"
      :class="[
        $style.icon,
        $style[icon.color]
      ]"
    >
      <Icon
        :icon="icon.icon"
      />
    </TooltipWrapper>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, toRefs,
} from 'vue';
import { DebtorStatus, DebtorSubstatus } from '@/hooks/useDebtors';
import { ProductionType } from '@/hooks/useConstructor';
import { DictType, useDicts } from '@/hooks/useDicts';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import TooltipWrapper from '@/components/tooltip/TooltipWrapper.vue';
import Icon from '@/components/icon/Icon.vue';

export default defineComponent({
  name: 'DebtorIcons',
  components: { Icon, TooltipWrapper },
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
  setup(props) {
    const { t } = useLocalI18n('debtorIcon');
    const { statuses, productionType } = toRefs(props);

    const substatuses = computed<string[]>(() => (
      (statuses.value || []).reduce((acc, cur) => ([
        ...acc,
        ...cur.substatus,
      ]), [] as Array<DebtorSubstatus>)).map(
      ({ substatus }) => substatus as string,
    ).filter((c, i, s) => s.indexOf(c) === i));

    const {
      getDictMap,
    } = useDicts();

    const substatusesMap = computed<{
      [key: string]: string;
    }>(() => (
      getDictMap(
        productionType.value === ProductionType.pretrial
          ? DictType.debtorPretrialSubstatuses
          : DictType.debtorSubstatuses,
      ).value
    ));

    const statusesMap = computed<{
      [key: string]: string;
    }>(() => (
      getDictMap(
        productionType.value === ProductionType.pretrial
          ? DictType.debtorPretrialStatuses
          : DictType.debtorStatuses,
      ).value
    ));

    type DebtorIcon = {
      key: string;
      icon: string;
      color: string;
      label: string;
    }

    const icons = computed(() => {
      const smsStatus = [...substatuses.value].reverse().find((item) => item.includes('sms'));
      const voiceStatus = [...substatuses.value].reverse().find((item) => item.includes('voice'));
      const emailStatus = [...substatuses.value].reverse().find((item) => item.includes('email'));

      return (([
        voiceStatus && {
          key: 'voice',
          icon: 'voice',
          color: ['voice_delivered', 'voice_ready'].includes(voiceStatus) ? 'green' : 'gray',
          label: t('voice', {
            status: substatusesMap.value[voiceStatus],
          }),
        },
        smsStatus && {
          key: 'sms',
          icon: 'sms',
          color: 'green',
          label: t('sms', {
            status: substatusesMap.value[smsStatus],
          }),
        },
        emailStatus && {
          key: 'email',
          icon: 'envelope',
          color: ['email_delivered'].includes(emailStatus) ? 'green' : 'gray',
          label: t('email', {
            status: substatusesMap.value[emailStatus],
          }),
        },
        substatuses.value.some((item) => item.includes('fees_paid')) && {
          key: 'fees_paid',
          icon: 'coins',
          color: 'green',
          label: substatusesMap.value.fees_paid,
        },
        substatuses.value.some((item) => item.includes('fees_await_paid')) && {
          key: 'fees_await_paid',
          icon: 'coins',
          color: 'gray',
          label: substatusesMap.value.fees_await_paid,
        },
        substatuses.value.some((item) => item.includes('statement_ordered')) && {
          key: 'statement_ordered',
          icon: 'egrn-excerpt',
          color: 'blue',
          label: substatusesMap.value.statement_ordered,
        },
        substatuses.value.some((item) => item.includes('statement_ready')) && {
          key: 'statement_ready',
          icon: 'egrn-excerpt',
          color: 'blue',
          label: substatusesMap.value.statement_ready,
        },
        substatuses.value.some((item) => item.includes('statement_error')) && {
          key: 'statement_error',
          icon: 'egrn-excerpt',
          color: 'gray',
          label: substatusesMap.value.statement_error,
        },
        substatuses.value.some((item) => item.includes('statement_received')) && {
          key: 'statement_received',
          icon: 'egrn-excerpt',
          color: 'green',
          label: substatusesMap.value.statement_received,
        },
        statuses.value.some((item) => item.status === 'ready_to_court') && {
          key: 'ready_to_court',
          icon: 'file-check',
          color: 'green',
          label: statusesMap.value.ready_to_court,
        },
      ] as Array<DebtorIcon | boolean>)
        .filter(Boolean) as Array<DebtorIcon>)
        .filter(({ key }, i, s) => (key.includes('statement')
          ? s.findIndex((f) => f.key.includes('statement')) === i
          : true));
    });

    const sortedIcons = computed(() => {
      const localIcons = [...icons.value];
      localIcons.sort((a, b) => (
        (a.key.includes('statement') ? 1 : 0)
        > (b.key.includes('statement') ? 1 : 0) ? -1 : 1
      ));

      return localIcons;
    });

    return {
      icons: sortedIcons,
      substatusesMap,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorIcons";
</style>
