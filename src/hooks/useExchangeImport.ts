import { onBeforeUnmount, ref } from 'vue';
import { useStore } from 'vuex';
import { DataTypeKey } from '@/hooks/useExchange';
import { Company, CompanySettings } from '@/hooks/useCompanies';
import { useSocket } from '@/hooks/useSocket';
import { SocketSubscriber } from '@/store/modules/socket';
import { IToastLevel, useToast } from '@/hooks/useToast';

export enum ExchangeImportPeriod {
  monthly = 'monthly',
  all = 'all'
}

export enum ExchangeImportMode {
  table = 'table',
  linear = 'linear',
}

export type ExchangeImportFile = {
  key: number;
  file: string | null;
  name: string | null;
}

export type ExchangeImportRequest = {
  companyId: Company['id'] | null;
  regionId: CompanySettings['default_region'] | null;
  dataType: DataTypeKey;
  year: number;
  mode: ExchangeImportMode;
  period: ExchangeImportPeriod;
  files: Array<ExchangeImportFile>;
  module?: 1|2|3|null;
}

export type ExchangeImportPartialRequest = Omit<ExchangeImportRequest, 'files'> & {
  file: ExchangeImportFile;
  month?: number;
}

export type ExchangeImportApiRequest<IsData extends boolean = boolean> = {
  company: Company['id'];
  last: boolean;
} & (IsData extends true ? {
  module: 1 | 2 | 3;
  mode: ExchangeImportMode;
  region: CompanySettings['default_region'];
  year: ExchangeImportRequest['year'];
} : {
  task_uuid:
    '0574d4db-7cfa-42f0-be4e-0029302e8bf1'
    | '193ee6a2-f1c7-4437-a804-7f00ee29ae10';
})

export type ExchangeMetrics = {
  uploading: number;
  uploaded: number;
  checking: number;
  checked: number;
}

export const useExchangeImport = () => {
  const uploadMetrics = ref<ExchangeMetrics>({
    uploading: 0,
    uploaded: 0,
    checking: 0,
    checked: 0,
  });

  const store = useStore();

  const {
    subscribeToCompany,
    unsubscribeFromCompany,
    subscribe,
  } = useSocket();

  const {
    showToast,
  } = useToast();

  const unsubs: Array<() => void> = [];
  onBeforeUnmount(() => {
    unsubs.forEach((unsub) => unsub());
  });

  const uploadData = async (model: ExchangeImportRequest) => {
    await subscribeToCompany(model.companyId!);
    const unsubCompany = () => {
      unsubscribeFromCompany(model.companyId!);
    };
    unsubs.push(unsubCompany);

    uploadMetrics.value = {
      uploading: model.files.filter((file) => (
        model.period === ExchangeImportPeriod.monthly ? !!file.file : true
      )).length,
      uploaded: 0,
      checking: 0,
      checked: 0,
    };

    const isCustom = [
      DataTypeKey.pretrial,
      DataTypeKey.judicial,
      DataTypeKey.executive,
    ].includes(model.dataType);

    await Promise.all(model.files.map(async (file, index) => {
      if (model.period === ExchangeImportPeriod.monthly && !file.file) {
        return;
      }
      const { status, response } = await store.dispatch('dataFile/uploadDataOrDataFile', {
        ...model,
        file,
        ...(model.period === ExchangeImportPeriod.monthly ? {
          month: index + 1,
        } : {}),
      });
      uploadMetrics.value.uploaded += 1;
      uploadMetrics.value.checking += 1;
      if (status) {
        const unsub = await subscribe({
          condition: (payload: any) => (
            payload.action === 'model_event'
              && payload.data.model === 'datafile/status/update'
              && (
                isCustom ? (
                  payload.data.obj.package === response.package.uuid
                ) : (
                  payload.data.obj.task_uuid === response.task_uuid
                )
              )
          ),
          async handler(payload: any) {
            if ([3, 4].includes(payload.data.obj.state)) {
              uploadMetrics.value.checked += 1;
              await showToast({
                label: 'pureLabel',
                message: 'pure',
                params: {
                  label: file.name,
                  message: payload.data.obj.status_text,
                },
                level: {
                  3: IToastLevel.success,
                  4: IToastLevel.danger,
                }[Number(payload.data.obj.state) as 3 | 4],
              });
              unsub();
              unsubs.splice(
                unsubs.findIndex((i) => i === unsub),
                1,
              );
            }
          },
        } as SocketSubscriber);
        unsubs.push(unsub);
      } else {
        uploadMetrics.value.checked += 1;
      }
    }));
    unsubCompany();
    unsubs.splice(
      unsubs.findIndex((i) => i === unsubCompany),
      1,
    );
  };

  return {
    uploadMetrics,
    uploadData,
  };
};
