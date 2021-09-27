<template>
  <div
    :class="[
      $style.tabs,
      ...arrayFrom(state).map(s => $style[s])
    ]"
  >
    <component
      :is="'to' in tab ? 'router-link' : 'button'"
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      :to="tab.to"
      :active-class="tab.exact ? null : $style.active"
      :exact-active-class="!tab.exact ? null : $style.active"
      :class="[
        $style.tab,
        tab.disabled && $style.disabled,
        modelValue === tab.key && $style.active,
      ]"
      @click="onClick(tab, $event)"
    >
      <div :class="$style.label">
        <slot
          :name="`tab(${tab.key})`"
          v-bind="tab"
        >
          {{ tab.label }}
        </slot>
      </div>
      <Icon
        v-if="tab.icon"
        :icon="tab.icon"
        :class="$style.icon"
      />
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ITab, ITabs } from '@/components/tabs/useTabs';
import Icon from '@/components/icon/Icon.vue';
import { arrayFrom } from '@/utils/object';

export default defineComponent({
  name: 'Tabs',
  components: { Icon },
  props: {
    state: [String, Array] as PropType<ITabs['state']>,
    tabs: Array as PropType<ITabs['tabs']>,
    modelValue: String as PropType<ITabs['modelValue']>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onClick = (tab: ITab, event: PointerEvent) => {
      tab.onClick && tab.onClick(event);
      emit('update:modelValue', tab.key);
    };

    return {
      onClick,
      arrayFrom,
    };
  },
});
</script>

<style lang="scss" module>
@import "./tabs";
</style>
