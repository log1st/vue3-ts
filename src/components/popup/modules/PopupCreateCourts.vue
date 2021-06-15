<template>
  <popupWrapper title="Создать судебный участок" :popupWidth="821">
    <template v-slot:content>
      <baseScrollWrapper :height="'500px'">
        <div class="courts__create-wrapper">
          <div class="courts__create-row">
            <div class="courts__create-col">
              <span>{{ createRows[0].name}}</span>
            </div>
            <div class="courts__create-col">
              <searchInput :params="{ value: createRows[0].value, readonly: true }"/>
            </div>
          </div>
          <div v-for="(item, i) in createRows.slice(1, 8)" class="courts__create-row" :key="'ppcrcouta' + i">
            <div class="courts__create-col">
              <span>{{ item.name}}</span>
            </div>
            <div class="courts__create-col">
              <searchInput
                :params="{ placeholder: item.placeholder }"
                @changeInputValue="changeInputsValue($event, i + 1)"
              />
            </div>
          </div>
          <div class="courts__create-separator"></div>
          <div v-for="(item, i) in createRows.slice(8, 17)" class="courts__create-row" :key="'ppcrcasdj' + i">
            <div class="courts__create-col">
              <span>{{ item.name}}</span>
            </div>
            <div class="courts__create-col">
              <searchInput :params="{ placeholder: item.placeholder }" @changeInputValue="changeInputsValue($event, i + 8)"/>
            </div>
          </div>
          <div class="courts__create-footer">
            <div class="btn btn-primary" @click="saveNew()">Сохранить</div>
          </div>
        </div>
      </baseScrollWrapper>
    </template>
  </popupWrapper>
</template>

<script>
import { mapActions } from 'vuex'
import popupWrapper from '@/components/popup/modules/PopupWrapper'
import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
import searchInput from '@/components/elements/SearchInput'
export default {
  components: { popupWrapper, baseScrollWrapper, searchInput },
  data () {
    return {
      createRows: [
        { name: 'id', key: '_id', value: this.$store.getters.getCourtNextId, readonly: true },
        { name: 'Наименование', key: 'description', placeholder: 'Введите название' },
        { name: 'Почтовый индекс', key: 'postIndex', placeholder: 'Введите название' },
        { name: 'Регион (область)', key: 'region', placeholder: 'Введите название' },
        { name: 'Город (населенный пункт)', key: 'district', placeholder: 'Введите название' },
        { name: 'Улица', key: 'city', placeholder: 'Введите название' },
        { name: 'Дом (строение)', key: 'street', placeholder: 'Введите название' },
        { name: 'Офис/помещение', key: 'office', placeholder: 'Введите название' },
        { name: 'Телефон', key: 'phone', placeholder: 'Введите название' },
        { name: 'Наименование получателя платежа', key: 'nameOfPayee', placeholder: 'Введите название' },
        { name: 'БИК', key: 'bik', placeholder: 'Введите название' },
        { name: 'Номер счета получателя платежа', key: 'payeeAccountNumber', placeholder: 'Введите название' },
        { name: 'ИНН', key: 'inn', placeholder: 'Введите название' },
        { name: 'КПП', key: 'kpp', placeholder: 'Введите название' },
        { name: 'ОКАТО', key: 'oktmo', placeholder: 'Введите название' },
        { name: 'Наименование банка получателя платежа', key: 'nameOfBank', placeholder: 'Введите название' },
        { name: 'КБК', key: 'kbk', placeholder: 'Введите название' }
      ]
    }
  },
  methods: {
    ...mapActions(['saveNewCourt', 'setPopupComponent']),
    changeInputsValue (event, i) {
      this.createRows[i].value = event
    },
    saveNew () {
      this.saveNewCourt({ arr: this.createRows })
      this.setPopupComponent({ component: 'popupViewCourts', params: { id: this.createRows[0].value } })
    }
  }
}
</script>
