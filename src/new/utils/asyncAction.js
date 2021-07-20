export const asyncAction = (action, handler, duration = 3000, maxTimeout = 30000) => {
  let timeout;
  let dropTimeout;

  const promise = new Promise((resolve, reject) => {
    dropTimeout = setTimeout(() => {
      clearTimeout(timeout);
      reject({
        status: 2,
        status_text: 'Таймаут запроса'
      })
    }, maxTimeout);
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
    clearTimeout(dropTimeout);
  }

  return {promise, unsubscribe};
}
