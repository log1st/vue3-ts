<template>
  <form @submit.prevent="submit" :class="$style.signer">
    <div
      :class="$style.field"
      :style="{
        gridArea: field,
      }"
      v-for="[field, label] in [['signer', 'Подписант'], ['signer_name', 'ФИО представителя']]"
      :key="field"
    >
      <div :class="$style.label">{{ label }}</div>
      <div :class="$style.value" v-if="!isEditing">
        <template v-if="model[field]">
          {{model[field]}}
        </template>
        <div :class="$style.na" v-else>
          Н/Д
        </div>
      </div>
      <TextInput v-else v-model="model[field]" :placeholder="label" :class="$style.input"/>
    </div>
    <DocumentField :is-editable="isEditing" :file.sync="model.file" :class="$style.document"/>
    <div :class="$style.actions">
      <Btn :class="$style.action" @click="toggleEditing" state="quaternary" label="Редактировать" v-if="!isEditing" />
      <Btn :class="$style.action" @click="stopEditing" state="secondary" label="Отмена" v-if="isEditing" />
      <Btn :class="$style.action" state="primary" type="submit" label="Сохранить" v-if="isEditing" />
    </div>
  </form>
</template>

<script>
import TextInput from "@/new/components/textInput/TextInput";
import {ref, watch, computed} from "@vue/composition-api";
import Btn from "@/new/components/btn/Btn";
import DocumentField from "@/new/components/documentField/DocumentField";
export default {
  name: "OrganizationDocumentsTabSigner",
  components: {DocumentField, Btn, TextInput},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: Object,
  },
  setup(props, {emit}) {
    const model = ref({...props.modelValue});
    watch(computed(() => props.modelValue), newModel => {
      model.value = {...newModel}
    }, {
      immediate: true,
    })

    const isEditing = ref(false);
    const toggleEditing = async () => {
      await new Promise(requestAnimationFrame)
      isEditing.value = !isEditing.value;
    }
    const stopEditing = async () => {
      await new Promise(requestAnimationFrame)
      isEditing.value = false;
      model.value = {...props.modelValue};
    }

    const submit = () => {
      emit('update:modelValue', model.value);
      isEditing.value = false;
    }

    return {
      model,

      isEditing,
      toggleEditing,
      stopEditing,

      submit,
    }
  }
}
</script>

<style lang="scss" module>
@import "./organizationDocumentsTabSigner";
</style>
