<template>
  <div :class="$style.container">
    <Tabs
      v-model="activeTab"
      :tabs="tabs"
      :class="$style.tabs"
      :state="['tertiary', 'tiny']"
    />
    <ActiveTable
      v-model:limit="limit"
      v-model:page="page"
      key-field="id"
      :class="$style.table"
      :table-key="`debtor-documents-${activeTab}`"
      :records="records"
      :columns="columns"
      :actions="actions"
      :total="total"
      :state="[
        'secondary',
        'stripeless',
        'hoverable',
        'absoluteActions',
        'inlineActions',
      ].filter(Boolean)"
    >
      <template #cell(file)="{record}">
        {{ decodeURIComponent(record.file.split('/').pop()) }}
      </template>
      <template
        v-if="['egrn-data', 'egrn-rights'].includes(activeTab)"
        #cell(status_history)="{record}"
      >
        <template v-if="Object.keys(record.status_history).length">
          <div :class="$style.statuses">
            <div
              v-for="({date, status}, index) in record.status_history"
              :key="index"
            >
              {{ status }} ({{ date }})
            </div>
          </div>
        </template>
        <NA v-else />
      </template>
      <template
        v-if="activeTab === 'sms'"
        #cell(status)="{record}"
      >
        {{ pretrialSubstatusesMap[`sms_${record.status}`] }}
      </template>
      <template
        v-else-if="activeTab === 'voice'"
        #cell(status)="{record}"
      >
        {{ record.status_text }}
      </template>
    </ActiveTable>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, toRefs, watch,
} from 'vue';
import Tabs from '@/components/tabs/Tabs.vue';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import { Debtor } from '@/hooks/useDebtors';
import {
  DebtorPayload, IDialogComponent, useDialog, useDialogRouteParam,
} from '@/hooks/useDialog';
import { ITab } from '@/components/tabs/useTabs';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import {
  ActionType,
  ActiveTableAction,
  ActiveTableColumn,
  ActiveTableColumnFormat,
  useActiveTable,
} from '@/hooks/useActiveTable';
import { ProductionType } from '@/hooks/useConstructor';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { OrderDirection } from '@/store/modules/api';
import {
  UploadHousebookDocumentsModel,
  UploadMyDocumentsModel,
  useDocuments,
} from '@/hooks/useDocuments';
import { downloadFile, useFileManager } from '@/hooks/useFileManager';
import { DictType, useDicts } from '@/hooks/useDicts';
import NA from '@/components/na/NA.vue';

export default defineComponent({
  name: 'DebtorDocumentsTab',
  components: { NA, ActiveTable, Tabs },
  props: {
    debtor: Object as PropType<Debtor>,
    productionType: {
      type: String as PropType<DebtorPayload['productionType']>,
      required: true,
    },
  },
  setup(props) {
    const { debtor, productionType } = toRefs(props);
    const { t } = useLocalI18n('debtor.documents');
    type ActiveTabKey = 'common' | 'housebook' | 'egrn-data' | 'egrn-rights' | 'fee' | 'judgments' | 'sms' | 'voice' | 'fns' | 'banks' | 'executions' | 'my-documents';
    const tabs = computed<Array<ITab<ActiveTabKey>>>(() => ((([
      {
        key: 'common',
      },
      productionType.value === ProductionType.judicial && {
        key: 'housebook',
      },
      productionType.value === ProductionType.judicial && {
        key: 'egrn-data',
      },
      productionType.value === ProductionType.judicial && {
        key: 'egrn-rights',
      },
      productionType.value === ProductionType.judicial && {
        key: 'fee',
      },
      productionType.value === ProductionType.judicial && {
        key: 'judgments',
      },
      productionType.value === ProductionType.pretrial && {
        key: 'sms',
      },
      productionType.value === ProductionType.pretrial && {
        key: 'voice',
      },
      productionType.value === ProductionType.executive && {
        key: 'fns',
      },
      productionType.value === ProductionType.executive && {
        key: 'banks',
      },
      productionType.value === ProductionType.executive && {
        key: 'executions',
      },
      {
        key: 'my-documents',
      },
    ] as Array<ITab<ActiveTabKey> | boolean>))
      .filter(Boolean) as Array<ITab<ActiveTabKey>>)
      .map((tab) => ({
        ...tab,
        label: t(`${tab.key}.tab`),
      })));

    const [activeTab] = useDialogRouteParam<ActiveTabKey>(
      'documents-tab',
      'common',
      ref(true),
    );

    const apiEndpoints = useDocuments();

    const {
      files,
      selectFiles,
    } = useFileManager({
      multiple: true,
      accept: ['application/pdf'],
    });

    const {
      showDialog,
      confirmDialog,
    } = useDialog();

    const {
      records,
      columns,
      actions,
      fetchData: refetchDocuments,
      limit,
      page,
      total,
    } = useActiveTable<any & {id: 'id'}, any, 'id'>({
      keyField: 'id',
      async fetch({ params, signal }) {
        if (!debtor.value) {
          return {
            count: 0,
            results: [],
          };
        }

        if (records?.value?.length) {
          records.value = [];
        }
        const { response } = await ((({
          common: apiEndpoints.fetchGeneralDocumentsFlow,
          housebook: apiEndpoints.fetchHousebook,
          'egrn-data': apiEndpoints.fetchEgrnData,
          'egrn-rights': apiEndpoints.fetchEgrnRights,
          fee: apiEndpoints.fetchFeePayments,
          judgments: apiEndpoints.fetchJudgments,
          sms: apiEndpoints.fetchSms,
          voice: apiEndpoints.fetchVoice,
          fns: apiEndpoints.fetchFnsHistory,
          banks: apiEndpoints.fetchBankHistory,
          executions: apiEndpoints.fetchWritsOfExecution,
          'my-documents': apiEndpoints.fetchMyDocuments,
        } as {
          [key in ActiveTabKey]: any
          // eslint-disable-next-line no-underscore-dangle
        })[params.filters!.__tab as ActiveTabKey])({ ...params, signal }));

        return response;
      },
      actions: computed(() => (([
        activeTab.value === 'housebook' && {
          key: 'upload',
          icon: 'upload',
          types: [ActionType.side],
          label: t('actions.housebook.upload'),
          handler: selectFiles,
        },
        activeTab.value === 'my-documents' && {
          key: 'upload',
          icon: 'upload',
          types: [ActionType.side],
          label: t('actions.my-documents.upload'),
          handler: selectFiles,
        },
        activeTab.value !== 'sms' && {
          key: 'preview',
          icon: 'eye',
          types: [ActionType.record],
          handler: async ({ selectedItems: [id] }) => {
            const item = records.value.find((item) => item.id === id);
            if (!item) {
              return;
            }
            window.open(item.file, '_blank');
          },
        },
        activeTab.value === 'voice' && {
          key: 'listen',
          icon: 'megaphone',
          types: [ActionType.record],
          handler: async ({ selectedItems: [id] }) => {
            const item = records.value.find((item) => item.id === id);
            if (!item) {
              return;
            }
            const { name = t('actions.listen'), file } = item;
            await showDialog({
              component: IDialogComponent.listenFile,
              addInRoute: false,
              payload: {
                name,
                file,
              },
            });
          },
        },
        activeTab.value !== 'sms' && {
          key: 'download',
          icon: 'download',
          types: [ActionType.record],
          handler: async ({ selectedItems: [id] }) => {
            const item = records.value.find((item) => item.id === id);
            if (!item) {
              return;
            }
            downloadFile(item.file, true);
          },
        },
        activeTab.value === 'my-documents' && {
          key: 'remove',
          icon: 'trash',
          types: [ActionType.record],
          handler: async ({ selectedItems: [id] }) => {
            const item = records.value.find((item) => item.id === id);
            if (!item) {
              return;
            }
            const { result, closeDialog } = await confirmDialog({
              message: t('actions.remove'),
            });

            if (result) {
              await apiEndpoints.removeMyDocument({ id: item.id });
              await refetchDocuments();
            }
            closeDialog();
          },
        },
      ] as Array<ActiveTableAction<any, any> | boolean>)
        .filter(Boolean) as Array<ActiveTableAction<any, any>>)),
      defaultSort: computed(() => ([
        {
          key: 'created_at',
          direction: OrderDirection.desc,
        },
        {
          key: 'id',
          direction: OrderDirection.desc,
        },
      ])),
      defaultLimit: ref(15),
      filters: computed(() => (([
        {
          key: '__tab',
          field: '__tab',
          type: ActiveFormFieldType.input,
          defaultValue: activeTab.value,
        },
        {
          key: 'debtor_id',
          field: 'debtor_id',
          type: ActiveFormFieldType.input,
          defaultValue: debtor.value?.debtor.pk,
        },
        ['common'].includes(activeTab.value) && {
          key: 'production_type',
          field: 'production_type',
          type: ActiveFormFieldType.input,
          defaultValue: productionType.value,
        },
      ] as Array<ActiveFormField<any> | boolean>)
        .filter(Boolean) as Array<ActiveFormField<any>>)),
      columns: computed(() => (([
        !['sms', 'voice'].includes(activeTab.value) && { key: 'id', width: '150px' },
        !['sms', 'voice', 'fns', 'banks', 'executions'].includes(activeTab.value) && {
          key: 'file',
          width: 'minmax(300px, 1.5fr)',
        },
        ['common', 'housebook'].includes(activeTab.value) && {
          key: 'document_formation_date',
          format: ActiveTableColumnFormat.date,
        },
        !['housebook', 'executions', 'egrn-data', 'egrn-rights', 'my-documents'].includes(activeTab.value) && { key: 'status' },

        ['housebook', 'egrn-data', 'egrn-rights', 'judgments'].includes(activeTab.value) && {
          key: 'created_at',
          format: ActiveTableColumnFormat.date,
        },

        ['sms', 'voice'].includes(activeTab.value) && {
          key: 'phone_number',
          format: ActiveTableColumnFormat.phone,
        },
        ['sms', 'voice'].includes(activeTab.value) && { key: 'operator.name' },
        ['sms', 'voice'].includes(activeTab.value) && {
          key: 'send_at',
          format: ActiveTableColumnFormat.dateTime,
        },
        ['sms', 'voice'].includes(activeTab.value) && {
          key: 'status_at',
          format: ActiveTableColumnFormat.dateTime,
        },
        ['sms', 'voice'].includes(activeTab.value) && {
          key: 'service_cost',
          format: ActiveTableColumnFormat.money,
        },
        ['sms'].includes(activeTab.value) && { key: 'message', width: 2 },

        ['voice'].includes(activeTab.value) && { key: 'payload', width: 2 },

        ['egrn-data', 'egrn-rights'].includes(activeTab.value) && { key: 'status_tracking' },

        ['fee'].includes(activeTab.value) && {
          key: 'amount',
          format: ActiveTableColumnFormat.money,
        },

        ['judgments'].includes(activeTab.value) && { key: 'case_id' },
        ['judgments'].includes(activeTab.value) && { key: 'case_number' },
        ['judgments'].includes(activeTab.value) && { key: 'considerated_at' },
        ['judgments'].includes(activeTab.value) && {
          key: 'effected_at',
          format: ActiveTableColumnFormat.date,
        },
        ['judgments'].includes(activeTab.value) && { key: 'judge_full_name' },
        ['judgments'].includes(activeTab.value) && { key: 'statuses' },

        ['fns', 'banks'].includes(activeTab.value) && { key: 'request_id' },
        ['fns'].includes(activeTab.value) && { key: 'document_title' },
        ['fns', 'banks'].includes(activeTab.value) && {
          key: 'request_date',
          format: ActiveTableColumnFormat.date,
        },
        ['fns', 'banks'].includes(activeTab.value) && {
          key: 'response_date',
          format: ActiveTableColumnFormat.date,
        },
        ['fns'].includes(activeTab.value) && { key: 'tax_inspector_full_name' },
        ['fns', 'banks'].includes(activeTab.value) && { key: 'status_current' },
        ['fns', 'banks', 'egrn-data', 'egrn-rights'].includes(activeTab.value) && { key: 'status_history' },

        ['banks'].includes(activeTab.value) && { key: 'bank_name' },

        ['executions'].includes(activeTab.value) && {
          key: 'initiation_date',
          format: ActiveTableColumnFormat.date,
        },
        ['executions'].includes(activeTab.value) && {
          key: 'completion_termination_date',
          format: ActiveTableColumnFormat.date,
        },
        ['executions'].includes(activeTab.value) && { key: 'termination_ground' },
        ['executions'].includes(activeTab.value) && { key: 'bailiff_full_name' },
        ['executions'].includes(activeTab.value) && { key: 'bailiff_email' },
      ] as Array<ActiveTableColumn<any> | boolean>)
        .filter(Boolean) as Array<ActiveTableColumn<any>>)
        .map((column) => ({
          ...column,
          field: column.key,
          label: t(`column.${String(column.key).split('.').pop()}`),
        }))),
    });

    watch(files, async (newFiles) => {
      if (!debtor.value) {
        return;
      }
      await Promise.all(
        newFiles.map((file) => (
          activeTab.value === 'my-documents'
            ? apiEndpoints.uploadMyDocument
            : apiEndpoints.uploadHousebookDocument
        )({
          debtor: debtor.value!.debtor.pk,
          production_type: productionType.value,
          file,
          ...(activeTab.value === 'housebook' ? {
            document_formation_date: (new Date()).toISOString(),
            can_be_attached: 'true',
          } : {}),
        } as UploadMyDocumentsModel & UploadHousebookDocumentsModel)),
      );
      await refetchDocuments();
    }, {
      deep: true,
    });

    const {
      getDictMap,
    } = useDicts();

    const pretrialSubstatusesMap = computed(() => (
      getDictMap(DictType.debtorPretrialSubstatuses).value
    ));

    return {
      pretrialSubstatusesMap,

      activeTab,
      tabs,
      records,
      columns,
      actions,
      limit,
      page,
      total,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorDocumentsTab";
</style>
