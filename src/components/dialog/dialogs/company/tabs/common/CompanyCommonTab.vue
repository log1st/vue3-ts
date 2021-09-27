<template>
  <form
    :class="$style.tab"
    @submit.prevent="submit"
  >
    <div
      v-for="group in groups"
      :key="group.key"
      :class="$style.group"
    >
      <div :class="$style.title">
        {{ group.label }}
      </div>
      <div :class="$style.fields">
        <div
          v-for="field in group.fields"
          :key="field.key"
          :class="$style.field"
        >
          <div :class="$style.label">
            {{ field.label }}
            <Btn
              v-if="
                isEditing
                  && ['physical_address', 'postal_address_zip_code'].includes(field.key)
                  && model[field.field.field] !== model.legal_address
              "
              state="tertiary"
              :class="$style.action"
              :label="t('company.common.asLegalAddress')"
              @click="setAddressField(field.key)"
            />
          </div>
          <ActiveField
            v-if="isEditing && field.field"
            v-model="model[field.field.field]"
            :class="$style.input"
            :type="field.field.type"
            :options="field.field.options"
            state="primary"
            :errors="errorsMap[field.field.field]"
            :delay="0"
          />
          <div
            v-else
            :class="$style.value"
          >
            <template v-if="company[field.key]">
              <template v-if="['taxation_system'].includes(field.key)">
                {{ companyTaxationSystemsMap[company[field.key]] }}
              </template>
              <template v-else-if="['type_peni_calculation'].includes(field.key)">
                {{ companyPeniCalculationTypesMap[company[field.key]] }}
              </template>
              <template v-else>
                {{ company[field.key] }}
              </template>
            </template>
            <NA v-else />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isEditing"
      :class="$style.actions"
    >
      <Btn
        state="tertiary"
        :label="t('company.common.cancel')"
        :class="$style.action"
        @click="reset"
      />
      <Btn
        state="primary"
        :label="t('company.common.submit')"
        :class="$style.action"
        type="submit"
      />
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, toRefs, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Company,
  UpdateCompanyModel,
  UpdateCompanyResponse,
  useCompanies,
} from '@/hooks/useCompanies';
import NA from '@/components/na/NA.vue';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import ActiveField from '@/components/activeField/ActiveField.vue';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import Btn from '@/components/btn/Btn.vue';
import { awaitFrame } from '@/utils/window';
import { formatPhone } from '@/utils/string';
import { DictType, useDicts } from '@/hooks/useDicts';
import { ISelectInput } from '@/components/selectInput/useSelectInput';
import { useBanks } from '@/hooks/useBanks';

export default defineComponent({
  name: 'CompanyCommonTab',
  components: { Btn, ActiveField, NA },
  props: {
    company: {
      type: Object as PropType<Company>,
      required: true,
    },
    isEditing: Boolean,
  },
  emits: ['update:isEditing'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { company, isEditing } = toRefs(props);
    const model = ref<UpdateCompanyModel['payload']>(company.value!);
    watch(company, (newCompany) => {
      model.value = { ...newCompany };
    });
    watch(isEditing, (value) => {
      if (!value) {
        model.value = { ...props.company };
      }
    });

    const {
      getDict,
      getDictMap,
    } = useDicts();

    const companyTaxationSystems = getDict(DictType.companyTaxationSystems);
    const companyPeniCalculationTypes = getDict(DictType.companyPeniCalculationTypes);

    type Groups = Array<{
      key: string;
      label: string;
      fields: Array<{
        key: string | keyof Company;
        label: string;
        field?: ActiveFormField<Company>;
      }>;
    }>
    const groups = computed<Groups>(() => ([
      {
        key: 'name',
        label: t('company.common.name.title'),
        fields: [
          {
            key: 'name_full',
            label: t('company.common.name.name_full.label'),
          },
          {
            key: 'name_short',
            label: t('company.common.name.name_short.label'),
          },
        ],
      },
      {
        key: 'activity',
        label: t('company.common.activity.title'),
        fields: [
          {
            key: 'type',
            label: t('company.common.activity.type.label'),
          },
          {
            key: 'okopf',
            label: t('company.common.activity.okopf.label'),
          },
          {
            key: 'taxation_system',
            label: t('company.common.activity.taxation_system.label'),
            field: {
              key: 'taxation_system',
              field: 'taxation_system',
              type: ActiveFormFieldType.select,
              options: {
                placeholder: t('company.common.activity.taxation_system.label'),
                options: companyTaxationSystems.value as ISelectInput<any>['options'],
              },
            },
          },
          {
            key: 'type_peni_calculation',
            label: t('company.common.activity.type_peni_calculation.label'),
            field: {
              key: 'type_peni_calculation',
              field: 'type_peni_calculation',
              type: ActiveFormFieldType.select,
              options: {
                placeholder: t('company.common.activity.type_peni_calculation.label'),
                options: companyPeniCalculationTypes.value as ISelectInput<any>['options'],
              },
            },
          },
        ],
      },
      {
        key: 'contacts',
        label: t('company.common.contacts.title'),
        fields: [
          {
            key: 'phone',
            label: t('company.common.contacts.phone.label'),
          },
          {
            key: 'site',
            label: t('company.common.contacts.site.label'),
          },
          {
            key: 'email',
            label: t('company.common.contacts.email.label'),
          },
          {
            key: 'email_buh',
            label: t('company.common.contacts.email_buh.label'),
          },
        ].map((field) => ({
          ...field,
          field: {
            key: field.key,
            field: field.key,
            type: ActiveFormFieldType.input,
            options: {
              placeholder: t(`company.common.contacts.${field.key}.label`),
            },
          },
        })),
      },
      {
        key: 'direction',
        label: t('company.common.direction.title'),
        fields: [
          {
            key: 'director',
            label: t('company.common.direction.director.label'),
          },
        ],
      },
      {
        key: 'addresses',
        label: t('company.common.addresses.title'),
        fields: [
          {
            key: 'legal_address',
            label: t('company.common.addresses.legal_address.label'),
          },
          {
            key: 'physical_address',
            label: t('company.common.addresses.physical_address.label'),
          },
          {
            key: 'postal_address_zip_code',
            label: t('company.common.addresses.postal_address_zip_code.label'),
          },
        ].map((field) => ({
          ...field,
          field: ['physical_address', 'postal_address_zip_code'].includes(field.key) ? {
            key: field.key,
            field: field.key,
            type: ActiveFormFieldType.input,
            options: {
              placeholder: t(`company.common.addresses.${field.key}.label`),
            },
          } : undefined,
        })),
      },
      {
        key: 'requisites',
        label: t('company.common.requisites.title'),
        fields: [
          {
            key: 'inn',
            label: t('company.common.requisites.inn.label'),
          },
          {
            key: 'kpp',
            label: t('company.common.requisites.kpp.label'),
          },
          {
            key: 'ogrn',
            label: t('company.common.requisites.ogrn.label'),
          },
          {
            key: 'ras_schet',
            label: t('company.common.requisites.ras_schet.label'),
          },
          {
            key: 'bic',
            label: t('company.common.requisites.bic.label'),
          },
          {
            key: 'full_name_bank',
            label: t('company.common.requisites.full_name_bank.label'),
          },
          {
            key: 'kor_schet',
            label: t('company.common.requisites.kor_schet.label'),
          },
        ].map((field) => ({
          ...field,
          field: ['ras_schet', 'bic'].includes(field.key) ? {
            key: field.key,
            field: field.key,
            type: ActiveFormFieldType.input,
            options: {
              placeholder: t(`company.common.requisites.${field.key}.label`),
            },
          } : undefined,
        })),
      },
    ]));

    const {
      updateCompany,
    } = useCompanies();

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors<keyof UpdateCompanyResponse>();

    const reset = async () => {
      await awaitFrame();
      emit('update:isEditing', false);
    };

    const submit = async () => {
      clearErrors();
      const { status, response } = await updateCompany({
        id: props.company.id,
        payload: model.value,
      });

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof UpdateCompanyResponse>);
      } else {
        await reset();
      }
    };
    const companyTaxationSystemsMap = getDictMap(DictType.companyTaxationSystems);
    const companyPeniCalculationTypesMap = getDictMap(DictType.companyPeniCalculationTypes);

    const setAddressField = async (field: keyof UpdateCompanyModel['payload']) => {
      await awaitFrame();
      (model.value as any)[field] = model.value.legal_address;
    };

    const {
      fetchBanks,
    } = useBanks();

    watch(computed(() => company.value.bic), async (bik) => {
      if (!bik) {
        return;
      }
      const { status, response } = await fetchBanks({
        limit: 1,
        page: 1,
        filters: {
          bik,
        },
      });
      if (status) {
        const bank = response.results[0];
        if (bank) {
          company.value.kor_schet = bank.data.correspondent_account;
          company.value.full_name_bank = bank.value;
        }
      }
    }, {
      immediate: true,
    });

    return {
      t,

      errorsMap,

      model,
      groups,

      submit,
      reset,

      formatPhone,

      companyTaxationSystemsMap,
      companyPeniCalculationTypesMap,

      setAddressField,
    };
  },
});
</script>

<style lang="scss" module>
@import "./companyCommonTab";
</style>
