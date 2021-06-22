import MessageFormat from '@messageformat/core';

const mf = new MessageFormat('ru');

const cache = new Map();

export const formatMessage = (message, payload) => {
  if(!cache.has(message)) {
    cache.set(message, mf.compile(message));
  }

  return cache.get(message)(payload);
}
