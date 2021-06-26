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
        key-field="id"
        selectable-column="id"
        :with-all-selection="false"
        :with-pagination="false"
        :with-actions="false"
        :with-controls="false"
        :with-context-menu="false"
        with-unique-selection
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

export default defineComponent({
  name: 'index',
  components: {ActiveTable},
  setup() {
    const {
      confirmDialog,
    } = useDialog();

    const {
      showToast,
    } = useToast();

    const store = useStore();

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
    } = useActiveTable({
      async fetch({params, cancelToken}) {
        const {data} = await axios({
          method: 'get',
          url: `${baseURL}/api/account/company/`,
          params,
          cancelToken,
        })

        return {
          data: {
            count: data.length,
            results: data.map((record, index) => ({
              ...record,
              index,
            })),
          }
        }
      },
      filters: computed(() => (
        ['name_full', 'name_short', 'inn', 'legal_address'].map(field => ({
          field,
          type: 'text',
          props: {
            placeholder: 'Введите текст',
          }
        }))
      )),
      actions: computed(() => ([
        {
          key: 'add',
          asLined: true,
          state: 'primary',
          label: 'Добавить компанию',
          handler: () => {
            alert('Add company')
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
              }))
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

            //@TODO remove
            store.dispatch('setCompanyDefault', store.getters['getCompanies'].findIndex(company => company.id === organization.id))
            store.dispatch('setCompanyDefaultData', organization)
          }
        },
      ])),
      columns: ref([
        {
          field: 'id',
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
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
