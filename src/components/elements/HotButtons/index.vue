<template>
  <div class="hot-buttons">
    <div class="main__opt">
      <ul>
        <li
          v-for="(item, index) in visibleActionItems"
          :key="index"
          class="main__opt__link"
          @click="$emit('action-emit', { action: item.action })"
          v-show="item.show"
        >
<!--          <i :class="item.icon.name"-->
<!--             :style="{ fontSize: '18px', color: item.color }"-->
<!--          ></i>-->
          <icon-base
            :hasStroke="false"
            :width="item.icon ? item.icon.w : 24"
            :height="item.icon ? item.icon.h : 24"
            iconColor="#818181"
            :viewBox="item.icon ? item.icon.viewBox : '0 0 20 20'"
          ><component v-if="item.icon" :is="'icon-' + item.icon.name" />
          </icon-base>
          <div class="btn-title__label">{{ item.name }}</div>
        </li>
      </ul>
      <!-- <div
        class="btn btn-icon btn-title"
        @click="$emit('action-emit', { action: 'printCourtOrder' })"
      >
        <icon-base
          :hasStroke="false"
          width="20"
          height="16"
          iconColor="#818181"
          :viewBox="'0 0 20 20'"
        ><component :is="'icon-print'" />
        </icon-base>
        <div class="btn-title__label">Печать судебного решения</div>
      </div> -->

      <!-- <div
        class="btn btn-icon btn-title"
        @click="$emit('action-emit', { action: 'printApplicationDischarge' })"
      >
          <icon-egrn />

        <div class="btn-title__label">Запрос ЕРГН</div>
      </div> -->


    </div>
    <div class="main__opt">
      <ul>
        <li class="btn btn-icon btn-title" @click="toggleTableDisplaySettings">
          <icon-base width="30" height="30" iconColor="#848aa1"><icon-panel/></icon-base>
        </li>
      <li v-if="debtorsModuleActive !== 0" class="btn btn-icon btn-title" @click="openButtonsManager">
        <icon-base
          width="30"
          height="30"
          iconColor="#495CFF"
        ><icon-settings />
        </icon-base>
        <div class="btn-title__label">Быстрые действия</div>
      </li>
      
        
    </ul>
    </div>
    
    <!-- Settings Modal -->
    <transition name="fade">
      <hot-buttons-manager
        :items="actionsProceedingsBtnList"
        v-model="managerDisplay"
        @save="updateHotButtons($event)"
      />
    </transition>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import HotButtonsManager from './components/HotButtonsManager';

  export default {
    name: 'HotButtons',
    components: {
      'hot-buttons-manager': HotButtonsManager,
    },
    props: {
      // items: Array
    },
    data() {
      return {
        tableDisplaySettings: false, // флаг панели настроки отображения таблицы
        managerDisplay: false,
      }
    },
    watch: {

    },
    methods: {
      ...mapActions(['setHotkeyStatuses']),
      openButtonsManager() {
        this.managerDisplay = true;
      },
      updateHotButtons(e) {
        this.setHotkeyStatuses(e);
        this.managerDisplay = false;
      },
      /**
       * Открыть/закрыть панель настроки таблицы
       */
      toggleTableDisplaySettings() {
        this.tableDisplaySettings = !this.tableDisplaySettings;
        events.$emit('table_display_settings', this.tableDisplaySettings)
      },
    },
    computed: {
      ...mapGetters(['actionsForCourtProceedings', 'actionsForPreTrialProceedings', 'debtorsModuleActive']),
      actionsProceedingsBtnList () {
        switch (this.debtorsModuleActive) {
          case 0:
            return this.actionsForPreTrialProceedings
            break;

          case 1:
            return this.actionsForCourtProceedings
            break;

          case 2:
            return this.actionsForCourtProceedings
            break;
        }
      },
      visibleActionItems () {
        return this.actionsProceedingsBtnList.filter(item => item.visible);
      }
    }
  }
</script>
