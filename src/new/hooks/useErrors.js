import {ref, computed} from "@vue/composition-api";

export const useErrors = () => {
  const errors = ref([]);

  const errorsMap = computed(() => (
    errors.value.reduce((acc, [field, value]) => ({
      ...acc,
      [field]: value
    }), {})
  ));

  const clearErrors = () => {
    errors.value = []
  };

  const setErrors = (errs) => {
    errors.value = errs
  }

  const addErrors = (errs) => {
    errors.value = [
      ...errors.value,
      ...errs
    ].filter(([key], index, self) => self.findIndex(error => error[0] === key) === index);
  }

  return {
    errorsMap,
    clearErrors,
    setErrors,
    addErrors,
  }
}
