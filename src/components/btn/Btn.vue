<template>
  <component
    :is="(to && !isDisabled) ? (typeof to === 'string' ? 'a' : 'RouterLink') : 'button'"
    :type="to ? undefined : type"
    :to="typeof to === 'string' ? undefined : to"
    :href="typeof to === 'string' ? to : undefined"
    :class="[
      $style.button,
      ...arrayFrom(state).map(s => $style[s]),
      isDisabled && $style.disabled
    ]"
    @click="onClick"
  >
    <div
      v-if="prependIcon || ('prepend' in $slots)"
      :class="$style.prepend"
    >
      <slot name="prepend">
        <Icon
          :icon="prependIcon"
          :class="$style.icon"
          data-role="icon"
        />
      </slot>
    </div>
    <div
      v-if="label || ('default' in $slots)"
      :class="$style.content"
      data-role="label"
    >
      <slot>
        {{ label }}
      </slot>
    </div>
    <div
      v-if="appendIcon || ('append' in $slots)"
      :class="$style.append"
    >
      <slot name="append">
        <Icon
          :icon="appendIcon"
          :class="$style.icon"
          data-role="icon"
        />
      </slot>
    </div>
  </component>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { arrayFrom } from '@/utils/object';
import { IBtn, IBtnState, IBtnType } from '@/components/btn/useBtn';
import Icon from '@/components/icon/Icon.vue';

export default defineComponent({
  name: 'Btn',
  components: { Icon },
  props: {
    to: [String, Object] as PropType<IBtn['to']>,
    state: {
      type: [String, Array] as PropType<IBtn['state']>,
      default: IBtnState.primary,
    },
    type: {
      type: String as PropType<IBtn['type']>,
      default: IBtnType.button,
    },
    label: String as PropType<IBtn['label']>,
    prependIcon: [String, Boolean] as PropType<IBtn['prependIcon']>,
    appendIcon: [String, Boolean] as PropType<IBtn['appendIcon']>,
    isDisabled: Boolean as PropType<IBtn['isDisabled']>,
  },
  emits: ['click'],
  setup(props, { emit }) {
    const onClick = (event: PointerEvent) => {
      if (props.isDisabled) {
        event.preventDefault();
        return;
      }
      emit('click', event);
    };
    return {
      arrayFrom,
      onClick,
    };
  },
});
</script>

<style lang="scss" module>
@import "./btn";
</style>
