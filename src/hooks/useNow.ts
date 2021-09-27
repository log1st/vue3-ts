import { onBeforeUnmount, onMounted, ref } from 'vue';

export const useNow = () => {
  const now = ref(new Date());

  let timeout: number;

  onMounted(() => {
    timeout = setInterval(() => {
      now.value = new Date();
    }, 1000);
  });

  onBeforeUnmount(() => {
    clearInterval(timeout);
  });

  return {
    now,
  };
};
