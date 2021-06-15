<template>
  <div class="root">
    <admin-sidebar :sidebarOpen="sidebarOpen" />
    <div class="root-content">
      <cabinet-header @toggleSidebar="sidebarOpen = !sidebarOpen" />
      <div v-if="appLoading" class="root-content__loading">
        <app-loading-placeholder />
      </div>
      <slot />
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
      sidebarOpen: true
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
