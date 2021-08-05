import {inject, computed, ref} from "@vue/composition-api";

export const useRouter = () => {
  const router = inject('router');

  const currentRoute = ref(router.currentRoute);

  const redirect = async (where) => {
    await router.push(where)
  }

  const go = async (where) => {
    router.go(where)
  }

  router.afterEach(to => {
    currentRoute.value = to;
  })

  return {
    currentRoute,
    redirect,
    go,
  }
}
