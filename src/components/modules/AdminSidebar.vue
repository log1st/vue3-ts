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
          <p title="Версия админ панели v1.6.0 | Версия редактора документов v2.0.0">Версия Админ панели 1.6.0</p>
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
        { name: 'Конструктор документов', route: '/admin/editor', },
        { name: 'Список организаций', route: '/admin/admin-panel', },
        { name: 'Статистика', route: '/admin/stats' },
        { name: 'Настройки', route: '/admin/admin-settings', }
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