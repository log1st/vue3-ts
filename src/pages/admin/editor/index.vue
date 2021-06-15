<template>
    <div class="main">
        <div class="main__head main__head--panel">
            <div>
                <btn-group :buttons="buttons" :active="currentActive" @currentActive="setPanelActive($event); currentActive = $event" :key="updateContent"/>
            </div>
        </div>
        <component
          :is="'docs' + currentActive"
          @changePanel="changePanel($event)"
          :params="params.data"
        />
    </div>
</template>
<script>
import docs0 from './components/Editor'
import docs1 from './components/Template'
export default {
    name: 'Admin',
    components: { docs0, docs1 },
    data(){
        return{
        updateContent: 0,
        currentActive: 0,
        params:{
          data: null
        },
        buttons: [
            { name: 'Конструктор документов' },
            { name: 'Шаблоны' },
            { name: 'Документы' },
      ]
        }
    },
      created () {
        this.setCurrentActive()
      },
      mounted() {
        /**
         * Переходим из шаблонов в редактор, с данными шаблона для редактирования
         */
        events.$on('goToEditor', data => { 
            this.currentActive = data.tabNumber
            this.updateContent = data.tabNumber
            this.params.data = data.template 
            history.replaceState({}, null, this.$route.path + '?tab=0');
            history.pushState({}, null, this.$route.path + '?tab=0');
        })
      },
        methods:{
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