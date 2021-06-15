<template>
  <div class="companies">
    <div class="companies__head">
      <div class="companies__controls">
        <div class="btn btn-icon" @click="searchOpen = !searchOpen">
          <icon-base v-if="!searchOpen"
            width="13"
            height="13"
            iconColor="#848aa1"
            ><icon-search />
          </icon-base>
          <icon-base v-else
            width="9"
            height="9"
            iconColor="#848aa1"
            ><icon-close />
          </icon-base>
        </div>
      </div>
      <div class="companies__row">
        <div v-for="(item, i) in headСompaniesData" class="companies__col" :key="'cmphd' + i">
          <span class="is-sorted">{{ item }}</span>
        </div>
      </div>
      <transition name="fade">
        <div v-show="searchOpen" class="companies__row companies__row-search">
          <div v-for="j in 4" class="companies__col" :key="'cmpsrch' + j">
            <search-input :params="{ placeholder: 'Введите текст…' }" @changeInputValue="changeInputsValue($event, j - 1)" />
          </div>
        </div>
      </transition>
      <div class="companies__separator"></div>
    </div>
    <div class="companies__body mt-20">
      <div v-for="(item, i) in getCompanies"
        class="companies__row"
        @mouseover="currentRowHovered = i"
        @mouseleave="currentRowHovered = null"
        :key="'cmprw' + i"
      >
        <div class="companies__col">
          <div class="companies__col-checkbox">
            <check-box :checked="item.checked" @changeCheckbox="!item.checked ? setCompanyChecked(i) : null" />
          </div>
          <span>{{ item.FullNameOrganization }}</span>
        </div>
        <div class="companies__col" @click="runActions(0)"><span>{{ item.ShortNameOfTheOrganization }}</span></div>
        <div class="companies__col" @click="runActions(0)"><span>{{ item.UrAddress }}</span></div>
        <div class="companies__col" @click="runActions(0)"><span>{{ item.FactAddress }}</span></div>
        <transition name="fade">
          <rowHoverActions v-if="currentRowHovered == i" :icons="actionsIcons" :elClass="i % 2 == 1 ? 'is-dark' : null" @setRowHoverAction="runActions($event)" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import searchInput from '@/components/elements/SearchInput'
import checkBox from '@/components/elements/CheckBox'
import rowHoverActions from '@/components/elements/RowHoverActions'
export default {
  components: { searchInput, checkBox, rowHoverActions },
  data () {
    return {
      searchOpen: false,
      actionsIcons: ['view', 'edit', 'close'],
      currentRowHovered: null,
      currentAction: null,
      headСompaniesData: ['Полное наименование', 'Сокращенное наименование', 'Юридический адрес', 'Фактический адрес'],
      searchData: [
        { key: 'FullNameOrganization', data: '' },
        { key: 'ShortNameOfTheOrganization', data: '' },
        { key: 'UrAddress', data: '' },
        { key: 'FactAddress', data: '' }
      ],
      setToDelete: null
    }
  },
  methods: {
    ...mapActions(['setPopupState', 'setPopupComponent', 'openPopup', 'setCompanyChecked', 'setCheckedByDefault', 'setCompanyFilterData', 'removeCompany']),
    changeInputsValue (event, i) {
      this.searchData[i].data = event.toLowerCase()
      this.setCompanyFilterData(this.searchData)
    },
    runActions (j) {
      if (j !== 2) {
        this.setPopupComponent({ component: 'company-cart', params: { mode: j === 0 ? 'view' : 'edit', _id: this.currentRowHovered } })
      } else if (this.getCompanies.length === 1) {
        this.setPopupComponent({ component: 'popupAlert', params: { title: 'Дейстивие запрещено', text: 'Невозможно удалить единственную компанию. Создайте новую компанию и после этого попробуйте еще раз.' } })
      } else {
        this.setToDelete = this.currentRowHovered
        this.setPopupComponent({ component: 'confirm', params: { title: `Подтвердите удаление компании<br>${this.getCompanies[this.currentRowHovered].ShortNameOfTheOrganization}`, btnConfirm: 'Удалить!', btnCancel: 'Отменить', action: this.confirmRemoveCompany } })
      }
    },
    confirmRemoveCompany (event) {
      if (event) {
        this.removeCompany(this.setToDelete)
      }
      this.setToDelete = null
    }
  },
  computed: {
    ...mapGetters(['getCompanies'])
  },
  beforeDestroy () {
    this.setCheckedByDefault()
  }
}
</script>
