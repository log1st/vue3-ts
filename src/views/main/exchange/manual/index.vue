<template>
    <exchangeWrapper>
        <main-container >
        <div class="manual">
          <div class="manual-head">
              Инструкция работы с файлом выгрузки должников
          </div>
            <div class="manual--body">
              <div class="manual--body-row">
                <div class="manual--body-title">
                  Шаблоны
                </div>
                <div class="manual--body-text">
                      Для того, чтобы использовать шаблоны, нажмите на нужный формат файла шаблона (csv, xls. xlsx) и скачайте его. Файл шаблона нужно заполнять строго как примере. Все положения столбцов должно быть как в шаблоне, даже если они не используется.<br>
                    <br>
                      В свою очередь в файле идет разбивка по домам, в виде блоков последовательных строк. Начинается блок названием улицы и дома (Ленина ул. д.2) и номеров квартир, далее идет название следующей улицы и следующие номера квартир и так далее...<br>
                    <div class="manual--btn">
                      <div class="exchange-example-docs-download-list manual--btn-wrapper"
                      v-for="(item, index) in exampleDocsLinear"
                      :key="index"
                      :class="{'disable-example': item.disable}"
                      >
                      <span v-if="!item.disable"> <a :href="'/assets/files/debtorImportTemplate.'+item.type" download>{{item.name}}</a> </span>
                      <span v-else>{{item.name}}</span>
                      <span>Файл</span>
                      </div>
                    </div>
                </div>
              </div>
              <div class="manual--body-row">
                <div class="manual--body-title">
                    Собственный файл
                </div>
                <div class="manual--body-text">
                  Чтобы выполнить загрузку Вашего файла, напишите нам на почту:
                  <a href="loading@urrobot.net">loading@urrobot.net</a>
                  или оставьте заявку в чате, и мы сделаем шаблон для Вас и все последующие выгрузки будите осуществлять используя Ваш файл.
                </div>
              </div>
              <div class="manual--body-row">
                <div class="manual--body-title">
                  Интеграция по API
                </div>
                <div class="manual--body-text">
                  Если у Вас в организации используется программа 1С или другой программный комплекс учета начислений, напишите нам на почту:
                  <a href="loading@urrobot.net">loading@urrobot.net</a>
                  или оставьте заявку в чате и мы сделаем безопасную интеграцию с нашей платформой, что позволит все данные получать в онлайн режиме.
                  Для того чтобы выгрузить файлы (исключение п.3) Вам нужно выбрать год и разложить файлы по нужным месяцам, после этого нажать импортировать. Ожидаем...
                </div>
              </div>
            </div>
                  <!-- <a href="/assets/files/debtorImportTemplate.csv" class="btn btn-primary" download>
                    <div>
                      <icon-base width="23" height="22"><icon-exel/></icon-base>
                      Скачать csv файл
                    </div>
                  </a> -->
        </div>
        </main-container>
    </exchangeWrapper>
</template>
<script>
import exchangeWrapper from '@/components/modules/exchange/ExchangeWrapper'

export default {
    components: {exchangeWrapper},
    name: 'Manual',
    data () {
      return {
        exampleDocsLinear: [
          {
          type: 'csv',
          name: 'CSV',
          disable: false,
          file: ''
          },
          {
            name: 'XLS',
            type: 'xls',
            disable: true,
            file: ''
          },
          {
            name: 'XLSX',
            type: 'xlsx',
            disable: true,
            file: ''
          }
        ]
      }
    }
}
</script>
<style lang="scss">
  .manual {
    &-head {
      font-weight: bold;
      font-size: 24px;
      line-height: 29px;
      letter-spacing: 0.04em;
      color: #333333;
      width: 396px;
    }

    &--btn {
      display: flex;
      flex-direction: row;
      margin-top: 20px;

      &-wrapper {
        margin-right: 30px;
      }

    }
    &--body-row:not(:first-child) {
      margin-top: 60px;
    }
    &--body {
      margin-top: 60px;
      &-row {
        display: grid;
        grid-template-columns: 1fr 4fr;
      }
      &-title {
        font-weight: 500;
        font-size: 18px;
        width: 271px;
        line-height: 22px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #21317A;
      }
      &-text {
        font-weight: normal;
        font-size: 14px;
        line-height: 19px;
        letter-spacing: 0.03em;
        color: #333333;
        max-width: 630px;
      }
    }
  }
</style>
