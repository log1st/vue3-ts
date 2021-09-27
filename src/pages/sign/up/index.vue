<template>
  <div :class="$style.page">
    <div :class="$style.title">
      {{ t('sign.up.title') }}
    </div>
    <div :class="$style.subTitle">
      {{ t('sign.up.subTitle') }}
    </div>
    <form
      data-cy="signup_form"
      :class="$style.form"
      @submit.prevent="submit"
    >
      <TextInput
        v-model="model.inn"
        data-cy="signup-inn-input"
        :placeholder="t('sign.up.inn.placeholder')"
        :class="$style.field"
        :errors="errorsMap.inn"
      />
      <TextInput
        v-model="model.login"
        data-cy="signup-login-input"
        :placeholder="t('sign.up.login.placeholder')"
        :class="$style.field"
        :errors="errorsMap.email || errorsMap.user_phone || errorsMap.detail"
      />
      <Checkbox
        v-model="model.agreement"
        data-cy="signup-checked"
        :class="$style.checkbox"
        :errors="errorsMap.agreement"
      >
        <template #label>
          <i18n-t keypath="sign.up.agreement.text">
            <template #policy>
              <a
                :href="files.policy"
                data-role="trigger"
                target="_blank"
                @click.stop
              >{{ t('sign.up.agreement.policy') }}</a>
            </template>
          </i18n-t>
        </template>
      </Checkbox>
      <div :class="$style.actions">
        <Btn
          data-cy="signup_demo"
          :label="t('sign.up.demo')"
          state="danger"
          :class="$style.action"
          @click="signDemo"
        />
        <Btn
          data-cy="signup_btn"
          :label="t('sign.up.submit')"
          :class="$style.action"
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
  SignUpModel, SignUpResponse, UserRole, useUser,
} from '@/hooks/useUser';
import Btn from '@/components/btn/Btn.vue';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import { DictType, useDicts } from '@/hooks/useDicts';
import { useCaptcha } from '@/hooks/useCaptcha';

export default defineComponent({
  name: 'Index',
  components: { Checkbox, Btn, TextInput },
  setup() {
    const { t } = useI18n();

    const {
      signIn,
      signUp,
      registrationData,
    } = useUser();

    const model = ref<SignUpModel>({
      login: registrationData.value?.phone || registrationData.value?.email || '',
      inn: registrationData.value?.inn || '',
      agreement: false,
    });

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors<keyof SignUpResponse>();

    const router = useRouter();

    const {
      runCaptcha,
    } = useCaptcha();

    const submit = async () => {
      clearErrors();

      let captcha = '';
      try {
        captcha = await runCaptcha('REGISTER');
      } catch (e) {
        setErrors([['captcha', t('captcha.error')]] as unknown as SourceErrors<keyof SignUpResponse>);
        return;
      }
      const { status, response } = await signUp({
        ...model.value,
        captcha,
      });

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof SignUpResponse>);
      } else {
        await router.push({ name: 'sign-confirm' });
      }
    };

    const signDemo = async () => {
      await signIn({ demoRole: UserRole.company, agreement: true });
    };

    const {
      getDictMap,
    } = useDicts();

    const files = getDictMap<{[key in 'policy']: string}>(DictType.files);

    return {
      t,

      files,

      model,

      submit,
      signDemo,

      errorsMap,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
