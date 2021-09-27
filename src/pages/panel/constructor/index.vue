<template>
  <div
    :class="[
      $style.page,
      $style[$route.name]
    ]"
  >
    <div :class="$style.header">
      <div :class="$style.title">
        {{ title }}
      </div>
      <Tabs
        :class="$style.tabs"
        :tabs="tabs"
        state="quinary"
      />
    </div>
    <div :class="$style.container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import Tabs from '@/components/tabs/Tabs.vue';
import { ITabs } from '@/components/tabs/useTabs';

export default defineComponent({
  name: 'Index',
  components: { Tabs },
  setup() {
    const { t } = useLocalI18n('panel.constructor');
    const router = useRouter();

    const templateId = computed(() => (
      router.currentRoute.value?.name === 'panel-constructor-template'
      && router.currentRoute.value?.params.id
    ));

    const title = computed(() => (
      t(`${({
        constructor: 'settings',
        template: `${templateId.value ? 'editTemplate' : 'createTemplate'}`,
        templates: 'templates',
      } as any)[
        (router?.currentRoute?.value?.name as string).split('-').pop() as any
      ]}.title`)
    ));

    const tabs = computed<ITabs['tabs']>(() => ([
      {
        key: 'index',
        label: t('tab.settings'),
        to: {
          name: 'panel-constructor',
        },
        exact: true,
      },
      {
        key: 'templates',
        label: t('tab.templates'),
        to: {
          name: 'panel-constructor-templates',
        },
      },
      {
        key: 'template',
        label: t(`tab.${templateId.value ? 'editTemplate' : 'createTemplate'}`),
        to: {
          name: 'panel-constructor-template',
        },
      },
    ]));

    return {
      title,
      tabs,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
