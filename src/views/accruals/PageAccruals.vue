<template>
  <div class="accruals__outer">
    <div class="accruals__close" @click="closeTab">
      <icon-base width="13" height="13" iconColor="#8c8ea2">
        <icon-close-big />
      </icon-base>
    </div>
    <div class="accruals__head">
      <div class="accruals__title">Свод начислений по лицевому счету</div>
    </div>
    <div class="accruals__items">
      <div class="accruals__item">
        <div class="accruals__item-head">
          <div class="accruals__item-head_row">
            <div class="accruals__item-head_col-1">Номер лицевого счета</div>
            <div class="accruals__item-head_col-2">342342353478</div>
          </div>
          <div class="accruals__item-head_row">
            <div class="accruals__item-head_col-1">Адрес</div>
            <div class="accruals__item-head_col-2">г. Москва, Тестовая д.6 кв.1</div>
          </div>
          <div class="accruals__item-head_row">
            <div class="accruals__item-head_col-1">ФИО</div>
            <div class="accruals__item-head_col-2">Иванов Сергей Александрович</div>
          </div>
        </div>
        <div class="accruals__item-table">
          <table class="accruals__table">
            <thead>
              <tr>
                <th colspan="3">Организация</th>
                <th rowspan="3">Нач-ый остаток</th>
                <th rowspan="3">Начислено</th>
                <th rowspan="3">Оплачено</th>
                <th colspan="2" class="accruals__table-th--45">
                  <div>Конечный остаток</div>
                </th>
                <th rowspan="3">Сумма просроченной задолженности</th>
              </tr>
              <tr>
                <th>№кв</th>
                <th>Лицевой счет</th>
                <th>Месяцев задолж-сти</th>
                <th rowspan="2"  class="accruals__table-th--45"><span>Задолженность</span></th>
                <th rowspan="2"  class="accruals__table-th--45"><span>Конечный остаток</span></th>
              </tr>
              <tr>
                <th colspan="3">Период взаиморасчетов</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 5" :key="i">
                <td colspan="3">07.12.2019</td>
                <td>0.00</td>
                <td><b>2 648.92 ₽</b></td>
                <td><b>0.0 ₽</b></td>
                <td><b>0.0 ₽</b></td>
                <td><b>2 648.92 ₽</b></td>
                <td><b>0.0 ₽</b></td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="accruals__table-row--total">
                <td colspan="3">Итого</td>
                <td><b>0.00</b></td>
                <td><b>16 648.92 ₽</b></td>
                <td><b>0.0 ₽</b></td>
                <td><b>0.0 ₽</b></td>
                <td><b>2 648.92 ₽</b></td>
                <td><b>0.0 ₽</b></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
    <div class="accruals__footer">
      <div class="accruals__total">
        Итого общая сумма задолженности 0.00 рублей
      </div>
      <div class="accruals__footer-answerable">
        <span>Генеральный директор</span>
        Лозован Ю.Б
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  mounted () {
    console.log(this.checkedDebtorsCount)
  },
  methods: {
    closeTab () {
      window.close()
    }
  },
  computed: {
    ...mapGetters(['checkedDebtorsCount'])
  }
}
</script>
