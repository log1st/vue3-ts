<template>
  <form @submit.prevent="submit" :class="$style.dialog">
    <div :class="$style.title">
      Настройка отображения
    </div>
    <div :class="$style.form">
      <div :class="$style.heading">
        Записей на странице
      </div>
      <TextInput
        :state="['primary', 'dark']"
        v-model.number="localLimit"
        label="Введите число от 1 до 500"
        :class="$style.limit"
      />
      <div :class="$style.columns">
        <div :class="$style.group">
          <div :class="$style.groupTitle">
            Порядок и отбражение колонок
          </div>
          <Draggable
            v-model="value"
            :filter="`.${$style.isDisabled}`"
            :group="{name: 'columns', pull: true}"
            :class="$style.list"
            :drag-class="$style.isDragging"
          >
            <div
              :class="[
                $style.item,
                columnsMap[item].isRequired && $style.isDisabled
              ]"
              v-for="item in value"
              :key="item"
            >
              <div :class="$style.itemHandle" v-if="!columnsMap[item].isRequired">
                <Icon icon="drag-n-sort"/>
              </div>
              <div :class="$style.itemLabel">
                {{columnsMap[item].label}}
              </div>
              <div :class="[$style.itemStatus, $style.isActive]">
                <Icon icon="eye"/>
              </div>
            </div>
          </Draggable>
        </div>
        <div :class="$style.exchange">
          <Icon icon="exchanger"/>
        </div>
        <div :class="$style.group">
          <div :class="$style.groupTitle">
            Скрытые/Фиксированные колонки
          </div>
          <Draggable
            v-model="notSelected"
            :group="{name: 'columns', pull: true}"
            :class="$style.list"
            :drag-class="$style.isDragging"
            :filter="`.${$style.isDisabled}`"
          >
            <div
              :class="[
                $style.item,
                columnsMap[item].isRequired && $style.isDisabled
              ]"
              v-for="item in notSelected"
              :key="item"
            >
              <div :class="$style.itemHandle" v-if="!columnsMap[item].isRequired">
                <Icon icon="drag-n-sort"/>
              </div>
              <div :class="$style.itemLabel">
                {{columnsMap[item].label}}
              </div>
              <div :class="$style.itemStatus">
                <Icon :icon="columnsMap[item].isRequired ? 'office-pin' : 'eye'"/>
              </div>
            </div>
          </Draggable>
        </div>
      </div>
    </div>
    <div :class="$style.actions">
      <Btn state="secondary" :class="$style.action" @click="reset">
        Сбросить
      </Btn>
      <Btn state="primary" type="submit" :class="$style.action">
        Применить
      </Btn>
    </div>
  </form>
</template>

<script>
import {computed, defineComponent, ref, watch} from "@vue/composition-api";
import Icon from "@/new/components/icon/Icon";
import Btn from "@/new/components/btn/Btn";
import SelectInput from "@/new/components/selectInput/SelectInput";
import TextInput from "@/new/components/textInput/TextInput";
import Draggable from 'vuedraggable'

export default defineComponent({
  name: "ActiveTableSettingsDialog",
  components: {
    TextInput,
    SelectInput,
    Btn,
    Icon,
    Draggable,
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    columns: Array,
    modelValue: Object,
    onSubmit: Function,
    onReset: Function,
  },
  setup(props, {emit}) {
    const localLimit = ref(props.modelValue.limit);
    const value = ref([]);
    const notSelected = ref([]);

    const availableColumns = computed(() => props.columns.map(({field}) => field));
    const columnsMap = computed(() => props.columns.reduce((acc, column) => ({
      ...acc,
      [column.field]: column,
    }), {}));

    watch(computed(() => props.modelValue), ({columns, limit}) => {
      localLimit.value = limit;
      value.value = [...columns.filter(column => (!columnsMap.value[column].isRequired))];
      notSelected.value = [...availableColumns.value.filter((field) => !columns.includes(field) || columnsMap.value[field].isRequired)];
    }, {
      immediate: true,
      deep: true,
    })

    const submit = () => {
      props.onSubmit && props.onSubmit({
        columns: value.value,
        limit: localLimit.value,
      });
      emit('close');
    }

    const reset = () => {
      props.onReset && props.onReset();
      emit('close');
    }

    return {
      localLimit,
      reset,
      submit,

      value,
      notSelected,

      columnsMap,
    }
  }
})
</script>

<style lang="scss" module>
@import "./activeTableSettingsDialog";
</style>
