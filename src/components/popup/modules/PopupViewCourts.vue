<template>
  <popupWrapper :title="!editMode ? 'Подробно о судебном участке' : 'Редактировать судебный участок'" :popupWidth="821">
      <div class="courts__create-buttons">
        <template v-if="editMode">
          <div class="btn btn-primary" @click="refreshData()">Обновить</div>
          <div class="btn btn-white" @click="setPopupComponent({ component: 'popupViewCourts', params: { id: params.id } })">Отменить</div>
        </template>
        <div v-else class="btn btn-primary" @click="setPopupComponent({ component: 'popupViewCourts', params: { id: params.id, editMode: true } })">Редактировать</div>
      </div>
      <div class="pb-30">
        <baseScrollWrapper :height="'500px'">
          <div class="courts__create-wrapper courts__create-wrapper--full">
            <div v-for="(item, i) in viewRows" class="courts__create-row" :class="{ 'is-dark' : i%2 === 1, 'courts__create-row--edits' : editMode }" :key="'ppcrcouta' + i">
              <div class="courts__create-col">
                <span>{{ item.name }}</span>
              </div>
              <div class="courts__create-col" :key="updateContent">
                <search-input v-if="editMode" :params="item" @changeInputValue="changeInputsValue($event, i)" />
                <span v-else>{{ item.value }}</span>
              </div>
            </div>
          </div>
        </baseScrollWrapper>
      </div>
  </popupWrapper>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import popupWrapper from '@/components/popup/modules/PopupWrapper'
import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
import searchInput from '@/components/elements/SearchInput'
export default {
  props: {
    params: Object
  },
  components: { popupWrapper, baseScrollWrapper, searchInput },
  data () {
    return {
      updateContent: 0,
      editMode: false, // редактирование
      createMode: false, // создать новый
      viewRows: [
        { name: 'id', key: '_id', readonly: true },
        { name: 'Наименование', key: 'FullRegion', valid: true, readonly: !this.editMode, placeholder: 'Введите наименование' },
        { name: 'Адрес', key: 'Address', readonly: !this.editMode, placeholder: 'Введите адрес' },
        { name: 'Мировой судья', key: 'Magistrate', readonly: true, placeholder: 'Введите ФИО' },
        { name: 'Телефон (секретарь суда)', key: 'Secretary', placeholder: 'Введите номер' },
        { name: 'Телефон (помощник мирового судьи)', key: 'AssistantJusticeOfThePeace', placeholder: 'Введите номер' },
        { name: 'Телефон (начальник управления)', key: 'HeadOfTheOffice', placeholder: 'Введите номер' },
        { name: 'Электронная почта', key: 'EmailCourt', placeholder: 'Введите e-mail' },
        { name: 'Наименование получателя платежа', key: 'NamePaymentRecipient', valid: true, placeholder: 'Введите наименование получателя платежа' },
        { name: 'БИК', key: 'BIC', valid: true, placeholder: 'Введите БИК', onlynumber: true },
        { name: 'Номер счета получателя платежа', key: 'RecipientAaccountNumber', valid: true, placeholder: 'Введите номер счета получателя платежа', onlynumber: true },
        { name: 'ИНН', key: 'INN', valid: true, placeholder: 'Введите ИНН', onlynumber: true },
        { name: 'КПП', key: 'KPP', valid: true, placeholder: 'Введите КПП', onlynumber: true },
        { name: 'ОКАТО', key: 'OKTMO', valid: true, placeholder: 'Введите ОКАТО', onlynumber: true },
        { name: 'Наименование банка получателя платежа', key: 'NameRecipientBank', valid: true, placeholder: 'Введите наименование банка получателя платежа' },
        { name: 'КБК', key: 'KBK', valid: true, placeholder: 'Введите KBK', onlynumber: true }
      ]
    }
  },
  created () {
    this.setModuleParams()
  },
  methods: {
    ...mapActions(['editJudicialDistricts', 'removeCourt', 'setPopupComponent', 'setPopupState']),
    setModuleParams () {
      this.editMode = this.params.editMode
      this.createMode = this.params.createMode
      this.viewRows.forEach(el => {
        el.value = this.getCourt(this.params.id)[el.key]
      })
    },
    changeInputsValue (event, i) {
      if (event === '') return false
      this.viewRows[i].value = event
    },
    validateData () {
      let errors = 0
      this.viewRows.forEach(el => {
        if (el.valid) {
          if (!el.value || el.value === '') {
            el.class = 'is-error'
            errors++
          }
        }
      })
      if (errors) this.updateContent++
      return !errors
    },
    refreshData () {
      if (this.validateData()) {
        const id = this.params.id
        const dataCourt = { Name: this.getCourt(id).Name }
        this.viewRows.forEach(el => {
          if (el.value) dataCourt[el.key] = el.value
        })
        this.editJudicialDistricts({ id, dataCourt })
          .then(() => {
            this.setPopupComponent({ component: 'popupViewCourts', params: { id } })
          })
      }
    },
    setRemoveCourt (event) {
      if (event) this.removeCourt(this.params.id)
    }
  },
  computed: {
    ...mapGetters(['getCourt'])
  }
}
</script>
