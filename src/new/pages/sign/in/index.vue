<template>
  <div :class="$style.page">
    <div :class="$style.title">Войдите в ЮРРОБОТ</div>
    <form @submit.prevent="submit" :class="$style.form">
      <ur-input-x
        v-model="model.login"
        el-placeholder="Введите почту или телефон"
        :class="$style.field"
        :error="errorsMap.login"
      />
      <ur-input-x
        v-model="model.password"
        el-placeholder="Введите пароль"
        :class="$style.field"
        :type="isPasswordVisible ? 'text' : 'password'"
        :error="errorsMap.password"
      >
        <template #append>
          <Icon icon="eye" @click="togglePasswordVisibility" :class="$style.append"/>
        </template>
      </ur-input-x>
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
        <Btn :class="$style.action" type="submit" label="Войти" :is-loading="isSubmitting"/>
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
      password: '',
      agree: false,
    });

    const isPasswordVisible = ref(false);
    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }

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
        if(field === 'Phone') {
          model.value.login = model.value.login.trim().replace(/^[78]/, '+7')
        }
        await store.dispatch('login', {
          [field]: model.value.login,
          Password: model.value.password,
        })
        await new Promise(requestAnimationFrame);
        // @TODO: move to middleware
        await redirect({name: 'Home'})
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

      isPasswordVisible,
      togglePasswordVisibility,

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
