<template>
  <form @submit.prevent="submit" :class="$style.dialog">
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
    });

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

    const periodOptions = computed(() => (Array(24).fill(null).map((i, index) => ({
      value: index + 1,
      label: formatMessage('{n, plural, =1{Каждый месяц} one{Каждый # месяц} few{Каждые # месяца} other{Каждые # месяцев}}', {
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
      periodOptions,

      reset,
      submit,

      employees,

      formatMessage,

      errorsMap,
    }
  }
})
</script>

<style lang="scss" module>
@import './pretrialDebtorsAutomatizingDialog';
</style>
