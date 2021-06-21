<template>
  <form @submit.prevent="submit" :class="$style.dialog">
    <div :class="$style.amount">
      <div :class="$style.label">
        Сумма для автоматической отправки\формирования судебного приказа в суд
      </div>
      <div :class="$style.amountFields">
        <TextInput
          v-model.number="model.minAmount"
          :state="['primary', 'dark']"
        >
          <template #prepend>
            от
          </template>
        </TextInput>
        <TextInput
          v-model.number="model.maxAmount"
          :state="['primary', 'dark']"
        >
          <template #prepend>
            до
          </template>
        </TextInput>
      </div>
    </div>
    <div :class="$style.claimFilling">
      <RadioGroup
        v-model="model.claimFilling"
        label="Подача судебного приказа\иска в суд"
        :options="claimFillingOptions"
      />
    </div>
    <div :class="$style.autoExecutive">
      <SelectInput
        label="Автоматически переводить должника в Исполнительное производство при получении судебного приказа?"
        v-model="model.autoExecutive"
        :options="yesOrNoOptions"
        :state="['dark', 'primary']"
      />
    </div>
    <div :class="$style.egrn">
      <SelectInput
        label="Требуется заказ выписки из ЕГРН?"
        v-model="model.egrn"
        :options="yesOrNoOptions"
        :state="['dark', 'primary']"
      />
    </div>
    <div :class="$style.autoEgrn">
      <SelectInput
        label="Заказ автоматически выписки из ЕГРН?"
        v-model="model.autoEgrn"
        :options="yesOrNoOptions"
        :state="['dark', 'primary']"
      />
    </div>
    <div :class="$style.checks">
      <Checkbox v-model="model.characteristicsState" label="Выписка о характеристиках" :class="$style.check"/>
      <Checkbox v-model="model.rightTransfers" label="Выписка о переходе прав" :class="$style.check"/>
    </div>
    <div :class="$style.period">
      <SelectInput
        v-model="model.period"
        :options="periodOptions"
        :state="['dark', 'primary']"
        label="Период автоматического обновления выписки"
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
import {defineComponent, ref, computed} from "@vue/composition-api";
import RadioGroup from "@/new/components/radioGroup/RadioGroup";
import SelectInput from "@/new/components/selectInput/SelectInput";
import Btn from "@/new/components/btn/Btn";
import Checkbox from "@/new/components/checkbox/Checkbox";
import {useActiveTable} from "@/new/components/activeTable/useActiveTable";
import {formatMessage} from "@/new/utils/messageFormat";
import TextInput from "@/new/components/textInput/TextInput";
import {baseURL} from "@/settings/config";

export default defineComponent({
  name: "JudicialDebtorsAutomatizingDialog",
  components: {TextInput, Checkbox, Btn, SelectInput, RadioGroup},
  setup() {
    const getDefaultModel = () => ({
      claimFilling: 'auto',
      autoExecutive: true,
      period: 3,
      characteristicsState: true,
      rightTransfers: false,
      egrn: true,
      autoEgrn: true,
      employees: [],
      employeeAddress: [],
      minAmount: null,
      maxAmount: null,
    });

    const model = ref(getDefaultModel());

    const claimFillingOptions = computed(() => ([
      {
        value: 'auto',
        label: 'Автоматически (с использованием ЭЦП)'
      },
      {
        value: 'manual',
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

    const periodOptions = computed(() => (Array(25 - 3).fill(null).map((i, index) => ({
      value: index + 3,
      label: formatMessage('{n, plural, =1{Каждый месяц} one{Каждый # месяц} few{Каждые # месяца} other{Каждые # месяцев}}', {
        n: index + 3,
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

    const submit = () => {
      console.log(model.value);
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
    }
  }
})
</script>

<style lang="scss" module>
@import './judicialDebtorsAutomatizingDialog';
</style>
