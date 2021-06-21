<template>
  <div :class="$style.dialog">
    <div :class="$style.title">
      {{title}}
    </div>
    <div :class="$style.actions">
      <Btn :class="$style.action" :url="url" target="_blank" :state="['tertiary', 'vertical']" prepend-icon="eye" label="Открыть и посмотреть"/>
      <Btn :class="$style.action" @click="download" :state="['tertiary', 'vertical']" prepend-icon="download" label="Скачать"/>
    </div>
    <div @click="copy" :class="$style.copy">
      Скопировать ссылку
    </div>
  </div>
</template>

<script>
import Btn from "@/new/components/btn/Btn";
import {copyToClipboard} from "@/new/utils/string";
import {downloadFile} from "@/new/utils/file";
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: "DownloadFileDialog",
  components: {Btn},
  props: {
    title: String,
    url: String,
  },
  setup(props) {
    const download = async () => {
      await downloadFile({
        url: props.url,
        name: props.url.split('/').pop(),
      })
    }

    const copy = async () => {
      await copyToClipboard(props.url)
    }

    return {
      download,
      copy,
    }
  }
})
</script>

<style lang="scss" module>
@import "./downloadFileDialog";
</style>
