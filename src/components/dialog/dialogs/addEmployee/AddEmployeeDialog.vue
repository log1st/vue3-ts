<template>
  <div
    :class="[
      $style.dialog,
      $style.default
    ]"
  >
    <div :class="$style.title">
      {{ t('employee.add.title') }}
    </div>
    <form
      :class="$style.form"
      @submit.prevent="submit"
    >
      <ActiveField
        v-for="field in fields"
        :key="field.key"
        v-model="model[field.field]"
        :class="[
          $style.field,
        ]"
        :type="field.type"
        :options="{
          ...(field.options || {}),
          isDisabled: model.is_me
        }"
        state="primary"
        :style="{gridArea: field.key}"
        :label="field.label"
        :errors="errorsMap[field.field]"
        :is-readonly="field.isReadonly"
      />
      <div :style="{gridArea: 'action'}">
        <Btn
          :class="$style.action"
          :label="t('employee.add.submit')"
          state="primary"
          type="submit"
          :is-disabled="model.is_me"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, toRefs, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import {
  CreateEmployeeResponse,
  Employee,
  EmployeeRole,
  useEmployees,
} from '@/hooks/useEmployees';
import { UserRole } from '@/hooks/useUser';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import ActiveField from '@/components/activeField/ActiveField.vue';
import Btn from '@/components/btn/Btn.vue';
import { Company, useCompanies } from '@/hooks/useCompanies';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import { Dict, DictType, useDicts } from '@/hooks/useDicts';
import { ISelectInput } from '@/components/selectInput/useSelectInput';

export default defineComponent({
  name: 'AddEmployeeDialog',
  components: { Btn, ActiveField },
  props: {
    companyId: Number as PropType<Company['id']>,
    employeeId: Number as PropType<Employee['id']>,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const {
      createEmployee,
      fetchEmployee,
      updateEmployee,
    } = useEmployees();

    const model = ref<Partial<Employee>>({
      email: '',
      user_phone: '',
      first_name: '',
      linked_companies: [],
      user_role: UserRole.company,
      employee_role: EmployeeRole.employee,
      position: null,
      is_me: false,
    });

    const { employeeId, companyId } = toRefs(props);
    watch(companyId, (id) => {
      if (!id) {
        return;
      }
      model.value.linked_companies = [id];
    }, {
      immediate: true,
    });
    watch(employeeId, async (id) => {
      if (!id) {
        return;
      }
      const { status, response } = await fetchEmployee({
        id,
        companyId: companyId.value!,
      });
      if (status) {
        model.value = response;
      }
    }, {
      immediate: true,
    });

    const {
      clearErrors,
      setErrors,
      errorsMap,
    } = useErrors<keyof CreateEmployeeResponse>();

    const submit = async () => {
      clearErrors();
      const { status, response } = props.employeeId ? (
        await updateEmployee({
          id: props.employeeId,
          payload: model.value,
          companyId: companyId.value!,
        })
      ) : (
        await createEmployee({
          ...model.value,
          company_id: companyId.value,
        })
      );

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof CreateEmployeeResponse>);
      } else {
        emit('close');
      }
    };

    const {
      companies,
      fetchPositions,
    } = useCompanies();
    const positions = ref<Dict<DictType.employeePositions>>([]);
    watch(companyId, async (id) => {
      if (!id) {
        return;
      }
      const { status, response } = await fetchPositions(id);

      if (status) {
        positions.value = response;
      }
    }, { immediate: true });

    const {
      getDict,
    } = useDicts();

    const employeeRoles = getDict(DictType.employeeRoles);

    const fields = computed<Array<ActiveFormField<Employee>>>(() => ([
      {
        key: 'first_name',
        field: 'first_name',
        label: t('employee.add.first_name.label'),
        type: ActiveFormFieldType.input,
        options: {
          placeholder: t('employee.add.first_name.placeholder'),
        },
      },
      {
        key: 'last_name',
        field: 'last_name',
        label: t('employee.add.last_name.label'),
        type: ActiveFormFieldType.input,
        options: {
          placeholder: t('employee.add.last_name.placeholder'),
        },
      },
      {
        key: 'email',
        field: 'email',
        label: t('employee.add.email.label'),
        type: ActiveFormFieldType.input,
        isReadonly: !!props.employeeId,
        options: {
          placeholder: t('employee.add.email.placeholder'),
        },
      },
      {
        key: 'user_phone',
        field: 'user_phone',
        label: t('employee.add.user_phone.label'),
        type: ActiveFormFieldType.input,
        isReadonly: !!props.employeeId,
        options: {
          placeholder: t('employee.add.user_phone.placeholder'),
        },
      },
      {
        key: 'position',
        field: 'position',
        label: t('employee.add.position.label'),
        type: ActiveFormFieldType.select,
        options: {
          placeholder: t('employee.add.position.placeholder'),
          options: positions.value as ISelectInput<any>['options'],
          displayField: 'name',
          valueField: 'position_id',
        },
      },
      {
        key: 'linked_companies',
        field: 'linked_companies',
        label: t('employee.add.linked_companies.label'),
        type: ActiveFormFieldType.select,
        options: {
          placeholder: t('employee.add.linked_companies.placeholder'),
          multiple: true,
          options: companies.value as ISelectInput<any>['options'],
          valueField: 'id',
          displayField: 'name_short',
        },
      },
      {
        key: 'employee_role',
        field: 'employee_role',
        label: t('employee.add.employee_role.label'),
        type: ActiveFormFieldType.select,
        options: {
          placeholder: t('employee.add.employee_role.placeholder'),
          options: employeeRoles.value as ISelectInput<any>['options'],
        },
      },
    ]));

    return {
      t,
      model,
      submit,
      fields,
      errorsMap,
    };
  },
});
</script>

<style lang="scss" module>
@import "./addEmployeeDialog";
</style>
