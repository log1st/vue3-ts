<template>
  <form
    :class="[
      $style.container,
      $style[productionType]
    ]"
    @submit.prevent="submit"
  >
    <div :class="$style.fields">
      <ActiveField
        v-for="field in fields"
        :key="field.key"
        v-model="model[field.field]"
        :type="field.type"
        :options="field.options"
        state="primary"
        :label="field.type !== 'checkbox' && field.label"
        :class="[
          $style.field,
          $style[field.key]
        ]"
        :errors="errorsMap[field.key]"
        :style="{gridArea: field.key}"
      />
      <div :class="$style.actions">
        <Btn
          :class="$style.action"
          state="quaternary"
          :label="t('reset')"
          @click="reset"
        />
        <Btn
          :class="$style.action"
          state="primary"
          :label="t('submit')"
          type="submit"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { ProductionType } from '@/hooks/useConstructor';
import {
  CompanySettings,
  CompanySettingsDischargeType,
  CompanySettingsSendType,
  useCompanies,
} from '@/hooks/useCompanies';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { getAwaitFrame } from '@/utils/window';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import ActiveField from '@/components/activeField/ActiveField.vue';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import { useActiveTable } from '@/hooks/useActiveTable';
import { Employee, useEmployees } from '@/hooks/useEmployees';
import Btn from '@/components/btn/Btn.vue';

export default defineComponent({
  name: 'Automatizing',
  components: { Btn, ActiveField },
  props: {
    productionType: {
      type: String as PropType<ProductionType>,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useLocalI18n('debtor.automatizing');
    const { t: rootT } = useI18n();

    const getEmptyModel = (): CompanySettings => ({
      amount_from: '',
      amount_setting: true,
      amount_to: '',
      auto_change_status: true,
      auto_discharge: false,
      auto_filing_claim: true,
      auto_transfer: true,
      automation_enabled: false,
      call_attempts: 0,
      company: 0,
      court_threshold: 0,
      debt_threshold: 0,
      debtor_data_registry_columns_order: [],
      debtor_data_registry_payment_name: '',
      debtor_data_registry_receiver_name: '',
      default_region: 0,
      discharge_periodic_month: 0,
      discharge_type: CompanySettingsDischargeType.first,
      failed_attempts: 0,
      id: 0,
      kvint_id: 0,
      max_discharges_per_day: 0,
      need_rosreestr_discharge: true,
      notification_period: 0,
      notification_shedule_days: {},
      notification_shedule_wdays: {},
      notify_emails: [],
      payment_of_duties: true,
      retries_count: 0,
      send_type: CompanySettingsSendType.send_to_court,
      sms_attempts: 0,
      sms_enabled: false,
      sms_operator_uuid: '',
      sms_priority: 0,
      timezone: 0,
      voice_enabled: false,
      voice_operator_uuid: '',
      wait_days_before_court: 0,
      wait_days_before_notify: 0,

      employees: [],
      rosreestr_characteristics: false,
      rosreestr_movement: false,
    });

    const model = ref<CompanySettings>(getEmptyModel());

    const {
      fetchCompanySettings,
      updateCompanySettings,
    } = useCompanies();

    const {
      companyId,
    } = useDefaultCompany();

    const fetchData = async () => {
      if (!companyId.value) {
        return;
      }
      const { status, response } = await fetchCompanySettings(companyId.value);

      if (status) {
        model.value = {
          ...response,

          employees: [],
          rosreestr_characteristics: false,
          rosreestr_movement: false,
        };
      }
    };

    watch(companyId, getAwaitFrame(fetchData), {
      immediate: true,
    });

    const {
      fetchEmployees,
    } = useEmployees();

    const {
      filtersModel: employeesFilterModel,
      records: employees,
    } = useActiveTable<
      Employee,
      Employee,
      'id'
    >({
      keyField: 'id',
      defaultLimit: ref(100),
      async fetch({ params, signal }) {
        const { response } = await fetchEmployees({
          ...params,
          signal,
        });

        return response;
      },
      filters: computed<Array<ActiveFormField<Employee>>>(() => ([
        {
          key: 'company_id',
          field: 'company_id',
          type: ActiveFormFieldType.input,
          defaultValue: companyId.value,
        },
      ])),
    });

    const fields = computed(() => (
      ([
        props.productionType === ProductionType.judicial && {
          key: 'amount_from',
        },
        props.productionType === ProductionType.judicial && {
          key: 'amount_to',
        },
        props.productionType === ProductionType.judicial && {
          key: 'auto_filing_claim',
          type: ActiveFormFieldType.select,
          options: {
            options: [
              { value: true, label: t('autoFilingClaim.automatic') },
              { value: false, label: t('autoFilingClaim.manual') },
            ],
          },
        },
        props.productionType === ProductionType.judicial && {
          key: 'auto_transfer',
          type: ActiveFormFieldType.select,
          options: {
            options: [
              { value: true, label: rootT('other.yes') },
              { value: false, label: rootT('other.no') },
            ],
          },
        },
        props.productionType === ProductionType.judicial && {
          key: 'need_rosreestr_discharge',
          type: ActiveFormFieldType.select,
          options: {
            options: [
              { value: true, label: rootT('other.yes') },
              { value: false, label: rootT('other.no') },
            ],
          },
        },
        props.productionType === ProductionType.judicial && {
          key: 'auto_discharge',
          type: ActiveFormFieldType.select,
          options: {
            options: [
              { value: true, label: rootT('other.yes') },
              { value: false, label: rootT('other.no') },
            ],
            isDisabled: !model.value.need_rosreestr_discharge,
          },
        },
        props.productionType === ProductionType.judicial && {
          key: 'rosreestr_characteristics',
          type: ActiveFormFieldType.checkbox,
        },
        props.productionType === ProductionType.judicial && {
          key: 'rosreestr_movement',
          type: ActiveFormFieldType.checkbox,
        },
        props.productionType === ProductionType.judicial && {
          key: 'discharge_periodic_month',
          type: ActiveFormFieldType.select,
          options: {
            options: Array(24).fill(null).map((i, index) => ({
              value: index + 1,
              label: rootT('other.monthPlural', { n: index + 1 }),
            })),
            isDisabled: !model.value.auto_discharge || !model.value.need_rosreestr_discharge,
            placeholder: rootT('other.choose'),
          },
        },
        props.productionType === ProductionType.judicial && {
          key: 'employees',
          type: ActiveFormFieldType.select,
          options: {
            multiple: true,
            displayField: ['last_name', 'first_name'],
            valueField: 'id',
            isSearchable: true,
            options: employees.value,
          },
          defaultValue: [],
          onQuery: ({ query }) => {
            employeesFilterModel.value.query = query;
          },
        },
        props.productionType === ProductionType.judicial && {
          key: 'notify_emails',
          type: ActiveFormFieldType.select,
          options: {
            multiple: true,
            fillable: true,
            placeholder: rootT('other.choose'),
          },
          defaultValue: [],
          onQuery: ({ query }) => {
            employeesFilterModel.value.query = query;
          },
        },
        props.productionType === ProductionType.pretrial && {
          key: 'debt_threshold',
        },
        props.productionType === ProductionType.pretrial && {
          key: 'notification_period',
          type: ActiveFormFieldType.select,
          options: {
            options: Array(31).fill(null).map((i, index) => ({
              value: index + 1,
              label: rootT('other.perMonthPlural', { n: index + 1 }),
            })),
            placeholder: rootT('other.choose'),
          },
        },
        props.productionType === ProductionType.pretrial && {
          key: 'priority',
          type: ActiveFormFieldType.select,
          options: {
            options: ['sms', 'email', 'voice', 'messengers'].map((value) => ({
              value,
              label: t(`priority.${value}`),
            })),
          },
        },
        props.productionType === ProductionType.pretrial && {
          key: 'court_threshold',
        },
        props.productionType === ProductionType.pretrial && {
          key: 'wait_days_before_court',
        },
        props.productionType === ProductionType.pretrial && {
          key: 'sms_enabled',
          type: ActiveFormFieldType.select,
          options: {
            options: [
              { value: true, label: rootT('other.yes') },
              { value: false, label: rootT('other.no') },
            ],
          },
        },
        props.productionType === ProductionType.pretrial && {
          key: 'automation_enabled',
          type: ActiveFormFieldType.select,
          options: {
            options: [
              { value: true, label: rootT('other.yes') },
              { value: false, label: rootT('other.no') },
            ],
          },
        },
      ] as Array<ActiveFormField<any> | boolean>)
        .filter(Boolean) as Array<ActiveFormField<any>>
    ).map((field) => ({
      ...field,
      field: field.field || field.key,
      label: t(`field.${String(field.key)}`),
      type: field.type || ActiveFormFieldType.input,
      options: {
        ...(field.options || {}),
        [
        field.type === ActiveFormFieldType.checkbox
          ? 'label'
          : 'placeholder'
        ]: field.options?.[
          field.type === ActiveFormFieldType.checkbox
            ? 'label'
            : 'placeholder'
        ] ?? t(`field.${String(field.key)}`),
      },
    })));

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors<keyof CompanySettings>();

    const submit = async () => {
      clearErrors();

      if (!companyId.value) {
        return;
      }

      const { status, response } = await updateCompanySettings({
        id: companyId.value,
        payload: model.value,
      });

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof CompanySettings>);
        return;
      }

      emit('close');
    };

    const reset = () => {
      model.value = getEmptyModel();
    };

    return {
      t,
      reset,

      model,
      submit,
      fields,
      errorsMap,
    };
  },
});
</script>

<style lang="scss" module>
@import "./automatizing";
</style>
