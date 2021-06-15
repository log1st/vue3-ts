<template>
<div class="sign-in-password">
    <div class="tab-content__form">
        <div class="form-content-welcome">Установите пароль</div>
        <!-- <div class="login__wrapp-text">
            <p>Установите новый пароль.</p>
            <p>Пароль должен состоять из букв латинского алфавита верхнего и нижнего регистра и цифр.</p>
        </div> -->
        <div class="login__form-input">
             <ur-input-x
                    @input="passwordInputHandler($event)"
                    :value="passwordComputed"
                    :readonly="false"
                    elPlaceholder="Введите пароль"
                    :rules="passwordRules"
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
                <ur-input-x
                @input="passwordInputHandlerRepeat($event)"
                :value="passwordRepeat"
                :readonly="false"
                elPlaceholder="Введите пароль повторно"
                :rules="repeatPasswordRules"
                type="text"
                ref="password"
                large
            >
                <template v-slot:append>
                    <div class="toggle-password" @click="changeTypeRepeat()">
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
        <div class="form-group form-btns">
            <ur-btn
                @click="validate"
                class="btn btn--login login-from-btn mini"
                :loading="loading"
            >
                <span>Готово</span>
            </ur-btn>
        </div>
    </div>
</div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import debounce from 'lodash/debounce';
    export default {
        name: 'ur-set-password',
        data() {
            return {
                loading: false,
                 // валидация пароля
                passwordRules: [
                    value => !!value || 'Поле обязательно к заполнению',
                    value => {
                        return !/[а-яА-ЯЁё]/.test(value) || 'Не используйте букв кириллицы' 
                    },
                    // value => /^(?=.*[0-9]).{6,}/.test(value) || 'Пароль должен состоять из цифр и букв латинского алфавита верхнего и нижнего регистра'
                ],
                // Валидация повторного ввода пароля
                repeatPasswordRules: [
                        value => !!value || 'Поле обязательно к заполнению',
                        value => {
                            return !/[а-яА-ЯЁё]/.test(value) || 'Не используйте букв кириллицы' 
                        }
                    ],
                passwordRepeat: '',
                passwordComputed: '',
                disableChangingType: false,
                type: 'text'
            }
        },
        methods: {
            ...mapActions(['passInstall']),
            ...mapMutations(['setStateField']),
            validate() {
                this.$refs.password.validateField();
                if (this.$store.state.auth.repeatPassword == this.$store.state.auth.password) {
                this.$nextTick(async () => {
                    if(!this.$refs.password.isError) {
                        this.loading = true;
                        await this.passInstall();
                        this.loading = false;
                    } 
                })
                }
            },
            async passwordInputHandler(e) {
                this.disableChangingType = true;
                if(e === '') {
                    this.setStateField({ key: 'password', value: '' })
                    this.passwordComputed = '';
                    this.disableChangingType = false;
                    return 
                }
                this.passwordComputed =  e;
                this.hidePasswordChars();
            },
            async passwordInputHandlerRepeat (e) {
                 this.disableChangingType = true;
                if(e === '') {
                    this.setStateField({ key: 'repeatPassword', value: '' })
                    this.passwordRepeat = '';
                    this.disableChangingType = false;
                    return 
                }
                this.passwordRepeat = e;
                this.hideRepeatPasswordChars();
               
            },
            hideRepeatPasswordChars: debounce ( 
                function () {
                    if(this.type === 'password') {
                        const end = this.passwordRepeat.split('').filter(i => i !== '*').join('');
                        this.setStateField({ key: 'repeatPassword', value: this.$store.state.auth.repeatPassword + end })
                    } else if(this.type === 'text') {
                        this.setStateField({ key: 'repeatPassword', value: this.passwordRepeat })  
                    }
                    this.passwordRepeat = new Array(this.passwordRepeat.length + 1).join('*');
                    this.type = 'password';
                    this.disableChangingType = false;
                }, 700
            ),
            hidePasswordChars: debounce(
                function() {
                    if(this.type === 'password') {
                        const end = this.passwordComputed.split('').filter(i => i !== '*').join('');
                        this.setStateField({ key: 'password', value: this.$store.state.auth.password + end })
                    } else if(this.type === 'text') {
                        // const end = this.passwordComputed.split('').filter(i => i !== '*').join('');
                        this.setStateField({ key: 'password', value: this.passwordComputed })  
                    }
                    this.passwordComputed = new Array(this.passwordComputed.length + 1).join('*');
                    this.type = 'password';
                    this.disableChangingType = false;
                }, 700
            ),
            changeType() {
                if(this.disableChangingType) return 
                if(this.type === 'password') {
                    this.type = 'text'
                    this.passwordComputed = this.$store.state.auth.password;
                } else if(this.type === 'text') {
                    this.type = 'password'
                    this.passwordComputed = new Array(this.passwordComputed.length + 1).join('*');
                }
            },
            changeTypeRepeat () {
                if(this.disableChangingType) return 
                if(this.type === 'password') {
                    this.type = 'text'
                    this.passwordRepeat = this.$store.state.auth.repeatPassword
                } else if(this.type === 'text') {
                    this.type = 'password'
                    this.passwordRepeat = new Array(this.passwordRepeat.length + 1).join('*');
                }
            }
        }
    }
</script>