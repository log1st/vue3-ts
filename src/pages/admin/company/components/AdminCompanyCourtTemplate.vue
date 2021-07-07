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
                  <v-select :options="docsTemplatesLocal" 
                    label="name" 
                    @input="setCourtTemplate($event, input.type, input.id, 1)" 
                    :placeholder="templateGetByCourtId(input.id, input.type, 1)">
                  </v-select>

                  <v-select :options="docsTemplatesShareholder" 
                    label="name" 
                    @input="setCourtTemplate($event, input.type, input.id, 2)"
                    :placeholder="templateGetByCourtIdShareholder(input.id, input.type, 2)">
                  </v-select>
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
        ...mapGetters(['docsTemplates']),
        docsTemplatesLocal () {
            return this.docsTemplates.map( tmp => {
                return {
                        name: tmp.name,
                        template: tmp.id,
                        // mode: 'default'
                    }
                })
        },
        docsTemplatesShareholder () {
            let arr = this.docsTemplates.filter( tmp => tmp.template_type_obj.description === "суд приказ (дольщики)")
            return arr.map( newTmp => {
                    return {
                        name: newTmp.name,
                        template: newTmp.id,
                        // mode: 'shareholder'
                    }
            })
        }
    },
    methods: {
        templateGetByCourtId ( id, type, templateType ) {
            let template;
            if (type === "m") {
                template = this.templates.filter( tmp => tmp.court === id )
            } else if (type === "c") {
                template = this.templates.filter( tmp => tmp.regional_court === id )
            }
            if (!!!template || template.length === 0) {
                let result = templateType === 1 ? 'Выберите шаблон суд приказа' : 'Выберите шаблон суд приказа (дольщики)'
                return result
            } else {
                let result;
                template.forEach( tmp => {
                    if (templateType === 1 && tmp.template_obj.template_type_obj.description != "суд приказ (дольщики)" ) {
                        console.log(tmp, id)
                        result = tmp.template_obj.name
                    } 
                    // else if (templateType === 1 && tmp.template_obj.template_type_obj.description === "суд приказ (дольщики)") {
                    //     result = 'Выберите шаблон суд приказа'
                    // }
                })
                return result || 'Выберите шаблон суд приказа'
            }
        },
        templateGetByCourtIdShareholder (id, type, templateType) {
            let template;
            if (type === "m") {
                template = this.templates.filter( tmp => tmp.court === id )
            } else if (type === "c") {
                template = this.templates.filter( tmp => tmp.regional_court === id )
            }

            if (!!!template || template.length === 0) {
                let result = templateType === 1 ? 'Выберите шаблон суд приказа' : 'Выберите шаблон суд приказа (дольщики)'
                return result
            } else {
                let result;
                template.forEach( tmp => {
                    if (templateType === 2 && tmp.template_obj.template_type_obj.description === "суд приказ (дольщики)") {
                        result = tmp.template_obj.name
                    } 
                    // else if (templateType === 2 && tmp.template_obj.template_type_obj.description != "суд приказ (дольщики)") {
                    //     result = 'Выберите шаблон суд приказа (дольщики)'
                    // }
                })
                return result || 'Выберите шаблон суд приказа (дольщики)'
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
        setCourtTemplate ( event, type, courtId, templateType ) {
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

            let operationIndex;
            let operationItem = this.templates.find( tmp => {
                if ( tmp.court === courtId || tmp.regional_court === courtId ) {
                    operationIndex = 1
                    return tmp
                } else {
                    operationIndex = 2
                    return tmp
                }
            })
            switch (operationIndex) {
                case 1:
                    this.patchCourtTemplate(data, operationItem, templateType)
                    break;
                case 2:
                    this.postCourtTemplate(data)
                    break;
            }
        },

        postCourtTemplate (payload) {

            this.$http({
                command: `/constructor/company/template/`,
                method: 'POST',
                data: payload
            })
            .then ( resp => {
                console.log(resp)
            })
            .catch ( error => {
                console.log(error)
            })
        },

        patchCourtTemplate (payload, lastItem, templateType) {
            this.$http({
                command: `/constructor/company/template/${payload.template}/`,
                method: 'patch',
                data: payload
            })
            .then ( resp => {
                let type = templateType === 2 ? 'суд приказ (дольщики)' : ''
                if (type != '' && type === lastItem.template_obj.template_type_obj.description ) {
                    this.deleteLastTemplate(lastItem)
                } else if (type === '' && type != lastItem.template_obj.template_type_obj.description) {
                    this.deleteLastTemplate(lastItem)
                }
            })
            .catch ( error => {
                console.log(error)
            })
        },

        deleteLastTemplate (payload) {
            console.log(payload)
            this.$http({
                command: `/constructor/company/template/${payload.id}/`,
                method: 'DELETE'
            })
            .then( resp => {
                console.log(resp)
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