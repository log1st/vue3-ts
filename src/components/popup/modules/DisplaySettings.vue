<template>
  <div class="dsettings">

    <div class="dsettings__close" @click="deleteNewParams(); setPopupState(false)" >
      <icon-base
        width="13"
        height="13"
        iconColor="#8c8ea2"
        ><icon-close-big />
      </icon-base>
    </div>
    <div class="dsettings__head">
      <span>Настройка отображения</span>
    </div>

    <div class="dsettings__records">
      <div class="dsettings__col">
        <span class="dsettings__row-title">Записей на странице</span>
      </div>
      <div class="dsettings__col-2">
        <div class="dsettings__input">
          <searchInput :params="{ value: getDebtorsInPage, onlynumber: true }" @changeInputValue="recordsPerPage = parseInt($event)" :key="updateContent" />
        </div>
        <span>Число от 1 и до 500</span>
      </div>
    </div>

    <div class="dsettings__row">
      <div class="dsettings__row-title">Настроить порядок и отображение колонок</div>
    </div>
    <div class="dsettings__content">
      <div class="dsettings__content-col">
        <div class="dsettings__group">
          <div class="dsettings__group-wrapper">
            <div class="dsettings__group-head">
              <span>Отображаемые колонки</span>
            </div>

            <draggable class="dsettings__group-body"
                       :list="getDisplayColumns.filter(col => col.views.view && !col.views.fixed)"
                       group="people"
                       @change="moveItem"
            >
              <div
                v-for="item in getDisplayColumns.filter(col => col.views.view && !col.views.fixed)"
                class="dsettings__group-item"
                :class="{ 'is-select' : item.views.select }"
                @click="setPicOut(item.name)"
                :key="'dsgrims' + item.name"
              >
                <div class="dsettings__group-item_icon">
                  <icon-base width="15" height="10" iconColor="#616f83" ><icon-view /></icon-base>
                </div>
                <span>{{ item.alias }}</span>
              </div>
            </draggable>

          </div>
        </div>
      </div>
      <div class="dsettings__content-col">
        <div class="dsettings__revers">
          <div class="dsettings__revers-btn" @click="setViewCols">
            <icon-base
              width="24"
              height="19"
              iconColor="#aab7cb"
              ><icon-reverse />
            </icon-base>
          </div>
        </div>
      </div>
      <div class="dsettings__content-col">
        <div class="dsettings__group">
          <div class="dsettings__group-wrapper">
            <div class="dsettings__group-head">
              <span>Скрытые / Фиксированные колонки</span>
            </div>
            <draggable class="dsettings__group-body" :list="getDisplayColumns.filter(col => !col.views.view || col.views.fixed)" group="people" @change="moveItem">
              <div
                v-for="item in getDisplayColumns.filter(col => !col.views.view || col.views.fixed)"
                class="dsettings__group-item"
                :class="{ 'is-select' : item.views.select, 'is-fixed' : item.views.fixed }"
                @click="setPicOut(item.name)"
                :key="'dsgrims' + item.name"
              >
                <div class="dsettings__group-item_icon">
                  <icon-base
                    width="17"
                    height="16"
                    ><icon-not-view />
                  </icon-base>
                </div>
                <span>{{ item.alias }}</span>
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>
    <div class="dsettings__group-buttons">
      <ur-btn
        @click="setNewParams(recordsPerPage)"
        class="btn btn-primary"
        :class="{'py-0' : debtorsTableColumnsLoader}"
        :loading="debtorsTableColumnsLoader"
      >
        <span>Применить</span>
      </ur-btn>
      <div class="btn btn-gray--outline big" title="Сброс на заводские установки" @click="setDefaultParams(); updateContent++">Сбросить</div>
<!--      <div class="btn btn-warning" title="Удалить последние изменения" @click="deleteNewParams(); updateContent++">Удалить</div>-->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import searchInput from '@/components/elements/SearchInput'
import iconReverse from '@/components/icons-svg/icons/IconReverse'
import iconView from '@/components/icons-svg/icons/IconView'
import iconNotView from '@/components/icons-svg/icons/IconNotView'
import draggable from 'vuedraggable'
import UrBtn from "@/components/elements/Button";
export default {
  components: {UrBtn, searchInput, iconReverse, iconView, iconNotView, draggable },
  data () {
    return {
      updateContent: 0
    }
  },
  mounted () {
    this.setDisplaySettingsEdit(true)
    this.recordsPerPage = this.getDebtorsInPage
  },
  created () {
  if (typeof document !== 'undefined') {
    document.onkeydown = evt => {
      evt = evt || window.event
      if (evt.keyCode === 13) {
        this.setNewParams(this.recordsPerPage)
      }
    }
  }
  },
  methods: {
    ...mapActions([
      'setDefaultParams',
      'setViewCols',
      'setNewParams',
      'deleteNewParams',
      'setPopupState',
      'setDisplaySettingsEdit',
      'setPicOut',
      'moveListItem'
    ]),
    /**
     * Обработчик события добавления и/или удаления из
     * компонента draggable
     * @param event
     */
    moveItem (event) {
      if (event.added) {
        this.moveListItem(event.added.element.name)
      }
    }
  },
  computed: {
    ...mapGetters(['getDebtorsInPage', 'getDisplayColumns', 'debtorsTableColumnsLoader'])
  },
  beforeDestroy () {
    this.deleteNewParams()
    this.setDisplaySettingsEdit(false)
  }
}
</script>
