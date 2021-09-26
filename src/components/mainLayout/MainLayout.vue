<template>
  <div
    :class="[
      $style.layout,
      $style[theme]
    ]"
  >
    <Header :class="$style.header" />
    <div :class="$style.page">
      <div
        :class="[
          $style.sidebar,
          isSidebarExpanded && $style.expanded,
        ]"
      >
        <Sidebar />
        <button
          :class="$style.sidebarToggler"
          @click="toggleSidebar"
        >
          <Icon
            data-role="icon"
            icon="chevron"
          />
        </button>
      </div>
      <div :class="$style.contentWrapper">
        <div
          :class="[
            $style.content,
            !hasDialogs && $style.scrollable
          ]"
        >
          <Dialogs :class="$style.dialogs" />
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Header from '@/components/header/Header.vue';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import { useSidebar } from '@/components/sidebar/useSidebar';
import Icon from '@/components/icon/Icon.vue';
import { useLayout } from '@/hooks/useLayout';
import Dialogs from '@/components/dialogs/Dialogs.vue';
import { useDialog } from '@/hooks/useDialog';

export default defineComponent({
  name: 'MainLayout',
  components: {
    Dialogs, Icon, Sidebar, Header,
  },
  setup() {
    const {
      isExpanded: isSidebarExpanded,
      toggle: toggleSidebar,
    } = useSidebar();

    const {
      theme,
    } = useLayout();

    const {
      dialogs,
    } = useDialog();
    const hasDialogs = computed(() => !!dialogs.value.length);

    return {
      isSidebarExpanded,
      toggleSidebar,
      theme,
      hasDialogs,
    };
  },
});
</script>

<style lang="scss" module>
@import "./mainLayout";
</style>
