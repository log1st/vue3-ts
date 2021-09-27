<template>
  <div
    :class="[
      $style.pagination,
      $style[state]
    ]"
  >
    <template
      v-for="item in pages"
      :key="item.key"
    >
      <div
        :class="[
          $style.page,
          item.isDisabled && $style.disabled,
          item.isActive && $style.active,
        ]"
        @click="selectPage(+item.value)"
      >
        <Icon
          v-if="item.icon"
          :class="$style.icon"
          :icon="item.icon"
        />
        <template v-else-if="item.label">
          {{ item.label }}
        </template>
      </div>
      <div
        v-if="item.spaceAfter"
        :class="$style.spacer"
      >
        <div />
        <div />
        <div />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useLocalValue } from '@/hooks/useLocalValue';
import Icon from '@/components/icon/Icon.vue';

export default defineComponent({
  name: 'Pagination',
  components: { Icon },
  props: {
    page: {
      type: Number as PropType<number>,
      required: true,
    },
    limit: {
      type: Number as PropType<number>,
      required: true,
    },
    total: {
      type: Number as PropType<number>,
      required: true,
    },
    state: {
      type: String as PropType<'default'>,
      default: 'default',
    },
  },
  emits: ['update:page', 'update:limit'],
  setup(props, { emit }) {
    const localPage = useLocalValue(props, 'page', emit);
    const localLimit = useLocalValue(props, 'limit', emit);

    const totalPages = computed(() => (Math.ceil(props.total / props.limit)));

    const selectPage = (page: number) => {
      if (page > totalPages.value || page < 1) {
        return;
      }
      localPage.value = page;
    };

    const pages = computed(() => {
      let newPages = [];

      newPages.push(...[1, 2]);
      newPages.push(...[localPage.value - 1]);
      newPages.push(localPage.value);
      newPages.push(...[localPage.value + 1]);
      newPages.push(...[totalPages.value, totalPages.value - 1]);

      newPages.sort((a, b) => (a - b > 0 ? 1 : -1));

      newPages = newPages
        .filter((cur, index, self) => self.indexOf(cur) === index)
        .filter((cur) => (cur >= 1) && (cur <= totalPages.value))
        .map((key) => ({
          key,
          value: key,
        }))
        .map((cur, index, self) => ({
          ...cur,
          spaceBefore: (
            index > 0
            && cur.value - self[index - 1].value > 1
          ),
          spaceAfter: (
            index < self.length - 1
            && -cur.value + self[index + 1].value > 1
          ),
        }));

      return [
        {
          key: 'first',
          icon: 'double-chevron-left',
          value: 1,
          isDisabled: localPage.value === 1,
        },
        {
          key: 'previous',
          icon: 'chevron-left',
          value: localPage.value - 1,
          isDisabled: localPage.value === 1,
        },
        ...newPages.map((cur) => ({
          ...cur,
          label: String(cur.value),
          isActive: localPage.value === cur.value,
        })),
        {
          key: 'next',
          icon: 'chevron-right',
          value: localPage.value + 1,
          isDisabled: localPage.value === totalPages.value,
        },
        {
          key: 'last',
          icon: 'double-chevron-right',
          value: totalPages.value,
          isDisabled: localPage.value === totalPages.value,
        },
      ] as Array<{
        key: string;
        icon?: string;
        value?: number;
        isDisabled?: boolean;
        isActive?: boolean;
        label?: string;
        spaceAfter?: boolean;
      }>;
    });

    return {
      pages,

      localPage,
      localLimit,

      selectPage,
    };
  },
});
</script>

<style lang="scss" module>
@import "./pagination";
</style>
