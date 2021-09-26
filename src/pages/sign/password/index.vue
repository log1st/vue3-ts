<template>
  <div :class="$style.page">
    <div :class="$style.title">
      {{ t('sign.password.title') }}
    </div>
    <form
      :class="$style.form"
      @submit.prevent="submit"
    >
      <TextInput
        v-model="model.password"
        :placeholder="t('sign.password.password.placeholder')"
        :errors="errorsMap.password"
        type="password"
        :class="$style.field"
      />
      <TextInput
        v-model="model.passwordConfirmation"
        :placeholder="t('sign.password.passwordConfirmation.placeholder')"
        type="password"
        :errors="errorsMap.passwordConfirmation"
        :class="$style.field"
      />
      <div :class="$style.actions">
        <Btn
          :class="$style.action"
          state="primary"
          :label="t('sign.password.submit')"
          type="submit"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  PasswordModel, PasswordResponse, SignInResponse, useUser,
} from '@/hooks/useUser';
import TextInput from '@/components/textInput/TextInput.vue';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import Btn from '@/components/btn/Btn.vue';

export default defineComponent({
  name: 'Index',
  components: { Btn, TextInput },
  setup() {
    const { t } = useI18n();

    const model = ref<PasswordModel>({
      password: '',
      passwordConfirmation: '',
    });

    const {
      setPassword,
    } = useUser();

    const {
      clearErrors,
      setErrors,
      errorsMap,
    } = useErrors<keyof PasswordResponse>();

    const submit = async () => {
      clearErrors();
      const { status, response } = await setPassword(model.value);

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof SignInResponse>);
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
