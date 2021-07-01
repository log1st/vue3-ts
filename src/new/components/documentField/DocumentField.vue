<template>
  <div :class="$style.wrapper">
    <div :class="$style.field">
      <div :class="$style.placeholder" v-if="!file">
        <Icon icon="add" :class="$style.placeholderIcon"/>
      </div>
      <template v-else>
        <div :class="$style.preview" :style="{backgroundImage: `url(${file})`}"/>
        <div :class="$style.controls">
          <Icon icon="download" @click="download" :class="$style.download"/>
          <Icon icon="pencil" @click="update" :class="$style.edit"/>
          <Icon icon="close" @click="remove" :class="$style.remove"/>
          <Icon icon="symbol" @click="remove" :class="$style.rename" v-if="withName"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Icon from "@/new/components/icon/Icon";
import {useLocalProp} from "@/new/hooks/useLocalProp";
import Btn from "@/new/components/btn/Btn";
export default {
  name: "DocumentField",
  components: {Btn, Icon},
  props: {
    file: String,
    name: String,
    withName: Boolean,
  },
  setup(props, {emit}) {
    const localFile = useLocalProp(props, emit, 'file');
    const localName = useLocalProp(props, emit, 'name');

    const download = () => {
      console.log('download');
    }

    const update = () => {
      console.log('update');
    }

    const remove = () => {
      localFile.value = null;
    }

    return {
      localFile,
      localName,

      download,
      update,
      remove,
    }
  }
}
</script>

<style lang="scss" module>
@import "./documentField";
</style>
