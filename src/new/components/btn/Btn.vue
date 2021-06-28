<template>
  <component
    :is="url ? (
      typeof url === 'string' ? 'a' : 'router-link'
    ) : 'button'"
    v-bind="{
      ...url ? {
        [typeof url === 'string' ? 'href' : 'to']: url,
        target,
      } : {
        type,
      }
    }"
    :class="[
      $style.button,
      ...(Array.isArray(state) ? state : [state]).map(s => $style[s]),
      isSquare && $style.isSquare,
      isDisabled && $style.isDisabled,
    ]"
    v-on="url ? {} : {
      click: onClick,
    }"
  >
    <div
      v-if="prependIcon"
      :class="$style.prepend"
    >
      <Icon
        :icon="prependIcon"
        :class="$style.icon"
      />
    </div>
    <div
      v-if="label || 'default' in $slots"
      :class="$style.content"
    >
      <slot>
        {{ label }}
      </slot>
    </div>
    <div
      v-if="appendIcon"
      :class="$style.append"
    >
      <Icon
        :icon="appendIcon"
        :class="$style.icon"
      />
    </div>
  </component>
</template>

<script>
import { defineComponent, PropType } from '@vue/composition-api';
import Icon from '@/new/components/icon/Icon.vue';

export default defineComponent({
  name: 'Btn',
  components: { Icon },
  props: {
    url: [String, Object],
    state: {
      type: [String, Array],
      default: 'primary',
    },
    label: String,
    isDisabled: Boolean,
    target: String,
    type: {
      type: String,
      default: 'button',
    },
    isSquare: Boolean,
    prependIcon: String,
    appendIcon: String,
  },
  emits: ['click'],
  setup(props, { emit }) {
    const onClick = (event) => {
      if (props.isDisabled) {
        event.stopPropagation();
        return;
      }
      emit('click', event);
    };

    return {
      onClick,
    };
  },
});
</script>

<style lang="scss" module>
@import "./btn";
</style>
