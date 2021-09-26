export const awaitFrame = async (callback?: (() => void)) => new Promise((resolve) => {
  requestAnimationFrame(() => {
    callback && callback();
    resolve(true);
  });
});

export const getAwaitFrame = (
  callback: ((params: any) => void),
) => (params: any) => awaitFrame(() => callback(params));

type TimeoutInstance = number;
export const awaitTimeout = <T extends TimeoutInstance>(duration: number): {
  unsubscribe: () => void;
  subscribe: () => Promise<T>;
} => {
  let timeout: TimeoutInstance;

  return {
    unsubscribe: () => {
      clearTimeout(timeout);
    },
    subscribe: () => new Promise<T>((resolve) => {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        resolve(timeout as T);
      }, duration);
    }),
  };
};
