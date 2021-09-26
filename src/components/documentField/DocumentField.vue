<template>
  <div
    :class="$style.wrapper"
    v-on="(dropZone && isEditing) ? {
      drop: onDrop,
      dragover: onDragover,
    } : {}"
  >
    <div
      v-if="label || ('label' in $slots)"
      :class="$style.label"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </div>
    <div
      :class="$style.field"
      :style="{
        backgroundImage: `url(${file})`
      }"
    >
      <div
        v-if="isEditing && (!file || isCreator)"
        :class="$style.add"
        @click="selectFiles"
      >
        <Icon
          data-role="icon"
          icon="add"
        />
      </div>
      <div
        v-if="!isEditing && file"
        :class="$style.icon"
      >
        <Icon
          data-role="icon"
          icon="files"
        />
      </div>
      <Btn
        v-if="file"
        :state="['secondary', 'highlighted']"
        prepend-icon="download"
        :class="[$style.download, $style.action]"
        @click="download"
      />
      <Btn
        v-if="file"
        :state="['secondary', 'highlighted']"
        prepend-icon="eye"
        :class="[$style.view, $style.action]"
        @click="view"
      />
      <Btn
        v-if="file && isEditing"
        :state="['secondary', 'highlighted']"
        prepend-icon="pencil"
        :class="[$style.edit, $style.action]"
        @click="selectFiles"
      />
      <Btn
        v-if="file && isEditing"
        :state="['secondary', 'highlighted']"
        prepend-icon="close"
        :class="[$style.remove, $style.action]"
        @click="remove"
      />
    </div>
    <template v-if="withName">
      <div
        v-if="!isEditing"
        :class="$style.name"
        :title="localName"
      >
        {{ localName }}
      </div>
      <TextInput
        v-else
        v-model="localName"
        :state="['primary', 'tiny']"
        :class="$style.nameField"
        :placeholder="t('documentField.name')"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import TextInput from '@/components/textInput/TextInput.vue';
import { useLocalValue } from '@/hooks/useLocalValue';
import { convertFileToBase64, downloadFile, useFileManager } from '@/hooks/useFileManager';
import { awaitFrame } from '@/utils/window';
import Icon from '@/components/icon/Icon.vue';
import Btn from '@/components/btn/Btn.vue';
import { arrayFrom } from '@/utils/object';

export default defineComponent({
  name: 'FileField',
  components: { Btn, Icon, TextInput },
  props: {
    file: String as PropType<string>,
    name: String as PropType<string>,
    withName: Boolean as PropType<boolean>,
    dropZone: Boolean as PropType<boolean>,
    isEditing: Boolean as PropType<boolean>,
    isCreator: Boolean as PropType<boolean>,
    isMultiple: Boolean as PropType<boolean>,
    label: String as PropType<string>,
    accept: [String, Array] as PropType<string | string[]>,
  },
  emits: ['update:file', 'update:name', 'create', 'remove'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const localFile = useLocalValue(props, 'file', emit);
    const localName = useLocalValue(props, 'name', emit);

    const {
      file: selectedFile,
      files: selectedFiles,
      selectFiles,
    } = useFileManager({
      multiple: !!props.isMultiple,
      accept: arrayFrom(props.accept),
    });

    watch(selectedFile, async (file) => {
      if (!file) {
        return;
      }
      if (props.isCreator) {
        emit('create', await convertFileToBase64(file));
        return;
      }
      localFile.value = await convertFileToBase64(file);
      localName.value = file.name;
    });

    watch(selectedFiles, async (files) => {
      if (!files.length) {
        return;
      }
      emit('create', await Promise.all(files.map(async (file) => ({
        file: await convertFileToBase64(file),
        name: file.name,
      }))));
    }, {
      deep: true,
    });

    const download = async () => {
      if (!localFile.value) {
        return;
      }
      await awaitFrame();
      downloadFile(`${localFile.value}${localFile.value.includes('?') ? '&' : '?'}download=1`);
    };

    const view = async () => {
      if (!localFile.value) {
        return;
      }
      await awaitFrame();
      downloadFile(localFile.value, false);
    };

    const remove = async () => {
      await awaitFrame();
      emit('remove');
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      if (!e.dataTransfer?.files[0]) {
        return;
      }
      const newSelectedFile = e.dataTransfer.files[0];
      selectedFile.value = newSelectedFile;
    };

    const onDragover = (e: DragEvent) => {
      e.preventDefault();
    };

    return {
      localFile,
      localName,
      t,

      remove,
      download,
      view,
      onDrop,
      onDragover,
      selectFiles,
    };
  },
});
</script>

<style lang="scss" module>
@import "./documentField";
</style>
