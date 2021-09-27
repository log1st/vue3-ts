<template>
  <div :class="$style.content">
    <form
      :class="$style.form"
      @submit.prevent="submit"
    >
      <div
        v-for="(field, key) in model"
        :key="key"
        :class="$style.field"
      >
        <ActiveField
          v-model="model[key]"
          :is-readonly="!isEditing || ['address', 'full_name'].includes(key)"
          :state="['primary', 'horizontal']"
          :errors="errorsMap[key]"
          :label="t(`field.${key}`)"
          type="input"
          :options="{placeholder: t(`field.${key}`)}"
          :format="{phone_number: 'phone'}[key]"
        />
      </div>
      <div :class="$style.actions">
        <Btn
          v-if="!isEditing"
          state="quinary"
          :class="$style.action"
          prepend-icon="pencil"
          @click="toggleEditing"
        />
        <template v-else>
          <Btn
            state="tertiary"
            :class="$style.action"
            :label="t('cancel')"
            @click="cancel"
          />
          <Btn
            :class="$style.action"
            :label="t('submit')"
            type="submit"
          />
        </template>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, inject, PropType, ref, toRefs, watch,
} from 'vue';
import {
  Debtor,
  DebtorMainProfile,
  UpdateDebtorMainProfileModel,
  useDebtors,
} from '@/hooks/useDebtors';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import ActiveField from '@/components/activeField/ActiveField.vue';
import { useToggle } from '@/hooks/useToggle';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import Btn from '@/components/btn/Btn.vue';
import { getAwaitFrame } from '@/utils/window';
import { ProductionType } from '@/hooks/useConstructor';

export default defineComponent({
  name: 'DebtorCommonMainTab',
  components: { Btn, ActiveField },
  props: {
    debtor: Object as PropType<Debtor>,
    productionType: {
      type: String as PropType<ProductionType>,
      required: true,
    },
  },
  setup(props) {
    const { debtor, productionType } = toRefs(props);
    const { t } = useLocalI18n('debtor.common.main');

    const getEmptyModel = () => ({
      full_name: '',
      address: '',
      registration_address: '',
      email: '',
      phone_number: '',
    });
    const model = ref<UpdateDebtorMainProfileModel['model']>(getEmptyModel());

    const resetModel = () => {
      model.value = debtor.value ? Object.keys(model.value).reduce((acc, cur) => ({
        ...acc,
        [cur]: debtor.value?.debtor_main_profile?.[cur as keyof DebtorMainProfile],
      }), {} as typeof model.value) : getEmptyModel();
    };

    watch(debtor, getAwaitFrame(resetModel), {
      immediate: true,
    });

    const [isEditing, toggleEditing, setEditing] = useToggle();

    const cancel = () => {
      resetModel();
      setEditing(false);
    };

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors<keyof UpdateDebtorMainProfileModel>();

    const {
      updateDebtorMainProfile,
    } = useDebtors();

    const fetchData = inject<(() => void)>('fetchData');

    const submit = async () => {
      clearErrors();

      const { status, response } = await updateDebtorMainProfile({
        id: debtor.value!.debtor_main_profile.id,
        debtorId: debtor.value!.debtor.pk,
        model: model.value,
        productionType: productionType.value,
      });

      if (!status) {
        setErrors(
          Object.entries(response) as
            unknown as SourceErrors<keyof UpdateDebtorMainProfileModel>,
        );
      } else {
        fetchData?.();
        setEditing(false);
      }
    };

    return {
      errorsMap,
      model,
      t,
      isEditing,
      toggleEditing,
      submit,
      cancel,
    };
  },
});
</script>

<style lang="scss" module>
@import "debtorCommonMainTab";
</style>
