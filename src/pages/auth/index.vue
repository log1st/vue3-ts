<template>
  <div class="page page-sign-in">
    <div class="sign-in">
    <div class="theme-changer">
        <input type="checkbox" v-model="localThemeState"  @change="dayNnight()" title="Change Theme" id="theme-changer">
        <label for="theme-changer"></label>
    </div>
      <div class="sign-in__inner">
        <div class="sign-in__logo logo">
          <icon-base width="368" height="111.44" :viewbox="'0 0 273.53 82.83'"><icon-urrobot /></icon-base>
        </div>

          <div class="sign-in__container">
            <div class="sign-in__welcome">
                Добро пожаловать <br>
                на платформу по автоматизации взыскания задолженностей
            </div>
            <div class="sign-in__block">
            
            <!-- регистрация / вход -->
            <ur-auth v-if="authLayout === 0"/>
            <!-- забыл пароль -->
            <ur-reset-password v-if="authLayout === 1" />
  
            <!-- пин активации аккаунта, пин востановления пароля через мыло (currentAction == 6) и через телефон -->
            <ur-auth-code v-if="authLayout === 3 || authLayout === 5 || authLayout === 6 || authLayout === 7" :authLayout="authLayout "/>
  
            <!-- установить пароль -->
            <ur-set-password v-if="authLayout === 4" />
  
            <!-- инструкции по сбросу пароля -->
            <ur-reset-password-guide v-if="authLayout == 8" />
  
            <!-- восстановление пароля -->
            <ur-set-new-password v-if="authLayout == 9"/>
          </div>
        </div>
        <div class="sign-in__footer">
          <div class="sign-in__footer-item" v-for="(item, i) in authFooterLinks" :key="'authfl' + i">
            <a class="sign-in__footer-link" href="#" replace @click.prevent="footerLinksActions(i)" >{{ item }}</a>
          </div>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import UrBtn from '@/components/elements/Button'
// components
// для оптимизации загрузки выполняем "ленивую" загрузку

const UrAuth = () => import('./components/UrAuth') 
const UrResetPassword = () => import('./components/UrResetPassword')
const UrSetPassword = () => import('./components/UrSetPassword')
const UrResetPasswordGuide = () => import('./components/UrResetPasswordGuide')
const UrAuthCode = () => import('./components/UrAuthCode')
const UrSetNewPassword = () => import('./components/UrSetNewPassword')

export default {
  name: 'Login',
  components: {
      'ur-btn': UrBtn,
      'ur-auth': UrAuth,
      'ur-reset-password': UrResetPassword,
      'ur-set-password': UrSetPassword,
      'ur-reset-password-guide': UrResetPasswordGuide,
      'ur-auth-code': UrAuthCode,
      'ur-set-new-password': UrSetNewPassword
  },
  data () {
    return {
      localThemeState: false,

      authFooterLinks: [
        'Пользовательское соглашение', 
        'Политика конфиденциальности', 
        // 'Оплата картой', 
        // 'Демо вход'
      ]
    }
  },
  watch: {
    localThemeState:{
      deep: true,
      immediate: true,
      handler (val) {
        if (this.$store.state.user.appTheme === 'night') {
          this.localThemeState = true
        } else if (this.$store.state.user.appTheme === 'day') {
          this.localThemeState = false
        }
      }
    },
  },
  computed: {
    ...mapGetters(['authLayout']),
  },
  created () {
    if (this.$store.state.user.appTheme == 'day') {
        document.documentElement.setAttribute('data-theme', 'day');
    } else if (this.$store.state.user.appTheme == 'night'){
        document.documentElement.setAttribute('data-theme', 'night');
    }
  },
  methods: {
    ...mapActions(['changeAppTheme']),
    dayNnight () {
      this.localThemeState = !this.localThemeState
      if (!this.localThemeState) {
        this.changeAppTheme('night')
        document.documentElement.setAttribute('data-theme', 'night');
      } else {
        document.documentElement.setAttribute('data-theme', 'day');
        this.changeAppTheme('day')
      }
    },
    async footerLinksActions (i) {
      switch (i) {
        case 0:
          window.open('assets/documents/EULA.pdf', '_blank')
          break
        case 1:
          window.open('assets/documents/privacy_policy.pdf', '_blank')
          break
      }
    }
  }
}
</script>
