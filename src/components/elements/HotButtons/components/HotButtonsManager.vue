<template>
  <div class="manage-hot-buttons-modal" v-show="value">
    <div class="manage-hot-buttons-modal__inner">
      <div class="manage-hot-buttons">

        <div class="manage-hot-buttons__head">
          <span>Быстрые клавиши</span>
          <div @click="closeHandler" >
            <i class="material-icons" style="color: #8c8ea2; cursor: pointer">close</i>
          </div>
        </div>

        <div class="manage-hot-buttons__body">
          <div
            class="manage-hot-buttons__item"
            v-for="(item, index) in itemsInner"
            :key="index"
            v-show="item.show"
          >
<!--            <i :class="item.icon.name"></i>-->
            <icon-base
              :hasStroke="false"
              :width="item.icon ? item.icon.w : 24"
              :height="item.icon ? item.icon.h : 24"
              iconColor="#818181"
              :viewBox="item.icon ? item.icon.viewBox : '0 0 20 20'"
            ><component v-if="item.icon" :is="'icon-' + item.icon.name" />
            </icon-base>
            <span>{{ item.name }}</span>
            <check-box-big
              @changeCheckbox="checkSetting(index)"
              :checked="item.visible"
            >
              <div>&#10004;</div>
            </check-box-big>

          </div>
        </div>

        <div class="manage-hot-buttons__footer">
          <div class="btn btn-primary" @click="updateHotButtonSettings">
            Применить
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
      value: Boolean,
      /**
       * Список кнопок
       */
      items: {
        type: Array,
      }
    },
    data() {
      return {
        itemsInner: []
      }
    },
    watch: {
      items: {
        immediate: true,
        deep: true,
        handler(value) {
          this.itemsInner = cloneDeep(value);
        }
      }
    },
    methods: {
      /**
       * Закрыть модальное окно
       */
      closeHandler () {
        this.$emit('input', false);
      },
      /**
       * Обновить настройки
       */
      updateHotButtonSettings() {
        this.$emit('save', this.itemsInner);
      },
      /**
       * Обработчик клика на чекбокс
       * @param index
       */
      checkSetting (index) {
        this.itemsInner[index].visible = !this.itemsInner[index].visible;
      }
    }
  }
</script>
