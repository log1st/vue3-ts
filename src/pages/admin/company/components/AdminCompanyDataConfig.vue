<template>
    <div class="config-data__wrapper template__wrapper">
        <div class="config-data__actions-btn-wrapper">

            <div class="display__select" style="margin:1em 0">
                <v-select :options="allColumnTemplate" label="title" class="select_created_template" v-model="createdTemplated" placeholder="Выберите один из созданых шаблонов">
                </v-select>

                <ur-btn
                class="btn btn-primary"
                style="margin-top: 1em"
                >
                    Назначить шаблон
                </ur-btn>
            </div>
                <hr>
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
            <div class="compib__row" >
              <div class="compib__row-label">
                <span>Тип файла</span>
              </div>
              <div class="compib__input">
                  <div class="search-input display__select">
                      <v-select :options="fileType" placeholder="Выберите тип файла" v-model="selctedFileType" />
                  </div>
              </div>
            </div>            
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
            <!-- <div class="config-data__table-alpha">
                <div class="config-data__table-alpha-char" v-show="variablesList.length > 0" v-for="item in alphabet" :key="item">
                    {{item}}
                </div>
            </div> -->
            <div class="config-data__add-space" v-show="variablesList.length > 0">
                <div class="spacer" v-for="(item, index) in spaces.top" :key="index">
                    {{index + 1}} Отступ <span style="font-size: 1.5em; color: red; cursor: pointer" title="убрать отступ" @click="removeSpace(1)"> - </span>
                </div>
                <div style="font-size: 1.5em; color: red; padding-left:40px; cursor: pointer" @click="addSpace(1)" title="Добавить отступ">
                   +
                </div>
            </div>
            <ul class="config-data__list-wrapper" v-show="variablesList.length > 0">
                 <draggable
                   :list="variablesList"
                   class="config-data__table"
                   ghost-class="ghost"
                   :move="checkMove"
                   @start="dragging = true"
                   @end="dragging = false"
                 >
                    <li class="config-data__list" v-for="(list, index) in variablesList" :key="index">
                        <div class="application__letter">
                            {{alphabet[index]}}
                        </div>
                        <div class="application__closer" @click="deleteVariable({index, list})">
                                X
                            </div>
                        <div class="application__spacer">
                            
                            <!-- <div class="application__spacer-left plus" @click="addSpace(2)">+</div> -->
                            <!-- <div class="application__spacer-right plus" @click="addSpace(3)">+</div> -->
                        </div>
                      <div class="application__index">{{index + 1}}. <input class="config-data__var-title" type="text" v-model="list.variable_name"></div>
                      <div class="application__var"> <input type="text" v-model="list.variable" @keyup="validateFormul(list.variable, index)" :placeholder="list.placeholder" :disabled="!list.in_formula"></div>  
                    </li>
                 </draggable>
            </ul>
            <div class="final-formul">
                <strong v-if="finalFormul" >{{finalFormul}}</strong>
            </div>
            <ur-btn
                v-show="variablesList.length > 0"
                @click="saveColTemplate"
                class="btn btn-primary"
                :loading="loading"
                :disabled="disabled"
            >
                Сохранить шаблон
            </ur-btn>
        </div>
    </div>
</template>
<script>
import draggable from "vuedraggable";
import { mapGetters } from 'vuex';

export default {
    components:{draggable},
    props: {
        company: {
          type: Object,
          required: true
      }
    },
    watch: {
       variablesList: {
           immediate: true,
           deep: true,
           handler (val) {
            if (val.length > 0) {
                if (this.lastLength < this.variablesList.length) {
                    this.alphabet.push(this.generateAlphabet(this.variablesList.length))
                }
              this.lastLength = this.variablesList.length
            }
           },
       } 
    },
    data () {
        return {
            resultFormul: {
                items: []
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

            fileType: [ 
                'csv', 'excel'
            ],
            selctedFileType: undefined,
            alphabet: [],
            openAddCol: false,
            variablesList: [],
            templateName: undefined,
            columnTypes: [],

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
            }
        }
    },
    methods: {
        validateFormul (payload, index) {
            console.log([payload])
            if (payload.indexOf('+') + 1) {
                if (payload.indexOf('-') + 1) { 
                this.$set(this.variablesList[index], 'variable', payload.replace(/\-/g, ''))

                this.$toast.open({
                    message: 'В формуле уже есть знак переменной "+"',
                    type: 'warning',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                })}
            } else if (payload.indexOf('-') + 1) {
                if (payload.indexOf('+') + 1) { 
                // payload.replace(/[-]/g, '');
                this.$toast.open({
                    message: 'В формуле уже есть знак переменной "-"',
                    type: 'warning',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                })
                this.$set(this.variablesList[index], 'variable', payload.replace(/\+/g, ''))
                }
            }
        },

        checkMove (e) {
            this.variablesList[e.draggedContext.index].position = e.draggedContext.futureIndex
            setTimeout( () => {
                this.variablesList.forEach( (item, index) => {
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
            this.variablesList.forEach( item => {
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
        addNewVars () {
            let column = this.existColumn.find(c => c.type === this.newVars.variable_name.name)

                this.newVars.position = this.variablesList.length
                this.newVars.in_formula = this.newVars.variable_name.in_formula
                this.newVars.variable_name = this.newVars.variable_name.verbose_name

            if ( !!column ) {
                this.newVars.column_id = column.pk
            } else {
                this.newVars.column_id = this.variablesList.length + 1
            }
                this.variablesList.push(this.newVars)
            
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

        /**
         * Удаление локальных переменных
         */
        deleteVariable (payload) {
            const { index, list } = payload
            if ( !list.id ) {
                this.variablesList.splice(index, 1)
                let formulIndex = this.resultFormul.items.findIndex( i => i.column_id === list.column_id )
                this.resultFormul.items.splice(formulIndex, 1)
            } else {
                //
            }
        },
        validationDataToSave () {
            return new Promise ((resolve, reject) => {
                if (!this.selctedFileType) {
                    reject({status: false, msg: 'Выберите тип файла'})
                }
                else if (!this.selectedProductionType) {
                    reject({status: false, msg: 'Выберите тип протзводтсва шаблона'})
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
                                ...this.variablesList
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

        getAllExistColumn () {
            this.$http({
                command: '/api/document-parsing/columns/',
                method: 'GET',
                requestCode: 'none'
            })
            .then( res => {
                this.existColumn = res
            })
        }
    },
    created () {
        this.getAllExistColumn()
        this.getColumnTypes()
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
    .config-data {
        .fina-formul {
            padding-left: 40px;
            font-size: 12pt;
            margin-bottom: 1em;
        }
        &__form {
            padding: 15px;
            &-row {
                display: flex;
                label {
                    width: 155px;
                }
            }
            &-row + &-row {
                margin: 0.5em 0;
            }
        }
        &__wrapper{
            &.template__wrapper {
                padding: 0 22px;
            }
        }
        &__var-title {
            border: none;
            width: 100%;
            overflow: hidden;
        }
    }
    .display__select {
        .vs__search {
            display: block;
        }
    }
    .select_created_template {
            .vs__search {
                display: block !important;
            }
        }
</style>