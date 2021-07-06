<template>
  <div :class="$style.page">
    <div :class="$style.title">Организации</div>
    <div :class="$style.body">
      <ActiveTable
        :class="$style.table"
        :columns="columns"
        :is-loading="isFetching"
        is-selectable
        :records="records"
        :sort.sync="sort"
        :actions="actions"
        :total="total"
        :limit.sync="limit"
        :page.sync="page"
        :filters="filters"
        :filters-model.sync="filtersModel"
        @reset="resetSettings"
        state="secondary"
        key-field="index"
        selectable-column="index"
        :with-all-selection="false"
        :with-pagination="false"
        :with-actions="false"
        :with-controls="false"
        :with-context-menu="false"
        with-unique-selection
        table-key="organizations"
        :record-actions="recordActions"
        @rowClick="showViewDialog"
      />
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, computed} from '@vue/composition-api';
import ActiveTable from "@/new/components/activeTable/ActiveTable";
import {useActiveTable} from "@/new/components/activeTable/useActiveTable";
import {baseURL} from "@/settings/config";
import {useDialog} from "@/new/hooks/useDialog";
import {useToast} from "@/new/hooks/useToast";
import {useStore} from "@/new/hooks/useStore";
import {daDataToken} from "@/new/utils/envHelpers";

export default defineComponent({
  name: 'index',
  components: {ActiveTable},
  setup() {
    const {
      confirmDialog,
      showDialog,
    } = useDialog();

    const {
      showToast,
    } = useToast();

    const store = useStore();

    const {
      records: newOrganizationRecords,
      filtersModel: newOrganizationFilterModel,
      dropRecords: dropOrganizationRecords,
    } = useActiveTable({
      filters: computed(() => ([{
        field: 'query',
        type: 'text',
      }])),
      isImmediate: false,
      defaultLimit: ref(10),
      async fetch({params: {limit, query}, cancelToken}) {
        const {data: {suggestions}} = await axios({
          method: 'get',
          url: `https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party`,
          headers: {
            'Authorization': `Token ${daDataToken}`,
          },
          params: {
            count: limit,
            query,
            branch_type: 'MAIN',
          },
          cancelToken,
        });

        return {
          data: {
            count: suggestions.length,
            results: suggestions.map(({value: label, data: {inn: value}}) => ({
              value,
              label,
            })).filter(
              ({value}, index, self) => self.findIndex((i) => i.value === value) === index
            ),
          }
        }
      }
    })

    const showAddOrganizationDialog = async () => {
      const {result, model} = await confirmDialog({
        headline: 'ИНН организации',
        field: {
          type: 'select',
          props: {
            placeholder: 'Введите ИНН новой компании',
            isSearchable: true,
            searchPlaceholder: 'Начните ввод',
            optionsRef: newOrganizationRecords,
            async onQuery({query}) {
              newOrganizationFilterModel.value.query = query
            }
          }
        },
        confirmLabel: 'Подтвердить',
        cancelLabel: 'Отменить'
      });
      if(!result) {
        return;
      }
      dropOrganizationRecords();

      const {data} = await axios({
        method: 'post',
        url: `${baseURL}/api/account/company/`,
        data: {
          inn: model,
        }
      });

      await showToast({
        message: `Компания "${data.name_full}" успешно добавлена`,
        type: 'success',
      })

      await fetchData();
    }

    const showOrganizationDialog = (id, isInitialEdit = false) => {
      showDialog({
        component: 'organization',
        isWide: true,
        payload: {
          id,
          isInitialEdit,
        }
      })
    };

    const showViewDialog = ({record:{ id }}) => {
      showOrganizationDialog(id)
    }

    const {
      columns,
      filters,
      filtersModel,
      limit,
      total,
      page,
      sort,
      resetSettings,
      records,
      isFetching,
      actions,
      recordActions,
      fetchData,
    } = useActiveTable({
      async fetch({params: {o: ordering, ...params}, cancelToken}) {
        const {data} = await axios({
          method: 'get',
          url: `${baseURL}/api/account/company/`,
          params: {
            ...params,
            ordering
          },
          cancelToken,
        });

        return {
          data: {
            ...data,
            results: data.results.map((record, index) => ({
              ...record,
              index: index + 1,
            }))
          }
        }

      },
      filters: computed(() => (
        ['name_full', 'name_short', 'inn', 'legal_address'].map(field => ({
          field,
          type: 'text',
          props: {
            placeholder: 'Введите текст',
            delay: 350
          }
        }))
      )),
      actions: computed(() => ([
        {
          key: 'add',
          asLined: true,
          state: 'primary',
          label: 'Добавить компанию',
          async handler() {
            await showAddOrganizationDialog()
          }
        },
        {
          key: 'setDefault',
          asLined: true,
          state: 'secondary',
          label: 'Установить по умолчанию',
          async handler({selectedItems}) {
            const isActive = !!selectedItems.length;
            const organization = records.value[selectedItems[0]];
            if(
              !(await confirmDialog({
                confirmLabel: 'Да',
                title: 'Смена организации по умолчанию',
                isCancellable: isActive,
                isConfirmable: isActive,
                message: isActive && `Вы уверены, что хотите установить организацию "${organization.name_full}"?`,
                hint: !isActive && 'Выберите организацию',
              })).result
            ) {
              return;
            }

            await axios({
              method: 'patch',
              url: `${baseURL}/api/account/user/active-company/${JSON.parse(localStorage.getItem('user')).id}/`,
              data: {
                default_company: organization.id
              }
            })
            localStorage.setItem('defaultCompany', organization.id);
            await showToast({
              message: `Компания "${organization.name_full} установлена по умолчанию"`,
              type: 'success',
            });

            store.dispatch('setCompanyDefault', organization.id)
          }
        },
      ])),
      columns: ref([
        {
          field: 'index',
          isRequired: true,
          label: '№',
          withTitle: false,
          width: '50px',
        },
        {
          field: 'name_full',
          label: 'Полное наименование',
          isSortable: true,
          width: 3,
        },
        {
          field: 'name_short',
          label: 'Сокращенное наименование',
          isSortable: true,
          width: 2,
        },
        {
          field: 'inn',
          label: 'ИНН',
          isSortable: true,
          width: 1,
        },
        {
          field: 'legal_address',
          label: 'Юридический адрес',
          isSortable: true,
          width: 2,
        },
      ]),
      recordActions: ref([
        {
          key: 'add',
          label: 'Просмотреть',
          icon: 'eye',
          handler: showViewDialog
        },
        {
          key: 'edit',
          label: 'Редактировать',
          icon: 'pencil',
          handler: ({record:{ id }}) => {
            showOrganizationDialog(id, true)
          }
        },
        {
          key: 'delete',
          label: 'Удалить',
          icon: 'close',
          async handler({record: {id, name_full}}) {
            if(
              !(await confirmDialog({
                confirmLabel: 'Да',
                title: 'Удаление организации',
                message: `Вы уверены, что хотите удалить организацию "${name_full}"?`,
              })).result
            ) {
              return;
            }

            await axios({
              method: 'delete',
              url: `${baseURL}/api/account/company/${id}`,
            })

            await fetchData();

            await showToast({
              message: 'Компания удалена',
              type: 'success',
            })
          }
        },
      ])
    })

    return {
      actions,
      isFetching,
      columns,
      filters,
      filtersModel,
      limit,
      total,
      page,
      sort,
      resetSettings,
      records,
      recordActions,
      showViewDialog,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
