<template>
  <div class="table">
    <!-- TABLE CONTROL PANEL -->
    <div class="table__control">
      <div class="table__nav">

        <!-- <div class="btn btn-icon" @click="toggleSearchPanel" v-if="searchPanel">
          <i class="material-icons" style="color: #848aa1" v-if="!searchPanelState">search</i>
          <i class="material-icons" style="color: #848aa1" v-else>close</i>
        </div> -->
        <slot name="controls"></slot>

        <!-- <div class="btn btn-icon" @click="toggleTableDisplaySettings">
          <icon-base width="12" height="17" iconColor="#848aa1"><icon-panel/></icon-base>
        </div> -->
        
      </div>
    </div>
    <!-- TABLE CONTROL PANEL END-->

    <!-- TABLE -->
    <div class="table__outer">
      <slot name="tableInner"></slot>
      <div class="table__inner">
        <!-- <baseScrollWrapper :height="scrollWrapperHeigth">-->
        <!-- @scroll="onScrollLoading()" -->
        <div class="table__inner-scroll"  ref="tablerows">
          <table cellspacing="0">
            <thead class="table__head">
              <th v-for="(item, index) in displayColumnsInner" :key="index" >
                <div class="table__head-cell">
                  <div v-if="item.key === 'checked'" style="position: absolute;
    right: 33px;
    font-size: 10px;
    width: 80px;">{{item.title}}</div>
                  <slot v-bind="item" :name="'head(' + item.key + ')'">
                    <span 
                      @click.stop="item.sortable ? sort(item) : null"
                      :class="{'table__head-cell--sort' : item.sortable }"
                    >
                      {{ item.title }}
                    </span>
                  </slot>
                  <div
                    class="table__head-sort"
                    :class="{'table__head-cell--sort' : item.sortable }" 
                    v-if="item.sortable" @click.stop="sort(item)">
                    <span class="mdi mdi-sort" v-if="item.sortDirection === 'none'"></span>
                    <span class="mdi mdi-sort-ascending" v-if="item.sortDirection === 'asc'"></span>
                    <span class="mdi mdi-sort-descending" v-if="item.sortDirection === 'desc'" ></span>
                  </div>
                </div>
              </th>
            </thead>

            <tbody class="table__body" ref="tbody" >
                <tr
                  v-for="(row, i) in displayRows"
                  class="table__row"
                  :key="'tblbdr' + i"
                  @contextmenu="$emit('contextmenu', { event: $event, i })"
                  @click="rowAction({ row, i })"
                >
                  <td v-for="(td, j) in displayColumnsInner" :key="j" :ref="`${td.key}`">
                    <slot v-bind="{ row, i }" :name="'cell(' + td.key + ')'">
                      <span>{{ row[td.key] }}</span>
                    </slot>
                  </td>
                </tr>
            </tbody>
          </table>
<!--        </baseScrollWrapper>-->
        </div>
        <!-- TABLE END -->

        <!-- TABLE FOOTER -->
        <div class="table__row-total">

          <div class="table__agregate">
            <table>
              <tbody class="table__body" ref="tbody">
              <tr style="background: transparent">
                <td v-for="(item, index) in displayColumnsInner" :key="index" :ref="`${item.key}Total`">
                  <span class="table__col-user table__col-total" v-if="index === 0">Итого:</span>
                  <span class="table__col-total-item" style="white-space: nowrap">
                    {{ debtorsData[item.key] | sepnum(2) }} {{ debtorsData[item.key] ? '₽' : '' }}
                   </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <slot name="footer"></slot>
        </div>
        <!-- TABLE FOOTER END-->
        <slot name="contextMenu"></slot>
      </div>
    </div>

    <div class="context-menu" :class="{'is-active' : contextMenuOpenFlag }" ref="contextMenu">
      <div class="context-menu__item" @click="checkedAll(); contextMenuOpenFlag = false">
        <span>Выбрать всех</span>
      </div>
      <div class="context-menu__item" @click="setNoChecked(); contextMenuOpenFlag = false">
        <span>Снять выделения</span>
      </div>
      <div class="context-menu__separator"></div>
      <div class="context-menu__item" :disabled="!checkedDebtorsCount.length" @click="$emit('printItem', currentOpen); contextMenuOpenFlag = false">
        <span>Печать</span>
      </div>
    </div>

    <!-- TABLE DISPLAY SETTINGS -->
    <transition name="fade">
      <display-settings
        v-model="tableDisplaySettings"
        :itemsPerPage="itemsPerPage"
        :columns="allColumns"
        v-on="$listeners"
      />
    </transition>
    <!-- TABLE DISPLAY SETTINGS END-->
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import tableControl from '@/components/elements/TableControl'
  import checkBox from '@/components/elements/CheckBox'
  import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
  import { debtorPaidColNames } from '@/settings/config.js';
  import cloneDeep from 'lodash/cloneDeep';
  import isEmpty from 'lodash/isEmpty';

  import DisplaySettings from './components/DisplaySettings';

  export default {
    name: 'ur-table',
    components: {
      'display-settings': DisplaySettings,
      tableControl, checkBox, baseScrollWrapper
    },
    props: {
      rowAction: {
        type: Function,
        default: () => {}
      },
      /**
       * Панель поиска по таблице
       */
      searchPanel: {
        type: Boolean,
        required: false,
        default: false
      },
      /**
       * Поля поиска по таблице
       */
      searchFormParams: {
        type: Array,
        required: false,
        default: () => {
          return []
        }
      },
      /**
       * Table columns
       */
      displayColumns: {
        type: Array,
        required: false,
        default: []
      },
      /**
       * Table rows
       */
      displayRows: {
        type: Array,
        required: false,
        default: []
      },
      /**
       * Колонки без форматирования
       */
      allColumns: {
        type: Array
      },
      /**
       * Количество элементов на странице
       */
      itemsPerPage: {
        type: [ Number, String ]
      },
      debtorPaidColNames: {
        type: [ Array ]
      }
    },
    watch: {
      displayColumns: {
        immediate: true,
        deep: true,
        handler(val) {
          // console.log(val);
          const items = cloneDeep(this.displayColumns);
          items.forEach(i => i.sortDirection = this.sortDirections[0])
          this.displayColumnsInner = items
        }
      },
      displayRows: {
        deep: true,
        handler(val) {
          // console.log(val);
          this.$nextTick(()=> {
            this.setTotalTableSizes();
          })
        }
      }
    },
    data () {
      return {
        // TABLE CONTROL PANEL
        tableDisplaySettings: false, // флаг панели настроки отображения таблицы
        searchPanelState:     false, // флаг панели поиска
        sortDirections: ['none', 'asc', 'desc'],

        displayColumnsInner: [],

        colNames: debtorPaidColNames,
        scrollPercent: 0,
        hasScroll: false,
        updateContent: 0,
        controlSearchOpen: false,
        contextMenuOpenFlag: false,
        currentOpen: null,
        timerId: null,
        showTableHead: false,
        colspan: 5,
        progress: 0,
        letsScroll: true
      }
    },
    mounted () {
      events.$on("table_display_settings", status => {
          this.tableDisplaySettings = status
      })
      // this.getListFamilyRelations();
      events.$on('reActiveSort', (data) => {
        console.log(data)
        if (data != null) { this.sort(data) } 
      })
      this.setTotalTableSizes();
    },
    methods: {
      ...mapActions([
        'setCurrentPage',
        'setPopupComponent',
        'setPopupState',
        'setNoChecked',
        'checkedAll',
        'setListDebtors',
        // 'setAllSumsDebtors',
        'getDebtorsTableColumns',
        'getListFamilyRelations',
        'renderingCourtProceedingsListScrolled',
        'sortData' 
      ]),
      onScrollLoading () {
        const progress = this.$refs.tablerows.scrollTop / (this.$refs.tablerows.scrollHeight - this.$refs.tablerows.clientHeight);
        let percent = 0;
          this.progress = progress
          percent = Math.round(this.progress * 100)
          this.progress = percent
        
         if (this.progress == 60 && this.letsScroll != false) {
           this.letsScroll = false
         } else {
           this.letsScroll = true
         }
        let onLoad = (this.$refs.tablerows.scrollTop / 100) * 50

         if (this.displayRows.length != this.itemsPerPage) {
          if (this.letsScroll == false && this.progress == 60) {
             this.renderingCourtProceedingsListScrolled(this.progress)
             let mathHeight = (this.$refs.tablerows.scrollTop / 100) * 95
             this.$refs.tablerows.scrollTop = mathHeight
          }    
         } 

      },
      setTotalTableSizes() {
        if(!isEmpty(this.$refs)) {
          this.displayColumnsInner.forEach(item => {
            if (this.$refs[item.key] && this.$refs[item.key][0]) {
              // this.$refs[item.key][0].style.minWidth = '100px';
              const width = this.$refs[item.key][0].offsetWidth;
              this.$refs[item.key + 'Total'][0].style.width = width + 'px';
            }
          })
        }
      },
      
      /**
       * Открыть/закрыть панель поиска по таблице
       */
      toggleSearchPanel() {
        this.searchPanelState = !this.searchPanelState;
      },
      sort(e) {
        // console.log(e)
        const index = this.sortDirections.findIndex(i => i === e.sortDirection);
        const item = this.displayColumnsInner.find(i => i.key === e.key);
        item.sortDirection = index === 2 ? this.sortDirections[0] : this.sortDirections[index + 1];
        this.sortData(e)
        this.$emit('sort', { key: e.key, sortDirection: e.sortDirection });
      },
      /**
       * Search button handler
       */
      searchHandler () {
        this.$emit('search');
      },
      /**
       * Очистить поиск
       */
      clearSearch () {
        //
        debugger
      },
      /**
       *
       * @param event
       * @param i
       * @param j
       */
      changeInputsValue (event, i, j) {
        // this.result[i][j] = event

      },
      /**
       * Снять выделение
       */
      setNoChecked () {
        debugger
      },

      calcColWidth () {
        let colspan = this.getDisplayColumns.length
        this.getDisplayColumns.forEach(({ name, views }) => {
          if (!views.current) {
            colspan--
            return false
          }
          if (name !== 'checked') {
            const colWhidth = this.$refs['td' + name][0].offsetWidth + 'px'
            if (this.$refs['thead' + name]) this.$refs['thead' + name][0].style = 'width: ' + colWhidth
            if (this.$refs['td' + name]) this.$refs['td' + name][0].style = 'width: ' + colWhidth
            if (this.$refs['tdfooter' + name]) this.$refs['tdfooter' + name][0].style = 'width: ' + colWhidth
          }
          if (this.colNames.some(el => el === name)) colspan--
        })
        this.showTableHead = true
        this.colspan = colspan
      },
      calcAfterFetchPage () {
        this.timerId = setInterval(() => {
          if (this.getDebtors.length > 0) {
            // this.calcColWidth()
            clearTimeout(this.timerId)
            this.timerId = null
          }
        }, 200)
      },
      checkDebtor () {
        if (this.debtIsChecked === this.allDebtors) {
          this.setNoChecked()
        } else {
          this.checkedAll()
        }
        this.calcAfterFetchPage()
      },
      contextMenuOpen (i, event) { // контекстное меню
        event.preventDefault()
        this.currentOpen = i
        this.$refs.contextMenu.style.left = event.clientX + 'px'
        this.$refs.contextMenu.style.top = event.clientY + 'px'
        this.contextMenuOpenFlag = true
        const _this = this
      if (typeof document !== 'undefined') {
        document.addEventListener('click', function setEventListener (e) {
          if (e.target.parentNode && e.target.parentNode.classList[0] !== 'context-menu__item') {
            _this.contextMenuOpenFlag = false
            document.removeEventListener('click', _this.setEventListener)
          }
        })
      }
      }
    },
    computed: {
      ...mapGetters([
        'pages',
        'getDebtors',
        'checkedDebtorsCount', // выделенные элементы таблицы
        'getDisplayColumns',
        'getDisplayColumnSum',
        'getStatusesDebtors',
        'getDebtorsData',
        'allDebtors', //
        'getDebtorsInPage',
        'debtorsData'
      ]),
      scrollWrapperHeigth () {
        if (typeof document !== 'undefined') {
          return (document.documentElement.clientHeight - 375) + 'px'
        }
      },
      allItems () {
        // todo
        return 100
      },
      checkedItems () {
        return 2
      },
      scrollLoading () {
        // TODO: отслеживать загрузку элементов
      },
      scrollWrapperHeigth () {
        if (typeof document !== 'undefined') {
          return (document.documentElement.clientHeight - 375) + 'px'
        }
      }
    }
  }
</script>
