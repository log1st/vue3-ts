<template>
  <div class="accruals__outer w-950">
    <div class="accruals__close" @click="closeTab">
      <icon-base width="13" height="13" iconColor="#8c8ea2">
        <icon-close-big />
      </icon-base>
    </div>
    <div class="accruals__head">
      <div class="accruals__title">Расчет пени за коммунальные услуги (ст. 155 ЖК РФ)</div>
    </div>
    <div class="accruals__items">
      <div class="accruals__item">
        <div class="accruals__item-head">
          <div class="accruals__item-head_row">
            <div class="accruals__item-head_col-1">№ ЛС</div>
            <div class="accruals__item-head_col-2">342342353478</div>
          </div>
          <div class="accruals__item-head_row">
            <div class="accruals__item-head_col-1">Адрес</div>
            <div class="accruals__item-head_col-2">г. Москва, Тестовая д.6 кв.1</div>
          </div>
          <div class="accruals__item-head_row">
            <div class="accruals__item-head_col-1">Должник</div>
            <div class="accruals__item-head_col-2">Иванов Сергей Александрович</div>
          </div>
        </div>
        <div class="accruals__item-title">Расчет пеней по задолженности, возникшей 13.03.2018</div>
        <div class="accruals__item-table">
          <table class="accruals__table-fine">
            <thead>
              <tr>
                <th rowspan="2">Задолженность</th>
                <th colspan="3">Период просрочки</th>
                <th rowspan="2">Ставка</th>
                <th rowspan="2">Доля ставки</th>
                <th rowspan="2">Формула</th>
                <th rowspan="2">Пени</th>
              </tr>
              <tr>
                <th>С</th>
                <th>ПО</th>
                <th>ДНИ</th>
              </tr>
            </thead>
            <tbody>
              <tr class="accruals__table-fine_subtitle">
                <td>-3 325.49 ₽</td>
                <td>13.02.2018</td>
                <td colspan="6" class="text-left pl-20">Погашение части долга</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Итого</td>
                <td>0.0 ₽</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Итого сумма</td>
                <td>0.0 ₽</td>
              </tr>
              <tr style="border-bottom: none">
                <td colspan="8" class="text-right pr-20">Расчет пеней по задолженности, возникшей 11.03.2018</td>
              </tr>
            </tfoot>
          </table>
          <table class="accruals__table-fine" style="border-top: none">
            <thead>
              <tr>
                <th rowspan="2">Задолженность</th>
                <th colspan="3">Период просрочки</th>
                <th rowspan="2">Ставка</th>
                <th rowspan="2">Доля ставки</th>
                <th rowspan="2">Формула</th>
                <th rowspan="2">Пени</th>
              </tr>
              <tr>
                <th>С</th>
                <th>ПО</th>
                <th>ДНИ</th>
              </tr>
            </thead>
            <tbody>
              <tr class="accruals__table-fine_subtitle">
                <td>-3 325.49 ₽</td>
                <td>13.02.2018</td>
                <td colspan="6" class="text-left pl-20">Погашение части долга</td>
              </tr>
              <tr v-for="i in 2" :key="i">
                <td></td>
                <td>13.02.2018</td>
                <td>15.02.2018</td>
                <td>30</td>
                <td>7,50%</td>
                <td>0</td>
                <td>2 657,87х30х0х7,5</td>
                <td>0.0 ₽</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Итого</td>
                <td>0.0 ₽</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Итого сумма</td>
                <td>0.0 ₽</td>
              </tr>
              <tr style="border-bottom: none">
                <td colspan="8" class="text-right pr-20">Сумма основного долга: 2 657, 87 ₽</td>
              </tr>
              <tr style="border-bottom: none">
                <td colspan="8" class="text-right pr-20">Сумма пеней по всем долженностям: 338, 88 ₽</td>
              </tr>
            </tfoot>
          </table>
        </div>
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
    // console.log(this.checkedDebtorsCount)
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
