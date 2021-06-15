import { months } from 'moment';
import Vue from 'vue';

Vue.mixin({
    methods: {
        /**
         * Заменяем символ "=" на "*" перед заливокой файлов на бэк  
         * @param {String} - файл в base64 формате
         */
        prepareBase64(str) {
            return str.replace(/=/g, "*");
        },
        /**
         * Заменяет символ "*" на "=" после скачивания файла с api
         * @param {String} - файл в base64 формате 
         */
        inversePrepareBase64(str) {
            return str.replace(/\*/g, "=");
        },
        /**
         * Читает содержимое файлов
         * @param {File} file 
         * @return {Promise}
         */
        toBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            })
        },
        twoSimbols(str) {
            str = '0' + str
            return str.slice(-2)
        },
        getCookie (cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
          }
    },
    data() {
        return {
            months: [{
                title: 'Январь',
                index: 1
            }, 
            {
                title: 'Февраль',
                index: 2
            },
            {
                title: 'Март',
                index: 3 
            },
            {
                title: 'Апрель',
                index: 4
            },
            {
                title: 'Май',
                index: 5
            },
            {
                title: 'Июнь',
                index: 6
            },
            {
                title: 'Июль',
                index: 7 
            },
            {
                title: 'Август',
                index: 8 
            },
            {
                title: 'Сентябрь',
                index: 9 
            },
            {
                title: 'Октябрь',
                index: 10
            },
            {
                title: 'Ноябрь',
                index: 11 
            },
            {
                title: 'Декабрь',
                index: 12
            }]
        }
    }
})