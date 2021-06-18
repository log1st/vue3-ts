<template>
    <div class="config-data__wrapper template__wrapper">
        <div class="config-data__actions-btn-wrapper">
            <div class="btn btn-primary"
            @click="openAddCol = !openAddCol">
                Добавить столбец
            </div>
        </div>
        <div class="config-data__form" v-show="openAddCol">
            <div class="config-data__form-row">
                <label for="">Наименование
                    <input type="text" v-model="newVars.variable_name">
                </label>
            </div>
            <div class="config-data__form-row">
                <label for="">Активировано
                    <input type="checkbox" v-model="newVars.is_active">
                </label>
            </div>
            <div class="config-data__form-row">
                <label for="">Обязательность
                    <input type="checkbox" v-model="newVars.required">
                </label>
            </div>
            <div class="config-data__form-row">
                <div class="btn btn-white"
                @click="addNewWars">
                    Добавить столбец
                </div>
            </div>
        </div>
        <div>
            <ul class="config-data__list-wrapper">
                 <draggable
                   :list="configList"
                   ghost-class="ghost"
                   :move="checkMove"
                   @start="dragging = true"
                   @end="dragging = false"
                 >
                    <li class="config-data__list" v-for="(list, index) in variablesList" :key="index">
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

export default {
    components:{draggable},
    props: {
        company: {
          type: Object,
          required: true
      }
    },
    data () {
        return {
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
            openAddCol: false,
            variablesList: [],
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

    }
}
</script>
<style lang="scss">
    .config-data {
        &__form {
            padding: 15px;
            &-row {
                width: 50%;
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
        }
    }
</style>