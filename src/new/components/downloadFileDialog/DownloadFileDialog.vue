<template>
  <div :class="$style.dialog">
    <div :class="$style.title">
      {{title}}
    </div>
    <div :class="$style.actions">
      <Btn :class="$style.action" @click="close" :url="url" target="_blank" :state="['tertiary', 'vertical']" prepend-icon="eye" label="Открыть и посмотреть"/>
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
import {useToast} from "@/new/hooks/useToast";

export default defineComponent({
  name: "DownloadFileDialog",
  components: {Btn},
  props: {
    title: String,
    url: String,
  },
  setup(props, {emit}) {
    const close = async () => {
      await new Promise(requestAnimationFrame);
      emit('close');
    }

    const download = async () => {
      const url = new URL(props.url);
      const params = new URLSearchParams(url.search);
      params.append('download', '1');
      url.search = params.toString();
      await downloadFile({
        url: url.toString(),
        name: props.url.split('/').pop(),
      })
      close();
    }

    const {
      showToast,
    } = useToast()

    const copy = async () => {
      await copyToClipboard(props.url)
      await showToast({
        message: 'Ссылка скопирована',
        type: 'success',
      })
      close();
    }

    return {
      download,
      copy,
      close,
    }
  }
})
</script>

<style lang="scss" module>
@import "./downloadFileDialog";
</style>
