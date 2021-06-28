import {computed} from "@vue/composition-api";
import {useStore} from "@/new/hooks/useStore";

export const useDialog = () => {
  const store = useStore();

  const dialogs = computed(() => (
    store.getters['dialogs/dialogs']
  ));

  const showDialog = async (dialog) => {
    const { id } = await store.dispatch('dialogs/showDialog', dialog);

    return id;
  };

  const hideDialogById = async (id) => {
    await store.dispatch('dialogs/hideDialogById', id);
  };

  const confirmDialog = async ({
    isCancellable = true,
    isConfirmable = true,
    ...rest
  }) => new Promise(async (resolve) => {
    await store.dispatch('dialogs/showDialog', {
      component: 'confirm',
      closeHandler: () => {
        resolve(false)
      },
      payload: {
        onClose: () => {
          resolve({result: false})
        },
        onConfirm: (value) => {
          resolve(value)
        },
        isCancellable,
        isConfirmable,
        ...rest,
      }
    })
  })

  return {
    dialogs,
    showDialog,
    hideDialogById,
    confirmDialog,
  };
}
