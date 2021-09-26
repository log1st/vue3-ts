<template>
  <div
    :class="[
      $style.dialog,
      $style.default,
    ]"
  >
    <div :class="$style.title">
      {{ t('companies.add.title') }}
    </div>
    <form
      :class="$style.form"
      @submit.prevent="submit"
    >
      <SelectInput
        v-model="model.inn"
        v-model:query.delay:500="companiesFilterModel.query"
        is-searchable
        value-field="data.inn"
        display-field="value"
        :options="companies"
        :class="$style.field"
        :placeholder="t('companies.add.inn.placeholder')"
        state="primary"
        :errors="errorsMap.inn"
      />
      <div :class="$style.actions">
        <Btn
          state="tertiary"
          :label="t('companies.add.cancel')"
          :class="$style.action"
          @click="close"
        />
        <Btn
          state="primary"
          :label="t('companies.add.submit')"
          :class="$style.action"
          type="submit"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Btn from '@/components/btn/Btn.vue';
import { AddCompanyModel, AddCompanyResponse, useCompanies } from '@/hooks/useCompanies';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import SelectInput from '@/components/selectInput/SelectInput.vue';
import { useActiveTable } from '@/hooks/useActiveTable';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { IToastLevel, useToast } from '@/hooks/useToast';

export default defineComponent({
  name: 'AddCompanyDialog',
  components: { SelectInput, Btn },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const close = (event?: PointerEvent) => {
      emit('close', event);
    };

    const {
      addCompany,
      fetchInns,
    } = useCompanies();

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors<keyof AddCompanyResponse>();

    const model = ref<AddCompanyModel>({
      inn: '',
    });

    const {
      showToast,
    } = useToast();

    const {
      records: companies,
      filtersModel: companiesFilterModel,
    } = useActiveTable<{ query: string; inn: string }, any, 'inn'>({
      keyField: 'inn',
      async fetch({ params, signal }) {
        const { response } = await fetchInns({ ...params, signal });

        if (params.filters?.query?.length && !response.results.length) {
          await showToast({
            label: 'companies.add.inn.invalid.title',
            message: 'companies.add.inn.invalid.message',
            level: IToastLevel.danger,
          });
        }

        return response;
      },
      filters: computed<Array<ActiveFormField<{ query: string; count: number }>>>(() => ([
        {
          key: 'query',
          field: 'query',
          type: ActiveFormFieldType.input,
          defaultValue: '',
        },
        {
          key: 'count',
          field: 'count',
          type: ActiveFormFieldType.input,
          defaultValue: 1,
        },
      ])),
    });

    const submit = async () => {
      clearErrors();

      const { status, response } = await addCompany({
        inn: model.value.inn || companiesFilterModel.value.query,
      });

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof AddCompanyResponse>);
      } else {
        close();
      }
    };

    return {
      t,
      close,
      model,
      submit,
      errorsMap,
      companies,
      companiesFilterModel,
    };
  },
});
</script>

<style lang="scss" module>
@import "addCompanyDialog";
</style>
