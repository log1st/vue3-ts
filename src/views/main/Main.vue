<template>
  <div class="main">
    <div class="main__head mb-20">
      <div class="main__head-title mt-6">Моя организация</div>
    </div>
    <div class="main__content">
      <div class="btn btn-primary" @click="$store.dispatch('allFiles')">allFiles</div>
      <br>
      <hr>
      <br>
      <div class="btn btn-primary" @click="$store.dispatch('refinance')">refinance</div>
      <br>
      <hr>
      <br>
      <div class="btn btn-primary" @click="$store.dispatch('infoInn')">infoInn</div>
      <br>
      <hr>
      <br>
      <div class="btn btn-primary" @click="listTaxSystems">listTaxSystems</div>
      <br>
      <hr>
      <br>
      <form action="#" id="uploadForm">
        <!-- <input type="file" name="main-test-file" @change="onFilesSelect($event)" ref="mContainerFile"> -->
        <!-- <input type="file" name="main-test-file" multiple @change="readFile(this)" id="file" ref="mContainerFile"> -->
        <input type="file" name="main-test-file" multiple id="file" ref="mContainerFile">
        <!-- <input type="file" name="main-test-file" multiple @change="changeFile" onchange="readFile(this)" ref="mContainerFile"> -->
        <div class="btn btn-primary" @click="readFile()">Object, file url</div>
      </form>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import qs from 'qs'
import csv from 'csvtojson'
import { URL } from '@/settings/config'
// const URL = 'http://urrobot.beinweb.ru/api/action.php'
export default {
  name: 'Main',
  methods: {
    listTaxSystems () {
      const data = qs.stringify({ Comand: 'ListTaxSystems', SoccetEnd: 1 })
      return new Promise((resolve, reject) => {
        axios.post(URL, data)
          .then(resp => {
            console.log('listTaxSystems', resp)
          }).catch(err => {
            reject(err)
          })
      })
    },
    uploadQS () {
      const file = this.$refs.mContainerFile.files[0]
      const reader = new FileReader()
      reader.readAsText(file, 'CP1251')
      reader.onload = () => {
        csv({
          noheader: true,
          output: 'csv'
        })
          .fromString(reader.result)
          .then((csvRow) => {
            console.log(csvRow) // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]
            // const File = {}
            // csvRow.forEach((row, index) => {
            //   File[index] = row
            // })
            // console.log(JSON.stringify(File))
            // return JSON.stringify(File)
            const data = qs.stringify({
              Comand: 'AddFile',
              Email: this.$store.getters.user.Email,
              Phone: this.$store.getters.user.Phone,
              Password: this.$store.getters.user.token,
              FileName: '2017.JSON.csv',
              File: csvRow,
              SoccetEnd: 1
            })
            // console.log('uploadQS', data)
            axios.post(URL, data, {
              headers: { 'Accept-Language': 'en, ru-RU' }
            })
              .then(response => {
                console.log(response)
              })
              .catch(error => {
                console.log(error)
              })
          })
      }
      reader.onerror = function () {
        console.log(reader.error)
      }
    },
    testFunction () {
      // console.log(this.readFile())
      let str = 'fldkghtkdhjmdf;lhkjtjтекст добавь'
      for (let i = 0; i <= 100; i++) {
        str += 'fldkghtkdhjmdf;lhkjtjтекст добавь'
      }
      const obj = { 0: str }
      // eslint-disable-next-line no-useless-escape
      const obj2 = '{"0":["\"ГУ ЕИРЦ ЗАО р-на \"\"Кунцево\"\"\";;;;;;;;;;;;;;"],"1":["янв.17;;;;;;;;;;;;;;"],"2":[";;;;;;;;;;;;;;"],"3":["по состоянию на;;;;;29.08.2017;;;;;;;;;"],"4":["исключая услуги;;;;;\"Неидентифицированные суммы; Страхование; \";;;;;;;;;"],"5":[";;;;;;;;;;;;;;"],"6":[";;;;;;;;;;;;;;"],"7":["ОБОРОТНАЯ ВЕДОМОСТЬ ПО РАСЧЕТАМ С КВАРТИРОСЪЕМЩИКАМИ;;;;;;;;;;;;;;"],"8":[";;;;;;;;;;;;;;"],"9":["№ кв.;№ лицевого счета;ФИО квартиросъемщика;Входящее сальдо;;Начисления постоянные;Начисленные субсидии;Начисления разовые;Оплачено;Оплачено страховки;Оплачено субсидий;Исходящее сальдо;;Просроченная задолженность;Месяц последней оплаты"],"10":[";;;Дебет;Кредит;;;;;;;Дебет;Кредит;;"],"11":["Бобруйская ул. д.2;;;;;;;;;;;;;;"],"12":["1;3130139987;Сокол Ирина Анатольевна;1423","31;0;2989","74;0;0;0;0;0;4413","05;0;1423","31;"],"13":["2;3130139872;Ушаков Валерий Николаевич;0;0","01;1187","86;0;0;1187","86;0;0;0;0","01;0;авг.17"],"14":["3;3130139485;Кирюхина Наталья Ивановна;0;10","19;2193","58;0;0;2193","58;0;0;0;10","19;0;авг.17"],"15":["4;3130139469;Тедеева Земма Михайловна;0;49","55;2085;0;0;0;0;0;2035","45;0;0;"],"16":["5;3130135193;Медова Елена Викторовна;0;1041","95;2506","09;0;0;0;0;0;1464","14;0;0;"],"17":["6;3130134721;Чечик Наталия Львовна;0;1027","62;1190","9;0;0;1190","9;0;0;0;1027","62;0;авг.17"],"18":["7;3130134588;Донехно Лидия Михайловна;0;18","72;648","34;0;0;648","34;26","07;0;0;18","72;0;авг.17"],"19":["7;9180124592;Данехно Александр Николаевич;0;0;954","54;0;0;954","54;0;0;0;0;0;авг.17"],"20":["Итого по дому: Бобруйская ул. д.2;;;342271","82;7566731","26;155250","02;0;3360","05;164632","23;823","67;0;339271","78;7569753","38;317778","83;"]}'
      console.log(obj2)
      this.$store.dispatch('addFile', { FileName: '2017.01.csv', File: obj }, {
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        headers: { 'Content-Type': 'application/json, text/plain, */*' }
        // headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    uploadFiles () {
      const data = new FormData()
      data.append('File', this.$refs.mContainerFile.files[0])
      data.append('Email', this.$store.getters.user.Email)
      data.append('Phone', this.$store.getters.user.Phone)
      data.append('Password', this.$store.getters.user.token)
      data.append('FileName', '2017.FORM-DATA.csv')
      data.append('SoccetEnd', 1)
      console.log(data)
      axios.post(URL, data, {
        headers: {
          Accept: 'application/csvm+json, text/plain, */*',
          'Accept-Language': 'en, ru-RU',
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    },
    changeFile () {
      console.log(this.$refs.mContainerFile.files[0])
    },
    readFile () {
      const file = this.$refs.mContainerFile.files[0]
      const reader = new FileReader()
      reader.readAsText(file, 'CP1251')
      // reader.readAsDataURL(file)

      // const csvFilePath = this.$refs.mContainerFile.value
      reader.onload = () => {
        csv({
          noheader: true,
          output: 'csv'
        })
          .fromString(reader.result)
          .then((csvRow) => {
            // console.log(csvRow) // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]
            // const File = {}
            // csvRow.forEach((row, index) => {
            //   File[index] = row
            // })
            // console.log(JSON.stringify(File))
            const data = qs.stringify({
              Comand: 'AddFile',
              Email: this.$store.getters.user.Email,
              Phone: this.$store.getters.user.Phone,
              Password: this.$store.getters.user.token,
              FileName: '2017.OBJ-URL.csv',
              File: encodeURIComponent(JSON.stringify(csvRow)),
              SoccetEnd: 1
            })
            console.log(data)
            axios.post(URL, data, {
              headers: { 'Accept-Language': 'en, ru-RU' }
            })
              .then(response => {
                console.log(response)
              })
              .catch(error => {
                console.log(error)
              })
          })
        // console.log(reader.result)
        // console.log(csv.parse(encodeURIComponent(reader.result)))
        // console.log(encodeURIComponent(reader.result))
        // this.$store.dispatch('addFile', { FileName: '2017.01.csv', File: csv.parse(encodeURIComponent(reader.result)) })
        // console.log('result', reader.result)
      }

      reader.onerror = function () {
        console.log(reader.error)
      }
    },
    onFilesSelect (e) {
      // получаем объект FileList
      // const files = e.target.files

      // const inpt = document.querySelector('#main-test-file')
      // console.log(jsn)
    }
  }
}
</script>
