<template>
  <div :class="$style.page">
    <div :class="$style.title">
      {{ t('sign.in.title') }}
    </div>
    <form
      data-cy="signin_from"
      :class="$style.form"
      @submit.prevent="submit"
    >
      <TextInput
        v-model="model.login"
        data-cy="sign-in-input-login"
        :placeholder="t('sign.in.login.placeholder')"
        :class="$style.field"
      />
      <TextInput
        v-model="model.password"
        data-cy="sign-in-input-pass"
        :placeholder="t('sign.in.password.placeholder')"
        :class="$style.field"
        type="password"
        :errors="errorsMap.detail"
      />
      <Checkbox
        v-model="model.agreement"
        :class="$style.checkbox"
        :errors="errorsMap.agreement"
        data-cy="signip-checked"
      >
        <template #label>
          <i18n-t keypath="sign.in.agreement.text">
            <template #policy>
              <a
                :href="files.policy"
                data-role="trigger"
                target="_blank"
                @click.stop
              >{{ t('sign.in.agreement.policy') }}</a>
            </template>
          </i18n-t>
        </template>
      </Checkbox>
      <router-link
        :class="$style.forgot"
        :to="{name: 'sign-forgot'}"
      >
        <span>
          {{ t('sign.in.forgot') }}
        </span>
      </router-link>
      <div :class="$style.actions">
        <Btn
          data-cy="demo_btn"
          :label="t('sign.in.demo')"
          state="danger"
          :class="$style.action"
          @click="signDemo"
        />
        <Btn
          data-cy="singin_btn"
          :label="t('sign.in.submit')"
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
import TextInput from '@/components/textInput/TextInput.vue';
import {
  SignInModel, SignInResponse, SignUpResponse, UserRole, useUser,
} from '@/hooks/useUser';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import Btn from '@/components/btn/Btn.vue';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import { isDev } from '@/utils/env';
import { DictType, useDicts } from '@/hooks/useDicts';
import { useCaptcha } from '@/hooks/useCaptcha';

export default defineComponent({
  name: 'Index',
  components: { Btn, Checkbox, TextInput },
  setup() {
    const { t } = useI18n();

    const model = ref<SignInModel>({
      // @TODO удалить потом
      login: isDev ? 'ap@urrobot.net' : '',
      password: isDev ? 'Stereo!@#8' : '',
      agreement: isDev,
    });

    const {
      signIn,
    } = useUser();

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors<keyof SignInResponse>();

    const {
      runCaptcha,
    } = useCaptcha();

    const submit = async () => {
      clearErrors();

      let captcha = '';
      try {
        captcha = await runCaptcha('LOGIN');
      } catch (e) {
        setErrors([['captcha', t('captcha.error')]] as unknown as SourceErrors<keyof SignUpResponse>);
        return;
      }
      const { status, response } = await signIn({
        ...model.value,
        captcha,
      });

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof SignInResponse>);
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
