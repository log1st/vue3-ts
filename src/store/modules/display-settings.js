// настройки отображения
export default {
  state: () => ( {
    debtorsTableColumnsLoader: false,
    displaySettingsEdit: false,
    displayColumns: [
      // current: отображаемый столбец, view: в списке показываемых, но еще не нажата "применить", default: по умолчанию, select: выделен
      [
        { name: 'checked', alias: 'Выбор', views: { current: true, fixed: true } },
        { name: 'RashSchet', alias: '№ ЛС', views: { current: true, fixed: true } },
        { name: 'FIO', alias: 'ФИО', views: { current: true, view: true, default: true, select: false } },
        { name: 'address', alias: 'Адрес', views: { current: true, view: true, default: true, select: false } },
        { name: 'Status', alias: 'Статус', views: { current: true, view: true, default: true, select: false } },
        { name: 'accrued', alias: 'Начислено', isSorted: true, views: { current: true, view: true, default: true, select: false } },
        { name: 'paid', alias: 'Оплачено', isSorted: true, views: { current: true, view: true, default: true, select: false } },
        { name: 'Indebtedness', alias: 'Задолженность', isSorted: true, views: { current: true, view: true, default: true, select: false } },
        { name: 'Peni', alias: 'Пеня', isSorted: true, views: { current: true, view: true, default: true, select: false } }
      ],
      [
        { serverName: 'FrostbiteChoice',   name: 'checked',    alias: 'Выбор',         views: { current: true, view: false, fixed: true } },
        { serverName: 'FrostbiteNumberLs', name: 'RashSchet',  alias: '№ ЛС',          views: { current: true, view: false, fixed: true }, width: '90px' },
        // { name: 'bussines', alias: '№ Дела', views: { current: false, view: false, default: true, select: false } },
        { serverName: 'FrostbiteFio',      name: 'FIO',        alias: 'ФИО',           views: { current: true, view: true, default: true, select: false }, width: '240px' },
        { serverName: 'FrostbiteAddress',  name: 'Adres',      alias: 'Адрес',         views: { current: true, view: true, default: true, select: false }, width: '180px' }, // Adres - эта дичь не моя, это такое апи
        { serverName: 'FrostbiteStaus',    name: 'Status',     alias: 'Статус',        views: { current: true, view: true, default: true, select: false }, width: '100px' },
        { serverName: 'FrostbiteAccrued',  name: 'AccruedCsv', alias: 'Начислено',     views: { current: true, view: true, default: true, select: false }, width: '100px', isSum: true, type: 'all' },
        { serverName: 'FrostbitePaid',     name: 'PaidCsv',    alias: 'Оплачено',      views: { current: true, view: true, default: true, select: false }, width: '100px', isSum: true, type: 'all' },
        { serverName: 'FrostbiteDebt',     name: 'TotalDebt',  alias: 'Задолженность', views: { current: true, view: true, default: true, select: false }, width: '100px', isSum: true, type: 'all' },
        { serverName: 'FrostbitePenalty',  name: 'PeniCsv',    alias: 'Пеня',          views: { current: true, view: true, default: true, select: false }, width: '100px', isSum: true, type: 'all' },
        { serverName: 'FrostbiteDuty',     name: 'StateDuty',  alias: 'Пошлина',       views: { current: true, view: true, default: true, select: false }, width: '100px', isSum: true, type: 'judicial' }
      ],
      [
        { name: 'checked', alias: 'Выбор', views: { current: true, fixed: true } },
        { name: 'RashSchet', alias: '№ ЛС', views: { current: true, fixed: true } },
        { name: 'bussines', alias: '№ Дела', views: { current: false, view: false, default: true, select: false } },
        { name: 'FIO', alias: 'ФИО', views: { current: true, view: true, default: true, select: false } },
        { name: 'address', alias: 'Адрес', views: { current: true, view: true, default: true, select: false } },
        { name: 'Status', alias: 'Статус', views: { current: true, view: true, default: true, select: false } },
        { name: 'accrued', alias: 'Начислено', views: { current: true, view: true, default: true, select: false } },
        { name: 'collected', alias: 'Взысканная сумма', views: { current: true, view: true, default: true, select: false } }
      ]
    ]
  }),
  mutations: {
    // открыто / закрыто окно редактирования настроек отображения
    setDisplaySettingsEdit (state, payload) {
      state.displaySettingsEdit = payload
    },
    // выделить / снять выделение
    setPicOut (state, { active, name }) {
      const elem = state.displayColumns[active].find(el => el.name === name)
      elem.views.select = !elem.views.select
    },
    // установить параметры отображения по дефолту
    setDefaultParams (state, active) {
      // console.log('setDefaultParams', active)
      state.displayColumns[active].forEach(el => {
        if (!el.views.fixed) {
          el.views.current = el.views.default;
          el.views.view = el.views.current;
          el.views.select = false
        }
      })
    },
    // переместить выделенные колонки в противополжную группу
    setViewCols (state, active) {
      state.displayColumns[active].forEach(el => {
        if (el.views.select) {
          el.views.view = !el.views.view
          el.views.select = false
        }
      })
    },
    // установить параметры в соотвю с выбранным
    setNewParams (state, { active }) {
      state.displayColumns[active].forEach(el => {
        if (!el.views.fixed) {
          el.views.current = el.views.view
          el.views.select = false
        }
      })
    },
    // сбросить все изменения
    deleteNewParams (state, active) {
      state.displayColumns[active].forEach(el => {
        if (!el.views.fixed) {
          el.views.view = el.views.current
          el.views.select = false
        }
      })
    },
    // перетащить одно свойство
    moveListItem (state, { active, name }) {
      const el = state.displayColumns[active].find(item => item.name === name);
      el.views.view = !el.views.view;
      el.views.select = false;
    },
    // установить свойство элементу
    setItemView (state, payload) {
      const { active, name, view } = payload;
      const item = state.displayColumns[active].find(i => i.serverName === name);
      if (item && !item.views.fixed) {
        item.views.view = view;
        item.views.current = view;
      }
    },

    setDebtorsTableColumnsLoader (state, data) {
      state.debtorsTableColumnsLoader = data;
    }
  },
  actions: {
    setDisplaySettingsEdit ({ commit }, payload) {
      commit('setDisplaySettingsEdit', payload)
    },
    setPicOut ({ commit, getters }, payload) {
      commit('setPicOut', { active: getters.debtorsModuleActive, name: payload })
    },
    setDefaultParams ({ dispatch, commit, getters }) {
      dispatch('setDebtorsInPage', getters.getDebtorsInPageDefault)
      commit('setDefaultParams', getters.debtorsModuleActive)
      commit('setDisplaySettingsEdit', false)
    },
    setViewCols ({ commit, getters }) {
      commit('setViewCols', getters.debtorsModuleActive)
    },
    /**
     * Изменить статусы отображения
     * @param {*} param0 
     * @param {*} payload 
     */
    setNewParams ({ state, commit, getters, dispatch }, payload) {
      commit('setDebtorsTableColumnsLoader', true);
      dispatch('setDebtorsInPage', payload);
      const statuses = {};
      state.displayColumns[1].forEach(column => {
        statuses[column.serverName] = +column.views.view;
      });
      // dispatch('appLoadingChange', true, { root: true });
      $http({
        data: {
          command: 'ChekcStatusesFrostbiteSettings',
          EntriesPage: payload,
          ...statuses
        }
      }).then(res => {
        commit('setNewParams', { active: getters.debtorsModuleActive });
        commit('setDisplaySettingsEdit', false);
        // dispatch('setPopupState', false);
      }).catch(e => {
        console.error('ошибка запроса колонок таблоицы', e);
      }).finally(() => {
        // dispatch('appLoadingChange', false, { root: true })
        commit('setDebtorsTableColumnsLoader', false);
      })
    },
    deleteNewParams ({ commit, getters }) {
      commit('deleteNewParams', getters.debtorsModuleActive)
    },
    /**
     * Перенести елемент (добавить в какой-либо блок draggable)
     * @param commit
     * @param getters
     * @param name
     */
    moveListItem ({ commit, getters }, name) {
      commit('moveListItem', { active: getters.debtorsModuleActive, name })
    },


  },

  getters: {
    getRecordsPerPage: state => state.recordsPerPage,
    getDisplayColumnSum: state => state.displayColumns[1].filter(item => item.isSum),
    // getDisplayColumns: (state, getters) => state.displayColumns[getters.debtorsModuleActive],
    /**
     * Получение колонок таблицы должников
     * @param state
     * @returns
     */
    getDisplayColumns (state) {
      return state.displayColumns[1]
    },
    getDisplaySettingsEdit: state => state.displaySettingsEdit,

    debtorsTableColumnsLoader: state => state.debtorsTableColumnsLoader
  }
}
