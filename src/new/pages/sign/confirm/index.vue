<template>
  <div :class="[$style.page, $style.confirm]">
    <div :class="$style.title">Подтверждение</div>
    <div :class="[$style.error, $style.subTitle]" v-if="'verification_code' in errorsMap">
      {{ errorsMap.verification_code }}
    </div>
    <div :class="$style.subTitle" v-else>
      Мы отправили вам код подтверждения
      <template v-if="placeholder">
        на {{ {
          email: 'почту',
          phone: 'телефон'
        }[placeholder.field] }} {{placeholder.value}}
      </template>
    </div>
    <ConfirmForm
      v-model="code"
      @back="goBack"
      @submit="submit"
      @resend="resend"
      :is-loading="isSubmitting"
    />
  </div>
</template>

<script>
import {defineComponent, ref} from "@vue/composition-api";
import ConfirmCode from "@/new/components/confirmCode/ConfirmCode";
import Btn from "@/new/components/btn/Btn";
import {useRouter} from "@/new/hooks/useRouter";
import ConfirmForm from "@/new/components/confirmForm/ConfirmForm";
import {useStore} from "@/new/hooks/useStore";
import {useErrors} from "@/new/hooks/useErrors";
import {arrayFrom} from "@/new/utils/object";

export default defineComponent({
  name: "index",
  components: {ConfirmForm, Btn, ConfirmCode},
  setup() {
    const code = ref('');

    const store = useStore();

    const {go, redirect} = useRouter();

    const goBack = async () => {
      await go(-1)
    }

    const placeholder = JSON.parse(sessionStorage.getItem('register') || '{}')

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors();

    const isSubmitting = ref(false);

    const submit = async () => {
      if(isSubmitting.value ) {
        return;
      }
      isSubmitting.value = true;
      clearErrors();
      try {
        await store.dispatch('activatePhoneEmail', {
          ...placeholder,
          code: code.value,
        });
        sessionStorage.setItem('register', JSON.stringify({
          ...placeholder,
          code: code.value,
        }));
        await redirect({
          name: 'sign-password'
        })
      } catch (e) {
        console.log('blya', e);
        code.value = '';
        if(e.response) {
          setErrors(Object.entries(e?.response.data).reduce((acc, [field, errors]) => ([
            ...acc,
            ...(arrayFrom(errors)).map(error => ([field, error]))
          ]), []))
        }
      }
      isSubmitting.value = false;
    }

    const resend = async () => {
      await store.dispatch('passwordRecoveryPhone', placeholder)
    }

    return {
      errorsMap,

      goBack,
      submit,
      placeholder,
      resend,

      code,
      isSubmitting,
    }
  }
})
</script>

<style lang="scss" module>
@import "../sign";
</style>
