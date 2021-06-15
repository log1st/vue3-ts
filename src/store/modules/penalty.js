import { baseURL } from '@/settings/config.js'

export default {
    state: () => ( {
        penalty: {
            Debt: 73,
            JudicialPractice: { // статусы
                AllAccruedCsv: 0,
                AllPaidCsv: 0,
                AllPeniCsv: 0,
                AllStateDuty: 0,
                AllTotalDebt: 0,
                StatusDecisionMade: 0,
                StatusFiledCourt: 0,
                StatusInWork: 0,
                StatusNew: 0,
                StatusPreTrialSettlement: 0,
                StatusRevoked: 0
            },
            Result: "100"
        },
        
    }),
    mutations: {
        setPenalty (state, payload) {
            state.penalty = payload
        },

        parseStatusToSet (state, payload) {
            const status = payload
            // console.log(status)
            state.penalty.JudicialPractice.StatusNew = status['Новый'] ? status['Новый'] : 0
            state.penalty.JudicialPractice.StatusInWork = status['В работе'] ? status['В работе'] : 0
        }
    },
    actions: {
        /**
         * Статус расчета пени %
         * @param {*} param0 
         * @param {*} payload 
         */
        getStatusCalculationPeni ({ commit }, payload) {
            return $http({
                data: {
                    command: 'StatusCalculationPeni',
                    OrganizationId: 0
                }
            }).then(res => {
                commit('setPenalty', res);
            }).catch(e => {
                console.log('error', e)
            })
        },
        /**
         * Получаем кол-во всех активных статусов у должников 
         * @param {commit} commit 
         */
        getStatusOnHeader ({ dispatch, commit }) {
            let companyId = localStorage.getItem('defaultCompany')
            let token = localStorage.getItem('token')
            if (token !== '') {
                axios.defaults.headers.common["X-Auth-Token"] = token
            } else {
                delete axios.defaults.headers.common["X-Auth-Token"]
            }

            axios({
                url: baseURL + '/api/debtor_cards/',
                method: 'GET',
                params: {
                    status: 'xxx',
                    id: companyId
                }
            })
            .then( res => {
                commit('parseStatusToSet', res.data)
            })
            .catch ( err => {
                if ( err.response.status === 403) {
                    dispatch('logout')
                } 
            })
        }
    },
    getters: {
        judicialPractice: state => state.penalty.JudicialPractice,
        judicialPracticeHeader (state) {
            const items = [
                {
                  title: 'Вынесено решение',
                  key: 'StatusDecisionMade',
                  count: 0,
                  show: true
                },
                {
                  title: 'Подано в суд',
                  key: 'StatusFiledCourt',
                  count: 0,
                  show: true
                },
                {
                  title: 'В работе',
                  key: 'StatusInWork',
                  count: 0,
                  show: true
                },
                {
                  title: 'Новый',
                  key: 'StatusNew',
                  count: 0,
                  show: true
                },
                {
                  title: 'Досудебное урегулирование',
                  key: 'StatusPreTrialSettlement',
                  count: 0,
                  show: false
                },
                {
                  title: 'Отозвано',
                  key: 'StatusRevoked',
                  count: 0,
                  show: true
                }
            ];

            for(const key in state.penalty.JudicialPractice) {
                const item = items.find(i => i.key === key);
                if(item) {
                  item.count = state.penalty.JudicialPractice[key]
                }
            };
            return items;
        }
    }
}
  