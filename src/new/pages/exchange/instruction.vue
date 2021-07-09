<template>
  <div :class="$style.page">
    <div :class="$style.title">Инструкция работы с файлом<br/>выгрузки должников</div>
    <div :class="$style.steps">
      <div :class="$style.step">
        <div :class="$style.label">Шаблоны</div>
        <div :class="$style.value">
          Для того, чтобы использовать шаблоны, нажмите на нужный формат файла шаблона (csv, xls. xlsx) и скачайте его. Файл шаблона нужно заполнять строго как в примере. Все положения столбцов должны быть как в шаблоне, даже если они не используются.
          <br/>
          <br/>
          В свою очередь в файле идет разбивка по домам, в виде блоков последовательных строк. Начинается блок названием улицы и дома (Ленина ул. д.2) и номеров квартир, далее идет название следующей улицы и следующие номера квартир и так далее...
          <div :class="$style.examples">
            <ExchangeExamples :examples="examples"/>
          </div>
        </div>
      </div>
      <div :class="$style.step">
        <div :class="$style.label">Собственный файл</div>
        <div :class="$style.value">Чтобы выполнить загрузку Вашего файла, напишите нам на почту: <a :href="`mailto:loading@urrobot.net`">loading@urrobot.net</a> или оставьте заявку в чате, и мы сделаем шаблон для Вас и все последующие выгрузки будите осуществлять используя Ваш файл.</div>
      </div>
      <div :class="$style.step">
        <div :class="$style.label">Интеграция по API</div>
        <div :class="$style.value">
          Если у Вас в организации используется программа 1С или другой программный комплекс учета начислений, напишите нам на почту: <a :href="`mailto:loading@urrobot.net`">loading@urrobot.net</a> или оставьте заявку в чате и мы сделаем безопасную интеграцию с нашей платформой, что позволит все данные получать в онлайн режиме.
          <br/>
          <br/>
          Для того чтобы выгрузить файлы (исключение п.3) Вам нужно выбрать год и разложить файлы по нужным месяцам, после этого нажать импортировать. Ожидаем...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref} from "@vue/composition-api";
import ExchangeExamples from "@/new/components/exchangeExamples/ExchangeExamples";

export default defineComponent({
  name: "instruction",
  components: {ExchangeExamples},
  setup() {
    const examples = ref([
      {
        type: 'csv',
        file: 'https://file-examples-com.github.io/uploads/2017/02/file_example_CSV_5000.csv',
      },
      {
        type: 'xls',
        file: 'https://file-examples-com.github.io/uploads/2017/02/file_example_XLS_10.xls',
      },
      {
        type: 'xlsx',
        file: 'https://file-examples-com.github.io/uploads/2017/02/file_example_XLSX_10.xlsx',
      },
    ]);

    return {
      examples,
    }
  }
})
</script>

<style lang="scss" module>
@import "./instruction";
</style>
