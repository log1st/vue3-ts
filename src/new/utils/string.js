export const getRandomString = (length = 7) => Math.random().toString(36).substr(2, length);

export const copyToClipboard = async (somethingToCopy) => {
  try {
    await navigator.clipboard.writeText(somethingToCopy);
  } catch (e) {
    console.error('Unable to copy', e);
  }
};

export const ucFirst = string => string[0].toUpperCase() + string.substr(1)
