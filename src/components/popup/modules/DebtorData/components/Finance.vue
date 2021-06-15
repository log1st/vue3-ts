<template>
    <div class="d-data__content">

      <div class="d-data__table">
        <div class="d-data__row d-data__finance-head">
          <div class="d-data__col"><span class="d-data__finance-head-title">Начислено</span> <span>{{ paramsInner.accrual | sepnum(2) }} ₽</span></div>
          <div class="d-data__col"><span class="d-data__finance-head-title">Оплачено</span> <span>{{ paramsInner.paid_up | sepnum(2) }} ₽</span></div>
          <div class="d-data__col"><span class="d-data__finance-head-title">Задолженность</span> <span>{{ paramsInner.debt | sepnum(2) }} ₽</span></div>
          <div class="d-data__col"><span class="d-data__finance-head-title">Пеня</span> <span>{{ paramsInner.penalty | sepnum(2) }} ₽</span></div>
        </div>

        <!-- <div class="d-data__head-tabs">
          <div class="slide__button--prev" @click="$refs.carouselFin.goToPrev()">
            <icon-base :width="24" :height="24" iconColor="white" viewBox="-4 -2 24 24">
              <icon-arrow-prev />
            </icon-base>
          </div>
          <agile :navButtons="false" :dots="false" ref="carouselFin" :slidesToShow="2">
            <div class="slide">
              <div class="slide__tab">
                <div><span>Начислено</span></div>
                <span>{{ paramsInner.AccruedCsv | sepnum(2) }} ₽</span>
              </div>
            </div>
            <div class="slide">
              <div class="slide__tab">
                <div><span>Оплачено</span></div>
                <span>{{ paramsInner.PaidCsv | sepnum(2) }} ₽</span>
              </div>
            </div>
            <div class="slide">
              <div class="slide__tab">
                <div><span>Задолженность</span></div>
                <span>{{ paramsInner.TotalDebt | sepnum(2) }} ₽</span>
              </div>
            </div>
            <div class="slide">
              <div class="slide__tab">
                <div><span>Пеня</span></div>
                <span>{{ paramsInner.PeniCsv | sepnum(2) }} ₽</span>
              </div>
            </div>
          </agile>
          <div class="slide__button--next" @click="$refs.carouselFin.goToNext()">
            <icon-base :width="24" :height="24" iconColor="white" viewBox="-4 -2 16 24">  
              <icon-arrow-next />
            </icon-base>
          </div>
        </div> -->
      </div>

        <!-- <ur-card-tabs :tabs="tabsComputed" :buttons="buttons" :scrollHeight="300"> -->
        <ur-card-tabs :tabs="tabs" :scrollHeight="300">
          
          <template slot="tab-1">
            <div class="d-data__content-table">
              <table>
                <tbody>
                <tr>
                  <th>
                    Дата начислений
                    <!-- <span class="table__head-sort" @click="sortHandler({ tabIndex: 0, field: 'Accrued' })">
                      <span class="mdi mdi-sort" v-if="tab1Sorting === 'none'"></span>
                      <span class="mdi mdi-sort-ascending" v-if="tab1Sorting === 'asc'"></span>
                      <span class="mdi mdi-sort-descending" v-if="tab1Sorting === 'desc'" ></span>
                    </span> -->
                  </th>
                  <th>Начислено</th>
                  <th>Начисления разовые</th>
                  <th>Доп. корректировка</th>
                  <th>Субсидии</th>
                </tr>
                <tr v-for="(item, i) in finance.accrual" :key="i + 'sjdf34'">
                  <td>{{ `${item.date}` }}</td>
                  <td>{{ item.value | sepnum(2) }} ₽</td>
                  <td v-if="!!item.parts[0] && item.parts[0].title === 'Начислено'">{{ item.parts[0].value | sepnum(2) }} ₽</td>
                  <td v-else> 0 ₽</td>
                  <td v-if="!!item.parts[1] && item.parts[1].title === 'Начислено разово'">{{ item.parts[1].value | sepnum(2) }} ₽</td>
                  <td v-else> 0 ₽</td>
                  <td v-if="!!item.parts[2] && item.parts[2].title === 'Начислено субсидий'">{{ item.parts[2].value | sepnum(2) }} ₽</td>
                  <td v-else> 0 ₽</td>
                </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template slot="tab-2">
            <div class="d-data__content-table">
              <table>
                <tbody>
                <tr>
                  <th>Месяц оплаты</th>
                  <th>Сумма оплаты</th>
                </tr>
                <tr v-for="(item, i) in finance.paid_up" :key="i">
                  <td>{{ `${item.date}` }}</td>
                  <td>{{ item.value | sepnum(2) }} ₽</td>
                </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template slot="tab-3">
            <div class="d-data__content-table">
              <table>
                <tbody>
                <tr>
                  <th>Начало просрочки</th>
                  <th>Конец просрочки</th>
                  <th>Задолженность</th>
                </tr>
                <tr v-for="(item, i) in finance.debt" :key="i">
                  <td>{{ item.start_date }}</td>
                  <td>{{ item.end_date }}</td>
                  <td>{{ item.value | sepnum(2) }} ₽</td>
                </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template slot="tab-4">
            <div class="d-data__content-table">
              <table>
                <tbody>
                <tr>
                  <th>Начало просрочки</th>
                  <th>Пеня</th>
                </tr>
                <template v-for="(item, i) in finance.penalties_data">
                  <tr v-if="item.start_date" :key="i+'sdad55'">
                    <td style="width: 50%">{{ item.start_date }}</td>
                    <td style="width: 50%">{{ item.value | sepnum(2) }} ₽</td>
                  </tr>
                </template>
                </tbody>
              </table>
            </div>
          </template>
        </ur-card-tabs>
      </div>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep';
    import isEmpty   from 'lodash/isEmpty';
    import filter    from 'lodash/filter';
    
    export default {
        props: {
            params: {
                type: Object
            }
        },
        computed: {
            tabsComputed() {
                return cloneDeep(this.tabs).map(t => t.title);
            }
        },
        created() {
            this.prepareParams();
        },
        data() {
            return {
                tabs: [
                    {
                        title: 'Начислено',
                        sorting: [
                            {
                                field: 'accrual',
                                sortDirection: 'none'
                            }
                        ]
                    },
                    {
                        title: 'Оплачено'
                    },
                    {
                        title: 'Задолженность'
                    },
                    {
                        title: 'Пеня'
                    },
                ],
                    // '', 'Оплачено', 'Задолженность', 'Пеня'],
                buttons: {
                    set: true,
                    array: [
                        { icon: 'print', width: 17, height: 17 },
                        { icon: 'download', width: 12, height: 13 }
                    ]
                },
                finance: {
                  accrual: [],
                  debt: [],
                  paid_up: []
                },
                paramsInner: [],
                tab1Sorting: 'none',
                objectCols: [ 'accrual', 'penalties_data', 'debt', 'paid_up' ],
                sortDirections: ['none', 'asc', 'desc'],
            }
        },
        methods: {
            /**
             * Филтрация данных вкладок
             */
            prepareParams() {
                this.paramsInner = cloneDeep(this.params);
                this.finance.accrual = this.paramsInner.accruals_data;
                this.finance.paid_up = this.paramsInner.paid_ups_data;
                this.finance.debt = this.paramsInner.debts_data;
                this.finance.penalties_data = this.paramsInner.penalties_data;
            },

            sortHandler({ tabIndex, field }) {
                let fieldObj = this.tabs[tabIndex].sorting.find(f => f.field === field);
                const index = this.sortDirections.findIndex(i => i === fieldObj.sortDirection);
                fieldObj.sortDirection = index === 2 ? this.sortDirections[0] : this.sortDirections[index + 1];
                this.sortByDate(fieldObj.sortDirection, field)
            },
            sortByDate(sortDirection, field) {

                switch (sortDirection) {
                case 'desc':
                    this.paramsInner[field] = this.paramsInner[field].reverse() 
                    // this.paramsInner[field] = this.paramsInner[field].sort((a, b) => {
                    //     return ((b['date_start']).format('DD.MM.YYYY') - moment(a['date_start']).format('MM.YYYY'));
                    // })
                    break;

                case 'asc':
                    this.paramsInner[field] = this.paramsInner[field].reverse() 
                    // this.paramsInner[field] = this.paramsInner[field].sort((a, b) => {
                    //     return (moment(a['date_start']).format('DD.MM.YYYY') - moment(b['date_start']).format('DD.MM.YYYY'));
                    // })
                    break;

                case 'none':
                    this.paramsInner[field] = this.paramsInner[field].sort(() => {
                        return 0.5 - Math.random();
                    })
                    break;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
  .d-data__col {
    text-align: center;
  }
</style>