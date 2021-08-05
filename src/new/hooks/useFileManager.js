import { onBeforeUnmount, onMounted, ref } from '@vue/composition-api';

export const downloadFile = (file, name) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.download = name || file.split('.').pop();
  a.href = file;
  a.target = "_blank"
  a.click();
}

export const convertFileToBase64 = async file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(reader.result)
    });
    reader.addEventListener('error', reject)
    reader.readAsDataURL(file);
  })

export const getFilePreview = async file =>
  new Promise((resolve, reject) => {
    if((file instanceof File && file.mimeType.startsWith('image'))) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result)
      });
      reader.addEventListener('error', reject)
      reader.readAsDataURL(file);
    } else if(file.startsWith('data:image')) {
      resolve(file)
    } else {
      axios({
        url: file,
      }).then(response => {
        if(response.headers['Content-Type'].startsWith('image')) {
          resolve(file)
        } else {
          resolve('https://picsum.photos/200/300?random=1');
        }
      })
    }
  })

export const useFilePaster = (callback) => {
  const onPaste = (e) => {
    const [file] = Array.from(e.clipboardData?.files || []);
    if (!file) {
      return;
    }
    callback(file);
  };

  const addListeners = () => {
    window.addEventListener('paste', onPaste);
  };

  const removeListeners = () => {
    window.removeEventListener('paste', onPaste);
  };

  onMounted(addListeners);
  onBeforeUnmount(removeListeners);
};

export const useFileManager = ({
  accept,
  multiple,
  maxSize,
} = {}) => {
  const file = ref();
  const files = ref([]);

  const selectFiles = () => {
    const input = document.createElement('input');
    input.accept = (accept || []).join(',');
    input.multiple = !!multiple;
    input.type = 'file';

    input.addEventListener('change', () => {
      const inputFiles = Array.from(input.files || []).filter((inputFile) => (
        maxSize ? (inputFile.size <= maxSize) : true
      ));

      if (multiple) {
        files.value = inputFiles.filter(Boolean);
      } else {
        file.value = inputFiles[0] || null;
      }
    });

    input.click();
    input.remove();
  };

  return {
    file,
    files,
    selectFiles,
  };
};
