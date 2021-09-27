import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { Company } from '@/hooks/useCompanies';

export type CompanyStat = {
  key: string;
  label: string;
  value: number;
}

export const useDefaultCompany = () => {
  const store = useStore();

  const { t } = useI18n();

  const stats = computed<Array<CompanyStat>>(() => ([
    {
      key: 'decisions',
      value: 0,
    },
    {
      key: 'inCourt',
      value: 0,
    },
    {
      key: 'inProgress',
      value: 0,
    },
    {
      key: 'new',
      value: 0,
    },
    {
      key: 'rejected',
      value: 0,
    },
  ].map((partialStat) => ({
    ...partialStat,
    label: t(`header.stat.${partialStat.key}`),
  }))));

  const company = computed<Company | null>({
    get: () => (
      store.getters['companies/defaultCompany']
    ),
    set: async (id) => {
      await store.dispatch('companies/setDefaultCompanyId', id);
    },
  });

  const companyId = computed(() => company.value?.id);

  return {
    stats,
    company,
    companyId,
  };
};
