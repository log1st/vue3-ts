<template>
  <div
    v-outside-click="hide"
    :class="$style.user"
  >
    <div
      :class="$style.trigger"
      @click="show"
    >
      <Avatar :class="$style.avatar" />
      <div :class="$style.info">
        <div :class="$style.company">
          {{ company?.name_short }}
        </div>
        <div :class="$style.balance">
          {{ formatMoney(company?.balance, 'RUB', $i18n.locale) }}
        </div>
        <div :class="$style.user">
          {{ [user?.first_name, user?.last_name].filter(Boolean).join(' ') }}
        </div>
      </div>
      <Icon
        icon="chevron"
        :class="$style.caret"
      />
    </div>
    <div
      v-if="isActive"
      :class="$style.menu"
    >
      <div :class="$style.item">
        <div :class="$style.itemLabel">
          <SelectInput
            :state="['primary', 'tiny']"
            :model-value="company.id"
            :options="companies"
            value-field="id"
            display-field="name_short"
            :allow-empty="false"
            @update:modelValue="id => company = id"
          />
        </div>
      </div>
      <div :class="$style.item">
        <div :class="$style.itemLabel">
          {{ t('header.user.changeTheme') }}
        </div>
        <ThemeSwitcher :class="$style.side" />
      </div>
      <router-link
        :to="{name: 'panel-password'}"
        :class="[$style.item, $style.hoverable]"
      >
        <div :class="$style.itemLabel">
          {{ t('header.user.changePassword') }}
        </div>
      </router-link>
      <button
        :class="[$style.item, $style.hoverable]"
        @click="signOut"
      >
        <span :class="$style.itemLabel">
          {{ t('header.user.signOut') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Avatar from '@/components/avatar/Avatar.vue';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { useUser } from '@/hooks/useUser';
import { formatMoney } from '@/utils/string';
import Icon from '@/components/icon/Icon.vue';
import { useToggle } from '@/hooks/useToggle';
import { useLayout } from '@/hooks/useLayout';
import ThemeSwitcher from '@/components/themeSwitcher/ThemeSwitcher.vue';
import SelectInput from '@/components/selectInput/SelectInput.vue';
import { useCompanies } from '@/hooks/useCompanies';

export default defineComponent({
  name: 'HeaderUser',
  components: {
    SelectInput,
    ThemeSwitcher,
    Icon,
    Avatar,
  },
  setup() {
    const { t } = useI18n();
    const {
      company,
    } = useDefaultCompany();

    const {
      companies,
    } = useCompanies();

    const {
      user,
      signOut,
    } = useUser();

    const [
      isActive,,
      setActive,
    ] = useToggle<boolean>();

    const {
      theme,
    } = useLayout();

    const router = useRouter();
    watch(router.currentRoute, () => {
      setActive(false);
    });

    const show = () => {
      setActive(true);
    };

    const hide = () => {
      setActive(false);
    };

    return {
      t,

      company,
      user,
      formatMoney,

      isActive,

      signOut,

      theme,

      show,
      hide,

      companies,
    };
  },
});
</script>

<style lang="scss" module>
@import "./headerUser";
</style>
