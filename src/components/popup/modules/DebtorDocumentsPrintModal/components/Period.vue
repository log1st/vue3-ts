<template>
  <div class="p-2">
    <p class="my-2 block-text block-text--title">Выбор периода расчета</p>
        
    <div class="mb-2 d-flex align-items-center">
      <ur-checkbox
          :checked="allPeriod"
          @change="togglePeriod()"
      />
      <span class="ml-2 block-text">за весь период</span>
    </div>

    <div class="mt-2 row no-gutters">
      <div class="col-1 d-flex align-items-center justify-content-center">
        <span class="block-text">от:</span>
      </div>
      <div class="col-5 d-flex align-items-center">
        <v-select 
          :disabled="allPeriod"
          :options="months"
          v-model="dateMonthStart"
          label="title"
          :reduce="month => month.index"
          :clearable="false"
          style="width: 60%"
          class="px-1"
        >
          <template v-slot:option="option">
            <span class="print-modal-date-option">{{ option.title }}</span>
          </template>
        </v-select>
        <v-select 
          :disabled="allPeriod"
          :options="years"
          v-model="dateYearStart"
          :clearable="false"
          style="width: 40%"
          class="px-1"
        >
          <template v-slot:option="option">
            <span class="print-modal-date-option">{{ option.label }}</span>
          </template>
        </v-select>
      </div>
      <div class="col-1 d-flex align-items-center justify-content-center">
        <span class="block-text">до:</span>
      </div>
      <div class="col-5 d-flex align-items-center">
        <v-select 
          :disabled="allPeriod"
          :options="months"
          v-model="dateMonthEnd"
          label="title"
          :reduce="month => month.index"
          :clearable="false"
          style="width: 60%"
          class="px-2"
        >
          <template v-slot:option="option">
            <span class="print-modal-date-option">{{ option.title }}</span>
          </template>
        </v-select>
        <v-select 
          :disabled="allPeriod"
          :options="years"
          v-model="dateYearEnd"
          :clearable="false"
          style="width: 40%"
          class="px-2"
        >
          <template v-slot:option="option">
            <span class="print-modal-date-option">{{ option.label }}</span>
          </template>
        </v-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
   data() {
      return {
        // месяц начала
        dateMonthStart: null,
        // месяц конца
        dateMonthEnd: null,
        // год начала
        dateYearStart: null,
        // год окончания
        dateYearEnd: null,
        // весь период
        allPeriod: true,
        // годы
        years: [2018, 2019, 2020]
      }
    },
    methods: {
      /**
       * Выбрать весь период расчета
       */
      togglePeriod() {
        this.allPeriod = !this.allPeriod;
      },
      formatMonth(month) {
        return month >= 10 ? month : '0' + month
      },
      /**
       * Отправить данные на расчет пени
       */
      makeCalculations () {
        let date = new Date();
        const dateStop = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        const dateFiltrStart = this.dateYearStart + '.' + this.formatMonth(this.dateMonthStart) + '.'; // 2017.03.
        const dateFiltrStop = this.dateYearEnd + '.' + this.formatMonth(this.dateMonthEnd) + '.'; // 2017.05.
        return this.$http({
          data: {
            command: 'JudicialPractice2',
            fileType: 'csv1',
            dateStop: dateStop,
            dateFiltrStart: dateFiltrStart,
            dateFiltrStop: dateFiltrStop, 
          }
        });
      }
    },
    computed: {
      /**
       * Период не пустой
       */
      periodIsNotEmpty() {
        switch(true) {
          case this.allPeriod: 
            return true
          case !this.allPeriod:
            return Boolean(this.dateMonthStart && 
                   this.dateMonthEnd &&
                   this.dateYearStart &&
                   this.dateYearEnd) || false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .block-text {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: #5e6476;

    &--title {
      font-size: 16px;
    }
  }
</style>

