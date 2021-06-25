export const asyncAction = (action, handler, duration) => {
  let timeout;
  const promise = new Promise((resolve, reject) => {
    const setTimer = () => {
      clearTimeout(timeout);
      setTimeout(async () => {
        const response = await handler(await action());
        if(response.status) {
          if('payload' in response) {
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
    console.log('blya');
    clearTimeout(timeout);
  }

  return {promise, unsubscribe};
}
