import { useStore } from 'vuex';

export const useCaptcha = () => {
  const store = useStore();

  const runCaptcha = async (action: string): Promise<string> => store.dispatch('thirdParty/runCaptcha', action);

  return {
    runCaptcha,
  };
};
