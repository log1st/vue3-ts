export const asyncAction = (action, handler, duration) => {
  let timeout;
  const promise = new Promise((resolve, reject) => {
    const setTimer = () => {
      clearTimeout(timeout);
      setTimeout(async () => {
        const response = await handler(await action());
        if(response.status) {
          if(!('error' in response)) {
            resolve(response.payload);
          } else {
            reject(response.error);
          }
        } else {
          setTimer();
        }
      }, duration)
    }

    setTimer();
  });

  const unsubscribe = () => {
    clearTimeout(timeout);
  }

  return {promise, unsubscribe};
}
