import { onBeforeUnmount, onMounted, ref } from 'vue';

export const downloadFile = (file: string, withFlag = false) => {
  const url = new URL(
    file.startsWith('http')
      ? file
      : `${window.location.origin}${file}`,
  );
  const params = new URLSearchParams(url.search);
  if (withFlag) {
    params.append('download', '1');
  }
  url.search = params.toString();

  window.open(url.toString(), '_blank');
};

export const convertFileToBase64 = async (
  file: File,
): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    resolve(reader.result as string);
  });
  reader.addEventListener('error', reject);
  reader.readAsDataURL(file);
});

export const useFilePaster = (callback: ((file: File) => void)) => {
  const onPaste = (e: ClipboardEvent) => {
    const [file] = Array.from(e.clipboardData?.files || []);
    if (!file) {
      return;
    }
    callback(file);
  };

  const addListeners = () => {
    window.addEventListener('paste', onPaste as any);
  };

  const removeListeners = () => {
    window.removeEventListener('paste', onPaste as any);
  };

  onMounted(addListeners);
  onBeforeUnmount(removeListeners);
};

export type FileManager = {
  accept?: string[];
  multiple?: boolean;
  maxSize?: number | null;
}

export const useFileManager = ({
  accept = [],
  multiple = false,
  maxSize,
}: FileManager = {} as FileManager) => {
  const file = ref<File>();
  const files = ref<Array<File>>([]);

  const selectFiles = () => {
    const input = document.createElement('input');
    input.accept = accept.join(',');
    input.multiple = multiple;
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
