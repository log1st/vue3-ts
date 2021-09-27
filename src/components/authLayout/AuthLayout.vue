<template>
  <Dialogs :class="$style.dialogs" />
  <div
    :class="[
      $style.layout,
      $style[theme]
    ]"
  >
    <ThemeSwitcher :class="$style.theme" />
    <div :class="$style.content">
      <Logo :class="$style.logo" />
      <div :class="$style.title">
        {{ t('sign.title') }}
      </div>
      <div :class="$style.form">
        <Tabs
          v-if="withTabs"
          :tabs="tabs"
          state="sign"
          :class="$style.tabs"
        />
        <div :class="$style.body">
          <RouterView />
        </div>
      </div>
    </div>
    <div :class="$style.links">
      <a
        v-for="link in links"
        :key="link.key"
        :href="link.to"
        target="_blank"
        :class="$style.link"
      >
        {{ link.label }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Logo from '@/components/logo/Logo.vue';
import Tabs from '@/components/tabs/Tabs.vue';
import { ITabs } from '@/components/tabs/useTabs';
import ThemeSwitcher from '@/components/themeSwitcher/ThemeSwitcher.vue';
import { DictType, useDicts } from '@/hooks/useDicts';
import Dialogs from '@/components/dialogs/Dialogs.vue';
import { useLayout } from '@/hooks/useLayout';

export default defineComponent({
  name: 'AuthLayout',
  components: {
    Dialogs,
    ThemeSwitcher,
    Tabs,
    Logo,
  },
  setup() {
    const { t } = useI18n();

    const tabs = computed<ITabs['tabs']>(() => ([
      {
        key: 'in',
        label: t('sign.tabs.in'),
        to: {
          name: 'sign-in',
        },
      },
      {
        key: 'up',
        label: t('sign.tabs.up'),
        to: {
          name: 'sign-up',
        },
      },
    ]));

    const {
      getDictMap,
    } = useDicts();

    const files = getDictMap < { [key in 'agreement'| 'policy']: string } >(DictType.files);

    const links = computed(() => ([
      {
        key: 'agreement',
        label: t('sign.links.agreement'),
        to: files.value.agreement,
      },
      {
        key: 'policy',
        label: t('sign.links.policy'),
        to: files.value.policy,
      },
    ]));

    const router = useRouter();
    const withTabs = computed(() => (
      ['up', 'in', 'forgot'].includes(String(router.currentRoute.value?.name).replace(/sign-(.*)(-|)/, '$1'))
    ));

    const {
      theme,
    } = useLayout();

    return {
      theme,
      t,
      tabs,

      links,

      withTabs,
    };
  },
});
</script>

<style lang="scss" module>
@import "./authLayout";
</style>
