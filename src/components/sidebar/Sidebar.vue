<template>
  <div
    :class="[
      $style.sidebar,
      isExpanded && $style.expanded
    ]"
  >
    <div :class="$style.menu">
      <router-link
        v-for="item in menu"
        :key="item.key"
        :to="item.to"
        :class="$style.item"
        :active-class="$style.active"
      >
        <Icon
          :icon="item.icon"
          inline
          :class="$style.itemIcon"
        />
        <div
          v-if="isExpanded"
          :class="$style.itemLabel"
        >
          {{ item.label }}
        </div>
      </router-link>
    </div>
    <div
      v-if="isExpanded"
      :class="$style.meta"
    >
      <i18n-t
        keypath="sidebar.copyright"
        tag="div"
        :class="$style.copyright"
      >
        <template #years>
          {{
            [
              formatDate(settings.serviceCreationDate, $i18n.locale, {year: 'numeric'}),
              formatDate(new Date(), $i18n.locale, {year: 'numeric'})
            ].filter(Boolean).join(' - ')
          }}
        </template>
      </i18n-t>
      <div :class="$style.version">
        {{ t('sidebar.version', {version: settings.serviceVersion}) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { SidebarMenuItem, useSidebar } from '@/components/sidebar/useSidebar';
import { useLayout } from '@/hooks/useLayout';
import { formatDate } from '@/utils/date';
import { ACLRule, useACL } from '@/hooks/useACL';
import Icon from '@/components/icon/Icon.vue';

export default defineComponent({
  name: 'Sidebar',
  components: { Icon },
  setup() {
    const { t } = useI18n();
    const {
      isExpanded,
    } = useSidebar();

    const {
      settings,
    } = useLayout();

    const {
      checkAccess,
    } = useACL();

    const menu = computed<Array<SidebarMenuItem>>(() => (
      (
        [
          checkAccess(ACLRule.organizationsIndex) && {
            key: 'organizations',
            label: t('sidebar.menu.organizations'),
            icon: 'organizations.colored',
            to: {
              name: 'organizations',
            },
          },
          checkAccess(ACLRule.debtorsIndex) && {
            key: 'debtors',
            label: t('sidebar.menu.debtors'),
            icon: 'debtors.colored',
            to: {
              name: 'debtors',
            },
          },
          checkAccess(ACLRule.exchangeIndex) && {
            key: 'exchange',
            label: t('sidebar.menu.exchange'),
            icon: 'exchange.colored',
            to: {
              name: 'exchange',
            },
          },
          checkAccess(ACLRule.panelIndex) && {
            key: 'panel',
            label: t('sidebar.menu.panel'),
            icon: 'panel.colored',
            to: {
              name: 'panel',
            },
          },
        ] as Array<SidebarMenuItem | false>
      ).filter((item) => !!item) as Array<SidebarMenuItem>
    ).map((item) => ({
      ...item,
      label: t(`sidebar.menu.${item.key}`),
    })) as Array<SidebarMenuItem>);

    return {
      t,

      isExpanded,
      settings,
      formatDate,

      menu,
    };
  },
});
</script>

<style lang="scss" module>
@import "./sidebar";
</style>
