<template>
  <exchangeWrapper>
    <mainContainer>
      <template slot="nobody">
        <table class="table-gis">
          <thead>
            <tr>
              <th></th>
              <th>
                <span class="is-sorted">№</span>
              </th>
              <th>
                <span class="is-sorted">Дата и время</span>
              </th>
              <th><span>Пользователь</span></th>
              <th><span>Адреса домов</span></th>
              <th><span>Статус синхронизации</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in users" :key="item.id">
              <td>
                <check-box :checked="item.checked" @changeCheckbox="item.checked = !item.checked" />
              </td>
              <td>{{ item._id }}</td>
              <td>{{ item.time }}</td>
              <td>{{ item.name }}</td>
              <td>
                <p v-for="(adr, j) in item.addresses" :key="'adrsexch' + j">{{ adr }}</p>
              </td>
              <td>
                <statusLabel :status="item.status">{{ item.status ? 'Подключена' : 'Ошибка' }}</statusLabel>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </mainContainer>
  </exchangeWrapper>
</template>

<script>
import exchangeWrapper from '@/components/modules/exchange/ExchangeWrapper'
import mainContainer from '@/components/elements/MainContainer'
import statusLabel from '@/components/elements/StatusLabel'
import checkBox from '@/components/elements/CheckBox'
export default {
  components: { exchangeWrapper, mainContainer, statusLabel, checkBox },
  data () {
    return {
      checked: false,
      users: [ // ГИС ЖКХ
        {
          _id: 1,
          checked: false,
          time: '12.01.2018 15:30',
          name: 'Кузнецова Н.Г.',
          addresses: ['Санкт-Петербург, большая конюшенная 15', 'Санкт-Петербург, большая конюшенная 18', 'Санкт-Петербург, большая конюшенная 15', 'Санкт-Петербург, большая конюшенная 12', 'Санкт-Петербург, большая конюшенная 12', 'Санкт-Петербург, большая конюшенная 12', 'Санкт-Петербург, большая конюшенная 12', 'Санкт-Петербург, большая конюшенная 12'],
          status: false
        }
      ]
    }
  }
}
</script>
