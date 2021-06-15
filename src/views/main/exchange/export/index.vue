<template>
  <exchangeWrapper>
    <mainContainer v-for="(list, j) in lists" :title="list.title" :key="j">
      <ul class="exchange__lists">
        <li v-for="(item, i) in list.items" class="exchange__list-item" @click="$router.push(item.rout)" :key="j +'listitems' + i" v-html="item.name"></li>
      </ul>
    </mainContainer>
  </exchangeWrapper>
</template>

<script>
import exchangeWrapper from '@/components/modules/exchange/ExchangeWrapper'
import mainContainer from '@/components/elements/MainContainer'
export default {
  components: { exchangeWrapper, mainContainer },
  data () {
    return {
      lists: [ // export
        {
          title: 'Реестр задолженностей (начислений)',
          items: [
            { name: 'Выгрузить реестр задолженностей / начислений (все)', rout: '/exchange/export/upload' },
            { name: 'Выгрузить реестр задолженностей / начислений (досудебная практика)', rout: '/exchange/export/upload' },
            { name: 'Выгрузить реестр задолженностей / начислений (судебная практика)', rout: '/exchange/export/upload' }
          ]
        }
        // {
        //   title: 'Льготники',
        //   items: [
        //     { name: 'Выгрузить сведения по льготникам в органы соц. защиты', rout: '/exchange/export' }
        //   ]
        // },
        // {
        //   title: 'Выгрузки в 1С',
        //   items: [
        //     { name: 'Расщепление платежей по услугам', rout: '/exchange/export' },
        //     { name: 'Расщепление платежей по услугам по банковской выписке', rout: '/exchange/export' },
        //     { name: 'Расщепление платежей по услугам в разрезе лицевых счетов', rout: '/exchange/export' }
        //   ]
        // }
      ]
    }
  }
}
</script>
