<template>
  <form @submit.prevent="submit" :class="$style.filters">
    <div :class="$style.list">
      <div
        :class="$style.filter"
        v-for="filter in visibleFilters"
        :key="filter.field"
        :style="{width: `${(filter.width || 1) * widthPart}%`}"
      >
        <FilterConfig
          v-model="value[filter.field]"
          :type="filter.type"
          :props="filter.props"
        />
      </div>
    </div>
    <div :class="$style.actions">
      <Btn state="secondary" @click="reset" :class="$style.action">
        Сбросить
      </Btn>
      <Btn state="primary" type="submit" :class="$style.action">
        Поиск
      </Btn>
    </div>
  </form>
</template>

<script>
import {defineComponent, computed} from "@vue/composition-api";
import {useLocalProp} from "@/new/hooks/useLocalProp";
import FilterConfig from "@/new/components/filter/FilterConfig";
import Btn from "@/new/components/btn/Btn";

export default defineComponent({
  name: "Filters",
  components: {Btn, FilterConfig},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: Object,
    filters: Array,
  },
  setup(props, {emit}) {
    const value = useLocalProp(props, emit, 'modelValue', true);

    const visibleFilters = computed(() => (
      props.filters.filter(({isHidden}) => !isHidden)
    ));

    const defaultValue = computed(() => (
      props.filters.reduce((acc, cur) => ({
        ...acc,
        [cur.field]: JSON.parse(JSON.stringify(cur.defaultValue || null))
      }), {})
    ))

    const widthPart = 100 / Math.max(...visibleFilters.value.map(({width = 1}) => width));

    const submit = async () => {
      emit('update:modelValue', value.value);
      emit('close');
    }

    const reset = async () => {
      value.value = defaultValue.value;
      await submit();
    }

    return {
      value,
      visibleFilters,
      widthPart,

      submit,
      reset,
    }
  }
})
</script>

<style lang="scss" module>
@import "./filters";
</style>
