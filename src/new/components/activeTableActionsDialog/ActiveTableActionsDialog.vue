<template>
  <form @submit.prevent="submit" :class="$style.dialog">
    <div :class="$style.title">
      Быстрые клавиши
    </div>
    <div :class="$style.actions">
      <div
        :class="[
          $style.action,
          value.includes(action.key) && $style.isActive,
        ]"
        v-for="action in actions"
        :key="action.key"
        @click="selectAction(action.key)"
      >
        <Icon :icon="action.icon" :class="$style.actionIcon"/>
        <div :class="$style.actionLabel">
          {{action.label}}
        </div>
      </div>
    </div>
    <Btn state="primary" type="submit" :class="$style.submit">
      Применить
    </Btn>
  </form>
</template>

<script>
import {defineComponent} from "@vue/composition-api";
import Icon from "@/new/components/icon/Icon";
import {useLocalProp} from "@/new/hooks/useLocalProp";
import Btn from "@/new/components/btn/Btn";

export default defineComponent({
  name: "ActiveTableActionsDialog",
  components: {Btn, Icon},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    actions: Array,
    modelValue: Array,
    onSubmit: Function,
  },
  setup(props, {emit}) {
    const value = useLocalProp(props, emit, 'modelValue', true, true);

    const selectAction = (key) => {
      const localValue = [...value.value];
      const index = localValue.indexOf(key);
      if(index === -1) {
        localValue.push(key);
      } else {
        localValue.splice(index, 1)
      }
      value.value = localValue
    };

    const submit = () => {
      props.onSubmit && props.onSubmit(value.value);
      emit('close');
    }

    return {
      selectAction,
      submit,

      value,
    }
  }
})
</script>

<style lang="scss" module>
@import "./activeTableActionsDialog";
</style>
