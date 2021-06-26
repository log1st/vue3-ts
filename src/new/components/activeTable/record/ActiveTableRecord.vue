<template>
  <div
    :class="[
      $style.record,
      $style[state],
      isSelected && $style.isSelected,
       gridModifier
     ]"
    :style="{gridTemplateColumns: gridTemplate}"
    @contextmenu.prevent="$emit('contextmenu', $event)"
  >
    <div :class="$style.selector" v-if="state === 'primary'" @click="$emit('rowClick')"/>
    <div
      v-for="column in columns"
      :key="column.field"
      :class="[$style.cell, cellModifier]"
      v-on="selectableColumn !== column.field ? {
        click: () => $emit('rowClick')
      } : {}"
    >
      <div :class="$style.content">
        <slot :name="`cell(${column.field})`" :record="record" :index="index">
          <div :class="$style.noData" v-if="[null, undefined].includes(getDeepField(record, column.field))">
            Нет данных
          </div>
          <template v-else>
            {{getDeepField(record, column.field)}}
          </template>
        </slot>
      </div>

      <Checkbox
        v-if="isSelectable && selectableColumn === column.field"
        :class="[$style.select]"
        :model-value="isSelected"
        @update:modelValue="$emit('select')"
      />
    </div>
  </div>
</template>

<script>
import {defineComponent} from "@vue/composition-api";
import Checkbox from "@/new/components/checkbox/Checkbox";
import {getDeepField} from "@/new/utils/object";

export default defineComponent({
  name: "ActiveTableRecord",
  components: {Checkbox},
  props: {
    state: {
      type: String,
      default: 'primary'
    },
    columns: Array,
    isSelectable: Boolean,
    selectableColumn: String,
    record: Object,

    gridTemplate: String,
    gridModifier: String,
    cellModifier: String,

    isSelected: Boolean,

    index: Number,
  },
  setup() {
    return {
      getDeepField,
    }
  }
})
</script>

<style lang="scss" module>
@import "./activeTableRecord";
</style>
