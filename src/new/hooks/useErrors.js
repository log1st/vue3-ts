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

  const pickErrors = (k) => {
    return Object.entries(errorsMap.value).filter(([key]) => key.startsWith(`${k}-`)).reduce((acc, [field, value]) => ({
      ...acc,
      [field.replace(new RegExp(`${k}-`), '')]: value,
    }), {})
  }

  return {
    errorsMap,
    clearErrors,
    setErrors,
    addErrors,
    pickErrors,
  }
}
