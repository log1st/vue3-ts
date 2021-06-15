<template>
  <exchangeWrapper>
    <mainContainer :title="'Выгрузить реестр задолженностей (начислений)'" >
      <div class="main-container__subtitle">
        <b>Для выгрузки</b> данных о должниках необходимо выполнить следующие действия
      </div>
      <p class="mt-6 mb-15">Выберите ниже организацию, к которой привязаны должники:</p>
      <search-input :params="orgs" @changeInputValue="currentOrg = $event" />
      <div class="main-container__row mt-20 mb-20">
        <p>Укажите временной диапазон и формат экспорта</p>
      </div>
      <div class="main-container__context">
        <div class="main-container__row">
          <span>C</span>
          <div class="main-container__select-group">
            <select-gray :items="monthData"></select-gray>
            <select-gray :items="yearsData"></select-gray>
          </div>
          <span>По</span>
          <div class="main-container__select-group">
            <select-gray :items="monthData"></select-gray>
            <select-gray :items="yearsData"></select-gray>
          </div>
          <div class="main-container__select-group">
            <select-gray :items="['PDF', 'Exel', 'Word']" >
              <template v-for="(item, i) in icons" :slot="'icon-' + i">
                <icon-base
                  :width="item.width"
                  :height="item.height"
                  :iconColor="item.color"
                  :key="item.name"
                ><component :is="'icon-' + item.name"></component>
                </icon-base>
              </template>
            </select-gray>
          </div>
        </div>
      </div>
      <!-- <div class="main-container__row mt-20">
        <div v-for="item in monthData" class="main-container__col-3" :key="item">
          <exchangeFileButton :name="item" />
        </div>
      </div> -->
      <div class="main-container__footer">
        <p>Нажмите на кнопку «Экспортировать»</p>
        <div class="main-container__footer-buttons">
          <div class="btn btn-primary">Экспортировать</div>
          <div class="btn btn-white" @click="$router.go(-1)">Отменить</div>
        </div>
      </div>
    </mainContainer>
  </exchangeWrapper>
</template>

<script>
import exchangeWrapper from '@/components/modules/exchange/ExchangeWrapper'
// import exchangeFileButton from '@/components/modules/exchange/ExchangeFileButton'
import mainContainer from '@/components/elements/MainContainer'
import searchInput from '@/components/elements/SearchInput'
import iconWord from '@/components/icons-svg/icons/IconWord'
import selectGray from '@/components/elements/SelectGray'
export default {
  name: 'ExportUpload',
  components: { exchangeWrapper, mainContainer, searchInput, selectGray, iconWord },
  data () {
    return {
      currentOrg: 'ООО «Айти Прогрессив Визион»',
      orgs: { placeholder: 'Выберите организацию', isSelect: true, items: ['ООО «Айти Прогрессив Визион»', 'ООО «Айти Прогрессив Визион2»'] },
      yearsData: ['2020 Год', '2019 Год', '2018 Год', '2017 Год'],
      monthData: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      icons: [
        { name: 'pdf', width: 14, height: 18, color: '#ff4e4e' },
        { name: 'exel', width: 23, height: 22 },
        { name: 'word', width: 18, height: 17 }
      ]

    }
  }
}
</script>
