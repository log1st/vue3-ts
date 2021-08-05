<template>
  <form @submit.prevent="submit" :class="$style.form">
    <ConfirmCode v-model="code" :class="$style.code"/>
    <template v-if="withResend">
      <div :class="$style.resend" v-if="isResendAvailable" @click="resend">Отправить повторно</div>
      <div :class="$style.resending" v-else>
        {{resendingLabel}}
      </div>
    </template>
    <Btn :is-loading="isLoading" :class="$style.action" label="Назад" @click="goBack" v-if="!code.length || code.length < 6"/>
    <Btn :is-loading="isLoading" :class="$style.action" label="Отправить" type="submit" v-else/>
  </form>
</template>

<script>
import ConfirmCode from "@/new/components/confirmCode/ConfirmCode";
import Btn from "@/new/components/btn/Btn";
import {computed, onBeforeUnmount, ref} from "@vue/composition-api";
export default {
  name: "ConfirmForm",
  components: {Btn, ConfirmCode},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    isLoading: Boolean,
    withResend: {
      type: Boolean,
      default: true,
    },
    modelValue: String,
  },
  setup(props, {emit}) {
    const code = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      }
    })
    const isResendAvailable = ref(true);

    let resendInterval;
    onBeforeUnmount(() => {
      clearInterval(resendInterval)
    })
    const resendingLeft = ref(60);

    const resendingLabel = computed(() => (
      `${[
        String(Math.floor(resendingLeft.value / 60)).padStart(2, '0'),
        String(resendingLeft.value % 60).padStart(2, '0')
      ].join(':')} ${resendingLeft.value >= 60 ? 'мин' : 'сек'}`
    ))

    const resend = async () => {
      emit('resend');
      isResendAvailable.value = false;
      resendingLeft.value = 60;
      resendInterval = setInterval(() => {
        if(resendingLeft.value <= 0) {
          clearInterval(resendInterval);
          isResendAvailable.value = true;
        }
        resendingLeft.value -= 1;
      }, 1000)
    }

    const goBack = () => {
      emit('back');
    }

    const submit = () => {
      emit('submit', code.value)
    }

    return {
      code,
      isResendAvailable,
      resendInterval,
      resendingLabel,
      resend,
      goBack,
      submit,
    }
  }
}
</script>

<style lang="scss" module>
@import "./confirmForm";
</style>
