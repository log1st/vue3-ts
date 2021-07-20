<template>
  <div class="root">
    <admin-sidebar :sidebarOpen="sidebarOpen" />
    <div class="root-content">
      <cabinet-header @toggleSidebar="sidebarOpen = !sidebarOpen" />
      <div class="header__menu" @click="sidebarOpen = !sidebarOpen">
        <div class="header__menu-icon" :class="{'is-active-open-btn': sidebarOpen}">
          <svg width="6" height="10" viewBox="0 0 6 10"
          :style="{'transform': sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
          fill="#333333"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M5.55956 4.80065L0.842218 0.0833028C0.731147 -0.0277676 0.553016 -0.0277676 0.441945 0.0833028C0.330875 0.194373 0.330875 0.372505 0.441945 0.483575L4.95811 4.99974L0.441945 9.5159C0.330875 9.62697 0.330875 9.8051 0.441945 9.91617C0.496433 9.97066 0.569781 10 0.641034 10C0.712286 10 0.785635 9.97276 0.840122 9.91617L5.55747 5.19883C5.66854 5.08985 5.66854 4.90962 5.55956 4.80065Z"
          :fill="sidebarOpen ? '#333333' : '#ffffff'"/>
          </svg>
        </div>
      </div>
      <div v-if="appLoading" class="root-content__loading">
        <app-loading-placeholder />
      </div>
      <router-view />
    </div>
    <transition name="fade">
      <popup v-if="getPopupOpen" :key="getPopupUpdate"></popup>
    </transition>
    <transition name="fade">
      <serviceMessage v-if="getServiceMessageStatus"></serviceMessage>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AdminSidebar from '@/components/modules/AdminSidebar'
import CabinetHeader from '@/components/modules/CabinetHeader'
import popup from '@/components/popup/Popup'
import appLoadingPlaceholder from '@/components/elements/AppLoadingPlaceholder.vue'
import serviceMessage from '@/components/elements/ServiceMessage.vue'

export default {
  name: 'AdminLayout',
  components: {
    'cabinet-header': CabinetHeader,
    popup,
    'admin-sidebar': AdminSidebar,
    appLoadingPlaceholder,
    serviceMessage
  },
  data () {
    return {
      sidebarOpen: false
    }
  },
  mounted(){
    let user, userRole;
    if (typeof window !== 'undefined') {
      user = localStorage.getItem('user');
      user = JSON.parse(user);
      userRole = user.role;
    } else {
      userRole = 'company'
    }


    if (userRole === 'admin') { // Роль пользователя для доступа в админку (перед загрузкой ставь admin)
      // this.$store.dispatch('rootInitData', null, { root: true })
    } else {
        window.location.href = '/';
    }
  },
  computed: {
    ...mapGetters([
      'getPopupOpen',
      'getPopupUpdate',
      'appLoading',
      'getServiceMessageStatus',
      'isLoggedIn',
      // для чата
      'getDefaultCompany'
    ])
  }
}

</script>
