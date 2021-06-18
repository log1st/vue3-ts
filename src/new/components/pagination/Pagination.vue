<template>
  <div :class="$style.pagination">
    <template v-for="newPage in pages">
      <div
        :key="newPage.key"
        :disabled="newPage.isDisabled"
        :class="[
          $style.page,
          newPage.isDisabled && $style.isDisabled,
          newPage.isActive && $style.isActive,
        ]"
        @click="selectPage(newPage.value)"
      >
        <Icon :class="$style.icon" :icon="newPage.icon" v-if="newPage.icon"/>
        <template v-else>
          {{ newPage.label }}
        </template>
      </div>
      <div
        v-if="newPage.spaceAfter"
        :class="$style.spacer"
        :key="`after-spacer-${newPage.key}`"
      >
        <div />
        <div />
        <div />
      </div>
    </template>
  </div>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api';
import Icon from "@/new/components/icon/Icon";

export default defineComponent({
  name: 'Pagination',
  components: {Icon},
  props: {
    page: Number,
    total: Number,
    limit: Number,
  },
  emits: ['update:page'],
  setup(props, { emit }) {
    const totalPages = computed(() => Math.ceil(props.total / props.limit));

    const selectPage = (page) => {
      if(page > totalPages.value || page < 1) {
        return;
      }
      emit('update:page', page);
    };

    const page = computed({
      get() {
        return props.page || 1;
      },
      set(page) {
        emit('update:page', page);
      },
    });

    const pages = computed(() => {
      let newPages = [];

      newPages.push(...[1, 2]);
      newPages.push(...[page.value - 1]);
      newPages.push(page.value);
      newPages.push(...[page.value + 1]);
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
          isDisabled: page.value === 1
        },
        {
          key: 'previous',
          icon: 'chevron-left',
          value: page.value - 1,
          isDisabled: page.value === 1
        },
        ...newPages.map((cur) => ({
          ...cur,
          label: String(cur.value),
          isActive: page.value === cur.value,
        })),
        {
          key: 'next',
          icon: 'chevron-right',
          value: page.value + 1,
          isDisabled: page.value === totalPages.value
        },
        {
          key: 'last',
          icon: 'double-chevron-right',
          value: totalPages.value,
          isDisabled: page.value === totalPages.value
        },
      ];
    });

    return {
      selectPage,

      pages,
    };
  },
});
</script>

<style lang="scss" module>
@import "./pagination";
</style>
