<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Выбор модуля шаблона</p>
        </template>
        <div class="popup__status">
            <div class="compib__row" 
            v-for="(item, index) in templates"
            :key="index">
                <div class="compib__row-label">
                    <span>Модуль - {{item.template_type_name}}</span>
                </div>
                <div class="compib__row-label">
                    <span>Шаблон - {{item.name}}</span>
                </div>
                <div class="compib__input">
                    <div class="search-input no-select-input">
                        <v-select label="name" :options="moduleType" v-model="item.template_type_name" @input="changeTemplateModule(index, item)"></v-select>
                    </div>
                </div>
            </div>
            <div class="popup__status-button">
                  <ur-btn
                      class="btn btn-primary"
                      :loading="loading"
                      @click="acceptAll"
                      :disabled="disabled"
                  >
                      <span>Применить</span>
                  </ur-btn>
            </div>
        </div>
    </popup-wrapper>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'
import { mapActions, mapGetters } from 'vuex'

export default {
    props: {
        params:{
            type: Object
        }
    },

    data () {
        return {
            loading: false,
            disabled: false,
            // clonedArray: new Array,

            moduleType: [
                {
                    name: 'Досудебный',
                    title: 'pretrial',
                    id: 1
                },
                {
                    name: 'Судебный',
                    title: 'judicial',
                    id: 2
                },
                {
                    name: 'Исполнительное',
                    title: 'executive',
                    id: 3
                }
            ],

            templates: []
        }
    },

    watch: {
        templates: {
            handler () {
                //
            },
            deep: true,
            immediate: true
        }
    },
    
    created () {
            this.templates = cloneDeep(this.params.templates)
            let types = this.moduleType
            let type;
            this.templates.forEach( i => {
                type = types.find( t => t.id === i.template_type)
                i.template_type_name = type.name
                i.template_title = type.title
            })
    },

    methods: {
        ...mapActions(['patchCompanyDocumentTemplate', 'setFinalyDocumentTemplate', 'setPopupState', 'updateData']),

        /**
         * Обработка и назначение шаблонов 
         */
        acceptAll () {
            let data = cloneDeep(this.params.templates)
            let item;
            let exist = false;
            data.forEach( d => {
                item = this.templates.find( i => i.id === d.id )
                exist = this.params.alreadyIsntall.find( t => {
                        if (t.id === d.existId) { return t }
                        else { return false }
                    })
                d.template_type = item.template_title
                // console.log(exist)
                if (exist) {
                    d.existId = exist.id
                    this.patchCompanyDocumentTemplate({template: d})
                    .then( () => {
                        this.setPopupState(false)
                        this.updateData()
                    })

                } else {
                    this.setFinalyDocumentTemplate({template: d})
                    .then( () => {
                        this.setPopupState(false)
                        this.updateData()
                    })
                }
            })
        },

        changeTemplateModule (index, item) {
            let findedItem = this.templates.find( e => e.id === item.id)
            findedItem.template_type = item.template_type_name.id
            findedItem.template_title = item.template_type_name.title
            findedItem.template_type_name = item.template_type_name.name
            this.$set(this.templates, index, findedItem)
        }
    }
}
</script>