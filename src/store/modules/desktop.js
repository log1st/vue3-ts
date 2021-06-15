export default {
    state: () => ( {
        desktopWidgetCoords: []
    }),
    mutations: {
        // setAllAccounts (state, payload) {
        //     state.accounts = Object.values(payload).map(i => { i.checked = false; return i });
        // },
        setDesktopWidgetCoords (state, payload) {
            state.desktopWidgetCoords = payload
            // state.desktopWidgetCoords = payload.map(i => { i['i'] = i.id; return i})
        }
    },
    actions: {
        /**
         * Получить координаты виджетов рабочего стола
         * @param {*} param0 
         */
        getDesktopWidgetCoords ({ commit, getters }) {
            dispatch('appLoadingChange', true, { root: true });
            return $http({
                data: {
                    command: 'ListWidgetCoord',
                    OrganizationId: 0
                }
            }).then(res => {
                commit('setDesktopWidgetCoords', Object.values(res.result));
            }).catch(e => {
                console.error(e)
            }).finally(() => {
                dispatch('appLoadingChange', false, { root: true });
            });
        },
        /**
         * Редактировать координаты виджета
         * @param {*} param0 
         */
        editDesktopWidgetCoords (context, payload) {
            const { id, x, y, w, name, h } = payload;
            dispatch('appLoadingChange', true, { root: true });
            return $http({
                data: {
                    command: 'EditWidgetCoord',
                    OrganizationId: 0,
                    Id: id,   
                    X: x,
                    Y: y,
                    W: w,
                    Name: name,
                    H: h,
                    visible: 1
                }
            }).then(res => {
                if(res.edit === 'Complete') {
                }
            }).catch(e => {
                console.error(e)
            }).finally(() => {
                dispatch('appLoadingChange', false, { root: true });
            });
        },
        /**
         * Сохранить координаты слайдов рабочего стола
         * @param {*} param0 
         * @param {*} payload 
         */
        saveNewDesctopWidgetcoords ({ state, dispatch }, payload) {
            return Promise.all(payload.map(i => {
                return dispatch('editDesktopWidgetCoords', { id: i.id, x: i.x, y: i.y, w: i.w, name: i.name, h: i.h });
            }))
        }
    },
    getters: {
        desktopWidgetCoords: state => state.desktopWidgetCoords
    }
}
