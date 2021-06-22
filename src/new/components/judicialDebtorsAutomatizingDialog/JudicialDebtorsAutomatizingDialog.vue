<template>
  <form @submit.prevent="submit" :class="$style.dialog">
    <div :class="$style.amount">
      <div :class="$style.label">
        Сумма для автоматической отправки\формирования судебного приказа в суд
      </div>
      <div :class="$style.amountFields">
        <TextInput
          v-model.number="model.amount_from"
          :state="['primary', 'dark']"
          :error="errorsMap.amount_from"
        >
          <template #prepend>
            от
          </template>
        </TextInput>
        <TextInput
          v-model.number="model.amount_to"
          :state="['primary', 'dark']"
          :error="errorsMap.amount_to"
        >
          <template #prepend>
            до
          </template>
        </TextInput>
      </div>
    </div>
    <div :class="$style.claimFilling">
      <RadioGroup
        v-model="model.auto_filing_claim"
        label="Подача судебного приказа\иска в суд"
        :options="claimFillingOptions"
        :error="errorsMap.auto_filing_claim"
      />
    </div>
    <div :class="$style.autoExecutive">
      <SelectInput
        label="Автоматически переводить должника в Исполнительное производство при получении судебного приказа?"
        v-model="model.auto_transfer"
        :options="yesOrNoOptions"
        :state="['dark', 'primary']"
        :error="errorsMap.auto_transfer"
      />
    </div>
    <div :class="$style.egrn">
      <SelectInput
        label="Требуется заказ выписки из ЕГРН?"
        v-model="model.need_rosreestr_discharge"
        :options="yesOrNoOptions"
        :state="['dark', 'primary']"
        :error="errorsMap.need_rosreestr_discharge"
      />
    </div>
    <div :class="$style.autoEgrn">
      <SelectInput
        label="Заказ автоматически выписки из ЕГРН?"
        v-model="model.auto_discharge"
        :options="yesOrNoOptions"
        :state="['dark', 'primary']"
        :error="errorsMap.auto_discharge"
        :is-disabled="!model.need_rosreestr_discharge"
      />
    </div>
    <div :class="$style.checks">
      <Checkbox v-model="model.characteristicsState" label="Выписка о характеристиках" :class="$style.check"
                :is-disabled="!model.need_rosreestr_discharge"
                :error="errorsMap.characteristicsState"/>
      <Checkbox v-model="model.rightTransfers" label="Выписка о переходе прав" :class="$style.check"
                :is-disabled="!model.need_rosreestr_discharge"
                :error="errorsMap.rightTransfers"/>
    </div>
    <div :class="$style.period">
      <SelectInput
        :is-disabled="!model.auto_discharge || !model.need_rosreestr_discharge"
        v-model="model.discharge_periodic_month"
        :options="periodOptions"
        :state="['dark', 'primary']"
        label="Период автоматического обновления выписки"
        :error="errorsMap.discharge_periodic_month"
      />
    </div>
    <div :class="[$style.employeeLabel, $style.label]">
      Формирование реестра для оплаты госпошлины
    </div>
    <div :class="$style.employee">
      <div :class="$style.employeeFields">
        <SelectInput
          v-model="model.employees"
          is-multiple
          label="Выбор сотрудника"
          :options="employees"
          placeholder="Выберите"
          value-prop="id"
          :display-prop="['last_name', 'first_name']"
          :state="['dark', 'primary']"
          :class="$style.employeeField"
          display-value-template="{n, plural, =1{Один сотрудник} one{# сотрудник} few{# сотрудника} other{# сотрудников}}"
          :error="errorsMap.employees"
        />
        <SelectInput
          v-model="model.employeeAddress"
          label="Введите e-mail ответственного сотрудника при оплате госпошлины"
          is-fillable
          is-multiple
          placeholder="Введите"
          :state="['dark', 'primary']"
          :class="$style.employeeField"
          display-value-template="{n, plural, =1{Один адрес} one{# адрес} few{# адреса} other{# адресов}}"
          :error="errorsMap.employeeAddress"
        />
      </div>
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
  name: "JudicialDebtorsAutomatizingDialog",
  components: {TextInput, Checkbox, Btn, SelectInput, RadioGroup},
  setup(props, {emit}) {
    const getDefaultModel = () => ({
      auto_filing_claim: false,
      auto_transfer: false,
      discharge_periodic_month: 12,
      characteristicsState: false,
      rightTransfers: false,
      need_rosreestr_discharge: false,
      auto_discharge: false,
      employees: [],
      employeeAddress: [],
      amount_from: 10000,
      amount_to: null,
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

    const claimFillingOptions = computed(() => ([
      {
        value: true,
        label: 'Автоматически (с использованием ЭЦП)'
      },
      {
        value: false,
        label: 'Вручную'
      }
    ]));

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

      claimFillingOptions,
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
@import './judicialDebtorsAutomatizingDialog';
</style>
