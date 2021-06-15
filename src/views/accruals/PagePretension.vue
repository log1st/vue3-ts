<template>
  <div>
    <div class="accruals__close accruals__close--outside" @click="closeTab">
      <icon-base width="13" height="13" iconColor="#ffffff">
        <icon-close-big />
      </icon-base>
    </div>
    <template>
      <div ref="list">
        <list></list>
      </div>
    </template>
  </div>
</template>

<script>
import list from '@/components/modules/accruals/List'
export default {
  name: 'PagePretension',
  props: {
    params: String
  },
  components: { list },
  data () {
    return {}
  },
  mounted () {
    console.log('PagePretension', this.$props)
  },
  methods: {
    closeTab () {
      // window.close()
      console.log(this.$refs.list)
    }
  }
}
</script>
