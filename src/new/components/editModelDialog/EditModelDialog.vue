<template>
  <form @submit.prevent="submit" :class="$style.dialog">
    <Icon v-if="!isEditing && isEditable" icon="pencil" :class="$style.editIcon" @click="toggleEditing" />
    <div :class="$style.field" v-for="field in fields" :key="field.key">
      <div :class="$style.label">{{field.label}}</div>
      <div :class="$style.value" v-if="!isEditing">
        <template v-if="value[field.key]">
          {{value[field.key]}}
        </template>
        <div v-else :class="$style.na">
          Н/Д
        </div>
      </div>
      <div :class="$style.input" v-else>
        <TextInput
          :placeholder="field.placeholder || field.label"
          :hint="field.hint"
          v-model="value[field.key]"
          :is-disabled="field.blockedBy ? fields.some(({key}) => !!value[key] && key !== field.key) : false"
          :error="errorsMap[field.key]"
        />
      </div>
    </div>
    <div :class="$style.error" v-if="'common' in errorsMap">{{errorsMap.common}}</div>
    <Btn v-if="isEditing" type="submit" :label="submitLabel" :class="$style.action" state="primary"/>
  </form>
</template>

<script>
import {defineComponent, computed, ref} from "@vue/composition-api";
import {cloneDeep} from "lodash";
import TextInput from "@/new/components/textInput/TextInput";
import Icon from "@/new/components/icon/Icon";
import Btn from "@/new/components/btn/Btn";

export default defineComponent({
  name: "EditModelDialog",
  components: {Btn, Icon, TextInput},
  props: {
    model: Object,
    fields: Array,
    onSave: Function,
    errors: {
      type: Object,
      default: () => ({}),
    },
    submitLabel: {
      type: String,
      default: 'Сохранить'
    },
    isEditable: {
      type: Boolean,
      default: true,
    },
    isInitiallyEditing: Boolean,
  },
  setup(props, {emit}) {
    const value = ref(cloneDeep(props.model));

    const submit = async () => {
      if(props.onSave) {
        const {errors, status} = await props.onSave(value.value);
        if(status) {
          emit('close');
        }
      } else {
        emit('close');
      }
    };

    const isEditing = ref(props.isInitiallyEditing);
    const toggleEditing = async () => {
      await new Promise(requestAnimationFrame);
      isEditing.value = !isEditing.value;
    }

    const errorsMap = computed(() => (props.errors?.value || {}))

    return {
      errorsMap,
      submit,
      value,

      isEditing,
      toggleEditing,
    }
  }

})
</script>

<style lang="scss" module>
@import "./editModelDialog";
</style>
