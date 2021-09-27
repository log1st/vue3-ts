import { useStore } from 'vuex';
import { onBeforeUnmount } from 'vue';
import { arrayFrom } from '@/utils/object';

export enum SignalType {
  companyAdded = 'companyAdded',
  companyUpdated = 'companyUpdated',
  defaultCompanyIdUpdated = 'defaultCompanyIdUpdated',
  companyDeleted = 'companyDeleted',
  employeeDeleted = 'employeeDeleted',
  employeeUpdated = 'employeeUpdated',
  employeeCreated = 'employeeCreated',
  accountDocumentCreated = 'accountDocumentCreated',
  accountDocumentUpdated = 'accountDocumentUpdated',
  accountDocumentDeleted = 'accountDocumentDeleted',
  companySettingsUpdated = 'companySettingsUpdated',
  model = 'model',
  modelErrors = 'modelErrors',
  tableSettings = 'tableSettings',
  tableActions = 'tableActions',
  debtorsUpdated = 'debtorsUpdated',

  debtorNeighboursFound = 'debtorNeighboursFound',
  navigateDebtor = 'navigateDebtor',
  findDebtorNeighbours = 'findDebtorNeighbours',

  getDebtorFilters = 'getDebtorFilters',
  debtorFilters = 'debtorFilters',
}

export type Signal = {
  type: SignalType;
  payload?: any;
}

export const useSignal = () => {
  const store = useStore();

  const dispatchSignal = async (signalType: SignalType, payload?: Signal['payload']) => {
    store.commit('layout/signal', { signalType, payload });
  };

  const subscribeToSignal = (
    signal: SignalType | Array<SignalType>,
    callback: (payload: Signal['payload']) => void,
  ): (() => void
) => store.subscribe(({
    type, payload,
  }) => {
    if (type === 'layout/signal' && arrayFrom(signal).includes(payload?.signalType)) {
      callback(payload?.payload);
    }
  });

  const unsubs: Array<() => void> = [];
  onBeforeUnmount(() => {
    unsubs.forEach((unsub) => unsub());
  });

  const awaitSignalResponse = async <T extends any>(
    outSignal: SignalType,
    inSignal: SignalType | Array<SignalType>,
  ): Promise<T> => new Promise(async (resolve) => {
    const unsub = subscribeToSignal(
      inSignal,
      (response: T) => {
        resolve(response);
        unsubs.splice(
          unsubs.findIndex((i) => i === unsub, 1),
        );
        unsub();
      },
    );
    unsubs.push(unsub);
    await dispatchSignal(outSignal);
  });

  return {
    subscribeToSignal,
    dispatchSignal,
    awaitSignalResponse,
  };
};
