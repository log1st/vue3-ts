<template>
  <div :class="$style.header">
    <router-link
      :to="{name: 'index'}"
      :class="$style.logo"
    >
      <Logo />
    </router-link>
    <div :class="$style.content">
      <div :class="$style.stats" v-if="false">
        <HeaderStats />
      </div>
      <div :class="$style.actions" v-if="false">
        <HeaderActions />
      </div>
      <div :class="$style.user">
        <HeaderUser />
      </div>
      <button
        :class="$style.signOut"
        @click="signOut"
      >
        <Icon
          icon="sign-out"
          data-role="icon"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Logo from '@/components/logo/Logo.vue';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import HeaderStats from '@/components/header/stats/HeaderStats.vue';
import HeaderActions from '@/components/header/actions/HeaderActions.vue';
import HeaderUser from '@/components/header/user/HeaderUser.vue';
import Icon from '@/components/icon/Icon.vue';
import { useUser } from '@/hooks/useUser';

export default defineComponent({
  name: 'Header',
  components: {
    Icon,
    HeaderUser,
    HeaderActions,
    HeaderStats,
    Logo,
  },
  setup() {
    const {
      stats,
    } = useDefaultCompany();

    const {
      signOut,
    } = useUser();

    return {
      stats,
      signOut,
    };
  },
});
</script>

<style lang="scss" module>
@import "./header";
</style>
