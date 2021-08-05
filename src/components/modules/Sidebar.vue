<template>
  <div class="sidebar" :class="{'is-open': sidebarOpen}" ref="sidebar">
    <div class="sidebar__header">
      <router-link to="/">
        <icon-base width="196" height="60" iconColor="#ffffff" >
          <icon-logo />
          <!-- <icon-logo-min v-else /> -->
          </icon-base>
      </router-link>
    </div>
    <div class="sidebar__content">
      <ul class="sidebar__nav">
        <li v-for="item in mainRoutes" class="sidebar__item" :class="{'active' : checkActiveRout(item.rout) }" :key="item.icon">
          <router-link :to="item.rout">
            <span class="sidebar__item-icon">
              <icon-base
                :width="item.width"
                :height="item.height"
                :viewBox="item.viewBox"
                :iconColor="item.rout == $route.path ? '#495CFF' : '#949BAF'"
                :hasStroke="item.hasStroke"
                ><component :is="'icon-' + item.iconname" />
              </icon-base>
            </span>
            <transition name="fade">
              <span v-if="sidebarOpen" class="sidebar__item-name" v-html="item.name"></span>
            </transition>
          </router-link>
        </li>
      </ul>
      <transition name="fade">
        <div v-if="sidebarOpen" class="sidebar__footer">
          <p>&copy; Юрробот 2017-2021</p>
          <p>Версия 2.3.0</p>
        </div>
      </transition>
    </div>

  </div>
</template>

<script>
import iconAffiliate from '@/components/icons-svg/icons/IconAffiliate'
import iconAnalitics from '@/components/icons-svg/icons/IconAnalitics'
import iconCourts from '@/components/icons-svg/icons/IconCourts'
import iconDoc from '@/components/icons-svg/icons/IconDoc'
import iconExchange from '@/components/icons-svg/icons/IconExchange'
import iconHome from '@/components/icons-svg/icons/IconHome'
import iconDebtors from '@/components/icons-svg/icons/iconDebtors'
import iconDesktop from '@/components/icons-svg/icons/IconDesktop'

export default {
  props: {
    sidebarOpen: Boolean
  },
  components: { iconAffiliate, iconAnalitics, iconCourts, iconDoc, iconHome, iconExchange, iconDebtors, iconDesktop },
  computed: {
    adminRole() {
      // TODO: move to store
      let user;
      user = localStorage.getItem('user');
      user = JSON.parse(user);
      return user.role === 'admin'
    },
    mainRoutes() {
      return [
        // { name: 'Рабочий стол', rout: '/desktop', iconname: 'desktop', width: 26, height: 26, viewBox: '0 0 26 26', hasStroke: true },
        // { name: 'Моя организация', rout: '/main', iconname: 'home', width: 15, height: 14 },
        { name: 'Организации', rout: '/organizations', iconname: 'affiliate', width: 28, height: 20, viewBox: '0 0 28 20' },
        { name: 'Работа с должниками', rout: '/debtors', iconname: 'debtors', width: 30, height: 30, viewBox: '0 0 30 30'},
        { name: 'Обмен данными', rout: '/exchange', iconname: 'exchange', width: 30, height: 30, viewBox:"0 0 30 30" },
        // { name: 'Справочник судов', rout: '/courts', iconname: 'courts', width: 19, height: 19, viewBox: '0 0 32 32' },
        // { name: 'Аналитика', rout: '/analitics', iconname: 'analitics', width: 25, height: 25 },
        // { name: 'Отчеты', rout: '/documents', iconname: 'doc', width: 18, height: 20 },
         { name: 'Панель управления', rout: '/panel', iconname: 'panel', width: 30, height: 30, viewBox:"0 0 30 30" },
        // { name: 'Настройки', rout: '/settings', iconname: 'settings', width: 20, height: 20 }, // Переходит в панель управления
      ].filter(Boolean)
    }
  },
  data () {
    return {
      isOpen: true,
    }
  },
  methods: {
    checkActiveRout (rout) {
      return this.$route.path.split('/')[1] === rout.split('/')[1]
    }
  },
  watch: {
    $route (to, from) {
      setTimeout(() => {
      if (typeof document !== 'undefined') {
          this.$refs.sidebar.style.height = document.querySelector('.root-content').offsetHeight + 'px'
        }
      }, 60)
    }
  }
}
</script>
