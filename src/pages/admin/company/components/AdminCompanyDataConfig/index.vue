<template>
    <div class="config-data__wrapper template__wrapper">
        <div class="config-data__actions-btn-wrapper">

            <div class="display__select" style="margin:1em 0">
                <btn-group class="btn-group-application parsing_template " :buttons="prodButtons" :active="currentActiveAppProd" @currentActive="selectProductionTypeTemplate($event); currentActiveAppProd = $event"/>

                <v-select :options="allColumnTemplate" label="title" @input="editSelectedTemplate()" :placeholder="settedColumnTemplate.title" class="select_created_template" v-model="selectedExistTemplate">
                </v-select>

                <column-table :selected-exist-template="selectedExistTemplate" :exist-formul="existFormul" :variables-list="variablesList" :type-template="1" />

                <ur-btn
                    v-show="variablesList.length > 0 && editMode"
                    class="btn btn-primary"
                    style="margin-top: 1em;"
                    @click="copyEditColTemplate"
                    :loading="loading"
                    :disabled="disabled"
                >
                    Скопировать данные шаблона
                </ur-btn>
            </div>
                <hr>
            <div class="main-container__title">Создание шаблона загрузки должников</div>

            <div class="display__select" style="margin:1em 0 ">
                <v-select :options="productionType" label="title" v-model="selectedProductionType" placeholder="Выберите тип производвства">
                </v-select>
            </div>
            
            <div class="compib__row" >
              <div class="compib__row-label">
                <span>Наименование шаблона</span>
              </div>
              <div class="compib__input">
                  <div class="search-input">
                    <input type="text" v-model="templateName" placeholder="введите имя шаблона">
                  </div>
              </div>
            </div>
            <!-- <div class="compib__row" >
              <div class="compib__row-label">
                <span>Тип файла</span>
              </div>
              <div class="compib__input">
                  <div class="search-input display__select">
                      <v-select :options="fileType" placeholder="Выберите тип файла" v-model="selctedFileType" />
                  </div>
              </div>
            </div>             -->
            <div class="btn btn-primary"
            @click="openAddCol = !openAddCol">
                Добавить столбец
            </div>
        </div>
        <div class="config-data__form" v-show="openAddCol">
            <div class="config-data__form-row display__select">
                <label for="">Наименование</label>
                    <!-- <input type="text" v-model="newVars.variable_name"> -->
                    <v-select 
                     style="width: 100%"
                     class="select_created_template"
                     placeholder="Выберите наименование столбца"
                     :options="columnTypes"
                     label="verbose_name"
                     v-model="newVars.variable_name"/>
            </div>
            <div class="config-data__form-row" v-if="newVars.variable_name.in_formula">
                <label for="">Формула</label>
                    <input type="text"  v-model="newVars.variable">
            </div>
            <div class="config-data__form-row">
                <label for="">Активирован</label>
                    <input type="checkbox" v-model="newVars.is_active">
            </div>
            <div class="config-data__form-row">
                <label for="">Обязательный</label>
                    <input type="checkbox" v-model="newVars.required">
            </div>
            <div class="config-data__form-row">
                <div class="btn btn-white"
                @click="addNewVars">
                    Добавить столбец
                </div>
            </div>
        </div>
        <div class="">
            <div class="config-data__add-space" v-show="variablesListNew.length > 0">
                <div class="spacer" v-for="(item, index) in spaces.top" :key="index">
                    {{index + 1}} Отступ <span style="font-size: 1.5em; color: red; cursor: pointer" title="убрать отступ" @click="removeSpace(1)"> - </span>
                </div>
                <div style="font-size: 1.5em; color: red; padding-left:40px; cursor: pointer" @click="addSpace(1)" title="Добавить отступ">
                   +
                </div>
            </div>

            <ul class="config-data__list-wrapper" v-show="variablesListNew.length > 0">
                 <draggable
                   :list="variablesListNew"
                   class="config-data__table"
                   ghost-class="ghost"
                   :move="checkMove"
                   @start="dragging = true"
                   @end="dragging = false"
                 >
                    <li class="config-data__list" v-for="(list, index) in variablesListNew" :key="index">
                        <div class="application__letter">
                            {{alphabet[index]}}
                        </div>
                        <div class="application__closer" @click="deleteVariable({index, list})">
                                X
                            </div>
                      <div class="application__index">{{index + 1}}. <input class="config-data__var-title" type="text" v-model="list.variable_name"></div>
                      <div class="application__var"> 
                        <input type="text" v-model="list.variable"
                        @keyup="validateFormul(list.variable, index)"
                        :placeholder="list.placeholder" 
                        :disabled="!list.in_formula">
                      </div>  
                    </li>
                 </draggable>
            </ul>
            
            <div class="final-formul" title="Финальная формула вычисления шаблона">
                <span>Формула: </span> <strong v-if="finalFormul" >{{finalFormul}}</strong>
            </div>
            <ur-btn
                v-show="variablesListNew.length > 0"
                @click="saveColTemplate"
                class="btn btn-primary"
                :loading="loading"
                :disabled="disabled"
            >
                Сохранить шаблон
            </ur-btn>

            <ur-btn
                v-show="editMode"
                class="btn btn-red"
                @click="declineEdit"
            >
                Отменить редактирование
            </ur-btn>
        </div>
    </div>
</template>
<script>
import draggable from "vuedraggable";
import { mapGetters } from 'vuex';
import columnTable from './components/tableTemplateColumns.vue'

export default {
    components:{draggable, 'column-table':columnTable},
    props: {
        company: {
          type: Object,
          required: true
      },
      prodButtons: {
          type: Array,
          required: true
      }
    },
    watch: {
       variablesListNew: {
           immediate: true,
           deep: true,
           handler (val) {
            if (val.length > 0) {
                if (this.lastLength < this.variablesListNew.length) {
                    this.alphabet.push(this.generateAlphabet(this.variablesListNew.length))
                }
              this.lastLength = this.variablesListNew.length
            }
           },
       } 
    },
    data () {
        return {
            currentActiveAppProd: 1,
            variablesListNew: [],
            resultFormul: {
                items: []
            },

            selectedExistTemplate: undefined,
            settedColumnTemplate: { 
                title:'Выберите один из созданых шаблонов'
                },
            selectedProductionType: undefined,
            loading: false,
            disabled: false,
            finalFormul: undefined,
            productionType: [
                {
                    type: 'pretrial',
                    title: 'Досудебное производство'
                },
                {
                    type: 'judicial',
                    title: 'Судебное производство'
                },
                {
                    type: 'executive',
                    title: 'Исполнительное производство'
                }
            ],
            lastLength: 0,

            existColumn: [],

            createdTemplated: undefined,
            copyTemplateData: {},
            fileType: [ 
                'csv', 'excel'
            ],
            selctedFileType: undefined,
            alphabet: [],
            openAddCol: false,
            variablesList: [],
            templateName: undefined,
            columnTypes: [],

            editMode: false,

            spaces: {
                top: [],
                left: [],
                right: []
            }, 
            newVars: {
                variable_name: '',
                is_active: true,
                required: true,
                position: 0,
                column_id: 0,
                variable: null
            },
            existFormul: undefined
        }
    },
    methods: {
        copyEditColTemplate () {
            this.copyTemplateData.columns.forEach( (item, index) =>  {
                item.template_column.column_id = item.template_column.pk
                delete item.template_column.pk
                this.variablesListNew.push(item.template_column)
            })
            setTimeout(() => {
                this.getFinalFormul()
            }, 1000)
        },

        validateFormul (payload, index) {
            console.log([payload])
            if (payload.indexOf('+') + 1) {
                if (payload.indexOf('-') + 1) { 
                this.$set(this.variablesListNew[index], 'variable', payload.replace(/\-/g, ''))

                this.$toast.open({
                    message: 'В формуле уже есть знак переменной "+"',
                    type: 'warning',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                })}
            } else if (payload.indexOf('-') + 1) {
                if (payload.indexOf('+') + 1) { 
                this.$toast.open({
                    message: 'В формуле уже есть знак переменной "-"',
                    type: 'warning',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                })
                this.$set(this.variablesListNew[index], 'variable', payload.replace(/\+/g, ''))
                }
            }
        },
        
        declineEdit() {
            this.editMode = false
            this.variablesListNew = []
            this.templateName = undefined
            this.finalFormul = undefined
        },
        
        editSelectedTemplate () {
            // this.editMode = true
            this.variablesList = []
            let parsedArray;
            if (!!this.selectedExistTemplate) {
                parsedArray = this.selectedExistTemplate
            } else if (this.settedColumnTemplate) {
                parsedArray = this.settedColumnTemplate
            }
            parsedArray.columns.forEach( (item, index) =>  {
                item.template_column.column_id = item.template_column.pk
                item.template_column.title = item.column.title
                delete item.template_column.pk
                this.variablesList.push(item.template_column)
            })
            this.copyTemplateData = parsedArray
            this.existFormul = parsedArray.formula.formula

            setTimeout(() => {
                this.getFinalFormul()
            }, 1000)
        },

        checkMove (e) {
            this.variablesListNew[e.draggedContext.index].position = e.draggedContext.futureIndex
            setTimeout( () => {
                this.variablesListNew.forEach( (item, index) => {
                    item.position = index
                })
            }, 1000)
        },
        generateAlphabet (column) {
            let temp, letter = '';
            while (column > 0)
            {
              temp = (column - 1) % 26;
              letter = String.fromCharCode(temp + 65) + letter;
              column = (column - temp - 1) / 26;
            }
           
            return letter; 
        },
        addSpace (position) {
            switch (position) {
                case 1:
                    this.spaces.top.push(false)
                    break;
                case 2:
                    
                    break;
                case 3:
                    
                    break;
            }
        },
        removeSpace(position) {
            switch (position) {
                case 1:
                    this.spaces.top.pop()
                    break;
                case 2:
                    
                    break;
                case 3:
                    
                    break;
            }
        },
        
        getFinalFormul () {
            this.resultFormul.items = []
            this.variablesListNew.forEach( item => {
                let obj = {
                    column_id: item.column_id,
                    variable_name: !!item.variable ? item.variable : null 
                }
                this.resultFormul.items.push(obj)
            })

            this.$http({
                command: '/api/document-parsing/debt-calculation-formula/',
                method: 'POST',
                data: this.resultFormul
            })
            .then( res => {
                this.finalFormul = res.formula
                // console.log(res)
            })
        },

        /**
         * Добавление нового столбца 
         */
        async addNewVars () {
                let column = this.existColumn.find(c => c.type === this.newVars.variable_name.name)
                this.newVars.position = this.variablesListNew.length
                this.newVars.in_formula = this.newVars.variable_name.in_formula

            if ( !!column ) {
                this.newVars.column_id = column.pk
            } else {
               await this.createNewColumn()
            }
                this.newVars.variable_name = this.newVars.variable_name.verbose_name
                this.variablesListNew.push(this.newVars)
            
            this.newVars = {
                variable_name: '',
                is_active: true,
                required: true,
                position: 0,
                column_id: 0,
                variable: null
            }
            setTimeout(() => {
                this.getFinalFormul()
            }, 1000 )
        },

        createNewColumn () {
            return new Promise ((resolve, reject) => {
                this.$http({
                    method: 'POST',
                    command: '/api/document-parsing/columns/',
                    data: {
                        title: this.newVars.variable_name.verbose_name,
                        type: this.newVars.variable_name.name,
                        instructions: null
                    }
                })
                .then ( resp => {
                    console.log(resp)
                    this.newVars.column_id = resp.pk
                    resolve({status: true})
                })
                .catch( error => {
                    this.newVars.column_id = this.variablesListNew.length + 1
                    reject({status: false, msg: error})
                })
            })
        },

        /**
         * Удаление локальных переменных
         */
        deleteVariable (payload) {
            const { index, list } = payload
            if ( !list.id ) {
                this.variablesListNew.splice(index, 1)
                let formulIndex = this.resultFormul.items.findIndex( i => i.column_id === list.column_id )
                this.resultFormul.items.splice(formulIndex, 1)
            }
        },
        validationDataToSave () {
            return new Promise ((resolve, reject) => {
                if (!this.selctedFileType) {
                    reject({status: false, msg: 'Выберите тип файла'})
                }
                else if (!this.selectedProductionType) {
                    reject({status: false, msg: 'Выберите тип производтсва шаблона'})
                }
                else if (!this.templateName) {
                    reject({status: false, msg: 'Введите имя шаблона'})
                }
                else {
                    resolve({status: true})
                }
            })
        },
        
        /**
         * Сохранение шаблона
         */
        saveColTemplate () {
            this.validationDataToSave()
            .then( result => {
                if ( result ) {
                    this.loading = true
                    this.disabled = true
                    this.$http({
                        command: '/api/document-parsing/templates/',
                        method: 'POST',
                        data: {
                            title: this.templateName,
                            file_type: this.selctedFileType,
                            production_type: this.selectedProductionType.type,
                            rows_offset: this.spaces.top.length,
                            columns_set: [
                                ...this.variablesListNew
                            ]
                        }
                    })
                    .then( resp => {
                        // console.log(resp)
                        this.loading = false
                        this.disabled = false
                        this.assignTemplateToCompany(resp.pk)
                    })
                }
            })
            .catch( err => {
                this.$toast.open({
                        message: err.msg,
                        type: 'error',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
            })
        },
        
        assignTemplateToCompany (payload) {
            return this.$http({
                command: `/api/document-parsing/templates/assign/${payload}/`,
                method: 'PATCH',
                data: {
                    company_id: this.command.id
                }
            })
            .then ( resp => {
                this.$toast.open({
                    message: `Шаблон парсинга установлен`,
                    type: 'success',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                })
                // console.log(resp)
            })
            .catch( error => {
                this.$toast.open({
                    message: `Ошибка установки шаблона`,
                    type: 'error',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                })
            })
        },

        /**
         * Получение типов колонок
         */
        getColumnTypes () {
            this.$http({
                command: `/api/document-parsing/columns/types`,
                method: 'GET',
                requestCode: 'none'
            })
            .then( resp => {
                this.columnTypes = resp
            })
        },

        /**
         * Получение всех существующих колонок шаблонов
         */
        getAllExistColumn () {
            this.$http({
                command: '/api/document-parsing/columns/',
                method: 'GET',
                requestCode: 'none'
            })
            .then( res => {
                this.existColumn = res
            })
        },
        selectProductionTypeTemplate (production) {
            let production_type = 'judicial';
             switch (production) {
               case 0:
                 production_type = 'pretrial'
                 break;
               case 1:
                 production_type = 'judicial'
                 break;
               case 2:
                 production_type = 'executive'
                 break;
             }
             this.getSettedColumnTemplate({production: production_type})
        },
        getSettedColumnTemplate ({production}) {
            this.$http({
                command: '/api/document-parsing/templates/',
                method: 'GET',
                requestCode: 'none',
                params: {
                    company_id: this.company.id,
                    production_type: production
                }
            })
            .then( resp => {
                resp.forEach( (el, i) => {
                    if (i === 0) {
                        this.settedColumnTemplate = el
                        this.$nextTick(() => {
                            this.editSelectedTemplate()
                        })    
                    } else {
                        this.variablesList = []
                        this.settedColumnTemplate.title = 'Выберите один из созданых шаблонов'
                    }
                })
            })
            .catch( err => {
                console.log(err)
                this.variablesList = []
                this.settedColumnTemplate.title = 'Выберите один из созданых шаблонов'
            })
        }
    },
    created () {
        this.getAllExistColumn()
        this.getColumnTypes()
        this.getSettedColumnTemplate({production: 'judicial'})
    },
    computed: {
        ...mapGetters([
            'columnTemplate',
            'allColumnTemplate'
        ])
    }
}
</script>
<style lang="scss">
    .btn-group-application{
    &.parsing_template {
        justify-content: start;
        margin: 1em 0; 
    }}
</style>