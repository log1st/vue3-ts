export default {
  state: () => ( {
    userInn: null
  }),
  mutations: {
    infoInn (state, payload) {
      state.userInn = payload
    },
    allFiles (state, payload) {
      console.log(payload)
    },
    addFiles (state, payload) {
      //
    }
  },
  actions: {
    /**
     * Ставка рефинансирования
     * @param {*} param0 
     */
    refinance (context) {
        $http({
          data: {
            command: 'Refinance'
          }
        }).then(res => {
          console.log(res.result)
          // if (res.Login === 'True') {
          //   const token = res.Token
          //   localStorage.setItem('token', token)
          //   commit('auth_success', token)
          //   resolve(res)
          // } else {
          //   localStorage.removeItem('token')
          //   reject(res)
          // }
        }).catch(err => {
          console.error(err)
        })
    },
    /**
     * Инфо ИНН общая информация
     * @param {*} param0 
     */
    infoInn ({ commit, getters, dispatch }) {
      return $http({
        data: {
          command: 'InfoInn',
          OrganizationFullInformation: 1,
          OrganizationId: 0
        }
      }).then(res => {
        //
      }).catch((err) => {
        //
      })
    },
    /**
     * Список всех файлов (Документооборот задолжников)
     * @param {*} param0 
     */
    allFiles ({ commit }) {
      $http({
        data: {
          command: 'AllFile',
          OrganizationId: 0
        }
      }).then(res => {
        if (res.allFile) {
          commit('allFiles', res.allFile);
        }
      }).catch(err => {
        console.error(err)
      })
    },
    /**
     * Добавить файл
     * @param {*} param0 
     * @param {*} param1 
     */
    addFile ({ commit }, { FileName, File }) {
      $http({
        data: {
          command: 'AddFile',
          FileName: FileName,
          File: File,
          OrganizationId: 0
        }
      }).then(res => {
        if (res.allFile) {
          commit('addFile', resp.data[1].return.AllFile)
        } 
      }).catch(err => {
        console.error(err)
      })
    }
  },
}
