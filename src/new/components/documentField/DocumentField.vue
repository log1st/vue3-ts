<template>
  <div :class="$style.wrapper">
    <div :class="$style.field">
      <div :class="$style.placeholder" @click="update" v-if="!file && isEditable">
        <Icon icon="add" :class="$style.placeholderIcon"/>
      </div>
      <template v-else>
        <div :class="$style.preview">
          <Icon icon="file" :class="$style.previewIcon"/>
        </div>
        <div :class="$style.controls" v-if="isEditable">
          <Icon icon="download" @click="download" :class="$style.download"/>
          <Icon icon="pencil" @click="update" :class="$style.edit"/>
          <Icon icon="close" @click="remove" :class="$style.remove"/>
          <Icon icon="symbol" @click="toggleRenaming" :class="$style.rename" v-if="withName && !isRenaming"/>
        </div>
      </template>
    </div>
    <template
      v-if="withName"
    >
      <div :class="$style.name" v-if="!isRenaming" :hint="localName">
        {{localName}}
      </div>
      <form @submit.prevent="toggleRenaming" v-else>
        <TextInput
          :state="['primary', 'dark', 'small']"
          :class="$style.nameField"
          v-model="localName"
          placeholder="Название"
        />
      </form>
    </template>
  </div>
</template>

<script>
import Icon from "@/new/components/icon/Icon";
import {useLocalProp} from "@/new/hooks/useLocalProp";
import Btn from "@/new/components/btn/Btn";
import {
  convertFileToBase64,
  downloadFile,
  getFilePreview,
  useFileManager
} from "@/new/hooks/useFileManager";
import {ref, watch} from "@vue/composition-api";
import TextInput from "@/new/components/textInput/TextInput";

export default {
  name: "DocumentField",
  components: {TextInput, Btn, Icon},
  props: {
    file: String,
    name: String,
    withName: Boolean,
    isEditable: Boolean,
    isCreator: Boolean,
  },
  setup(props, {emit}) {
    const localFile = useLocalProp(props, emit, 'file');
    const localName = useLocalProp(props, emit, 'name');

    const preview = ref();

    const {
      file: selectedFile,
      selectFiles,
    } = useFileManager();

    watch(selectedFile, async file => {
      if(!file) {
        return;
      }
      if(props.isCreator) {
        emit('create', await convertFileToBase64(file));
        return;
      }
      localFile.value = await convertFileToBase64(file)
      localName.value = file.name;
    });

    watch(localFile, async file => {
      return;
      if(props.isCreator) {
        return;
      }
      if(!file) {
        preview.value = null;
      } else {
        preview.value = await getFilePreview(file)
      }
    }, {
      immediate: true,
    })

    const download = () => {
      downloadFile(
        localFile.value,
        localName.value && `${localName.value}.${localFile.value.split('.').pop()}`
      )
    }

    const update = () => {
      selectFiles()
    }

    const remove = async () => {
      await new Promise(requestAnimationFrame)
      localFile.value = null;
      emit('remove')
    }

    const isRenaming = ref(true);
    const toggleRenaming = async () => {
      await new Promise(requestAnimationFrame)
      isRenaming.value = !isRenaming.value
    }
    const stopRenaming = async () => {
      await new Promise(requestAnimationFrame)
      localName.value = props.name;
    }

    return {
      localFile,
      localName,
      preview,

      download,
      update,
      remove,

      isRenaming,
      toggleRenaming,
      stopRenaming,
    }
  }
}
</script>

<style lang="scss" module>
@import "./documentField";
</style>
