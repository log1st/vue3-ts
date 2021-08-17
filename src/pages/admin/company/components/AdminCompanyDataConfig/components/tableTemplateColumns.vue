<template>
<div>
    <ul class="config-data__list-wrapper" v-show="variablesList.length > 0">
        <draggable
          :list="variablesListCloned"
          class="config-data__table"
          ghost-class="ghost"
          :move="checkMove"
          @start="dragging = true"
          @end="dragging = false"
        >
           <li class="config-data__list" v-for="(list, index) in variablesListCloned" :key="index">
               <div class="application__letter">
                   {{alphabet[index]}}
               </div>
             <div class="application__index">{{index + 1}}. <input class="config-data__var-title" type="text" v-model="list.title"></div>
             <div class="application__var"> 
               <input type="text" v-model="list.variable"
               @keyup="validateFormul(list.variable, index)"
               :placeholder="list.placeholder" 
               :disabled="!list.in_formula">
             </div>  
           </li>
        </draggable>

        <li class="result-formul-exist">
            <span><strong>Формула:</strong> {{existFormul}} </span>
        </li>
    </ul>
            <ur-btn
                class="btn btn-primary"
                style="margin-top: 1em"
                @click="setColumnTemplateOnCompany()"
                >
                Назначить шаблон
            </ur-btn>
            <ur-btn
                class="btn btn-primary"
                style="margin-top: 1em"
                @click="saveColumnTemplateOnCompany()"
                >
                Сохранить изменения
            </ur-btn>
            <ur-btn
                v-show="editMode"
                class="btn btn-red"
                style="margin-top: 1em"
                @click="declineEdit"
                >
                Отменить редактирование
            </ur-btn>
</div>
</template>
<script>
import draggable from "vuedraggable";
import cloneDeep from 'lodash/cloneDeep'

export default {
    components: {draggable},
    data () {
        return {
            alphabet: [],
            lastLength: 0,
            variablesListCloned: [],
            editMode: false
        }
    },

    watch: {
       variablesList: {
           immediate: true,
           deep: true,
           handler (val) {
               if (val.length > 0) {
                    this.variablesListCloned = cloneDeep(this.variablesList)
               }
           }
       },
       variablesListCloned: {
           immediate: true,
           deep: true,
           handler (val) {
            if (val.length > 0) {
                for (let i = 1; i < this.variablesList.length; i++) {
                    this.alphabet.push(this.generateAlphabet(i))
                }
                
                // if (this.lastLength < this.variablesList.length) {
                //     this.alphabet.push(this.generateAlphabet(this.variablesList.length))
                // }
              this.lastLength = this.variablesList.length

            }
           },
       } 
    },

    props:{
        existFormul: {
            type: String
        },

        selectedExistTemplate: {
            type: Object
        },

        variablesList: {
            type: Array,
            required: true
        },
        /**
         * @description Возможные значение 1 - Cуществующий шаблон | 2 - Новый шаблон 
         */
        typeTemplate: {
            type: Number
        }
    },
    
    mounted () {
        this.variablesListCloned = cloneDeep(this.variablesList)
    },

    methods: {
        validateFormul (payload, index) {
            if (payload.indexOf('+') + 1) {
                if (payload.indexOf('-') + 1) { 
                this.$set(this.variablesListCloned[index], 'variable', payload.replace(/\-/g, ''))

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
                this.$set(this.variablesListCloned[index], 'variable', payload.replace(/\+/g, ''))
                }
            }
        },

        saveColumnTemplateOnCompany () {
            let dataToSend = cloneDeep(this.variablesListCloned)
            let mappedData = dataToSend.map((item) => {
                return {
                    position: item.position,
                    variable_name: item.variable_name,
                    is_active: item.is_active,
                    column_id: item.column_id,
                    required: item.required,
                    reversed: item.reversed
                }
            })
            return this.$http({
                command: `/api/document-parsing/templates/${this.selectedExistTemplate.pk}/`,
                method: 'PATCH',
                data: {
                    columns_set: mappedData
                }
            }).then( resp => {
                console.log(resp)
                this.$toast.open({
                    message: 'Шаблон парсинга изменен',
                    type: 'success'
                })
            }).catch( err => {
                this.$toast.open({
                    message: err,
                    type: 'error'
                })
            })
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
        
        checkMove (e) {
            this.variablesListCloned[e.draggedContext.index].position = e.draggedContext.futureIndex
            setTimeout( () => {
                this.variablesListCloned.forEach( (item, index) => {
                    item.position = index
                })
            }, 1000)
            this.editMode = true
        },

        declineEdit () {
            this.editMode = false
            this.variablesListCloned = cloneDeep(this.variablesList)
        },

        setColumnTemplateOnCompany () {
            return this.$http({
                command: `/api/document-parsing/templates/assign/${this.selectedExistTemplate.pk}/`,
                method: 'PATCH',
                data: {
                    company_id: this.company.id
                }
            })
            .then( resp => {
                this.$toast.open({
                    message: 'Шаблон парсинга назначен',
                    type: 'success'
                })
            })
            .catch( err => {
                this.$toast.open({
                    message: `Ошибка сервера - ${err}`,
                    type: 'error'
                })
            })
        },
    }
}
</script>
<style lang="scss">

    .result-formul-exist {
        font-size: 12.5pt;
        list-style: none;
        margin: 1em 0;
    }

    .config-data__list-wrapper {
        li {
            list-style: none;
        }
    }
</style>