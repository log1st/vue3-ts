<template>
    <div :class="$style.layout">
      <div :class="$style.container">
        <div :class="$style.logo"/>
        <div :class="$style.label">
          Добро пожаловать<br/>на платформу по автоматизации взыскания задолженностей
        </div>
        <div :class="$style.content">
          <div :class="$style.tabs" :style="{gridTemplateColumns: `repeat(${tabs.length}, 1fr)`}">
            <router-link
              v-for="tab in tabs"
              :key="tab.key"
              :active-class="$style.active"
              :class="$style.tab"
              :to="tab.to"
            >
              {{tab.label}}
            </router-link>
          </div>
          <div :class="$style.body">
            <router-view/>
          </div>
        </div>
      </div>
      <div :class="$style.links">
        <a :href="link.url" target="_blank" v-for="link in links" :key="link.key" :class="$style.link">
          {{link.label}}
        </a>
      </div>
    </div>
</template>

<script>
import {defineComponent, ref} from "@vue/composition-api";

export default defineComponent({
  name: "AuthLayout",
  setup() {
    const tabs = ref([
      {
        key: 'in',
        label: 'Вход',
        to: {
          name: 'sign-in'
        }
      },
      {
        key: 'up',
        label: 'Регистрация',
        to: {
          name: 'sign-up'
        }
      },
    ]);

    const links = ref([
      {
        key: 'agreement',
        label: 'Пользовательское соглашение',
        url: '/assets/documents/EULA.pdf',
      },
      {
        key: 'privacyPolicy',
        label: 'Политика конфиденциальности',
        url: '/assets/documents/privacy_policy.pdf',
      },
    ])

    return {
      tabs,
      links,
    }
  }
})
</script>

<style lang="scss" module>
@import "./authLayout";
</style>
