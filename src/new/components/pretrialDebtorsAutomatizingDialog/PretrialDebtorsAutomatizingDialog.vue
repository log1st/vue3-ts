<template>
  <form @submit.prevent="submit" :class="$style.dialog">
    <div :class="$style.smsAmount">
      <TextInput label="Сумма для отправки SMS-уведомления должнику" v-model="model.debt_threshold" :state="['primary', 'dark']"/>
    </div>
    <div :class="$style.smsParams" v-if="false">
      <div :class="$style.label">Параметры SMS-уведомления</div>
      <Checkbox v-model="allSmsParams" :class="$style.allParams" label="Выбрать все"/>
      <div :class="$style.params">
        <Checkbox v-model="model.smsParams[param]" v-for="param in ['full_name', 'address', 'debt', 'penalty']" :key="param" :label="{
          full_name: 'ФИО',
          address: 'Адрес',
          debt: 'Задолженность',
          penalty: 'Пени'
        }[param]"/>
      </div>
    </div>
    <div :class="$style.smsPeriod">
      <SelectInput
        :state="['primary', 'dark']"
        v-model="model.notification_period"
        :options="notificationPeriods"
        label="Период рассылки*"
      />
    </div>
    <div :class="$style.smsTime">
      <div :class="$style.label">
        Время рассылки*
      </div>
      <div :class="$style.times">
        <TextInput
          :state="['primary', 'dark']"
        >
          <template #prepend>с</template>
        </TextInput>
        <TextInput
          :state="['primary', 'dark']"
        >
          <template #prepend>по</template>
        </TextInput>
      </div>
    </div>
    <div :class="$style.smsNumber" v-if="false">
      <SelectInput
        :state="['primary', 'dark']"
        v-model="model.smsNumber"
        :options="smsNumbers"
        label="Выбор номера для уведомлений**"
      />
    </div>
    <div :class="$style.footer">
      <div :class="$style.footerLine">*Кроме выходных и праздничных дней</div>
      <div :class="$style.footerLine" v-if="false">**Настройка номера происходит в “<router-link :to="'/integration'">Интеграция</router-link>”</div>
    </div>

    <div :class="$style.voiceAmount">
      <TextInput label="Дней до начала работы" v-model="model.wait_days_before_notify" :state="['primary', 'dark']"/>
    </div>
    <div :class="$style.voiceParams" v-if="false">
      <div :class="$style.label">Параметры голосового уведомления</div>
      <Checkbox v-model="allVoiceParams" :class="$style.allParams" label="Выбрать все"/>
      <div :class="$style.params">
        <Checkbox v-model="model.voiceParams[param]" v-for="param in ['full_name', 'address', 'debt', 'penalty']" :key="param" :label="{
          full_name: 'ФИО',
          address: 'Адрес',
          debt: 'Задолженность',
          penalty: 'Пени'
        }[param]"/>
      </div>
    </div>
    <div :class="$style.voicePeriod">
      <SelectInput
        :state="['primary', 'dark']"
        v-model="model.notification_period"
        :options="notificationPeriods"
        label="Период рассылки*"
      />
    </div>
    <div :class="$style.voiceTime">
      <div :class="$style.label">
        Время уведомления*
      </div>
      <div :class="$style.times">
        <TextInput
          :state="['primary', 'dark']"
        >
          <template #prepend>с</template>
        </TextInput>
        <TextInput
          :state="['primary', 'dark']"
        >
          <template #prepend>по</template>
        </TextInput>
      </div>
    </div>
    <div :class="$style.voiceNumber" v-if="false">
      <SelectInput
        :state="['primary', 'dark']"
        v-model="model.voiceNumber"
        :options="voiceNumbers"
        label="Выбор номера для уведомлений**"
      />
    </div>

    <div :class="$style.priority">
      <div :class="$style.label">
        Приоритетное уведомление
      </div>
      <div :class="$style.params">
        <Checkbox v-model="model.priority" v-for="type in ['sms', 'voice']" :key="type" :label="{
        sms: 'SMS',
        email: 'E-mail',
        voice: 'Голосовое',
        messengers: 'Мессенджеры'
      }[type]" :true-value="type"/>
      </div>
    </div>
    <div :class="$style.claimPeriod" v-if="false">
      <div :class="$style.label">Перевод в судебное производство по количеству месяцев просрочки</div>
      <div :class="$style.checkable">
        <Checkbox v-model="model.autoClaimPeriodEnabled"/>
        <SelectInput :state="['primary', 'dark']" v-model="autoClaimPeriod" :options="notificationPeriods"/>
      </div>
    </div>
    <div :class="$style.claimAmount">
      <div :class="$style.label">
        Сумма для перевода должника в раздел судебное производство
      </div>
      <div :class="$style.checkable">
        <Checkbox v-model="model.autoClaimAmountEnabled"/>
        <TextInput label="Для физ. лиц" :is-disabled="!model.autoClaimAmountEnabled" v-model="model.court_threshold"/>
      </div>
      <div :class="$style.checkable">
        <div></div>
        <TextInput label="Для юр. лиц" :is-disabled="!model.autoClaimAmountEnabled" v-model="model.wait_days_before_court"/>
      </div>
    </div>

    <div :class="$style.smsIfNoVoice">
      <SelectInput :state="['primary', 'dark']" v-model="model.sms_enabled" label="Отправка смс-увдомления, если номер занят/недоступен" :options="yesOrNoOptions"/>
    </div>
    <div :class="$style.autoPretrial">
      <SelectInput :state="['primary', 'dark']" v-model="model.automation_enabled" label="Автоматическое формирование досубного требования" :options="yesOrNoOptions"/>
    </div>
    <div :class="$style.autoPretrialAmount" v-if="false">
      amount
    </div>

    <div :class="$style.actions">
      <Btn @click="reset" state="secondary" label="Сбросить" :class="$style.action"/>
      <Btn type="submit" state="primary" label="Применить" :class="$style.action"/>
    </div>
  </form>
</template>

<script>
import {defineComponent, ref, computed, onMounted} from "@vue/composition-api";
import RadioGroup from "@/new/components/radioGroup/RadioGroup";
import SelectInput from "@/new/components/selectInput/SelectInput";
import Btn from "@/new/components/btn/Btn";
import Checkbox from "@/new/components/checkbox/Checkbox";
import {useActiveTable} from "@/new/components/activeTable/useActiveTable";
import {formatMessage} from "@/new/utils/messageFormat";
import TextInput from "@/new/components/textInput/TextInput";
import {baseURL} from "@/settings/config";
import {useErrors} from "@/new/hooks/useErrors";

export default defineComponent({
  name: "PretrialDebtorsAutomatizingDialog",
  components: {TextInput, Checkbox, Btn, SelectInput, RadioGroup},
  setup(props, {emit}) {
    const getDefaultModel = () => ({
        debt_threshold: 0,
        court_threshold: 0,
        wait_days_before_court: 0,
        wait_days_before_notify: 0,
        notification_period: 0,
        sms_enabled: false,
        voice_enabled: false,
        sms_priority: false,
        failed_attempts: 0,
        notification_shedule_days: [],
        notification_shedule_wdays: [],
        sms_operator_uuid: null,
        voice_operator_uuid: null,
        kvint_id: 0,
        automation_enabled: false,
        timezone: 0,
        sms_attempts: 0,
        call_attempts: 0,
        retries_count: 0,
        auto_discharge: false,
        discharge_type: 'both',
        discharge_periodic_month: 1,
        max_discharges_per_day: 1,
        amount_from: 10000,
        amount_to: null,
        notify_emails: [],
        send_type: 'send_to_email',
        need_rosreestr_discharge: false,
        amount_setting: false,
        payment_of_duties: false,
        auto_filing_claim: false,
        auto_change_status: false,
        auto_transfer: false,
        debtor_data_registry_receiver_name: null,
        debtor_data_registry_payment_name: null,
        debtor_data_registry_columns_order: [],
      smsParams: {
          full_name: false,
          address: false,
          debt: false,
          penalty: false,
      },
      voiceParams: {
        full_name: false,
        address: false,
        debt: false,
        penalty: false,
      },
      priority: 'sms',
    });

    const allSmsParams = computed({
      get() {
        return Object.values(model.value.smsParams).reduce((acc, cur) => acc && cur, true)
      },
      set(value) {
        Object.keys(model.value.smsParams).forEach(key => {
          model.value.smsParams[key] = value
        })
      }
    })

    const allVoiceParams = computed({
      get() {
        return Object.values(model.value.voiceParams).reduce((acc, cur) => acc && cur, true)
      },
      set(value) {
        Object.keys(model.value.voiceParams).forEach(key => {
          model.value.voiceParams[key] = value
        })
      }
    })

    const model = ref(getDefaultModel());

    const fetchData = async () => {
      const response = await axios({
        method: 'get',
        url: `${baseURL}/api/account/company-settings/${localStorage.getItem('defaultCompany')}/`
      });

      model.value = {
        ...getDefaultModel(),
        ...response.data,
      };
    }

    onMounted(fetchData);

    const yesOrNoOptions = computed(() => ([
      {
        value: false,
        label: 'Нет'
      },
      {
        value: true,
        label: 'Да'
      },
    ]));

    const notificationPeriods = computed(() => (Array(31).fill(null).map((i, index) => ({
      value: index + 1,
      label: formatMessage('{n, plural, =1{Один раз месяц} one{# раз в месяц} few{# раза в месяц} other{# раз в месяц}}', {
        n: index + 1,
      })
    }))))

    const {
      filtersModel: employeesFilterModel,
      records: employees,
    } = useActiveTable({
      limit: ref(10),
      async fetch() {
        const response = await axios({
          method: 'get',
          url: `${baseURL}/api/account/company/${localStorage.getItem('defaultCompany')}/employees/`
        });
        return {
          data: {
            count: response.data.count,
            results: response.data,
          }
        };
      }
    });

    const reset = () => {
      model.value = getDefaultModel();
    }

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors();

    const submit = async () => {
      clearErrors();

      try {
        await axios({
          method: 'patch',
          url: `${baseURL}/api/account/company-settings/${localStorage.getItem('defaultCompany')}/`,
          data: model.value,
        })
        emit('close');
      } catch (e) {
        setErrors(
          Object.entries(e.response.data).reduce((acc, [key, [message]]) => ([
            ...acc,
            [key, message]
          ]), [])
        )
      }
    }

    return {
      model,

      yesOrNoOptions,
      notificationPeriods,

      reset,
      submit,

      employees,

      formatMessage,

      errorsMap,

      allSmsParams,
      allVoiceParams,
    }
  }
})
</script>

<style lang="scss" module>
@import './pretrialDebtorsAutomatizingDialog';
</style>
