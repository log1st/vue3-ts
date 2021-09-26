<template>
  <div
    :class="[
      $style.container,
      $style[theme]
    ]"
  >
    <div :class="$style.title">
      {{ t('title') }}

      <Btn
        :class="$style.sign"
        :label="t('sign.label')"
        state="primary"
        prepend-icon="flash-drive"
        @click="showSignConfigurationDialog"
      />
    </div>
    <div :class="$style.articles">
      <div :class="$style.article">
        <div :class="$style.articleLabel">
          {{ t('template.label') }}
        </div>
        <div :class="$style.articleBody">
          {{ t('template.body') }}
        </div>
      </div>
      <div :class="$style.article">
        <div :class="$style.articleLabel">
          {{ t('file.label') }}
        </div>
        <div :class="$style.articleBody">
          <i18n-t
            tag="div"
            keypath="exchange.import.instructions.file.body"
          >
            <template #email>
              <a
                :href="`mailto:${settings.exchangeImportEmail}`"
                target="_blank"
              >{{ settings.exchangeImportEmail }}</a>
            </template>
          </i18n-t>
          <ExchangeTemplates
            :class="$style.templates"
            :templates="templates"
          />
        </div>
      </div>
      <div :class="$style.article">
        <div :class="$style.articleLabel">
          {{ t('integration.label') }}
        </div>
        <i18n-t
          tag="div"
          keypath="exchange.import.instructions.integration.body"
          :class="$style.articleBody"
        >
          <template #email>
            <a
              :href="`mailto:${settings.exchangeImportEmail}`"
              target="_blank"
            >{{ settings.exchangeImportEmail }}</a>
          </template>
        </i18n-t>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { useLayout } from '@/hooks/useLayout';
import { ImportFileTemplate } from '@/store/modules/layout';
import ExchangeTemplates from '@/components/exchangeTemplates/ExchangeTemplates.vue';
import { ExchangeTemplate } from '@/components/exchangeTemplates/useExchangeTemplates';
import Btn from '@/components/btn/Btn.vue';
import { IDialogComponent, useDialog } from '@/hooks/useDialog';
import { ActiveFormFieldType } from '@/hooks/useActiveForm';
import { SignalType, useSignal } from '@/hooks/useSignal';
import { IToastLevel, useToast } from '@/hooks/useToast';

export default defineComponent({
  name: 'ExchangeImportInstructions',
  components: { Btn, ExchangeTemplates },
  setup() {
    const { t } = useLocalI18n('exchange.import.instructions');

    const { t: commonT } = useI18n();
    const {
      settings,
      theme,
    } = useLayout();

    const templates = computed<Array<ExchangeTemplate>>(() => ([
      ImportFileTemplate.csv,
      ImportFileTemplate.xls,
      ImportFileTemplate.xlsx,
    ].map((key) => ({
      key,
      label: commonT(`file.${key}`),
      url: settings.value.importFilesTemplates.judicial.linear[key],
    }))));

    const signalId = 'signConfig';

    const {
      showDialog,
    } = useDialog();

    const {
      subscribeToSignal,
    } = useSignal();

    const {
      showToast,
    } = useToast();

    let hideModelDialog: (() => void) | null;

    onBeforeUnmount(
      subscribeToSignal(SignalType.model, async (payload) => {
        if (payload.id !== signalId) {
          return;
        }
        hideModelDialog?.();
        await showToast({
          level: IToastLevel.success,
          message: 'exchange.import.instructions.sign.toast.success',
        });
      }),
    );

    onBeforeUnmount(() => {
      hideModelDialog?.();
      hideModelDialog = null;
    });

    const showSignConfigurationDialog = async () => {
      hideModelDialog?.();
      hideModelDialog = await showDialog({
        component: IDialogComponent.model,
        addInRoute: false,
        payload: {
          signal: signalId,
          isEditable: true,
          fields: [
            {
              key: 'crypto_pro_thumbprint',
              field: 'crypto_pro_thumbprint',
              options: {
                label: t('sign.field.crypto_pro_thumbprint'),
                placeholder: t('sign.field.crypto_pro_thumbprint'),
              },
              type: ActiveFormFieldType.input,
            },
            {
              key: 'crypto_pro_proxy_url',
              field: 'crypto_pro_proxy_url',
              options: {
                label: t('sign.field.crypto_pro_proxy_url'),
                placeholder: t('sign.field.crypto_pro_proxy_url'),
              },
              type: ActiveFormFieldType.input,
            },
          ],
        },
      });
    };

    return {
      t,
      settings,
      templates,
      theme,
      showSignConfigurationDialog,
    };
  },
});
</script>

<style lang="scss" module>
@import "./exchangeImportInstructions";
</style>
