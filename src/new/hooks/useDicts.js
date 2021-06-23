import {computed} from "@vue/composition-api";
import {useStore} from "@/new/hooks/useStore";

export const useDicts = () => {
  const store = useStore();

  const services = computed(() => store.getters['dicts/services']);
  const servicesMap = computed(() => store.getters['dicts/servicesMap']);

  const documentTypes = computed(() => store.getters['applicationUserList'].map((document) => ({
    value: document.id,
    label: document.name,
    full: document,
  })));
  const documentTypesMap = computed(() => documentTypes.value.reduce((acc, {value, label}) => ({
    ...acc,
    [value]: label,
  }), {}));

  const judicialStatuses = computed(() => store.getters['dicts/judicialStatuses']);
  const judicialStatusesMap = computed(() => store.getters['dicts/judicialStatusesMap']);

  const judicialSubStatuses = computed(() => store.getters['dicts/judicialSubStatuses']);
  const judicialSubStatusesMap = computed(() => store.getters['dicts/judicialSubStatusesMap']);

  const judicialEgrnStatuses = computed(() => store.getters['dicts/judicialEgrnStatuses']);
  const judicialEgrnStatusesMap = computed(() => store.getters['dicts/judicialEgrnStatusesMap']);

  const judicialFeeStatuses = computed(() => store.getters['dicts/judicialFeeStatuses']);
  const judicialFeeStatusesMap = computed(() => store.getters['dicts/judicialFeeStatusesMap']);

  return {
    services,
    servicesMap,

    documentTypes,
    documentTypesMap,

    judicialStatuses,
    judicialStatusesMap,

    judicialSubStatuses,
    judicialSubStatusesMap,

    judicialEgrnStatuses,
    judicialEgrnStatusesMap,

    judicialFeeStatuses,
    judicialFeeStatusesMap,
  }
}
