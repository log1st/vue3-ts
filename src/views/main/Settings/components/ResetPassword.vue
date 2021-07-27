<template>

    <div class="main__content mt-20" :key="updateContent">
      <div class="main__content-row">
        <div class="main__content-col main__content-col--1062">
          <main-container :title="'Сменить пароль'">

            <template slot="nobody">
              <form class="set-form" @submit.prevent action="#" method="post">

                <div class="set-form__row justify-content-start">
                  <div class="set-form__label necessarily col-3">Текущий пароль</div>
                  <div class="col-4">
                    <!-- :rules="passwordRules" -->
                    <ur-input
                        @input="passwordInputHandler({ e: $event, index: 0 }); form[0].error = ''"
                        :value="form[0].passwordComputed"
                        :readonly="false"
                        placeholder="Введите пароль"
                        type="text"
                        ref="oldPassword"
                    >
                        <template v-slot:append>
                            <div @click="changeType(0)">
                                <icon-base :hasStroke="false" :width="24" :height="24" iconColor="#818181" :viewBox="'0 0 20 20'">
                                    <icon-eye />
                                </icon-base>
                            </div>
                        </template>
                    </ur-input>
                    <div v-if="form[0].error" class="settings-error">{{ form[0].error }}</div>
                  </div>
                </div>

                <div class="set-form__row justify-content-start">
                  <div class="set-form__label necessarily col-3">Новый пароль</div>
                  <div class="col-4">
                    <ur-input
                        @input="passwordInputHandler({ e: $event, index: 1 });  form[1].error = ''"
                        :value="form[1].passwordComputed"
                        :readonly="false"
                        placeholder="Введите пароль"
                        type="text"
                        ref="password"
                    >
                        <template v-slot:append>
                            <div @click="changeType(1)">
                                <icon-base :hasStroke="false" :width="24" :height="24" iconColor="#818181" :viewBox="'0 0 20 20'">
                                    <icon-eye />
                                </icon-base>
                            </div>
                        </template>
                    </ur-input>
                    <div v-if="form[1].error" class="settings-error">{{ form[1].error }}</div>

                    <!-- <div v-if="passwordWrong && i == 1" class="login__input-warning">{{ 6 > password[1].length ? 'Длинна пароля не менее 6-ти символов' : 'Пароль должен состоять из букв латинского алфавита верхнего и нижнего регистра (цифры по желанию)' }}</div>
                    <div v-else-if="item.text" class="set-form__input-text_right">Например: QKJFKDUIjfdkj_1_454</div>
                    <div v-if="passwordWrong && i == 2 && password[1] !== password[2]" class="login__input-warning">Пароли не совпадают!!!</div> -->

                  </div>
                </div>

                <div class="set-form__row justify-content-start">
                  <div class="set-form__label necessarily col-3">Подтверждение пароля</div>
                  <div class="col-4">
                    <ur-input
                        @input="passwordInputHandler({ e: $event, index: 2 });  form[2].error = ''"
                        :value="form[2].passwordComputed"
                        :readonly="false"
                        placeholder="Введите пароль"
                        type="text"
                        ref="password"
                    >
                        <template v-slot:append>
                            <div @click="changeType(2)">
                                <icon-base :hasStroke="false" :width="24" :height="24" iconColor="#818181" :viewBox="'0 0 20 20'">
                                    <icon-eye />
                                </icon-base>
                            </div>
                        </template>
                    </ur-input>
                    <div v-if="form[2].error" class="settings-error">{{ form[2].error }}</div>

                  </div>
                </div>

                <div class="set-form__footer mt-20">
                  <div class="btn btn-primary" @click="saveNewPassword()">Сохранить пароль</div>
                  <div class="btn btn-white" @click="cancelChangePasword()">Отменить</div>
                </div>

              </form>
            </template>

          </main-container>
        </div>
      </div>
    </div>

</template>

<script>
import { sha512 } from 'js-sha512'
import debounce  from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'password-reset',
  data () {
    return {
        updateContent: 0,

        password: [],
        passwordWrong: false,
        // валидация пароля
        passwordRules: [
            value => !!value || 'Поле обязательно к заполнению',
            value => {
                return !/[а-яА-ЯЁё]/.test(value) || 'Не используйте букв кириллицы'
            },
            // value => /^(?=.*[0-9]).{6,}/.test(value) || 'Пароль должен состоять из строчных и прописных букв латинского алфавита и цифр.'
        ],
        form: [
            // старый пароль
            {
                type: "password",
                password: '',
                passwordComputed: '',
                disableChangingType: false,
                error: ''
            },
            // новый пароль
            {
                type: "password",
                password: '',
                passwordComputed: '',
                disableChangingType: false,
                error: ''
            },
            // новый пароль повтор
            {
                type: "password",
                password: '',
                passwordComputed: '',
                disableChangingType: false,
                error: ''
            }
        ]
    }
  },

  methods: {
    /**
     * Сохранить новый пароль
     */
    saveNewPassword () {
        this.form.forEach((field, index) => {
            const errors = cloneDeep(this.passwordRules).map(rule => rule(field.password));
            // if(errors.some(e => typeof(e) === 'string')) {
            const error = errors.find(e => typeof(e) === 'string');
            if(error) {
                this.form[index].error = error;
            }
        })

        if(this.form[1].password !== this.form[2].password) {
            this.form[1].error = 'Пароли не совпадают';
            this.form[2].error = 'Пароли не совпадают';
        }

        if(this.form.every(f => f.error.length <= 0 )) {
            this.$store.dispatch('changePassword',
                {
                    password: sha512(this.form[0].password),
                    newPassword: this.form[1].password
                });
        }
    },

    cancelChangePasword () {
        this.form.forEach(f => {
            f.password = '';
            f.passwordComputed = '';
            f.error = '';
            f.disableChangingType = false
        })
    },
    // validPassword (password) {
    //   // const regex = /^(?=.*[0-9]).{6,}/
    //   // const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{6,}/
    //   const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}/
    //   if (!regex.test(password)) return false
    //   else return true
    // },
    validateField(refName) {
        this.$refs[refName] && this.$refs[refName].validateField();
        this.$nextTick(() => {
            this.disabled = this.$refs[refName].isError
        })
    },
    //
    async passwordInputHandler({ e, index }) {
        this.form[index].disableChangingType = true;
        if(e === '') {
            this.form[index].password = '';
            this.form[index].passwordComputed = '';
            this.form[index].disableChangingType = false;
            return
        }
        this.form[index].passwordComputed = e;
        this.hidePasswordChars({ e, index });
    },
    hidePasswordChars: debounce(
        function({ e, index }) {
            if(this.form[index].type === 'password') {
                const end = this.form[index].passwordComputed.split('').filter(i => i !== '*').join('');
                this.form[index].password = this.form[index].password + end;
            } else if(this.form[index].type === 'text') {
                this.form[index].password = this.form[index].passwordComputed;
            }
            this.form[index].passwordComputed = new Array(this.form[index].passwordComputed.length + 1).join('*');
            this.form[index].type = 'password';
            this.form[index].disableChangingType = false;
        }, 500
    ),
    changeType(index) {
        if(this.form[index].disableChangingType) return
        if(this.form[index].type === 'password') {
            this.form[index].type = 'text'
            this.form[index].passwordComputed = this.form[index].password;
        } else if(this.form[index].type === 'text') {
            this.form[index].type = 'password'
            this.form[index].passwordComputed = new Array(this.form[index].passwordComputed.length + 1).join('*');
        }
    },
  }
}
</script>

<style lang="scss">
    .settings-error {
        font-size: 12px;
        font-weight: 400;
        line-height: 21px;
        border-radius: 8px;
        color: red;
    }
</style>
