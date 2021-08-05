<template>
  <div :class="[$style.page, $style.passwordForm]">
    <div :class="$style.title">Установите пароль</div>
    <form @submit.prevent="submit" :class="$style.form">
      <ur-input-x
        v-model="model.password"
        el-placeholder="Введите пароль"
        :class="$style.field"
        :error="errorsMap.password"
      />
      <ur-input-x
        v-model="model.passwordConfirmation"
        el-placeholder="Повторите пароль"
        :class="$style.field"
        :error="errorsMap.passwordConfirmation"
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
      password: '',
      passwordConfirmation: '',
    });

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors();

    const {
      showToast,
    } = useToast();

    const placeholder = JSON.parse(sessionStorage.getItem('register') || '{}');

    const isSubmitting = ref(false);
    const submit = async () => {
      clearErrors();

      if(isSubmitting.value) {
        return;
      }
      if(model.value.password !== model.value.passwordConfirmation) {
        setErrors([['passwordConfirmation', 'Пароли не совпадают']]);
        return;
      }
      isSubmitting.value = true;
      let dispatchName = 'setNewPass'
      if (store.state.auth.authSetPasswordType === 'signup') {
        dispatchName = 'passwordInstall'
      } else if (store.state.auth.authSetPasswordType === 'restore') {
        dispatchName = 'setNewPass'
      }
      try {
        await store.dispatch(dispatchName, {
          ...placeholder,
          password: model.value.passwordConfirmation,
        })
        .then( async resp => {
          await new Promise(requestAnimationFrame);
          await redirect({name: 'sign-in'})
          await showToast({
            message: 'Пароль успешно изменен!',
            type: 'success'
          })
        })
        .catch( error => {
          error.forEach( async err => {
            await showToast({
              message: `${err}`,
              type: 'error',
            });
          })
        })
        
      } catch (e) {
        // console.log(e);
        isSubmitting.value = false;
      }
    }

    return {
      model,
      errorsMap,

      submit,

      isSubmitting,
    }
  }
})
</script>

<style lang="scss" module>
@import "../sign";
</style>
