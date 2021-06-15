import Vue    from 'vue';
import moment from 'moment';

/**
 * Фильтр для даты в шаблонах
 * @param {String | Date} - на вход строки "14.07.2020 21:53" или "2020-06-05 T17:10:43.104Z"
 * @returns {String} - на выходе 'DD.MM.YYYY HH:mm'
 */
Vue.filter('formatDate', (value) => {
    if (!value) return ''
    if(value instanceof Date) {
      return moment(value).format('DD.MM.YYYY HH:mm');
    }
    if(!value.includes('-')) return value
    return moment(value).format('DD.MM.YYYY HH:mm');
});

/**
 * Фильтр для даты в шаблонах
 * @param {String} - на вход строка timestamp
 * @returns {String} - на выходе 'DD.MM.YYYY HH:mm'
 */
Vue.filter('formatTimeStamp', value => {
    if(!value) return value
    return  moment(value * 1000).format('DD.MM.YYYY HH:mm');
});
   

    