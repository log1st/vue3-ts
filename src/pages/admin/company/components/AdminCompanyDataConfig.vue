<template>
    <div class="config-data__wrapper">
        <div>
            <ul class="config-data__list-wrapper">
                 <draggable
                   :list="configList"
                   ghost-class="ghost"
                   :move="checkMove"
                   @start="dragging = true"
                   @end="dragging = false"
                 >
                    <li class="config-data__list" v-for="(list, index) in configList" :key="list.index">
                      <div class="application__index">{{index + 1}}. {{list.name}}</div>
                      <div class="application__var"> <input type="text" v-model="list.variable" :placeholder="list.placeholder"> </div>  
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
        }
    },
    methods: {
        checkMove (e) {
            this.configList[e.draggedContext.index].sortNumber = e.draggedContext.futureIndex
            // console.log(e)
        }
    }
}
</script>