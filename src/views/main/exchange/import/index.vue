<template>
  <exchangeWrapper>
    <mainContainer title="Лицевые счета и собственники помещений">
      <ul class="exchange__lists">
        <template v-for="(item, i) in debtorsModulesButtons">
          <li v-if="item.status"
            class="exchange__list-item"
            @click="$router.push('/exchange/import/upload?action=' + item._id)"
            :moduleName="item.title"
            :key="'listitems' + i"
            v-html="'Загрузить лицевые счета должников в раздел «' + item.title + '»'"
          />
        </template>
      </ul>
    </mainContainer>
  </exchangeWrapper>
</template>

<script>
import { mapGetters } from 'vuex'
import exchangeWrapper from '@/components/modules/exchange/ExchangeWrapper'
import mainContainer from '@/components/elements/MainContainer'
export default {
  components: { exchangeWrapper, mainContainer },
  computed: mapGetters(['debtorsModulesButtons'])
}
</script>
