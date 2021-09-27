<template>
  <form
    :class="$style.page"
    @submit.prevent="submit"
  >
    <div :class="$style.title">
      {{ t('title') }}
    </div>
    <div :class="$style.form">
      <TextInput
        v-model="model.oldPassword"
        type="password"
        :placeholder="t('oldPassword')"
        state="default"
        :class="$style.field"
        :errors="errorsMap.old_password"
      />
      <TextInput
        v-model="model.password"
        type="password"
        :placeholder="t('password')"
        state="default"
        :class="$style.field"
        :errors="errorsMap.password"
      />
      <TextInput
        v-model="model.confirmation"
        type="password"
        :placeholder="t('confirmation')"
        state="default"
        :class="$style.field"
        :errors="errorsMap.confirmation"
      />
    </div>
    <div :class="$style.actions">
      <Btn
        state="tertiary"
        :label="t('cancel')"
        :to="{name: 'index'}"
        :class="$style.action"
      />
      <Btn
        state="primary"
        type="submit"
        :label="t('submit')"
        :class="$style.action"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import TextInput from '@/components/textInput/TextInput.vue';
import {
  ChangePasswordModel,
  ChangePasswordResponse,
  useUser,
} from '@/hooks/useUser';
import Btn from '@/components/btn/Btn.vue';
import { SourceErrors, useErrors } from '@/hooks/useErrors';

export default defineComponent({
  name: 'Index',
  components: { Btn, TextInput },
  setup() {
    const { t } = useLocalI18n('panel.password');

    const model = ref<ChangePasswordModel>({
      oldPassword: '',
      password: '',
      confirmation: '',
    });

    const {
      changePassword,
    } = useUser();

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors<keyof ChangePasswordResponse>();

    const router = useRouter();

    const submit = async () => {
      clearErrors();

      const { status, response } = await changePassword(model.value);

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof ChangePasswordResponse>);
      } else {
        await router.push({ name: 'index' });
      }
    };

    return {
      t,
      model,
      errorsMap,
      submit,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
