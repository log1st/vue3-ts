export const downloadFile = ({ url, name }) => {
  // Content disposition required for pdf
  const a = document.createElement('a');
  a.download = name;


  const uri = new URL(url);
  const params = new URLSearchParams(uri.search);
  params.append('download', '1');
  uri.search = params.toString();

  a.href = uri.toString();
  a.target = '_blank';
  a.click();
  a.remove();
};
