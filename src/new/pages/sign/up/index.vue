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
        @input="checkInn($event)"
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
        <Btn :class="[$style.action, {'disabled-btn': !model.validationInn}]" :disabled="!model.validationInn"  type="submit" label="Регистрация" :is-loading="isSubmitting"/>
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
import {daDataToken} from "@/new/utils/envHelpers";

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

      validationInn: false
    });

    const checkInn = async (event) => {
        await showToast({
                title: 'Проверка ИНН',
                message: 'Проверка существования ИНН',
                type: 'warning'
              })
        await axios({
          method: 'GET',
          url: `https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party`,
          headers: {
            'Authorization': `Token ${daDataToken}`,
          },
          params: {
            count: 10,
            query:event,
            branch_type: 'MAIN',
          },
        })
        .then (async response => {
          if (response.data.suggestions.length > 0) {
            model.value.validationInn = true;
            await showToast({
                title: 'ИНН верный!',
                message: 'Данный ИНН может быть использован',
                type: 'success'
              })
          } else {
            model.value.validationInn = false;
              await showToast({
                title: 'ИНН не обнаружен',
                message: 'Введите верный ИНН',
                type: 'error'
              })
          }
        });
    };
    
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
        sessionStorage.setItem('register', JSON.stringify({
          field: field.toLowerCase(),
          value: model.value.login,
          inn: model.value.inn,
        }));
        store.commit('setAuthTypeInstallPassword', 'signup')
        await redirect({
          name: 'sign-confirm'
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

      checkInn,
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
