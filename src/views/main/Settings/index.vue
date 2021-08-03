<template>
  <div class="main">
    <div class="main__head">
      <!-- <div class="main__head-title">Настройки</div> -->
<!--      @currentActive="setPanelActive($event);-->
      <btn-group
        :buttons="setTabs"
        :active="0"
        currentActive = "$event"
        :key="updateContent"
      />
    </div>
<!--    <div v-if="currentActive == 1" class="main__content mt-20">-->
    <div v-if="false" class="main__content mt-20" style="padding: 0 0 60px 0; margin-left: 1.5em">
      <div class="main__content-row">
        <div class="main__content-col main__content-col--776">
          <mainContainer :title="'Email рассылки'">
            <template slot="nobody">
              <form class="set-form" @submit.prevent action="#" method="post">
                <div v-for="(item, i) in formData0" class="set-form__row" :key="'frm-' + i">
                  <div class="set-form__label">{{ item.label }}</div>
                  <div class="set-form__inputs">
                    <search-input v-for="(inpt, j) in item.inputs" :params="inpt" @changeInputValue="changeInputsValue($event, i, j)" :key="i + 'srchinp' + j" />
                  </div>
                </div>
                <div class="set-form__footer mt-20">
                  <div class="btn btn-primary">Сохранить</div>
                  <div class="btn btn-white">Отменить</div>
                </div>
              </form>
            </template>
          </mainContainer>
        </div>
        <div class="main__content-col main__content-col--287">
          <mainContainer :title="'SMS рассылки'">
            <template slot="nobody">
              <div class="main-container__body">
                <div class="main-container__context">
                  <p>По умолчанию все письма отправляются от имени «ЮРРОБОТ». Чтобы добавить свое «Имя отправителя» которое будет указано в СМС (например «UK Perspektiva»), необходимо его зарегестрировать у операторов Мегафон и МТС. Для подачи заявки на регистрацию имени отправителя напишите письмо на sales@yr.ru</p>
                </div>
                <div class="main-container__subtitle main-container__subtitle--sms">Имя отправителя</div>
                <search-input :params="{ placeholder: 'Ввод текста', value: 'YRROBOT' }" @changeInputValue="changeInputsValue($event)" />
              </div>
            </template>
          </mainContainer>
        </div>
      </div>
    </div>

    <div v-if="currentActive == 1"  class="main__content mt-20" :key="updateContent">
      <div class="main__content-row">

        <!-- <div class="main__content-col main__content-col--1062">
          <mainContainer :title="'Сменить пароль'">
            <template slot="nobody">
              <form class="set-form" @submit.prevent action="#" method="post">
                <div v-for="(item, i) in formData1" class="set-form__row" :key="'frm-' + i">
                  <div class="set-form__label necessarily">{{ item.label }}</div>
                  <div class="set-form__input set-form__input--text_right">
                    <search-input
                      :params="item.input"
                      @changeInputValue="password[i] = $event"
                      @focused="passwordWrong = false"
                    />
                    <div v-if="passwordWrong && i == 1" class="login__input-warning">{{ 6 > password[1].length ? 'Длинна пароля не менее 6-ти символов' : 'Пароль должен состоять из букв латинского алфавита верхнего и нижнего регистра (цифры по желанию)' }}</div>
                    <div v-else-if="item.text" class="set-form__input-text_right" v-html="item.text"></div>
                    <div v-if="passwordWrong && i == 2 && password[1] !== password[2]" class="login__input-warning">Пароли не совпадают!!!</div>
                  </div>
                </div>
                <div class="set-form__footer mt-20">
                  <div class="btn btn-primary" @click="saveNewPassword()">Сохранить пароль</div>
                  <div class="btn btn-white" @click="cancelChangePasword()">Отменить</div>
                </div>
              </form>
            </template>
          </mainContainer>
        </div> -->
        <reset-password></reset-password>
      </div>
    </div>
  </div>
</template>

<script>
import { sha512 } from 'js-sha512'
import btnGroup from '@/components/elements/ButtonsGroup'
import mainContainer from '@/components/elements/MainContainer'
import searchInput from '@/components/elements/SearchInput'
import ResetPassword from './components/ResetPassword'

export default {
  name: 'Settings',
  components: { btnGroup, mainContainer, searchInput,
    'reset-password': ResetPassword
  },
  data () {
    return {
      setTabs: [
        // { name: 'Настройки' },
        { name: 'Сменить пароль' }
      ],
      currentActive: 1,
      updateContent: 0,
      formData0: [
        { label: 'Имя отправителя', inputs: [{ placeholder: 'Имя отправителя', value: 'ООО «Айти Прогрессив Визион»' }] },
        { label: 'Адрес электронной почты отправителя', inputs: [{ type: 'email', placeholder: 'Ввод текста' }] },
        { label: 'Логин', inputs: [{ placeholder: 'Ввод текста' }] },
        { label: 'Пароль', inputs: [{ type: 'password' }] },
        { label: 'Почтовый сервер', inputs: [{ placeholder: 'Адрес сервера' }, { placeholder: '445' }] },
        { label: 'Вид шифрования', inputs: [{ placeholder: 'SSL', isSelect: true, items: ['TSL', 'SSL/TSL', 'no'] }] },
        { label: 'Количество сообщений в минуту', inputs: [{ placeholder: '10', isSelect: true, items: ['25', '50', '100'] }] }
      ],
      formData1: [
        { label: 'Текущий пароль', input: { type: 'password', placeholder: 'Введите пароль' } },
        { label: 'Новый пароль', input: { type: 'password', placeholder: 'Введите пароль', view: true }, text: 'Например: QKJFKDUIjfdkj_1_454' },
        { label: 'Подтверждение пароля', input: { type: 'password', placeholder: 'Введите пароль', view: true } }
      ],
      password: [],
      passwordWrong: false
    }
  },
  mounted () {
    this.setCurrentActive()
  },
  methods: {
    changeInputsValue (event, i, j) {},
    setTabActive (event) {
      // this.currentActive = event
    },
    setPanelActive (event) {
      return
      // history.pushState({}, null, this.$route.path + '?tab=' + event)
    },
    setCurrentActive () {
      if (this.$route.query.tab !== undefined) {
        // this.currentActive = this.$route.query.tab * 1
        this.currentActive = 1;
        this.updateContent++
      } else {
        // history.replaceState({}, null, this.$route.path + '?tab=' + this.currentActive)
        history.replaceState({}, null, this.$route.path + '?tab=1')
        this.updateContent++
      }
    },
    saveNewPassword () {
      if (!this.validPassword(this.password[1])) {
        this.passwordWrong = true
        return false
      }
      if (this.password[1] !== this.password[2]) {
        this.passwordWrong = true
        return false
      }
      this.$store.dispatch('changePassword', { Password: this.password[0], NewPassword: this.password[1] }).then(res => {
        this.$toast.open({
          message: 'Пароль был успешно изменен',
          type: 'success',
          duration: 5000,
          dismissible: true,
          position: 'top-right'
        });
      })
      // console.log('ok', this.password)
    },
    cancelChangePasword () {
      this.passwordWrong = false
      this.password = []
      this.updateContent++
    },
    validPassword (password) {
      // const regex = /^(?=.*[0-9]).{6,}/
      // const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{6,}/
      const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}/
      if (!regex.test(password)) return false
      else return true
    }
  },
  watch: {
    $route (to, from) {
      this.setCurrentActive()
    }
  }
}
</script>
