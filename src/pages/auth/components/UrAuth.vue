<template>
        <form action="#" class="sign-in__form-inner" @submit.prevent>

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

            <div class="tab-content active">
             <div class="tab-content__form sign-in-form">
                <div class="form-content-welcome">
                    <template v-if="activeTab === 0">
                        Войдите в ЮРРОБОТ
                    </template>
                    <template v-else>
                        Вы с нами впервые?
                        <span>Присоединяйтесь!</span>
                    </template>
                </div>
            <div v-show="activeTab === 1">
                <ur-input-x
                    v-model="inn"
                    mask="############"
                    @blur="defineLoginType; validateField('inn')"
                    :rules="rules"
                    :latin="true"
                    elPlaceholder="Введите ИНН"
                    ref="inn"
                />
            </div>
            <div>
                <ur-input-x
                    v-model="userLogin"
                    elId="sign-in-name"
                    :rules="loginRules"
                    :latin="true"
                    @blur="defineLoginType; validateField('login')"
                    elPlaceholder="Введите почту или телефон"
                    ref="login"
                    large
                />
            </div>

            <div>
                <ur-input-x
                    v-if="activeTab == 0"
                    @input="passwordInputHandler($event)"
                    :value="passwordComputed"
                    :readonly="false"
                    elPlaceholder="Введите пароль"
                    :rules="passwordRules"
                    :latin="true"
                    @blur="defineLoginType; validateField('password')"
                    type="text"
                    ref="password"
                    large
                >
                    <template v-slot:append>
                        <div class="toggle-password" @click="changeType()">
                            <icon-base
                                :hasStroke="false"
                                :width="24" :height="24"
                                iconColor="#818181"
                                :viewBox="'0 0 20 20'"
                            >
                                <icon-eye />
                            </icon-base>
                        </div>
                    </template>
                </ur-input-x>
            </div>
            <div class="form-group checkbox-custom">
                <input type="checkbox" v-model="personalInfoProcessing" class="checkbox-custom__input"
                    id="checkrule">
                <label class="checkbox-custom__label" for="checkrule">соглашаюсь на
                    обработку
                    персональных данных и принимаю <a
                        href="https://app.urrobot.net/assets/documents/privacy_policy.pdf"
                        target="_blank">политику
                        конфеденциальности</a>.</label>
            </div>
            <div v-show="activeTab == 0" class="forgot-password" @click.prevent="setAuthLayout(1)">
                Забыли пароль?
            </div>
            <div class="form-group form-btns">

                <ur-btn
                :loading="loading"
                @click="demologin()"
                class="btn btn--demo login-from-btn loader-opener">
                Демо вход
                </ur-btn>

                <ur-btn
                :loading="loading"
                @click="auth()"
                :disabled="disabled"
                class="btn btn--login login-from-btn loader-opener">
                {{ activeTab == 0 ? 'Войти' : 'Регистрация' }}
                </ur-btn>
            </div>

             <vue-recaptcha
                ref="recaptcha"
                size="invisible"
                sitekey="6LcxaasZAAAAAGEYsSX6ia_jH6gkh7fG8waRjSFC"
                @verify="registerCaptcha"
                @expired="onCaptchaExpired"
                @error="errorCaptcha"
                :loadRecaptchaScript="true"
                badge="bottomleft"
              />

             </div>

            </div>
        </div>

        </form>
</template>

<script>
    import { mapActions, mapMutations, mapGetters } from 'vuex';
    const VueRecaptcha = () => import('vue-recaptcha')
    import { URL } from '@/settings/config'
    import qs from 'qs'
    import debounce from 'lodash/debounce';

    export default {
        name: 'UrAuth',
        components: { VueRecaptcha },
        data() {
            return {
                passwordComputed: '',
                disableChangingType: false,
                activeTab: 0,
                tabs: ['Вход', 'Регистрация'],
                // флаг загрузки
                loading: false,
                disabled: false,
                type: 'password',
                sitekey: '6Lc56qkZAAAAAIs6IfKv2tJTrnIdtDWyCakxLer1',
                personalInfoProcessing: false,
                // валидация ИНН
                rules: [
                    value => !!value || 'Поле обязательно к заполнению',
                    value => {
                        return this.validateInn(value)
                    }
                ],
                // валидация пароля
                passwordRules: [
                    value => !!value || 'Поле обязательно к заполнению',
                    value => {
                        return !/[а-яА-ЯЁё]/.test(value) || 'Не используйте букв кириллицы'
                    },
                   ],
                // валидация email/phone
                loginRules: [
                    value => !!value || 'Поле обязательно к заполнению',
                    value => {
                        return !/[а-яА-ЯЁё]/.test(value) || 'Не используйте букв кириллицы'
                    },
                    value => {
                        return (
                            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ||
                            /^(\+7|7|8)?[\s\-]?\(?[1-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(value)
                        ) || 'Что-то пошло не так. Попробуйте заполнить правильно'
                    }
                ]
            }
        },
        watch: {
            isLoggedIn: {
                immediate: true,
                handler (val) {
                    if (val === true) {
                        this.$router.push({ path: '/' }).catch(()=>{});
                    }
                }
            }
        },
        computed: {
            ...mapGetters(['userEmail', 'userPhone', 'isLoggedIn']),
            inn: {
                get() {
                    return this.$store.state.auth.inn
                },
                set(value) {
                    this.setStateField({ key: 'inn', value: value })
                }
            },
            userLogin: {
                get() {
                    return this.$store.state.auth.userLogin
                },
                set(value) {
                    this.setStateField({ key: 'userLogin', value: value })
                }
            },
            password: {
                get() {
                    return this.$store.state.auth.password
                },
                set(value) {
                    this.setStateField({ key: 'password', value: value })
                }
            }
        },
        mounted () {
            events.$on('auth', (status) => {
                if (status) {
                    this.$router.push({ path: '/' }).catch(()=>{});
                }
            })
            events.$on('restorePass', status => {
                if (status) {
                    this.$router.push({ path: '/settings?tab=1' }).catch(()=>{});
                }
            })
        },
        methods: {
            ...mapActions([
                'login',
                'demoLogin',
                'enter',
                'defineLoginType', // распределяет/определяет email или phone был введен
                'register', // action регистрации
                'appLoadingChange',
            ]),
            ...mapMutations([
                'setStateField',
                'setAuthLayout',
            ]),
            passwordInputHandler(e) {
                this.disableChangingType = true;
                if(e === '') {
                    this.setStateField({ key: 'password', value: '' })
                    this.passwordComputed = '';
                    this.disableChangingType = false;
                    return
                }
                this.passwordComputed = e;
                this.hidePasswordChars();
            },

            hidePasswordChars: debounce(
                function() {
                    if(this.type === 'password') {
                        const end = this.passwordComputed.split('').filter(i => i !== '*').join('');
                        const stored = this.$store.state.auth.password + end;
                        if (this.passwordComputed.length != stored.length) {
                            this.setStateField({ key: 'password', value: end })
                        } else {
                            this.setStateField({ key: 'password', value: stored })
                        }
                    } else if(this.type === 'text') {
                        this.setStateField({ key: 'password', value: this.passwordComputed })
                    }
                    this.passwordComputed = new Array(this.passwordComputed.length + 1).join('*');
                    this.type = 'password';
                    this.disableChangingType = false;
                }, 700
            ),
            changeType() {
                if(this.disableChangingType) return;
                if(this.type === 'password') {
                    this.type = 'text'
                    this.passwordComputed = this.$store.state.auth.password;
                    // debugger
                } else if(this.type === 'text') {
                    this.type = 'password'
                    this.passwordComputed = new Array(this.passwordComputed.length + 1).join('*');
                    // debugger
                }
            },
            registerCaptcha (recaptchaToken) {
                const data = qs.stringify({
                    Comand: 'CheckCapcha',
                    Response: recaptchaToken,
                    SoccetEnd: 1
                });
                return axios({
                    method: 'POST',
                    url: URL,
                    data: data
                }).then(res => {
                    if(res.data[1].return.Result.success) {
                        this.auth();
                    }
                }).catch((e) => {
                    console.log(e, 'error captcha')
                });
            },
            onCaptchaExpired () {
                this.$refs.recaptcha.reset()
            },
            errorCaptcha() {
                console.error('Error in captcha component handler');
            },
            /**
             * Переход между вкладками "Вход" и "Регистрация"
             */
            changeTab(i) {
                this.activeTab = i;
            },
            // валидация поля
            validateField(refName) {
                this.$refs[refName] && this.$refs[refName].validateField();
                this.$nextTick(() => {
                    this.disabled = this.$refs[refName].isError ? this.$refs[refName].isError : false
                })
            },
            async validate() {
                this.$refs.login && this.$refs.login.validateField();
                this.$refs.password && this.$refs.password.validateField();
                this.$refs.inn && this.$refs.inn.validateField();

                await this.$nextTick();

                const errors = [];
                for(const key in this.$refs) {
                    if(this.$refs[key] && this.$refs[key].isError) {
                        errors.push(this.$refs[key].isError);
                    }
                }

                if(errors.some(e => e === true)) {
                    this.disabled = true;
                    return false;
                } else {
                    this.disabled = false;
                    return true;
                }
            },

            async checkCaptchaAndValidate() {
                this.loading = true;
                const isValid = await this.validate();
                this.$refs.recaptcha.reset();
                this.$refs.recaptcha.execute();
            },

            auth() {
                if (!this.personalInfoProcessing) {
                    return this.$toast.open({
                        message: `Подтвердите обработку персональных данных`,
                        type: 'error',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                } else {
                this.validate();
                this.$nextTick(async () => {
                    switch(this.activeTab) {
                        case 0:
                            if(!this.$refs.login.isError && !this.$refs.password.isError) {


                                this.appLoadingChange(true)
                                this.loading = true;

                                await this.defineLoginType();
                                await this.enter();

                                this.loading = false;
                                this.appLoadingChange(false);
                            }
                        break

                        case 1:
                            if(!this.$refs.login.isError && !this.$refs.inn.isError) {

                                this.loading = true;
                                await this.defineLoginType();
                                await this.register()
                                .then( () => this.loading = false)
                                .catch( err => this.loading = false);
                                this.loading = false;
                            }
                        break
                    }
                })
                }
            },

            demologin() {
                this.loading = true;
                this.demoLogin({
                    demo_role: 'company'
                }).then((res) => {
                    //
                }).finally(() => {
                    this.$router
                        .push('/')
                        .catch((err)=>{
                            console.log(err)
                        });
                    this.loading = false;

                })
            },

            checkINN(inputNumber) {
                //преобразуем в строку
                inputNumber = "" + inputNumber;
                //преобразуем в массив
                inputNumber = inputNumber.split('');
                //для ИНН в 10 знаков
                if((inputNumber.length == 10) && (inputNumber[9] == ((2 * inputNumber[  0] + 4 * inputNumber[1] + 10 * inputNumber[2] + 3 * inputNumber[3] + 5 * inputNumber[4] + 9 * inputNumber[5] + 4 * inputNumber[6] + 6 * inputNumber[7] + 8 * inputNumber[8]) % 11) % 10)){
                    return true;
                } else {
                    return false;
                }
            },
            validateInn(inn) {
                var error = { code: null, message: null };
                var result = false;
                if (typeof inn === 'number') {
                    inn = inn.toString();
                } else if (typeof inn !== 'string') {
                    inn = '';
                }
                if (!inn.length) {
                    error.code = 1;
                    error.message = 'ИНН пуст';
                } else if (/[^0-9]/.test(inn)) {
                    error.code = 2;
                    error.message = 'ИНН может состоять только из цифр';
                } else if ([10, 12].indexOf(inn.length) === -1) {
                    error.code = 3;
                    error.message = 'ИНН может состоять только из 10 или 12 цифр';
                } else {
                    var checkDigit = function (inn, coefficients) {
                        var n = 0;
                        for (var i in coefficients) {
                            n += coefficients[i] * inn[i];
                        }
                        return parseInt(n % 11 % 10);
                    };
                    switch (inn.length) {
                        case 10:
                            var n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
                            if (n10 === parseInt(inn[9])) {
                                result = true;
                            }
                            break;
                        case 12:
                            var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                            var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                            if ((n11 === parseInt(inn[10])) && (n12 === parseInt(inn[11]))) {
                                result = true;
                            }
                            break;
                    }
                    if (!result) {
                        error.code = 4;
                        error.message = 'Неправильное контрольное число';
                    }
                }
                console.log(result);
                // debugger
                return result || error.message; // true || 'jib,rf'
            }

        },
    }
</script>

