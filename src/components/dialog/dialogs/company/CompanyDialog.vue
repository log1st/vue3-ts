<template>
  <div
    :class="[
      $style.dialog,
      $style.default
    ]"
  >
    <button
      :class="[
        $style.edit,
        isEditing && $style.active,
      ]"
      @click="toggleEditing"
    >
      <span
        v-if="isEditing"
        :class="$style.editLabel"
      >
        {{ t('company.edit') }}
      </span>
      <Icon
        icon="pencil"
        :class="$style.editIcon"
      />
    </button>
    <div :class="$style.title">
      {{ company?.name_short }}
    </div>
    <Tabs
      v-model="activeTab"
      :class="$style.tabs"
      :tabs="tabs"
      state="secondary"
    />
    <component
      :is="component"
      v-if="company"
      v-model:is-editing="isEditing"
      :class="$style.content"
      :company="company"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onBeforeUnmount, PropType, ref, toRefs, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { Company, useCompanies } from '@/hooks/useCompanies';
import Tabs from '@/components/tabs/Tabs.vue';
import { ITabs } from '@/components/tabs/useTabs';
import CompanyCommonTab from '@/components/dialog/dialogs/company/tabs/common/CompanyCommonTab.vue';
import { useDialogRouteParam } from '@/hooks/useDialog';
import Icon from '@/components/icon/Icon.vue';
import { useToggle } from '@/hooks/useToggle';
import { getAwaitFrame } from '@/utils/window';
import { SignalType, useSignal } from '@/hooks/useSignal';
import CompanyEmployeesTab
  from '@/components/dialog/dialogs/company/tabs/employees/CompanyEmployeesTab.vue';
import CompanyDocumentsTab
  from '@/components/dialog/dialogs/company/tabs/documents/CompanyDocumentsTab.vue';

export default defineComponent({
  name: 'CompanyDialog',
  components: { Icon, Tabs },
  props: {
    id: {
      type: Number as PropType<Company['id']>,
      required: true,
    },
    isInitiallyEditing: Boolean as PropType<boolean>,
    isCurrent: Boolean as PropType<boolean>,
  },
  setup(props) {
    const isCurrent = computed(() => !!props.isCurrent);
    const { t } = useI18n();
    const {
      fetchCompany,
    } = useCompanies();

    const company = ref<Company | null>(null);

    const { id } = toRefs(props);

    const fetchData = async (newId: Company['id']) => {
      const { response } = await fetchCompany(newId);
      company.value = response;
    };

    const {
      subscribeToSignal,
    } = useSignal();

    onBeforeUnmount(
      subscribeToSignal(SignalType.companyUpdated, (payload: {
        id: Company['id'];
        payload: Company;
      }) => {
        if (payload.id === id.value) {
          fetchData(payload.id);
        }
      }),
    );

    watch(id, getAwaitFrame(fetchData), {
      immediate: true,
    });

    type ActiveTabKey = 'common' | 'employees' | 'documents';
    const tabs = computed<ITabs<ActiveTabKey>['tabs']>(() => ([
      {
        key: 'common',
        label: t('company.common.title'),
        icon: 'info',
      },
      {
        key: 'employees',
        label: t('company.employees.title'),
        icon: 'users',
      },
      {
        key: 'documents',
        label: t('company.documents.title'),
        icon: 'files',
      },
    ]));

    const [activeTab] = useDialogRouteParam<ActiveTabKey>(
      'tab',
      'common',
      isCurrent,
    );

    const component = computed(() => (({
      common: CompanyCommonTab,
      employees: CompanyEmployeesTab,
      documents: CompanyDocumentsTab,
    } as {[key in ActiveTabKey]: any})[activeTab.value]));

    const [isEditing, toggleEditing] = useToggle(props.isInitiallyEditing);

    return {
      t,

      company,
      tabs,
      activeTab,
      component,

      isEditing,
      toggleEditing,
    };
  },
});
</script>

<style lang="scss" module>
@import "./companyDialog";
</style>
