<template>
  <form
    :class="$style.page"
    @submit.prevent="submit"
  >
    <div :class="$style.title">
      {{ t('sign.confirm.title') }}
    </div>
    <div
      v-if="registrationData"
      :class="$style.subTitle"
    >
      <i18n-t keypath="sign.confirm.subTitle.text">
        <template #data>
          {{ t(`sign.confirm.subTitle.${
            'email' in registrationData ? 'email' : 'phone'
          }`, 'email' in registrationData ? {
            email: registrationData.email,
          } : {
            phone: formatPhone(registrationData?.phone),
          }) }}
        </template>
      </i18n-t>
    </div>
    <router-link
      :to="{name: 'sign-up'}"
      :class="$style.wrong"
    >
      {{ t(`sign.confirm.wrong.${'email' in registrationData ? 'email' : 'phone'}`) }}
    </router-link>
    <ConfirmationCode
      v-model="model.code"
      :errors="errorsMap.verification_code"
      :length="6"
      :class="$style.code"
    />
    <div
      v-if="timeLeft"
      :class="$style.duration"
    >
      {{ formatDuration(timeLeft) }} {{ t('other.sec') }}
    </div>
    <button
      v-else
      :class="$style.resend"
      type="button"
      @click="resend"
    >
      {{ t('sign.confirm.resend') }}
    </button>
    <div :class="$style.actions">
      <Btn
        v-if="model.code.length >= 6"
        :class="$style.action"
        state="primary"
        :label="t('sign.confirm.submit')"
        type="submit"
      />
      <Btn
        v-else-if="timeLeft"
        :class="$style.action"
        state="primary"
        :label="t('sign.confirm.back')"
        @click="goBack"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import {
  useUser, VerifyModel, VerifyResponse,
} from '@/hooks/useUser';
import { formatDuration, formatPhone } from '@/utils/string';
import ConfirmationCode from '@/components/confirmationCode/ConfirmationCode.vue';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import { useNow } from '@/hooks/useNow';
import Btn from '@/components/btn/Btn.vue';
import store from '@/store';

export default defineComponent({
  name: 'Index',
  components: { Btn, ConfirmationCode },
  beforeRouteEnter(to, from, next) {
    if (!store.getters['user/registrationData']) {
      return next({ name: 'sign' });
    }
    return next();
  },
  setup() {
    const { t } = useI18n();
    const {
      registrationData,
      verify,
      codeUntil,
      resendCode,
    } = useUser();

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors<keyof VerifyResponse>();

    const model = ref<VerifyModel>({
      code: '',
    });

    const router = useRouter();

    const submit = async () => {
      clearErrors();
      const { status, response } = await verify(model.value);

      if (!status) {
        model.value.code = '';
        setErrors(Object.entries(response) as SourceErrors<keyof VerifyResponse>);
      } else {
        await router.push({ name: 'sign-password' });
      }
    };

    const {
      now,
    } = useNow();

    const timeLeft = computed(() => (
      codeUntil.value
        ? (
          codeUntil.value > now.value ? (
            (Math.ceil((codeUntil.value?.getTime() - now.value.getTime()) / 1000))
          ) : 0
        )
        : 0
    ));

    const goBack = async () => {
      router.go(-1);
    };

    const resend = async () => {
      model.value.code = '';
      await resendCode();
    };

    return {
      t,

      registrationData,
      formatPhone,

      model,
      errorsMap,
      submit,

      timeLeft,

      formatDuration,

      goBack,
      resend,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
