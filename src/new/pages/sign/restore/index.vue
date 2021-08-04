<template>
  <div :class="[$style.page, $style.restoreForm]">
    <div :class="$style.title">Забыли пароль?</div>
    <div :class="$style.subTitle">
      Введите адрес электронной почты или телефона, который вы использовали при регистрации, и мы отправим вам инструкции по восстановлению пароля.
    </div>
    <form @submit.prevent="submit" :class="$style.form">
      <ur-input-x
        v-model="model.login"
        el-placeholder="Введите почту или телефон"
        :class="$style.field"
        :error="errorsMap.login"
      />
      <Btn :class="$style.action" type="submit" label="Отправить" :is-loading="isSubmitting"/>
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

      if(isSubmitting.value) {
        return;
      }
      isSubmitting.value = true;

      try {
        const field = model.value.login.includes('@') ? 'email' : 'phone';
        await store.dispatch('passwordRecoveryPhone', {
          field,
          value: model.value.login
        })
        await new Promise(requestAnimationFrame);
        sessionStorage.setItem('register', JSON.stringify({field: field.toLowerCase(), value: model.value.login}));
        store.commit('setAuthTypeInstallPassword', 'restore')
        await redirect({name: 'sign-confirm'})
      } catch (e) {
        console.log(e);
        const {detail = ''} = e?.response?.data || {};
        if(detail.includes('login')) {
          setErrors([['login', detail]]);
        } else if(detail.includes('password')) {
          setErrors([['password', detail]]);
        } else if(detail) {
          setErrors([['password', detail]])
        }
      }
      isSubmitting.value = false;
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
