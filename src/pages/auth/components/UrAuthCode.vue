<template>
 <div class="sign-in-submit">
    <div class="form-content-welcome">{{ codeBlock[authLayout].title }}</div>
    <div class="form-content-info">
        <p v-if="authLayout == 5">Мы отправили вам код подтверждения на <span v-if="userEmail.length > 0">почту {{ userEmail.length > 0 && userEmail || 'email'}}</span>
         <span v-if="userPhone.length > 0">{{ userPhone.length > 0 && userPhone || 'телефон' }}.</span></p>
        <p v-else-if="authLayout == 6">Мы отправили вам код для восстановления пароля на ваш {{ userEmail.length > 0 && userEmail || 'email'}}. Введите его в поле ниже</p>
        <p v-if="codeBlock[authLayout].text !== ''">{{ codeBlock[authLayout].text }}</p>
    </div>
    <div v-if="(authLayout == 5 && userPhone !== '' )|| authLayout == 7" class="login__wrapp-email">
        <span>{{ phoneMask(validPhone(userPhone)) }}</span>
        <a href="javascript:void(0);" class="login__link" @click.prevent="setAuthLayout(1)">Неверный телефон?</a>
    </div>
    <div v-if="(authLayout == 5 && userEmail !== '' )|| authLayout == 7"  @click.prevent="setAuthLayout(1)"
    style="cursor:pointer">
        Неверный email?
    </div>
    <div class="submit-numbers">
        <input 
        v-for="(item, i) in 6" :class="{ 'is-changed' : code.length >= i + 1 }" :key="'lgn' + i"
        class="input-next" type="text" @input="codeSymbolWrite($event, i)" 
        @click.prevent="changeNext(i)" :value="code[i] ? code[i] : ''" :readonly="code.length >= i + 1" autocomplete="none" :ref="'codeInput' + i">
    </div>
    <div>
        <span v-if="setTimer" class="timer">{{ time }} сек</span>
        <a v-else href="javascript:void(0);" class="login__link login__link--dark" @click="passwordRecoveryPhone">Отправить повторно</a>
    </div>
    <div class="login__button">
        <ur-btn
            @click="setAuthLayout(0)" 
            ref="codeBtn"
            class="btn login-from-btn btn--login mini"
            :loading="loading"
        >
            <span>Назад</span>
        </ur-btn>
    </div>
</div>
</template>

<script>
    import { baseURL } from '@/settings/config'
    import { mapMutations, mapGetters, mapActions } from 'vuex'

    export default {
        name: 'ur-auth-code',
        props: {
            authLayout: {
                type: Number
            }
        },
        computed: {
            ...mapGetters([ 'userEmail', 'userPhone', 'setTimer', 'time', 'code'])
        },
        data() {
            return {
                codeBlock: {
                    3: { title: 'Забыли пароль?', text: 'Мы отправили вам код с подтверждением на', action: this.submitForgot },
                    5: { title: 'Подтверждение', text: '', action: this.activatePhoneEmail },
                    6: { title: 'Восстановление пароля', text: '', action: this.sentPinForNewPassword },
                    7: { title: 'Восстановление пароля', text: 'Мы отправили СМС с кодом активации на ваш номер. Введите его в поле ниже', action: this.sentPinForNewPassword }
                },

                loading: false,
                userLogin: '',
                forgotData: '',
                password: ''
            }
        },
        watch: {
            authLayout (val) {
                if (val === 1 && this.userLogin !== '') {
                    this.setStateField({ key: 'forgotData', value: this.userLogin });
                }
            },
            async code (val) {
                if (val.length > 0) {
                    document.addEventListener('keydown', this.keyPressFunc)
                }
                if (this.code.length === 6) {
                    this.loading = true;
                    await this.codeBlock[this.authLayout].action({ Email: this.userEmail, Phone: this.userPhone })
                    this.loading = false;
                }
                if (val.length === 0) {
                    this.loading = false;
                }
            }
        },
        methods: {
            ...mapActions([
                'passwordRecoveryPhone',
                // 'submitForgot',
                'activatePhoneEmail',
                'sentPinForNewPassword'
            ]),
            ...mapMutations(['setStateField', 'setAuthLayout']),
            keyPressFunc (e) {
                if (this.authLayout === 3 || this.authLayout === 5 || this.authLayout === 6 || this.authLayout === 7) {
                    if (e.keyCode === 8) {
                        e.preventDefault()
                        this.setStateField({ key: 'code', value: this.code.slice(0, -1) });
                        if (this.code.length > 0) { 
                            this.$refs['codeInput' + (this.code.length)][0].focus() 
                        } else { 
                            this.$refs.codeInput0[0].focus()
                        }
                    }
                    if (e.keyCode === 9) {
                        e.preventDefault()
                        return false
                    }
                }
            },
            changeNext (i) {
                if (i > this.code.length - 1) {
                    this.$refs['codeInput' + (this.code.length)][0].focus()
                }
            },
            codeSymbolWrite (event, i) {
                const currentSumbol = event.target.value[0]
                this.setStateField({ key: 'code', value: this.code + currentSumbol });
                if (i <= 4) {
                    this.$refs['codeInput' + ++i][0].focus()
                } else {
                    this.$refs.codeInput5[0].blur()
                }
            },
            phoneMask (phone) {
                if (phone.length !== 11) return phone
                else {
                    const bodyPhone = ' (' + phone.substr(1, 3) + ') ' + phone.substr(4, 3) + '-' + phone.substr(7, 2) + '-' + phone.substr(9, 2)
                    return phone[0] === '7' ? '+7' + bodyPhone : phone[0] + bodyPhone
                }
            },
            validPhone (phone) {
                return phone.replace(/\D+/g, '')
            },
    

        },

        beforeDestroy () {
            document.removeEventListener('keydown', this.keyPressFunc)
            clearTimeout(this.timerID)
            clearTimeout(this.timerID2)
        }
    }
</script>