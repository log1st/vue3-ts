<template>
  <div
    :class="[
      $style.record,
       gridModifier
     ]"
    :style="{gridTemplateColumns: gridTemplate}"
    @contextmenu.prevent="$emit('contextmenu', $event)"
  >
    <div
      :class="$style.selector"
      :style="isSelectable ? {left: columns[0].width || '0px'} : {}"
    />
    <div
      v-for="column in columns"
      :key="column.field"
      :class="[$style.cell, cellModifier]"
    >
      <div :class="$style.content">
        <slot :name="`cell(${column.field})`" :record="record" :index="index">
          {{getDeepField(record, column.field)}}
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
