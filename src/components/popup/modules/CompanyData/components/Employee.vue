<template>
    <div>
        <div class="cart__content-item_head">
            <div class="btn btn-primary" @click="addNewEmployee">Добавить сотрудника</div>
        </div>

        <div class="cart__table">
            <div class="cart__table-head">
            <div class="employees__table-row">
                <div class="employees__table-col"><span style="padding: 0px 12px">Имя</span></div>
                <div class="employees__table-col"><span style="padding: 0px 12px">Фамилия</span></div>
                <div class="employees__table-col"><span style="padding: 0px 12px">Должность</span></div>
                <div class="employees__table-col"><span style="padding: 0px 12px">Моб телефон</span></div>
                <div class="employees__table-col"><span style="padding: 0px 12px">Email</span></div>
            </div>
            </div>
            <div class="cart__table-body">
            <div v-for="(employee, i) in employees"
                class="employees__table-row"
                @mouseover="currentRowHovered = i"
                @mouseleave="currentRowHovered = null"
                :key="'wrkrw' + i"
            >
                <div class="employees__table-col">
                    <ur-input
                        v-model="employee.first_name"
                        :readonly="currentRowEditing !== i"
                        placeholder="Введите Имя"
                        :rules="[(val) => !!val ||'Поле обязательно к заполнению']"
                        type="text"
                        :outlined="false"
                        :dark="currentRowEditing === i"
                        ref="first_name"
                        small
                    />
                </div>
                <div class="employees__table-col">
                    <ur-input
                        v-model="employee.last_name"
                        :readonly="currentRowEditing !== i"
                        placeholder="Введите Фамилию"
                        :rules="[(val) => !!val ||'Поле обязательно к заполнению']"
                        type="text"
                        :outlined="false"
                        :dark="currentRowEditing === i"
                        ref="last_name"
                        small
                    />
                </div>
                <div class="employees__table-col">
                    <ur-input
                        v-model="employee.employee_role"
                        :readonly="currentRowEditing !== i"
                        placeholder="Введите должность"
                        :rules="[(val) => !!val ||'Поле обязательно к заполнению']"
                        type="text"
                        :outlined="false"
                        :dark="currentRowEditing === i"
                        ref="employee_role"
                        small
                    />
                </div>
                <div class="employees__table-col">
                    <ur-input
                        v-model="employee.user_phone"
                        :readonly="currentRowEditing !== i"
                        placeholder="Введите телефон"
                        :rules="[(val) => !!val ||'Поле обязательно к заполнению']"
                        type="text"
                        :outlined="false"
                        :dark="currentRowEditing === i"
                        ref="user_phone"
                        small
                    />
                </div>
                <div class="employees__table-col">
                    <ur-input
                        v-model="employee.email"
                        :readonly="currentRowEditing !== i"
                        placeholder="Введите e-mail"
                        :rules="[(val) => !!val ||'Поле обязательно к заполнению']"
                        type="text"
                        :outlined="false"
                        :dark="currentRowEditing === i"
                        ref="email"
                        small
                    />
                </div>
                <transition name="fade">
                    <rowHoverActions 
                        class="companies__employees-action"
                        v-if="(currentRowHovered == i && !addProcess && !editProcess) || currentRowEditing == i" 
                        :icons="icons" 
                        :elClass="i % 2 == 1 ? 'is-dark' : null" @setRowHoverAction="runActions($event, i)" />
                </transition>
            </div>
            </div>
        </div>

    </div>
</template>

<script>
import rowHoverActions from '@/components/elements/RowHoverActions';
import { mapActions, mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

export default {
    components: { rowHoverActions },
    props: {
        id: [String, Number]
    },
    data () {
        return {
            currentRowHovered: null,

            addProcess: false,
            editProcess: false,

            currentRowEditing: null,
            employees: []
        }
    },
    watch: {
        companyEmployees: {
            immediate: true,
            deep: true,
            handler(val) {
                this.employees = cloneDeep(val);
                this.currentRowEditing = null,
                this.addProcess = false;
                this.editProcess = false;
            }
        }
    },
    computed: {
        ...mapGetters(['companyEmployees']),
        icons() {
            return ((this.addProcess || this.editProcess) && ['check', 'close']) || ['edit', 'close'];
        }
    },
    created () {
        this.getListEmployee(this.$store.state.user.user.id)
    },
    mounted () {
        // if (this.employees.length > 0) {
        //     this.employees.forEach( e => {
        //         e.user_phone.toString();
        //     })
        // }
    },
    methods: {
        ...mapActions(['deleteEmployee', 'getListEmployee', 'setPopupState', 'setPopupComponent', 'openPopup']),
        // добавляем поля для нового участника и ставим флаг добавления. текущий row - последний
        addNewEmployee() {
            
            if(!this.addProcess) { // если мы в режиме добавления, то больше нельзя добавить
                
                // this.currentRowEditing = this.employees.length - 1;
                this.addProcess = true;
                this.setPopupComponent({component: 'CompanyAddEmployer', params:{
                  id: this.id,
                  status: 'new',
                }})
            }
        },
        // разблокировать сотруднику поля формы и установить режим редактировани 
        editEmployee(rowIndex) {
            if(!this.editProcess) {
                this.currentRowEditing = rowIndex;
                this.editProcess = true;
                this.setPopupComponent({component: 'CompanyAddEmployer', params:{
                  status: 'edit',
                  id: this.id,
                  employeer: this.employees[rowIndex]
                }})
            }
        },
        cancelAddingNewEmployee() {
            this.employees.pop();
            this.addProcess = false;
        },
        cancelEdititngEmployee() {
            this.editProcess = false;
            this.currentRowEditing = null;
        },
        deleteEmployeeWrap(rowIndex) {
            this.deleteEmployee(this.employees[rowIndex]);
        },
   
        runActions (actionIndex, rowIndex) {
            console.log(actionIndex === 0, this.editProcess)
            
            this.currentRowEditing = rowIndex;
            switch(true) {
                // case (actionIndex === 0 && this.addProcess && !this.editProcess): // кнопка 0 и процесс добавления и не процесс редактирования
                //     // debugger
                //     this.saveNewEmployee() // сохранить нового участника
                //     break

                // case (actionIndex === 1 && this.addProcess && !this.editProcess): // кнопка 1 и процесс добавления и не процесс редактирования
                //     // debugger
                //     this.cancelAddingNewEmployee();
                //     break

                case (actionIndex === 0 && !this.addProcess && !this.editProcess): 
                    // debugger
                    this.editEmployee(rowIndex) // поставить сотрудника в режим редактирования и заблокировать добавление
                    break
                
                // case (actionIndex === 0 && !this.addProcess && this.editProcess): // подтвержить редактирование
                //     // debugger
                //     this.updateEmployee(rowIndex);
                //     break

                case (actionIndex === 1 && !this.addProcess && this.editProcess): // отменить редактирование
                    // debugger
                    this.cancelEdititngEmployee(rowIndex)
                    break

                case (actionIndex === 1 && !this.editProcess && !this.addProcess): // удалить
                    this.deleteEmployeeWrap(rowIndex)
                    break
            }
        }
    }
}
</script>