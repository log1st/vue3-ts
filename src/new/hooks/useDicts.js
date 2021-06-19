import {computed} from "@vue/composition-api";
import {useStore} from "@/new/hooks/useStore";

export const useDicts = () => {
  const store = useStore();

  const judicialStatuses = computed(() => store.getters['dicts/judicialStatuses']);
  const judicialStatusesMap = computed(() => store.getters['dicts/judicialStatusesMap']);

  const judicialEgrnStatuses = computed(() => store.getters['dicts/judicialEgrnStatuses']);
  const judicialEgrnStatusesMap = computed(() => store.getters['dicts/judicialEgrnStatusesMap']);

  const judicialFeeStatuses = computed(() => store.getters['dicts/judicialFeeStatuses']);
  const judicialFeeStatusesMap = computed(() => store.getters['dicts/judicialFeeStatusesMap']);

  return {
    judicialStatuses,
    judicialStatusesMap,

    judicialEgrnStatuses,
    judicialEgrnStatusesMap,

    judicialFeeStatuses,
    judicialFeeStatusesMap,
  }
}
