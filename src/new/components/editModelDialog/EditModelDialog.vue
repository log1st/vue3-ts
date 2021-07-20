<template>
  <form @submit.prevent="submit" :class="$style.dialog">
    <Icon v-if="!isEditing" icon="pencil" :class="$style.editIcon" @click="toggleEditing" />
    <div :class="$style.field" v-for="field in fields" :key="field.key">
      <div :class="$style.label">{{field.label}}</div>
      <div :class="$style.value" v-if="!isEditing">
        {{value[field.key]}}
      </div>
      <div :class="$style.input" v-else>
        <TextInput :placeholder="field.label" v-model="value[field.key]"/>
      </div>
    </div>
    <Btn v-if="isEditing" type="submit" :label="submitLabel" :class="$style.action" state="primary"/>
  </form>
</template>

<script>
import {defineComponent, ref} from "@vue/composition-api";
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
    submitLabel: {
      type: String,
      default: 'Сохранить'
    },
  },
  setup(props, {emit}) {
    const value = ref(cloneDeep(props.model));

    const submit = () => {
      props.onSave && props.onSave(value.value);
      emit('close');
    };

    const isEditing = ref(false);
    const toggleEditing = async () => {
      await new Promise(requestAnimationFrame);
      isEditing.value = !isEditing.value;
    }

    return {
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
