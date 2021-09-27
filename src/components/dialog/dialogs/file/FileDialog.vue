<template>
  <div
    :class="[
      $style.dialog,
      $style.default
    ]"
  >
    <div :class="$style.caption">
      {{ title }}
    </div>
    <div :class="$style.actions">
      <Btn
        v-if="withPreview"
        :label="t('preview')"
        :to="url"
        target="_blank"
        :state="['tertiary', 'vertical']"
        prepend-icon="eye"
        :class="$style.action"
        @click="close"
      />
      <Btn
        :label="t('download')"
        :to="downloadUrl"
        target="_blank"
        :state="['tertiary', 'vertical']"
        prepend-icon="download"
        :class="$style.action"
        @click="close"
      />
    </div>
    <button
      v-if="withCopy"
      :class="$style.copy"
      @click="copy"
    >
      {{ t('copy') }}
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { FilePayload } from '@/hooks/useDialog';
import Btn from '@/components/btn/Btn.vue';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { IToastLevel, useToast } from '@/hooks/useToast';
import { copyToClipboard } from '@/utils/string';

export default defineComponent({
  name: 'FileDialog',
  components: { Btn },
  props: {
    title: String as PropType<FilePayload['url']>,
    url: {
      type: String as PropType<FilePayload['url']>,
      required: true,
    },
    withPreview: {
      type: Boolean as PropType<FilePayload['withPreview']>,
      default: true,
    },
    withCopy: {
      type: Boolean as PropType<FilePayload['withCopy']>,
      default: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useLocalI18n('fileDialog');

    const close = async () => {
      await new Promise(requestAnimationFrame);
      emit('close');
    };

    const downloadUrl = computed(() => {
      const url = new URL(props.url);
      const params = new URLSearchParams(url.search);
      params.append('download', '1');
      url.search = params.toString();

      return url.toString();
    });

    const {
      showToast,
    } = useToast();

    const copy = async () => {
      await copyToClipboard(props.url);
      await showToast({
        message: 'fileDialog.copied',
        level: IToastLevel.success,
      });
      await close();
    };

    return {
      t,

      close,
      copy,
      downloadUrl,
    };
  },
});
</script>

<style lang="scss" module>
@import "./fileDialog";
</style>
