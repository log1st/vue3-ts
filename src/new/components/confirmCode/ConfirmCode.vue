<template>
    <div :class="$style.wrapper" :style="{
      gridTemplateColumns: `repeat(${length}, 1fr)`
    }">
      <div
        :class="$style.field"
        v-for="i in length"
        :key="i"
      >
        <input
          ref="inputRefs"
          v-model="localValue[i - 1]"
          :class="$style.input"
          @input="goTo(i)"
          @focus="select(i - 1)"
        />
      </div>
    </div>
</template>

<script>
import {defineComponent, ref, watch, computed} from "@vue/composition-api";

export default defineComponent({
  name: "ConfirmCode",
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: String,
    length: {
      type: Number,
      default: 6,
    },
  },
  setup(props, {emit}) {
    const localValue = ref(Array(props.length).fill(''))

    watch(computed(() => props.modelValue), value => {
      localValue.value = value.split('').slice(0, props.length)
    }, {
      immediate: true,
    });

    watch(localValue, value => {
      emit('update:modelValue', value.join(''))
    });

    const inputRefs = ref([]);

    const goTo = index => {
      if(inputRefs.value[index]) {
        inputRefs.value[index].focus();
      }
    }

    const select = index => {
      if(inputRefs.value[index]) {
        inputRefs.value[index].select();
      }
    }

    return {
      localValue,
      inputRefs,
      goTo,
      select,
    }
  }
})
</script>

<style lang="scss" module>
@import "./confirmCode";
</style>
