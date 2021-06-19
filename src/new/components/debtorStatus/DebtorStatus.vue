<template>
  <div
    :class="[$style.status, $style[color]]"
    @click="$emit('click', $event)"
  >
    <div :class="$style.label">
      {{status}}
    </div>
    <div :class="$style.hint">
      {{subStatus}}
    </div>
    <Icon icon="chevron-down" :class="$style.icon"/>
  </div>
</template>

<script>
import {defineComponent} from "@vue/composition-api";
import Icon from "@/new/components/icon/Icon";

export default defineComponent({
  name: "DebtorStatus",
  components: {Icon},
  setup() {
    const statuses = ['Новый', 'Готов', 'В работе', 'Подано', 'Исполнение']
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const subStatuses = ['Принято к производству']
    const subStatus = subStatuses[Math.floor(Math.random() * subStatuses.length)];
    const colors = ['blue', 'green', 'gray', 'purple', 'cyan']
    const color = colors[Math.floor(Math.random() * colors.length)];

    return {
      status,
      subStatus,
      color,
    }
  }
})
</script>

<style lang="scss" module>
@import "./debtorStatus";
</style>
