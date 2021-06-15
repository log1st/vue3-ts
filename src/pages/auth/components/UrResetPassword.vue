<template>
    <div class="sign-in__form-inner">
            
        <div class="sign-in__tab">
            <div class="tab-nav" role="tablist">
                <div v-for="(item, i) in tabs"
                    class="tab-link"
                    :class="{ active : activeTab == i }"
                    @click="changeTab(i)"
                    :key="'frmtbs' + i"
                >{{ item }}
                </div>
                <span></span>
            </div>

            <div class="tab-content active" data-tab-content="sign-in">
                <div class="tab-content__form forgot-form">
                    <div class="form-content-welcome">
                        <!-- <div class="login__wrapp-back" @click="setAuthLayout(0)"></div> -->
                        Забыли пароль?
                        <span>Введите адрес электронной почты или телефона,
                            который вы использовали при регистрации,
                            и мы отправим вам инструкции по восстановлению пароля.</span>
                    </div>

                            <ur-input-x
                                v-model="forgotData" 
                                :readonly="false"
                                elId="forgot-name"

                                elPlaceholder="Введите почту или телефон"
                                :rules="loginRules"
                                type="text"
                                ref="login"
                                @blur="defineLoginType"
                                large
                            />
                    <div class="login__button">
                        <ur-btn
                            class="btn btn--login login-from-btn"
                            :loading="loading"
                            @click="validate()"
                        >
                            <span>Отправить</span>
                        </ur-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapGetters, mapActions } from 'vuex';

    export default {
        name: 'ur-reset-password',
        data() {
            return {
                tabs: ['Вход', 'Регистрация'],
                activeTab: 0,
                loading: false,
                  // валидация email/phone
                loginRules: [
                    value => !!value || 'Поле обязательно к заполнению',
                    value => {
                        return !/[а-яА-ЯЁё]/.test(value) || 'Не используйте букв кириллицы' 
                    },
                    value => { 
                        return ( 
                            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 
                            /^\+?7(9\d{9})$/.test(value)
                        ) || 'Что-то пошло не так. Попробуйте заполнить правильно'
                    }
                ]
            }
        },
         computed: {
            forgotData: {
                get() {
                    return this.$store.state.auth.userLogin
                },
                set(value) {
                    this.setStateField({ key: 'userLogin', value: value })
                }
            }
        },
        methods: {
            ...mapActions(['defineLoginType', 'passwordRecoveryPhone']),
            ...mapMutations(['setStateField', 'setAuthLayout']),
            validate() {
                this.$refs.login.validateField();
                this.$nextTick(async () => {
                    if(!this.$refs.login.isError) {
                        this.loading = true;
                        await this.defineLoginType('password-reset');
                        await this.passwordRecoveryPhone()
                        this.loading = false;
                    }
                })
            },
            /**
             * Переход между вкладками "Вход" и "Регистрация"
             */
            changeTab(i) {
                this.activeTab = i;
                this.setAuthLayout(0)
            },
        }
    }
</script>