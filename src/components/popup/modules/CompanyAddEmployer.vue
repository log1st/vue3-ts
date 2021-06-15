<template>
    <popup-wrapper :popupWidth='808'>
        <template v-slot:header>    
          <p class="m-0">Добавление сотрудника</p>
        </template>
        <div class="employer__modal-wrapper">
            <div class="employer__personal-data">
                <div class="employer__data-input" v-for="(item, index) in personalData" :key="index">
                    <label :for="'input'+index">
                        {{item.label}}
                    </label>
                    <ur-input
                    :rules="item.rules"
                    :readonly="false"
                    :type="item.input"
                    :placeholder="item.placeholder"
                    v-model="item.value"
                    :id="'input'+index"/>
                </div>
                <div class="employer__data-input">
                    <label for="select-company">Установка компании сотруднику</label>
                    <v-select
                      multiple
                      placeholder="Выберите одну или несколько компаний"
                      label="name_short"
                      v-model="employeeCompanies"
                      :options="companies"
                    />
                </div>
            </div>
        </div>
        <div class="cart__footer">
          <div class="cart__footer-button">
            <div class="btn btn-primary" v-if="params.status === 'new'" @click="validationEmployeer(1)">Сохранить</div>
            <div class="btn btn-primary" v-if="params.status === 'edit'"
            @click="validationEmployeer(2)"
            >
            Редактировать
            </div>
            <div class="btn btn-white" @click="$store.dispatch('setPopupState', false)">Отменить</div>
          </div>
        </div>
    </popup-wrapper>
</template>
<script>
import axios from 'axios'
import { baseURL } from '@/settings/config'
import { mapActions } from 'vuex'
import findIndex from 'lodash/findIndex'

export default {
    props:{
        params: Object
    },
    data () {
        return {
            employeeCompanies: [],
            personalData: [
                {
                    label: 'Имя',
                    input: 'text',
                    placeholder: 'Введите имя',
                    model: 'first_name',
                    value: '',
                    required: true,
                    rules: [
                        value => !!value || 'Поле обязательно к заполнению',
                        value => {
                            return /^[а-яА-ЯёЁa]+$/.test(value) || 'Используйте только кириллицу'
                        }
                    ]
                },
                {
                    label: 'Фамилия',
                    input: 'text',
                    placeholder: 'Введите фамилию',
                    model: 'last_name',
                    value: '',
                    required: true,
                    rules: [
                        value => !!value || 'Поле обязательно к заполнению',
                        value => {
                            return /^[а-яА-ЯёЁa]+$/.test(value) || 'Используйте только кириллицу'
                        }
                    ]

                },
                {
                    label: 'Должность',
                    input: 'text',
                    placeholder: 'Введите должность',
                    model: 'employee_role',
                    value: '',
                    required: true,
                    rules: [
                        value => !!value || 'Поле обязательно к заполнению',
                        value => {
                            return /^[а-яА-ЯёЁa]+$/.test(value) || 'Используйте только кириллицу'
                        }
                    ]
                },
                {
                    label: 'Телефон',
                    input: 'text',
                    placeholder: '+7 ### ### ## ##',
                    model: 'user_phone',
                    value: '',
                    required: false,
                    rules: [
                        value => !!value || 'Поле обязательно к заполнению',
                        value => {
                            return !/[а-яА-ЯЁё]/.test(value) || 'Не используйте букв кириллицы'
                        },
                        value => {
                            return (
                                /^(\+7|7|8)?[\s\-]?\(?[1-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(value)
                            ) || 'Номер телефона не должен быть больше 11 символов (не считая +)'
                        }
                    ],
                },
                {
                    label: 'Email',
                    input: 'email',
                    placeholder: 'Введите почту',
                    model: 'email',
                    value: '',
                    required: true,
                    rules: [
                        value => !!value || 'Поле обязательно к заполнению',
                        value => {
                            return /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/.test(value) || 'Не верный формат email'
                        }

                    ]

                },
                // {
                //     label: 'Пароль',
                //     input: 'password',
                //     placeholder: 'Введите пароль',
                //     model: 'password',
                //     value: ''
                // },
                // {
                //     label: 'ИНН',
                //     input: 'number',
                //     placeholder: 'Введите ИНН',
                //     model: 'user_inn',
                //     value: '',
                //     required: false
                // },
            ]
        }
    },
    watch: {
        // employeePhone: {
        //     handler (val) {
        //         let phone; 
        //         if (val.length === 12) {
        //             phone = cloneDeep(val)
        //         }
        //         if (val.length > 12) {
        //             this.personalData[2].value = phone
        //             this.$toast.open({
        //                 message: `Номер телефона не должен превышать 11 символов`,
        //                 type: 'error',
        //                 duration: 5000,
        //                 dismissible: true,
        //                 position: 'top-right'
        //             })
        //         }
        //     },
        //     immediate: true
        // }
    },
    computed: {
        employeePhone () {
            return this.personalData[2].value
        },
        companies () {
            return this.$store.state.companies.companies
        }
    },
    mounted () {
        if (this.params.status === 'edit') {
            this.personalData
            .forEach( emp => {
                emp.value = this.params.employeer[emp.model]
            })
        }
    },
    methods: {
        ...mapActions(['setPopupComponent']),
        
        validateField(refName) {
                this.$refs[refName] && this.$refs[refName].validateField();
                this.$nextTick(() => {
                    this.disabled = this.$refs[refName].isError ? this.$refs[refName].isError : false
                })
        },

        validationEmployeer (type) {
            let result = false
            this.personalData.forEach( per => {
                if (per.required && per.value === '') {
                    this.$toast.open({
                        message: `Поле ${per.label} является обязательным`,
                        type: 'error',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    });
                } else {
                    result = true
                }
            }) 
            if (result) {
                if (type === 1) {
                    this.saveNewEmployeer()
                } else if (type === 2) {
                    this.editEmployeer()
                }
            } 
            
        },
        editEmployeer () {
            let companyArr = this.employeeCompanies.map( c => c.id) 

            let data = {
                linked_companies: companyArr
            }
            this.personalData.forEach( per => {
                data[per.model] = per.value
            }) 

            // Удаляем из номера пробелы, скобки и знак +
            let parsePhone = data.user_phone.toString();
                parsePhone = parsePhone.replace(/\s+/g, '');
                parsePhone = parsePhone.replace(/\+/g, '').replace(/\(/g, '').replace(/\)/g, '');
                data.user_phone = parseInt(parsePhone)
            axios({
                method: 'PATCH',
                data: data,
                url: baseURL+`/api/account/employee/${this.params.employeer.id}/`,
            })
            .then ( () => {
                this.$toast.open({
                        message: 'Успешно сохранено',
                        type: 'success',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    });
                this.$store.dispatch('setPopupState', false)
                let indexCompany = findIndex(this.$store.state.companies.companies, e => {
                    return e.id == this.params.id
                })
                this.setPopupComponent({ component: 'company-data', params: { mode: 'view', index: indexCompany } })
            })
        },
        saveNewEmployeer () {
            let companyArr = this.employeeCompanies.map( c => c.id) 
            let data = {
                linked_companies: companyArr
            }

            this.personalData.forEach( per => {
                data[per.model] = per.value
            }) 

             let parsePhone = data.user_phone.toString();
                 parsePhone = parsePhone.replace(/\s+/g, '');
                 parsePhone = parsePhone.replace(/\+/g, '').replace(/\(/g, '').replace(/\)/g, '');
                 data.user_phone = parseInt(parsePhone)
                 
            axios({
                data: data,
                url: baseURL+'/api/account/employee/',
                method: 'POST'
            }).then( res => {
                if (res.error || res.data.error) {
                     this.$toast.open({
                        message: 'Ошибка сохранения данных',
                        type: 'error',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    });
                } else {
                    this.$toast.open({
                        message: 'Успешно сохранено, пароль пользователя отправлен на его e-mail',
                        type: 'success',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    });
                    this.$store.dispatch('setPopupState', false)
                    let indexCompany = findIndex(this.$store.state.companies.companies, e => {
                        return e.id == this.params.id
                    })
                    this.setPopupComponent({ component: 'company-data', params: { mode: 'view', index: indexCompany } })
                }
            })
            .catch( err => {
                let keysErr = Object.keys(err.response.data)
                keysErr.forEach( errs => {
                    this.$toast.open({
                        message: err.response.data[errs][0],
                        type: 'error',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                })
            })
        }
    }
}
</script>
<style lang="scss">
    .employer__data-input {
        .ur-input--outlined {
            border: none
        }
    }
</style>