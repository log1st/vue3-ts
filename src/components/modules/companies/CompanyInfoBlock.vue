<template>
  <div class="compib">
    <div class="compib__header">
      <div class="compib__row compib__row--dark">
        <div class="compib__title">
          <span>Общие данные организации</span>
        </div>
        <!-- <div class="compib__actions">
          <div v-for="(item, j) in actionsIcons" class="companies__actions-item" @click="runActions(j)" :key="'cmpactns' + j">
            <icon-base
              :width="item.width"
              :height="item.height"
              iconColor="#8e9baf"
              ><component :is="'icon-' + item.name" />
            </icon-base>
          </div>
        </div> -->
      </div>
    </div>
    <div class="compib__body">
      <div v-for="(item, i) in companyData" :key="'sdfsdk' + i">
        <div class="compib__row compib__row--dark">
          <span>{{ item.title }}</span>
        </div>
        <div v-for="(input, j) in item.inputs" class="compib__row" :key="i + 'xcvsdf' + j">
          <div class="compib__row-label">
            <span>{{ input.label }}</span>
            <span v-if="input.action" class="compib__row-label_action" @click.prevent="input.action(input.key)">Как юр.адрес</span>
          </div>
          <div class="compib__input" :key="input.action ? updateContentInner[input.key] + 'asdasd' : null">
            <search-input :params="input.inputParams" @changeInputValue="$emit('changeInputsValue', { key: input.key, event: $event })"/>
          </div>
        </div>
      </div>
      <!-- Файлы ЕГРЮЛ -->
      <div class="compib__row compib__row--align_top">
        <div class="compib__row-label">
          <span>Файлы ЕГРЮЛ</span>
        </div>
        <div class="compib__files">
          <div class="compib__files-item">
            <div class="compib__files-item_img" :style="{ backgroundImage: 'url(./assets/images/bitmap.jpg)' }"></div>
            <div class="compib__files-item_icons">
              <div v-for="(item, i) in filesActionsIcons" class="compib__files-item_icon" :key="'flsacti' + i">
                <icon-base
                  :width="item.width"
                  :height="item.height"
                  iconColor="#8e9baf"
                  ><component :is="'icon-' + item.name" />
                </icon-base>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="compib__row">
        <span class="compib__footer-label">Выбрать файл</span>
        <div class="btn btn-primary">Выбрать</div>
      </div>
    </div>
  </div>
</template>

<script>
import iconView from '@/components/icons-svg/icons/IconView'
import searchInput from '@/components/elements/SearchInput'
export default {
  props: {
    companyData: Array,
    updateContent: String
  },
  components: { iconView, searchInput },
  data () {
    return {
      updateContentInner: {
        FactAddress: 0,
        PochtAddress: 0
      },
      actionsIcons: [{ name: 'view', width: 14, height: 10 }, { name: 'edit', width: 11, height: 11 }, { name: 'close', width: 9, height: 9 }],
      filesActionsIcons: [{ name: 'close', width: 9, height: 9 }, { name: 'media', width: 9, height: 9 }, { name: 'litle-search', width: 8, height: 8 }]
    }
  },
  watch: {
    updateContent (val) {
      this.updateContentInner[val]++
    }
  }
}
</script>
