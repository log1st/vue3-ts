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
                  <v-select :options="docsTemplates" 
                  label="name" @input="setCourtTemplate($event, input.type, input.id)" 
                  :placeholder="templateGetByCourtId(input.id, input.type, 1)"></v-select>

                  <v-select :options="docsTemplatesShareholder" 
                  label="name" 
                  @input="setCourtTemplate($event, input.type, input.id)"
                  :placeholder="templateGetByCourtId(input.id, input.type, 2)"></v-select>

                </div>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        company: {
            type: Object,
            require: true
        },
        templates: {
            type: Array,
            require: true
        }
    },
    data () {
        return {
            courts: []
        }
    },
    
    mounted () {
        this.getCourt()
    },
    computed: {
        docsTemplates () {
            return this.templates.map( tmp => {
                return {
                        name: tmp.template_obj.name,
                        id: tmp.template,
                        court: tmp.court,
                        company: tmp.company,
                        regional_court: tmp.regional_court
                    }
                })
        },
        docsTemplatesShareholder () {
            let arr = this.templates.filter( tmp => tmp.template_obj.template_type_obj.description === "суд приказ (дольщики)")
            return arr.map( newTmp => {
                    return {
                        name: newTmp.template_obj.name,
                        id: newTmp.template,
                        court: newTmp.court,
                        company: newTmp.company,
                        regional_court: newTmp.regional_court
                    }
            })
        }
    },
    methods: {
        templateGetByCourtId ( id, type, templateType ) {
            let template;
            if (type === "m") {
                template = this.templates.find( tmp => tmp.court === id )
            } else if (type === "c") {
                template = this.templates.find( tmp => tmp.regional_court === id )
            }

            if (!!!template) {
                let result = templateType === 1 ? 'Выберите шаблон суд приказа' : 'Выберите шаблон суд приказа (дольщики)'
                return result
            } else {
                if (templateType === 2 && template.template_obj.template_type_obj.description === "суд приказ (дольщики)") {
                    return template.template_obj.name
                } else if (templateType === 1) {
                    return template.template_obj.name
                } else if (templateType === 2 && template.template_obj.template_type_obj.description != "суд приказ (дольщики)") {
                    return 'Выберите шаблон суд приказа (дольщики)'
                }
            }
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
                this.courts.push(resp)
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
            console.log([event, type, courtId])
            let data = {
                ...event,
                company: this.company.id,
                production_type: 'judicial'
            }
            switch (type) {
                case "m":
                    data.court = courtId
                    break;
                case "c":
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