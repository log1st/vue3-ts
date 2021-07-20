<template>
  <div class="root">
    <div v-if="percentLoader.status" class="root-content__loading">
        <global-percent-loader />
      </div>
    <sidebar :sidebarOpen="sidebarOpen" />
    <div class="root-content">
      <Dialogs/>
      <cabinet-header />
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
      <div v-if="appLoading && !percentLoader.status" class="root-content__loading">
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
import CabinetHeader from '@/components/modules/CabinetHeader'
import sidebar from '@/components/modules/Sidebar'
import popup from '@/components/popup/Popup'
import appLoadingPlaceholder from '@/components/elements/AppLoadingPlaceholder.vue'
import globalPercentLoader   from '@/components/elements/globalPercentLoader'
import serviceMessage from '@/components/elements/ServiceMessage.vue'
import { getDocumentsOrderList, getServicesList } from '../store/modules/documents/statementsJudical';
import Dialogs from "@/new/components/dialogs/Dialogs";
import {storage} from "@/new/utils/storage";


export default {
  name: 'CabinetLayout',
  components: {
    Dialogs,
    'cabinet-header': CabinetHeader,
    'global-percent-loader': globalPercentLoader,
    sidebar,
    popup,
    appLoadingPlaceholder,
    serviceMessage
  },
  data () {
    return {
      sidebarOpen: storage.get('sidebarOpen', true)
    }
  },
  watch: {
    sidebarOpen: value => {
      storage.set('sidebarOpen', value);
    }
  },
  serverPrefetch () {
    // возвращает Promise из действия, поэтому
    // компонент ждёт данные перед рендерингом
    return this.fetchItem()
  },
  mounted () {

    if (this.isLoggedIn) {
      // Promise.all([
      //   this.loadInfoINNContracts(),
      //   this.loadInfoINNSharedData(),
      //   this.checkServicesTab(),
      //   this.getRegionsList(),
      //   this.initPenaltyAction(),
      //   this.getStatusCalculationPeni()
      // ]).then(() => {
      this.window.onload = function () {
        // paradocsWidget.init("77ebd206-9280-4f9c-b8de-f63a7cc5c448");
      };
      this.$store.dispatch('rootInitData', null, { root: true }).then(() => {
      //   if(!this.getDefaultCompany.INN) {
      //     console.error('Нет компании - чат не будет инициирован');
      //     return;
      //   }

        // (function(d, w, c) {
        //   w.ChatraID = 'Jh6v7qP6rEwPTL2eu';
        //   var s = d.createElement('script');
        //   w[c] = w[c] || function() {
        //       (w[c].q = w[c].q || []).push(arguments);
        //   };
        //   s.async = true;
        //   s.src = 'https://call.chatra.io/chatra.js';
        //   if (d.head) d.head.appendChild(s);
        // })(document, window, 'Chatra');

        // window.ChatraSetup = {
        //     /* current user’s generated string */
        //     clientId: this.getDefaultCompany.INN
        // };
        // debugger
        // чат
        // Chatra('setIntegrationData', {
        //   name: this.getDefaultCompany.ShortNameOfTheOrganization,
        //   email: this.getDefaultCompany.Email1,
        //   phone: this.getDefaultCompany.Phone1,
        //   notes: this.getDefaultCompany.FullNameOrganization,
        // });
        // Chatra('openChat')
      })
    }
  },
  methods: {
    ...mapActions([
      'loadInfoINNContracts',
      'loadInfoINNSharedData',
      'getRegionsList',
      'initPenaltyAction',
      'getStatusCalculationPeni',
    ]),
    fetchItem () {
      // возвращаем Promise из действия
      return null
    }
  },
  computed: {
    ...mapGetters([
      'getPopupOpen',
      'percentLoader',
      'getPopupUpdate',
      'appLoading',
      'getServiceMessageStatus',
      'isLoggedIn',
      // для чата
      'getDefaultCompany'
    ]),
    item () {

      return null
    }
  }
}
</script>
