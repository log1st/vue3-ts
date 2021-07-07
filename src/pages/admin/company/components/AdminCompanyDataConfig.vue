<template>
    <div class="config-data__wrapper template__wrapper">
        <div class="config-data__actions-btn-wrapper">

            <div style="margin:1em 0">
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
            <div style="margin:1em 0 ">
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
                  <div class="search-input">
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
            <div class="config-data__form-row">
                <label for="">Наименование</label>
                    <!-- <input type="text" v-model="newVars.variable_name"> -->
                    <v-select style="width: 100%" :options="columnTypes" label="verbose_name" v-model="newVars.variable_name"/>
            </div>
            <div class="config-data__form-row" v-if="newVars.variable_name.in_formula">
                <label for="">Формула</label>
                    <input type="text"  v-model="newVars.formula">
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
                @click="addNewWars">
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
                   :list="configList"
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
                      <div class="application__var"> <input type="text" v-model="list.variable" :placeholder="list.placeholder" :disabled="!list.in_formula"></div>  
                    </li>
                 </draggable>
            </ul>
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
            selectedProductionType: undefined,
            loading: false,
            disabled: false,
            productionType: [
                {
                    type: 'pretrial',
                    title: 'Досудебное производство'
                },
                {
                    type: 'judicial',
                    title: 'Судебное производство'
                }
            ],
            lastLength: 0,
            configList: [
                {
                    id: 1,
                    name: 'Оплачено',
                    sortNumber: 1,
                    variable: null,
                    placeholder: 'Ввeдите переменную'
                },
                {
                    id: 2,
                    name: 'Оплачено субсидий',
                    sortNumber: 2,
                    variable: null,
                    placeholder: 'Ввeдите переменную'
                },
                {
                    id: 3,
                    name: 'Просрочено',
                    sortNumber: 3,
                    variable: null,
                    placeholder: 'Ввeдите переменную'
                },
                {
                    id: 4,
                    name: 'Сальдо кредит',
                    sortNumber: 4,
                    variable: null,
                    placeholder: 'Ввeдите переменную'
                },
                {
                    id: 5,
                    name: 'Входящее дебет',
                    sortNumber: 5,
                    variable: null,
                    placeholder: 'Ввeдите переменную'
                },
                {
                    id: 6,
                    name: 'Дата рождения',
                    sortNumber: 6,
                    variable: null,
                    placeholder: 'Ввeдите переменную'
                },
                {
                    id: 7,
                    name: 'Место рождения',
                    sortNumber: 7,
                    variable: null,
                    placeholder: 'Ввeдите переменную'
                },
                {
                    id: 8,
                    name: 'Серия паспорта',
                    sortNumber: 8,
                    variable: null,
                    placeholder: 'Ввeдите переменную'
                },
                {
                    id: 9,
                    name: 'Номер паспорта', 
                    sortNumber: 9,
                    variable: null,
                    placeholder: 'Ввeдите переменную'
                },
            ],
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
                column_id: 0
            }
        }
    },
    methods: {
        checkMove (e) {
            this.configList[e.draggedContext.index].sortNumber = e.draggedContext.futureIndex
            // console.log(e)
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
        addNewWars () {
            this.newVars.position = this.variablesList.length
            this.newVars.in_formula = this.newVars.variable_name.in_formula
            this.newVars.variable_name = this.newVars.variable_name.verbose_name
            this.newVars.column_id = this.variablesList.length + 1
            this.variablesList.push(this.newVars)
            this.newVars = {
                variable_name: '',
                is_active: true,
                required: true,
                position: 0,
                column_id: 0
            }
        },

        /**
         * Удаление локальных переменных
         */
        deleteVariable (payload) {
            const { index, list } = payload
            if ( !list.id ) {
                this.variablesList.splice(index, 1)
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
        }
    },
    created () {
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
    .select_created_template {
            .vs__search {
                display: block !important;
            }
        }
</style>