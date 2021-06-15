<template>
  <div class="acontrol">
    <div class="acontrol__col-1">
      <div class="acontrol__row">
        <search-input :params="{ placeholder: 'Выберите дом', class: 'is-big border-blue' }" />
      </div>
      <div class="acontrol__row">
        <datePicker :params="{ active: true }" @changeDate="changeDate($event, 'from')" key="abra"/>
        <datePicker :params="{ dpwidth: 200}" @changeDate="changeDate($event, 'to')" key="codabra"/>
      </div>
    </div>
    <div class="acontrol__col-2">
      <div class="acontrol__row">
        <search-input :params="{ placeholder: 'По дням', isSelect: true, class: 'is-big', items: ['По дням', 'По неделям', 'По месяцам', 'По годам'] }" />
      </div>
    </div>
    <div class="acontrol__col-3">
      <div class="acontrol__row">
        <div class="btn btn-primary">Показать</div>
        <div class="btn btn-white">Сбросить фильтр</div>
      </div>
    </div>
  </div>
</template>

<script>
import searchInput from '@/components/elements/SearchInput'
import datePicker from '@/components/elements/DatePicker'
export default {
  components: { searchInput, datePicker },
  methods: {
    changeDate (event, type) {
      console.log(event, type)
    }
  }
}
</script>
