import {inject, computed} from "@vue/composition-api";

export const useRouter = () => {
  const router = inject('router');

  const currentRouter = computed(() => (router.currentRoute));

  const redirect = async (where) => {
    await router.push(where)
  }

  return {
    currentRouter,
    redirect,
  }
}
