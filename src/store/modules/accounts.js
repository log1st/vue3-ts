import { URL as APIURL } from '@/settings/config';
import qs from 'qs';
import cloneDeep from 'lodash/cloneDeep';

export default {
    state: () => ({
        accounts: []
    }),
    mutations: {
        setAllAccounts (state, payload) {
            state.accounts = Object.values(payload).map(i => { i.checked = false; return i });
           
        },
        checkAccount(state, index) {
            // const findedIndex = state.accounts.findIndex(a => a.number === index);
            const cloned = cloneDeep(state.accounts[index]);
            cloned.checked = !cloned.checked;
            state.accounts.splice(index, 1, cloned);
        }
    },
    actions: {
        /**
         * Получить все счета
         * @param {*} param0 
         * @description НЕИСПОЛЬЗУЕТСЯ устаревшая функция
         */
        getAllAccounts ({ commit, getters }) {
                    // commit('setAllAccounts', result);
        },
        /**
         * Создать счет
         * @param {*} param0 
         */
        createAccount ({ commit, getters }, payload) {
            const { Amount, TypePayment, Comments } = payload;
            const data = qs.stringify({
                Comand: 'AddInvoice',
                Email: getters.user.Email,
                Phone: getters.user.Phone,
                Password: getters.user.token,
                Amount: Amount,
                TypePayment: TypePayment,
                Comments: Comments,
                SoccetEnd: 1
            });
            return axios({
                method: 'post',
                url: APIURL,
                data: data
            }).then(res => {
                const result = res.data[1].return.Result;
                if (result) {
                    commit('setAllAccounts', result);
                }
            }).catch(e => {
                console.error(e)
            }).finally(() => {
                //
            });
        },

    },
    getters: {
        accounts(state) { 
            return cloneDeep(state.accounts).map((a, index) => {
                return {
                    checked: a.checked,
                    number: index,
                    id: index + 1, // добавляем id для списка в таблице 
                    date: a.Date,
                    // summ: a.Amount.replace(/\./g, ','), 
                    summ: a.Amount, 
                    use: a.StatusPuy,
                    pays: a.AmountPayment,
                    datePays: a.DatePayment,
                    actions: 'Действия'
                }
            });
        },
        transactions(state) {
            return cloneDeep(state.accounts).filter(a => { 
                return a.StatusPuy === "True"
            }).map((t, index) => {
                return {
                    number: index,
                    _id: index,
                    checked: t.checked,
                    date: t.Date,
                    summ: t.Amount,
                    type: 'Прямая',
                    coments: 'Комментарии',
                    act: 'Акт оказанных услуг'
                }
            }) 
        },
        checkedAccounts: state => state.accounts.filter(a => a.checked),
    }
}
