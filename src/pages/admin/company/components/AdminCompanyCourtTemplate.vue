<template>
    <div>
        <div class="main-container__head">
          <div class="main-container__title">Шаблоны судов</div>
        </div>
        <div class="court-template">
            <div class="inputs__wrapper">
              <div v-for="(input, i) in courts" class="compib__row" :key="i">
                <div class="compib__row-label">
                  <span>{{ input.name }}</span>
                </div>
                <div class="compib__input">
                    <!-- @input="setTemplate($event, input)" -->
                  <v-select :options="docsTemplates"  label="name" v-model="input.courtId"></v-select>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props:{
        company: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            templates: [],
            courts: []
        }
    },
    
    mounted () {
        this.getCourt()
    },
    computed: {
        ...mapGetters(['docsTemplates'])
    },
    methods: {
        /**
         * Запрос судов - Мировых и Региональных
         */
        getCourt () {
            this.getMagistrateCourt()
            this.getRegionalCourt()
        },

        /**
         * Запрос получения данных мировых судов
         */
        getMagistrateCourt () {
            return this.$http({
                command: '/reference_books/magistrate_court_place/',
                method: 'GET',
                requestCode: 'none'
            })
            .then ( resp => {
                console.log(resp)
                this.courts = resp
            })
            .catch ( err => {
                console.log(err)
            })
        },

        /**
         * Запрос получения данных региональных судов
         */
        getRegionalCourt () {
            return this.$http({
                command: '/reference_books/regional_court_place/',
                method: 'GET',
                requestCode: 'none'
            })
            .then ( resp => {
                console.log(resp)
                this.court.push(resp)
            })
            .catch ( err => {
                console.log(err)
            })
        }
    }
}
</script>