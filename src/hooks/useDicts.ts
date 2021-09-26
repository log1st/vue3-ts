import { useStore } from 'vuex';
import { computed } from 'vue';

export type Dict<T> = Array<T>;

export enum DictType {
  companyTaxationSystems = 'companyTaxationSystems',
  companyPeniCalculationTypes = 'companyPeniCalculationTypes',
  employeePositions = 'employeePositions',
  employeeRoles = 'employeeRoles',
  files = 'files',
  debtorStatuses = 'debtorStatuses',
  debtorSubstatuses = 'debtorSubstatuses',
  debtorPretrialStatuses = 'debtorPretrialStatuses',
  debtorPretrialSubstatuses = 'debtorPretrialSubstatuses',
  tenantRelationships = 'tenantRelationships',
}

export type DictMap<T, Label extends keyof T> = {
  [key in keyof T]: T[Label]
}

export const useDicts = () => {
  const store = useStore();

  const getDict = <T, Type extends DictType = DictType>(type: Type) => computed<Dict<T>>(() => (
    store.getters['dicts/getDict'](type)
  ));

  const getDictMap = <
    T,
    Type extends DictType = DictType
  >(type: Type) => computed<DictMap<T, keyof T>>(
    () => (
      store.getters['dicts/getDictMap'](type)
    ),
  );

  return {
    getDict,
    getDictMap,
  };
};
