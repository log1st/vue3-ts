<template>
    <div class="config-data__wrapper template__wrapper">
        <div class="config-data__actions-btn-wrapper">
            <div style="margin:1em 0 ">
                <v-select :options="productionType" label="title" v-model="selectedProductionType" placeholder="Выберите тип производвства">
                </v-select>
            </div>
            
    
            <div class="btn btn-primary"
            @click="openAddCol = !openAddCol">
                Добавить столбец
            </div>
        </div>
        <div class="config-data__form" v-show="openAddCol">
            <div class="config-data__form-row">
                <label for="">Наименование</label>
                    <input type="text" v-model="newVars.variable_name">
            </div>
            <div class="config-data__form-row">
                <label for="">Формула</label>
                    <input type="text" v-model="newVars.formula">
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
            <div class="config-data__table-alpha">
                <div class="config-data__table-alpha-char" v-show="variablesList.length > 0" v-for="item in alphabet" :key="item">
                    {{item}}
                </div>
            </div>
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
                        <div class="application__spacer">
                            <div class="application__spacer-left plus" @click="addSpace(2)">+</div>
                            <div class="application__spacer-right plus" @click="addSpace(3)">+</div>
                        </div>
                      <div class="application__index">{{index + 1}}. <input class="config-data__var-title" type="text" v-model="list.variable_name"></div>
                      <div class="application__var"> <input type="text" v-model="list.variable" :placeholder="list.placeholder"></div>  
                    </li>
                 </draggable>
            </ul>
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
            selectedProductionType: false,
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
            alphabet: [],
            openAddCol: false,
            variablesList: [],
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
            this.variablesList.push(this.newVars)
            this.newVars = {
                variable_name: '',
                is_active: true,
                required: true,
                position: 0,
                column_id: 0
            }
        },
        deleteVars () {

        },
        /**
         * Сохранение шаблона
         */
        saveColTemplate () {

        }

    },
    computed: {
        ...mapGetters([
            'columnTemplate'
        ])
    }
}
</script>
<style lang="scss">
    .config-data {
        &__form {
            padding: 15px;
            &-row {
                // width: 30%;
                display: flex;
                // justify-content: space-between;
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
</style>