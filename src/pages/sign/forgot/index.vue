<template>
  <div :class="$style.page">
    <div :class="$style.title">
      {{ t('sign.forgot.title') }}
    </div>
    <div :class="$style.subTitle">
      {{ t('sign.forgot.subTitle') }}
    </div>
    <form
      :class="$style.form"
      @submit.prevent="submit"
    >
      <TextInput
        v-model="model.login"
        :class="$style.field"
        :placeholder="t('sign.forgot.login.placeholder')"
      />
      <div :class="$style.actions">
        <Btn
          :class="$style.action"
          state="primary"
          :label="t('sign.forgot.submit')"
          type="submit"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import TextInput from '@/components/textInput/TextInput.vue';
import {
  RestoreModel, RestoreResponse, SignUpResponse, useUser,
} from '@/hooks/useUser';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import Btn from '@/components/btn/Btn.vue';
import { useCaptcha } from '@/hooks/useCaptcha';

export default defineComponent({
  name: 'Index',
  components: { Btn, TextInput },
  setup() {
    const { t } = useI18n();

    const model = ref<RestoreModel>({
      login: '',
    });

    const {
      restore,
    } = useUser();

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors<keyof RestoreResponse>();

    const router = useRouter();

    const {
      runCaptcha,
    } = useCaptcha();

    const submit = async () => {
      clearErrors();

      let captcha = '';
      try {
        captcha = await runCaptcha('RESTORE');
      } catch (e) {
        setErrors([['captcha', t('captcha.error')]] as unknown as SourceErrors<keyof SignUpResponse>);
        return;
      }
      const { status, response } = await restore({
        ...model.value,
        captcha,
      });

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof RestoreResponse>);
      } else {
        await router.push({ name: 'sign-confirm' });
      }
    };

    return {
      t,

      model,
      submit,

      errorsMap,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
