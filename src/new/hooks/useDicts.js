import {computed} from "@vue/composition-api";
import {useStore} from "@/new/hooks/useStore";

export const useDicts = () => {
  const store = useStore();

  const employeePositions = computed(() => store.getters['dicts/employeePositions']);
  const employeePositionsMap = computed(() => store.getters['dicts/employeePositionsMap']);

  const employeeRoles = computed(() => store.getters['dicts/employeeRoles']);
  const employeeRolesMap = computed(() => store.getters['dicts/employeeRolesMap']);

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
  const judicialSubStatusesGroups = computed(() => store.getters['dicts/judicialSubStatusesGroups']);
  const judicialSubStatusesGroupsMap = computed(() => store.getters['dicts/judicialSubStatusesGroupsMap']);

  const pretrialStatuses = computed(() => store.getters['dicts/pretrialStatuses']);
  const pretrialStatusesMap = computed(() => store.getters['dicts/pretrialStatusesMap']);

  const pretrialSubStatuses = computed(() => store.getters['dicts/pretrialSubStatuses']);
  const pretrialSubStatusesMap = computed(() => store.getters['dicts/pretrialSubStatusesMap']);

  const judicialEgrnStatuses = computed(() => store.getters['dicts/judicialEgrnStatuses']);
  const judicialEgrnStatusesMap = computed(() => store.getters['dicts/judicialEgrnStatusesMap']);

  const judicialFeeStatuses = computed(() => store.getters['dicts/judicialFeeStatuses']);
  const judicialFeeStatusesMap = computed(() => store.getters['dicts/judicialFeeStatusesMap']);

  const tenantRelationships = computed(() => store.getters['dicts/tenantRelationships']);
  const tenantRelationshipsMap = computed(() => store.getters['dicts/tenantRelationshipsMap']);

  return {
    employeePositions,
    employeePositionsMap,

    employeeRoles,
    employeeRolesMap,

    services,
    servicesMap,

    documentTypes,
    documentTypesMap,

    judicialStatuses,
    judicialStatusesMap,

    judicialSubStatuses,
    judicialSubStatusesMap,
    judicialSubStatusesGroups,
    judicialSubStatusesGroupsMap,

    pretrialStatuses,
    pretrialStatusesMap,

    pretrialSubStatuses,
    pretrialSubStatusesMap,

    judicialEgrnStatuses,
    judicialEgrnStatusesMap,

    judicialFeeStatuses,
    judicialFeeStatusesMap,

    tenantRelationships,
    tenantRelationshipsMap,
  }
}
