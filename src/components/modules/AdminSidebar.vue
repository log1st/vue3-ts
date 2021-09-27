<template>
    <div class="sidebar" :class="{'is-open': sidebarOpen}" ref="sidebar">
    <div class="sidebar__header">
      <router-link to="/">
          <icon-base width="196" height="60" iconColor="#ffffff" > <icon-logo /> </icon-base>
      </router-link>
    </div>
    <div class="sidebar__content">
      <ul class="sidebar__nav">
        <li 
          v-for="item in mainRoutes" 
          class="sidebar__item" 
          :class="{ 'active' : item.route === $route.path }" 
          :key="item.icon"
        >
          <router-link :to="item.route">
            <span class="sidebar__item-icon">
              <icon-base
                :width="item.width"
                :height="item.height"
                :iconColor="item.route == $route.path ? '#495CFF' : '#949BAF'"
                :hasStroke="item.hasStroke"
                :viewbox="item.viewbox"
                ><component :is="'icon-' + item.iconname" />
              </icon-base>
            </span>
            <transition name="fade">
              <span v-if="sidebarOpen" class="sidebar__item-name">{{ item.name }}</span>
            </transition>
          </router-link>
        </li>
      </ul>
      <transition name="fade">
        <div v-if="sidebarOpen" class="sidebar__footer">
          <p>&copy; Юрробот 2017-2021 </p>
          <p title="Версия админ панели v1.6.3a | Версия редактора документов v2.0.0">Версия Админ панели 1.6.3a</p>
        </div>
      </transition>
    </div>

  </div>
</template>
<script>
export default {
  props: {
    sidebarOpen: Boolean
  },
  data () {
    return {
      isOpen: true,
      mainRoutes: [
        { name: 'Конструктор документов', route: '/admin/editor', iconname: 'pen-nib', width: 30, height: 20, viewbox: '0 0 480 480'},
        { name: 'Список организаций', route: '/admin/admin-panel', iconname: 'company-list', width: 30, height: 30, viewbox: '0 0 74 74' },
        { name: 'Статистика', route: '/admin/stats', iconname: 'pie-chart', width: 30, height: 30, viewbox: '0 0 512 512' },
        { name: 'Лицензии', route: '/admin/admin-license', iconname: 'license-key', width: 30, height: 30, viewbox: '0 0 512 512' },
        { name: 'Настройки', route: '/admin/admin-settings', iconname: 'setting-admin', width: 30, height: 30, viewbox: '0 0 456 456' }
      ]
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