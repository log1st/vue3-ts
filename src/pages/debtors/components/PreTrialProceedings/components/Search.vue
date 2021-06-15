<template>
  <transition name="fade">
    <div v-show="value" class="table__search">
      <div class="table__search-inputs" :key="counterUpdate">
        
        <div class="table__search-input">
          <search-input
            :params="{ placeholder: 'ФИО' }"
            @changeInputValue="changeInputsValue({ e: $event, key: 'FIOFilter'})"
          />
        </div>

        <div class="table__search-input">
          <chips-input @change="changeInputsValue({ e: $event, key: 'NumberFilter'})" placeholder="ЛС" />
        </div>

        <div class="table__search-input">
          <search-input
            :params="{ placeholder: 'Любой статус', isSelect: true, items: ['Новый', 'Подано в суд', 'Вынесено решение', 'В работе'] }"
            @changeInputValue="changeInputsValue({ e: $event, key: 'StatusFilter'})"
          />
        </div>

        <div class="table__search-input">
          <search-input
            :params="{ placeholder: 'Сумма долга от', onlynumber: true }"
            @changeInputValue="changeInputsValue({ e: $event, key: 'DebtFromFilter'})"
          />
          <search-input
            :params="{ placeholder: 'Сумма долга до', onlynumber: true }"
            @changeInputValue="changeInputsValue({ e: $event, key: 'DebtToFilter'})"
          />
        </div>

        <div class="table__search-input">
          <search-input
            :params="{ placeholder: 'Адрес' }"
            @changeInputValue="changeInputsValue({ e: $event, key: 'AddressFilter'})"
          />
        </div>

        <div class="table__search-input">
          <search-input
            :params="{ placeholder: 'Рейтинг от', isSelect: true, items: [0, 1, 2, 3, 4, 5] }"
            @changeInputValue="changeInputsValue({ e: $event, key: 'ReitingFromFilter'})"
          />
          <search-input
            :params="{ placeholder: 'Рейтинг до', isSelect: true, items: [0, 1, 2, 3, 4, 5] }"
            @changeInputValue="changeInputsValue({ e: $event, key: 'ReitingToFilter'})"
          />
        </div>

        <div class="table__search-input-cols-2">
          <search-input
            :params="{ placeholder: 'Любой номер приложения', isSelect: true, items: applicationListComputed }"
            @changeInputValue="setApplictaionFilter({ e: $event, key: 'Application'})"
          />
          <search-input
            :params="{ placeholder: 'Статус выписки ЕГРН', isSelect: true, items: egrnStatuses }"
          />
        </div>

      </div>
      <div class="table__search-buttons">
        <div class="btn btn-primary" @click="searchHandler">Найти</div>
        <div class="btn btn-white" @click="clearSearch">Сбросить</div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import cloneDeep from 'lodash/cloneDeep';

  export default {
    props: ['value'],
    data() {
      return {
        counterUpdate: 0,
        egrnStatuses: ['Заказана', 'Не заказана']
      }
    },
    computed: {
      ...mapGetters(['applicationList']),
      applicationListComputed() {
        return cloneDeep(this.applicationList).map((i, index) => {
          return `Приложение №${index + 1} ${i.CreationDate}`;
        })
      },

    },
    methods: {
      ...mapActions([
        'searchDebtors',
        'getDebtorsCourtProceedingsList',
        'setCurrentPage',
        'combinedRequests',
        'appLoadingChange'
      ]),
      ...mapMutations(['setSearchField', 'clearSearchFields', 'clearListDebtors', 'clearVisitedPages']),
      /**
       * Обработчик события change
       * @param e
       * @param key
       */
      changeInputsValue({ e, key }) {
        this.setSearchField({ key , value: e });
      },
      setApplictaionFilter({ e, key }) {
        const list = cloneDeep(this.applicationList).map((i, index) => {
          return { 
            title: `Приложение №${index} ${i.CreationDate}`,
            index: index
          }
        })
        const index = list.find(a => a.title === e).index;
        // debugger
        if(index === undefined) return
        // debugger
        // var extract = event.e.match(/№(.*)\ 20/)[1];
        // extract = parseInt(extract) - 1;
        this.changeInputsValue({ e: index, key: 'Application'});
      },
      /**
       * Поиск
       */
      searchHandler() {
        this.clearListDebtors();
        this.clearVisitedPages();
        this.searchDebtors();
      },
      async clearSearch () {
        this.clearListDebtors();
        this.clearVisitedPages();
        this.appLoadingChange(true);
        this.clearSearchFields();
        this.counterUpdate++
        await this.combinedRequests();
        this.setCurrentPage(1);
        this.getDebtorsCourtProceedingsList();
      }
    }
  }
</script>
