<template>
  <div :class="$style.container">
    <Tabs
      v-model="activeTab"
      :tabs="tabs"
      :class="$style.tabs"
      :state="['tertiary', 'tiny']"
    />
    <div :class="$style.title">
      {{ t('title') }}
    </div>
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
        'bold',
        'absoluteActions',
      ].filter(Boolean)"
    >
      <template
        #cell(status)="{record}"
      >
        <template v-if="activeTab === 'sms'">
          {{ substatusesMap[`sms_${record.status}`] }}
        </template>
        <template v-else-if="activeTab === 'voice'">
          {{ record.status_text }}
        </template>
      </template>
    </ActiveTable>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, toRefs,
} from 'vue';
import Tabs from '@/components/tabs/Tabs.vue';
import ActiveTable from '@/components/activeTable/ActiveTable.vue';
import { Debtor } from '@/hooks/useDebtors';
import { IDialogComponent, useDialog, useDialogRouteParam } from '@/hooks/useDialog';
import { ITab } from '@/components/tabs/useTabs';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import {
  ActionType,
  ActiveTableAction,
  ActiveTableColumn,
  ActiveTableColumnFormat,
  useActiveTable,
} from '@/hooks/useActiveTable';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { OrderDirection } from '@/store/modules/api';
import { useDocuments } from '@/hooks/useDocuments';
import { downloadFile } from '@/hooks/useFileManager';
import { DictType, useDicts } from '@/hooks/useDicts';

export default defineComponent({
  name: 'DebtorNotificationsTab',
  components: { ActiveTable, Tabs },
  props: {
    debtor: Object as PropType<Debtor>,
  },
  setup(props) {
    const { debtor } = toRefs(props);
    const { t } = useLocalI18n('debtor.notifications');
    type ActiveTabKey = 'sms' | 'voice';
    const tabs = computed<Array<ITab<ActiveTabKey>>>(() => ((([
      {
        key: 'sms',
      },
      {
        key: 'voice',
      },
    ] as Array<ITab<ActiveTabKey> | boolean>))
      .filter(Boolean) as Array<ITab<ActiveTabKey>>)
      .map((tab) => ({
        ...tab,
        label: t(`${tab.key}.tab`),
      })));

    const [activeTab] = useDialogRouteParam<ActiveTabKey>(
      'notifications-tab',
      'sms',
      ref(true),
    );

    const apiEndpoints = useDocuments();

    const {
      showDialog,
    } = useDialog();

    const {
      records,
      columns,
      actions,
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
          sms: apiEndpoints.fetchSms,
          voice: apiEndpoints.fetchVoice,
        } as {
          [key in ActiveTabKey]: any
          // eslint-disable-next-line no-underscore-dangle
        })[params.filters!.__tab as ActiveTabKey])({ ...params, signal }));

        return response;
      },
      actions: computed(() => (([
        activeTab.value === 'voice' && {
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
            downloadFile(item.file);
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
      ] as Array<ActiveFormField<any> | boolean>)
        .filter(Boolean) as Array<ActiveFormField<any>>)),
      columns: computed(() => (([
        { key: 'id', width: '100px' },
        { key: 'operator.name' },
        ['sms'].includes(activeTab.value) && {
          key: 'created_at',
          format: ActiveTableColumnFormat.date,
        },
        {
          key: 'phone_number',
          format: ActiveTableColumnFormat.phone,
          width: 1.25,
        },
        ['sms'].includes(activeTab.value) && { key: 'message', width: 3.5 },
        {
          key: 'send_at',
          format: ActiveTableColumnFormat.dateTime,
        },
        { key: 'status' },
        {
          key: 'service_cost',
          format: ActiveTableColumnFormat.money,
        },
      ] as Array<ActiveTableColumn<any> | boolean>)
        .filter(Boolean) as Array<ActiveTableColumn<any>>)
        .map((column) => ({
          ...column,
          field: column.key,
          label: t(`column.${String(column.key).split('.').pop()}`),
        }))),
    });

    const {
      getDictMap,
    } = useDicts();

    const substatusesMap = computed(() => (
      getDictMap(DictType.debtorPretrialSubstatuses).value
    ));

    return {
      t,

      activeTab,
      tabs,
      records,
      columns,
      actions,
      limit,
      page,
      total,
      substatusesMap,
    };
  },
});
</script>

<style lang="scss" module>
@import "./debtorNotificationsTab";
</style>
