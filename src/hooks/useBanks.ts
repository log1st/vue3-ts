import { useStore } from 'vuex';
import { ApiResponse, ListingRequestSource, ListingResponse } from '@/store/modules/api';

export const useBanks = () => {
  const store = useStore();
  const fetchBanks = async (
    model: ListingRequestSource<{ bik: string }>,
  ): Promise<ApiResponse<ListingResponse<{
    value: string;
    data: {
      correspondent_account: string;
    };
  }>>> => {
    const { status, response } = await store.dispatch('dicts/fetchBanks', model);

    return { status, response };
  };

  return {
    fetchBanks,
  };
};
