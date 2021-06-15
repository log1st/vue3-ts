<template>
  <div class="main">
    <div class="main__head">
      <div class="main__head-title mt-6">Судебные участки мировых судей</div>
<!--      <div class="btn btn-primary" @click="setPopupComponent({ component: 'popupCreateCourts' })"><span class="fz-22">+</span> Добавить участок</div>-->
    </div>
    <div class="main__content pt-20">
      <div class="courts">
        <div class="courts__wrapp">
          <div class="courts__controls">
            <div class="btn btn-icon" @click="searchOpen = !searchOpen; $emit('changeControlHeight', searchOpen)">
              <icon-base v-if="!searchOpen" width="13" height="13" iconColor="#848aa1">
                <icon-search />
              </icon-base>
              <icon-base v-else width="9" height="9" iconColor="#848aa1">
                <icon-close />
              </icon-base>
            </div>
          </div>
          <div class="courts__content">
            <table class="courts__table">
              <thead>
                <tr class="courts__table-head">
                  <th>#</th>
                  <th>ID</th>
                  <th>Наименование</th>
                  <th>Адрес</th>
                  <th>Телефон</th>
                  <th>Наименование получателя платежа</th>
                </tr>
                <transition name="fade">
                  <tr v-show="searchOpen" class="courts__table-search">
                    <th></th>
                    <th v-for="(item, i) in searchInputs" :key="'courtssits' + i">
                      <search-input :params="item" @changeInputValue="changeInputsValue($event, i)" />
                    </th>
                  </tr>
                </transition>
                <tr class="courts__table-decor">
                  <th colspan="6"></th>
                </tr>
              </thead>
              <!-- <tbody>
                <tr v-for="(item, i) in getCourts"
                  @mouseover="currentRowHovered = i"
                  @mouseleave="currentRowHovered = null"
                  @click="clickRow($event, item._id)"
                  :key="'crtsdtder' + i"
                >
                  <td>{{ i + 1 }}</td>
                  <td>{{ item._id}}</td>
                  <td>{{ item.Name}}</td>
                  <td>{{ item.Address}}</td>
                  <td>{{ item.Secretary}}</td>
                  <td>
                    {{ item.NameOfPayee}}
                    <transition name="fade">
                      <rowHoverActions v-if="currentRowHovered == i" :icons="actionsIcons" :elClass="i % 2 == 1 ? 'is-dark' : null" @setRowHoverAction="runActions($event, item._id)" />
                    </transition>
                  </td>
                </tr>
              </tbody> -->
            </table>
            <baseScrollWrapper :height="'600px'">
              <table class="courts__table">
                <tbody>
                  <tr v-for="(item, i) in getCourts"
                    @mouseover="currentRowHovered = i"
                    @mouseleave="currentRowHovered = null"
                    @click="clickRow($event, item._id)"
                    :key="'crtsdtder' + i"
                  >
                    <td>{{ i + 1 }}</td>
                    <td>{{ item._id}}</td>
                    <td>{{ item.Name}}</td>
                    <td>{{ item.Address}}</td>
                    <td>{{ item.Secretary}}</td>
                    <td>
                      {{ item.NamePaymentRecipient}}
                      <transition name="fade">
                        <rowHoverActions
                          v-if="currentRowHovered == i"
                          :icons="actionsIcons"
                          :elClass="i % 2 == 1 ? 'is-dark' : null"
                          @setRowHoverAction="setPopupComponent({ component: 'popupViewCourts', params: { id: item._id, editMode: $event === 1 } })" />
                      </transition>
                    </td>
                  </tr>
                </tbody>
              </table>
            </baseScrollWrapper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import searchInput from '@/components/elements/SearchInput'
import rowHoverActions from '@/components/elements/RowHoverActions'
import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
export default {
  name: 'Courts',
  components: { searchInput, rowHoverActions, baseScrollWrapper },
  data () {
    return {
      searchOpen: false,
      contentUpdate: 0,
      searchInputs: [
        { placeholder: 'Ввод текста', onlynumber: true },
        { placeholder: 'Ввод текста' },
        { placeholder: 'Ввод текста' },
        { placeholder: 'Ввод текста' },
        { placeholder: 'Ввод текста' }
      ],
      actionsIcons: ['view', 'edit'],
      currentRowHovered: null,
      searchData: [
        { key: '_id', data: '' },
        { key: 'Name', data: '' },
        { key: 'Address', data: '' },
        { key: 'Secretary', data: '' },
        { key: 'NamePaymentRecipient', data: '' }
      ],
      setIdCourtToRemove: null
    }
  },
  // created () {
  //   if (this.$store.getters.getListOfJudicialDistrictsLength === 0) this.combinedRequests()
  // },
  methods: {
    ...mapActions(['setCourtsFilterData', 'setPopupComponent', 'combinedRequests', 'removeCourt']),
    changeInputsValue (event, i) {
      this.searchData[i].data = event
      this.setCourtsFilterData(this.searchData)
    },
    clickRow (event, id) {
      if (event.target.tagName === 'TD') this.setPopupComponent({ component: 'popupViewCourts', params: { id } })
    }
  },
  computed: {
    ...mapGetters(['getCourts'])
  }
}
</script>
