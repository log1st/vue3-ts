export const downloadFile = ({ url, name }) => {
  // Content disposition required for pdf
  const a = document.createElement('a');
  a.download = name;
  a.href = url;
  a.target = '_blank';
  a.click();
  a.remove();
};
