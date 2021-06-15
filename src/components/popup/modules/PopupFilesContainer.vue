<template>
  <div class="f-container">
    <div class="f-container__body"
      :class="{ 'highlight' : highlight, 'is-loading' : fileName || isLoading }"
      @dragover.prevent="highlight = true; isLoading = true"
      @dragleave.prevent="highlight = false"
      @drop.stop.prevent="dropFiles"
    >
      <div class="f-container__body-wrap">
        <baseScrollWrapper :height="'300px'">
          <div v-if="getDeptorFiles.length > 0" class="f-container__body-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Название</th>
                  <th>Дата</th>
                  <th>Производство</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in getDeptorFiles" @mouseover="currentRowHovered = i" @mouseleave="currentRowHovered = null" :key="'fcnttbl' + i">
                  <td>
                    <icon-base
                      width="14"
                      height="15"
                      viewbox="0 0 42 51"
                      iconColor="#7989a0"
                      ><icon-file />
                    </icon-base>
                  </td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.date | formatdate(true) }}</td>
                  <td>{{ item.proceedings }}</td>
                  <td>
                    <a href="javascript:void(0);">{{ item.status }}</a>
                    <transition name="fade">
                      <rowHoverActions v-if="currentRowHovered == i" :icons="actionsIcons" @setRowHoverAction="runActions($event)" />
                    </transition>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </baseScrollWrapper>
      </div>
      <div class="f-container__mask" :class="{ 'is-hide' : getDeptorFiles.length > 0 }">
        <div class="f-container__mask-inner">
          <div class="f-container__icon">
            <icon-base
              width="42"
              height="51"
              :iconColor="fileName != null ? '#ffffff' : '#cbd7e8'"
              ><icon-file />
            </icon-base>
          </div>
          <div class="f-container__subtitle">{{ fileName === null ? 'Перетащите файлы сюда' : fileName + ' Загружается' }}</div>
        </div>
        <transition name="fade">
          <div v-if="fileName != null" class="f-container__loader">
            <div class="f-container__loader-marker"></div>
          </div>
        </transition>
      </div>
    </div>
    <div class="f-container__input" :class="{ 'is-disabled' : fileName != null }">
      <input type="file" name="f-container-file" multiple @change="changeFile" ref="fContainerFile" :key="'a' + fileName">
      <label for="f-container-file" class="f-container__input-label" @click="fileName === null ? $refs.fContainerFile.click() : null">
        <div class="f-container__placeholder">
          <span>{{ fileName === null ? 'Выбрать файл' : fileName }}</span>
        </div>
        <div class="f-container__button">
          <div class="btn btn-primary">Выбрать</div>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
import rowHoverActions from '@/components/elements/RowHoverActions'
export default {
  components: { baseScrollWrapper, rowHoverActions },
  data () {
    return {
      highlight: false,
      isLoading: false,
      fileName: null,
      currentRowHovered: null,
      actionsIcons: ['view', 'download']
    }
  },
  methods: {
    ...mapActions(['setDebtorFile']),
    changeFile (event) {
      this.upFiles(this.$refs.fContainerFile.files)
    },
    dropFiles (e) {
      console.log(e)
      debugger
      if (e.dataTransfer.files) {
        this.upFiles(e.dataTransfer.files);
        this.isLoading = false;
      }
    },
    upFiles (files) {
      files.forEach((file, i) => {
        setTimeout(() => {
          this.fileName = file.name
          this.setDebtorFile(file)
            .then(res => {
              this.fileName = null
            })
            .catch(error => console.log(error))
        }, 1500 * i)
      })
    },
    runActions (e) {
      console.log(this.currentRowHovered, e)
    }
  },
  computed: {
    ...mapGetters(['getDeptorFiles'])
  }
}
</script>
