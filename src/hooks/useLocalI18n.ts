import { useI18n } from 'vue-i18n';

export const useLocalI18n = (localKey: string) => {
  const { t } = useI18n();

  const localT = (key: string, params: Record<any, any> = {}) => (
    t(`${localKey}.${key}`, params)
  );

  return {
    t: localT,
  };
};
