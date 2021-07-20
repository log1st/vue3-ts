<template>
  <div :class="[$style.page, $style.up]">
    <div :class="$style.title">Вы с нами впервые?</div>
    <div :class="$style.subTitle">Присоединяйтесь!</div>
    <form @submit.prevent="submit" :class="$style.form">
      <ur-input-x
        v-model="model.inn"
        el-placeholder="Введите ИНН"
        :class="$style.field"
        :error="errorsMap.inn"
      />
      <ur-input-x
        v-model="model.login"
        el-placeholder="Введите почту или телефон"
        :class="$style.field"
        :error="errorsMap.login"
      />
      <Checkbox :state="['radio', 'dark']" v-model="model.agree" :class="$style.agree">
        <template #label>
          Соглашаюсь на обработку персональных данных и принимаю <a target="_blank" :href="privacyPolicyUrl">политику конфеденциальности</a>
        </template>
      </Checkbox>
      <router-link :to="{name: 'sign-restore'}" :class="$style.forgot">
        Забыли пароль?
      </router-link>
      <div :class="$style.actions">
        <Btn state="danger" :class="$style.action" @click="demo" label="Демо Вход" :is-loading="isSubmitting"/>
        <Btn :class="$style.action" type="submit" label="Регистрация" :is-loading="isSubmitting"/>
      </div>
    </form>
  </div>
</template>

<script>
import {defineComponent, ref} from "@vue/composition-api";
import Btn from "@/new/components/btn/Btn";
import Icon from "@/new/components/icon/Icon";
import {useErrors} from "@/new/hooks/useErrors";
import UrInputX from "@/components/elements/UrInputX";
import Checkbox from "@/new/components/checkbox/Checkbox";
import {useStore} from "@/new/hooks/useStore";
import {useRouter} from "@/new/hooks/useRouter";
import {useToast} from "@/new/hooks/useToast";
import {baseURL} from "@/settings/config";

export default defineComponent({
  name: "index",
  components: {
    Checkbox,
    Icon,
    Btn,
    UrInputX,
  },
  setup() {
    const store = useStore();
    const {redirect} = useRouter();

    const model = ref({
      login: '',
      inn: '',
      agree: false,
    });


    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors();

    const {
      showToast,
    } = useToast();

    const isSubmitting = ref(false);
    const submit = async () => {
      clearErrors();

      if(!model.value.agree) {
        await showToast({
          message: `Подтвердите обработку персональных данных`,
          type: 'error',
        });
        return;
      }
      if(isSubmitting.value) {
        return;
      }
      isSubmitting.value = true;

      try {
        const field = model.value.login.includes('@') ? 'Email' : 'Phone';
        await store.dispatch('registerNewAccount', {
          [field]: model.value.login,
          Inn: model.value.inn,
        })
        await new Promise(requestAnimationFrame);
        sessionStorage.setItem('register', JSON.stringify({field: field.toLowerCase(), value: model.value.login}));
        await redirect({
          name: 'sign-confirm',
        })
      } catch (e) {
        console.log(e);
        const {data} = e?.response || {};
        if(typeof data === 'object' && (data !== null)) {
          setErrors(Object.entries(data).reduce((acc, [key, errors]) => ([
            ...acc,
            ...errors.map(error => ([key, error]))
          ]), []))
        } else {
          await showToast({
            title: 'Не удалось зарегистрироваться',
            message: e.message,
            type: 'error'
          })
        }
        isSubmitting.value = false;
      }
    }

    const demo = async () => {
      await store.dispatch('demoLogin', {
        demo_role: 'company',
      })
      // @TODO: move to middleware
      await redirect({name: 'Home'})
    }

    const privacyPolicyUrl = '/assets/documents/privacy_policy.pdf'

    return {
      model,
      errorsMap,

      submit,
      demo,

      privacyPolicyUrl,

      isSubmitting,
    }
  }
})
</script>

<style lang="scss" module>
@import "../sign";
</style>
