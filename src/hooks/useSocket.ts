import { useStore } from 'vuex';
import { Company } from '@/hooks/useCompanies';
import { SocketSubscriber } from '@/store/modules/socket';

export const useSocket = () => {
  const store = useStore();

  const subscribeToCompany = async (id: Company['id']) => {
    if (store.getters['companies/defaultCompanyId'] === id) {
      return;
    }
    await store.dispatch('socket/subscribeToCompany', id);
  };

  const unsubscribeFromCompany = async (id: Company['id']) => {
    if (store.getters['companies/defaultCompanyId'] === id) {
      return;
    }
    await store.dispatch('socket/unsubscribeFromCompany', id);
  };

  const subscribe = async (config: Omit<SocketSubscriber, 'id'>) => store.dispatch('socket/subscribe', config);
  const unsubscribeById = async (id: SocketSubscriber['id']) => store.dispatch('socket/unsubscribe', id);

  return {
    subscribeToCompany,
    unsubscribeFromCompany,
    subscribe,
    unsubscribeById,
  };
};
