<template>
  <div class="main">
    <div class="main__head main__head--panel">
      <div class="main__head-title"><b>{{ $store.getters.getInfoINNContracts ? $store.getters.getInfoINNContracts.ShortNameOfTheOrganization : ' ' }}</b></div>
      <div>
        <btn-group :buttons="buttons" :active="currentActive" @currentActive="setPanelActive($event); currentActive = $event" :key="updateContent"/>
      </div>
    </div>
    <component
      :is="'panel' + currentActive"
      @changePanel="changePanel($event)"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import btnGroup from '@/components/elements/ButtonsGroup'
import panel0 from '@/components/modules/panel/Panel0'
import panel1 from '@/components/modules/panel/Panel1'
import panel2 from '@/components/modules/panel/Panel2'
import panel3 from '@/components/modules/panel/Panel3'
import panel4 from '@/components/modules/panel/Panel4'
import panel5 from './Settings'

export default {
  name: 'Panel',
  components: { btnGroup, panel0, panel1, panel2, panel3, panel4, panel5 },
  data () {
    return {
      updateContent: 0,
      currentActive: 0,
      buttons: [
        { name: 'Общие данные' },
        { name: 'Договор' },
        { name: 'Счета' },
        { name: 'Транзакция и акты' },
        { name: 'Услуги ЮРРОБОТ' },
        { name: 'Настройки' }
      ]
    }
  },
  created () {
    this.setCurrentActive()
    // this.$store.dispatch('getAllAccounts');
  },
  methods: {
    ...mapActions(['loadInfoINNContracts']),
    setPanelActive (event) {
      history.pushState({}, null, this.$route.path + '?tab=' + event)
    },
    changePanel(event) {
      this.currentActive = event.tab;
      this.updateContent++
      history.replaceState({}, null, this.$route.path + '?tab=' + this.currentActive);
    },
    setCurrentActive () {
      if (this.$route.query.tab !== undefined) {
        this.currentActive = this.$route.query.tab * 1
        this.updateContent++
      } else {
        history.replaceState({}, null, this.$route.path + '?tab=' + this.currentActive)
      }
    }
  },
  watch: {
    $route (to, from) {
      this.setCurrentActive()
    }
  }
}
</script>
