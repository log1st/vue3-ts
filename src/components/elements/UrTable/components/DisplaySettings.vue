<template>
  <div class="dsettings-modal" v-show="value" @click="outsideClickListener($event, false)">
    <div class="dsettings-modal__inner" @click="outsideClickListener($event, true)">

      <div class="dsettings">
        <!-- header -->
        <div class="dsettings__close" @click="closeDisplaySettingsHandler" >
          <i class="material-icons" style="color: #8c8ea2; cursor: pointer">close</i>
        </div>
        <div class="dsettings__head">
          <span>Настройка отображения</span>
        </div>
        <!-- items count -->
        <div class="dsettings__records">
          <div class="dsettings__col">
            <span class="dsettings__row-title">Записей на странице</span>
          </div>
          <div class="dsettings__col-2">
            <div class="dsettings__input">
              <input type="tel" v-mask="'####'" v-model="recordsPerPage"/>
            </div>
            <span>Число от 1 и до 500</span>
          </div>
        </div>
        <!-- columns -->
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

                  <vue-draggable
                    class="dsettings__group-body"
                    :list="visibleColumns"
                    group="people"
                    @change="moveItem"
                  >
                    <div
                      v-for="(item, index) in visibleColumns"
                      :key="index"
                      class="dsettings__group-item"
                      :class="{ 'is-select' : item.views.select }"
                      @click="selectItem(item)"
                    >
                      <div class="dsettings__group-item_icon">
                        <i class="material-icons" style="color: #616f83; font-size: 16px;">remove_red_eye</i>
                      </div>
                      <span>{{ item.alias }}</span>
                    </div>
                  </vue-draggable>

                </div>
              </div>
            </div>

            <div class="dsettings__content-col">
              <div class="dsettings__revers">
                <div class="dsettings__revers-btn" @click="moveSelectedItems">
                  <i class="material-icons" style="color: #aab7cb; font-size: 36px; cursor: pointer">swap_horiz</i>
                </div>
              </div>
            </div>

            <div class="dsettings__content-col">
              <div class="dsettings__group">
                <div class="dsettings__group-wrapper">
                  <div class="dsettings__group-head">
                    <span>Скрытые / Фиксированные колонки</span>
                  </div>
                  <vue-draggable
                    class="dsettings__group-body"
                    :list="hiddenColumns"
                    group="people"
                    @change="moveItem"
                  >
                    <div
                      v-for="(item, index) in hiddenColumns"
                      :key="index"
                      class="dsettings__group-item"
                      :class="{ 'is-select' : item.views.select, 'is-fixed' : item.views.fixed }"
                      @click="selectItem(item)"
                    >
                      <div class="dsettings__group-item_icon">
                        <i class="material-icons" style="color: #616f83; font-size: 16px">remove_red_eye</i>
                      </div>
                      <span>{{ item.alias }}</span>
                    </div>
                  </vue-draggable>
                </div>
              </div>
            </div>
          </div>

        <div class="dsettings__group-buttons">
          <div
            @click="saveNewDisplaySettings"
            class="btn btn-primary"
          >
            <span>Применить</span>
          </div>
          <div
            class="btn btn-gray--outline big"
            title="Сброс на заводские установки"
            @click="setDefaultSettings"
          >
            Сбросить
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import cloneDeep from 'lodash/cloneDeep';

  export default {
    props: {
      value: {
        type: Boolean
      },
      itemsPerPage: {
        type: [Number,String]
      },
      columns: {
        type: Array
      }
    },
    data () {
      return {
        recordsPerPage: 0,
        items: []
      }
    },
    created () {
    if (typeof document !== 'undefined') {
      document.onkeydown = evt => {
        evt = evt || window.event
        if (evt.keyCode === 13) {
          this.saveNewDisplaySettings
        }
      }
    }
    },
    watch: {
      columns: {
        immediate: true,
        deep: true,
        handler() {
          this.items = cloneDeep(this.columns);
        }
      },
      value: {
        handler() {
          this.items = cloneDeep(this.columns);
        }
      },
      itemsPerPage: {
        immediate: true,
        deep: true,
        handler() {
          this.recordsPerPage = parseInt(this.itemsPerPage);
        }
      }
    },
    methods: {
      /**
       * Эмит события сохранения с измененными настроками
       */
      saveNewDisplaySettings () {
        this.$emit('columnsChange', {
          items: this.items,
          itemsPerPage: this.recordsPerPage
        });
        this.closeDisplaySettingsHandler();
      },
      /**
       * Установить настройки по умолчанию
       */
      setDefaultSettings() {
        const items = cloneDeep(this.columns);
        items.forEach(i => {
          i.views.view = true;
        })
        this.items = items;
      },
      /**
       * Закрыть модальное окно
       */
      closeDisplaySettingsHandler () {
        this.$emit('input', false);
      },
      /**
       * Выделить/отметить элемент
       */
      selectItem (item) {
        const elem = this.items.find(el => el.name === item.name);
        elem.views.select = !elem.views.select
      },
      /**
       * Обработчик события добавления и/или удаления
       * элемента из компонента draggable
       * @param event
       */
      moveItem (event) {
        if (event.added) {
          const name = event.added.element.name;
          const el = this.items.find(item => item.name === name);
          el.views.view = !el.views.view;
          el.views.select = false;
        }
      },
      /**
       * Переместить выбранные элементы в противоположную колонку
       * или поменять местами выбранные элементы из разных колонок
       */
      moveSelectedItems () {
        this.items.forEach(el => {
          if (el.views.select) {
            el.views.view = !el.views.view
            el.views.select = false
          }
        })
      },
       /**
       * Закрытие модального окна кликом вне
       */
      outsideClickListener (event, status) {
        if (event.srcElement.className == "dsettings-modal") {
        this.$emit('input', false);
        // если модалку с выборкой (да\нет) закрыли без выбора, вырубить loading и disabled у кнопок
        events.$emit('close_popup_with_selection', false) 
        this.removeClickListener(); 
        }
      if (typeof document !== 'undefined') {
        document.addEventListener('click', this.outsideClickListener)
      }
     },
    removeClickListener() {
      if (typeof document !== 'undefined') {
        document.removeEventListener('click', this.outsideClickListener)
      }
    },
    },
    computed: {
      /**
       * Видимые колонки
       * @returns {Array}
       */
      visibleColumns(){
        return this.items.filter(col => col.views && col.views.view && !col.views.fixed);
      },
      /**
       * Скрытые или зафиксированные колонки
       * @returns {Array}
       */
      hiddenColumns(){
        return this.items.filter(col => col.views && (!col.views.view || col.views.fixed));
      }
    }
  }
</script>
