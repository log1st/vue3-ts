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
                <div class="compib__input double_select">
                    <!-- @input="setTemplate($event, input)" -->
                  <v-select :options="docsTemplates" placeholder="Выберите шаблон суд приказа" label="name" @input="setCourtTemplate($event, 1, input.id)" :value="templateGetByCourtId(input.id)"></v-select>
                  <v-select :options="docsTemplates" placeholder="Выберите шаблон суд приказа (дольщики)" label="name" @input="setCourtTemplate($event, 2, input.id)" :value="templateGetByCourtId(input.id)"></v-select>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
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
        this.templates = cloneDeep(this.docsTemplates)
    },
    computed: {
        ...mapGetters(['docsTemplates']),
        
    },
    methods: {
        templateGetByCourtId ( id ) {
            return this.templates.find( tmp => tmp.court === id || tmp.regional_court === id )
        },

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
                requestCode: 'none',
                params: {
                    company_id: this.company.id
                }
            })
            .then ( resp => {
                // console.log(resp)
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
                requestCode: 'none',
                params: {
                    company_id: this.company.id
                }
            })
            .then ( resp => {
                // console.log(resp)
                this.court.push(resp)
            })
            .catch ( err => {
                console.log(err)
            })
        },

        /**
         * @param event Событие установки шаблона
         * @param {Int} type [1,2] 1 - суд приказ | 2 - суд пиказ дольщики 
         * @param {Int} courtId id суда на который будет происходить назначение
         */
        setCourtTemplate ( event, type, courtId ) {
            // console.log([event, type, courtId])
            let data = {
                ...event,
                company: this.company.id,
                production_type: 'judicial'
            }
            switch (type) {
                case 1:
                    data.court = courtId
                    break;
                case 2:
                    data.regional_court = courtId
                    break;
            }
            return this.$http({
                command: `/constructor/company/template/${event.id}/`,
                method: 'PATCH',
                data
            })
            .then ( resp => {
                console.log(resp)
            })
            .catch ( error => {
                console.log(error)
            })
        }
    }
}
</script>
<style lang="scss">
    .double_select {
        width: 100%;
        display: flex;
        flex-direction: row;
        .v-select {
            width: 50%;
            margin: 0 0.5em;
            .vs__search {
                display: block;
            }
        }
    }
</style>