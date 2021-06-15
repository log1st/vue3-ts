const setSimbols = (str, delta = 2) => {
  if (str.toString().length >= delta) return str
  else {
    str = '0000000000' + str
    return str.slice(-delta)
  }
}

export default {
  state: () => ( {
    nextId: 34,
    ListOfJudicialDistricts: []
  }),
  mutations: {
    clearCourts (state) {
      state.ListOfJudicialDistricts = []
    },
    setCourtsFilterData (state, payload) {
      state.ListOfJudicialDistricts.forEach(court => {
        payload.every(cols => cols.data === '' ? true : (!court[cols.key] ? false : court[cols.key].toString().toLowerCase().includes(cols.data.toLowerCase())))
          ? court.done = true
          : court.done = false
      })
    },
    editJudicialDistricts (state, dataCourt) {
      const ind = state.ListOfJudicialDistricts.findIndex(el => el._id === dataCourt._id)
      for (const key in dataCourt) {
        state.ListOfJudicialDistricts[ind][key] = dataCourt[key]
      }
    },
    saveNewCourt (state, { arr }) {
      const newCourt = { done: true, _id: setSimbols(state.nextId, 3) }
      arr.forEach(el => {
        newCourt[el.key] = el.value ? el.value : '—'
      })
      const index = state.ListOfJudicialDistricts.length
      state.ListOfJudicialDistricts.splice(index, 1, newCourt)
      state.nextId++
    },
    setListOfJudicialDistricts (state, payload) {
      state.ListOfJudicialDistricts = []
      let id = 1
      for (const key in payload) {
        const newObj = {
          NameOfPayee: '',
          BIK: '',
          PayeeAccountNumber: '',
          INN: '',
          KPP: '',
          OKTMO: '',
          NameOfBank: '',
          KBK: '',
          done: true,
          _id: setSimbols(id, 3)
        }
        state.ListOfJudicialDistricts.push(Object.assign(newObj, payload[key]))
        id++
      }
      state.nextId = id
    }
  },
  actions: {
    clearCourts ({ commit }) {
      commit('clearCourts')
    },
    setCourtsFilterData ({ commit }, payload) {
      commit('setCourtsFilterData', payload)
    },
    /**
     * Редактировать судебный участкок
     * @param {*} param0 
     * @param {*} param1 
     */
    editJudicialDistricts ({ commit, getters }, { id, dataCourt }) {
      return $http({
        data: {
          command: 'EditJudicialDistricts',
          ...dataCourt,
          OrganizationId: 0
        }
      }).then(res => {
        if (res.edit === 'Complete') {
          commit('editJudicialDistricts', dataCourt)
        }
      }).catch(err => {
        console.error(err);
      })
    },
    saveNewCourt ({ commit }, payload) {
      commit('saveNewCourt', payload)
    },
    // TODO: use $http instead of axios
    // setListOfJudicialDistricts ({ commit, getters, dispatch }) {
    //   //dispatch('appLoadingChange', true)
    //   const data = qs.stringify({
    //     Comand: 'ListOfJudicialDistricts',
    //     Email: getters.user.Email,
    //     Phone: getters.user.Phone,
    //     Password: getters.user.token,
    //     OrganizationId: 0,
    //     SoccetEnd: 1
    //   })
    //   return new Promise((resolve, reject) => {
    //     axios.post(URL, data)
    //       .then(resp => {
    //         // console.log('ListOfJudicialDistricts respons', resp)
    //         if (resp.data[1].return.Result) {
    //           commit('setListOfJudicialDistricts', resp.data[1].return.Result)
    //           //dispatch('appLoadingChange', false)
    //           resolve()
    //         } else {
    //           reject(resp.data[0].Error)
    //         }
    //       }).catch(err => {
    //         reject(err)
    //       })
    //   })
    // }
  },
  getters: {
    getListOfJudicialDistrictsLength: state => state.ListOfJudicialDistricts.length,
    getCourts: state => state.ListOfJudicialDistricts.filter(el => el.done),
    getCourt: state => id => state.ListOfJudicialDistricts.find(el => el._id === id),
    getCourtNextId: state => state.nextId
  }
}
