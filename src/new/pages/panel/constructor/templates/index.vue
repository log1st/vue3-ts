<template>
  <div :class="$style.page">
    <div :class="$style.header">
      <div :class="$style.content">
        <div :class="$style.title">
          Выберите готовый документ для редактирования
        </div>
        <div :class="$style.menu" v-if="'menu' in $slots">
          <slot name="menu"/>
        </div>
      </div>
    </div>
    <div :class="$style.wideBody">
      <div :class="$style.table">
        <div :class="$style.title">Список шаблонов</div>
        <div :class="$style.tableBody">
          <ActiveTable
            key-field="id"
            state="tertiary"
            :columns="columns"
            :records="records"
            :record-actions="recordActions"
            :is-loading="isFetching"
            :with-actions="false"
            :is-selectable="false"
            :with-pagination="false"
            :with-all-selection="false"
            :with-context-menu="false"
            :actions-width="90"
            :class="$style.tableTable"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, computed} from '@vue/composition-api';
import {useActiveTable} from "@/new/components/activeTable/useActiveTable";
import ActiveTable from "@/new/components/activeTable/ActiveTable";
import {baseURL} from "@/settings/config";
import {useRouter} from "@/new/hooks/useRouter";
import {useDialog} from "@/new/hooks/useDialog";
import {useToast} from "@/new/hooks/useToast";
import {useStore} from "@/new/hooks/useStore";

export default defineComponent({
  name: 'index',
  components: {ActiveTable},
  setup() {
    const {redirect} = useRouter();

    const {
      confirmDialog,
    } = useDialog();

    const {
      showToast,
    } = useToast();

    const store = useStore();

    const {
      columns,
      records,
      isFetching,
      recordActions,
      fetchData,
    } = useActiveTable({
      columns: ref([
        {
          field: 'index',
          label: '№',
        },
        {
          field: 'name',
          label: 'Имя',
        },
        {
          field: 'template_type_obj.description',
          label: 'Тип шаблона',
        },
      ]),
      filters: computed(() => ([
        {
          field: 'company_id',
          type: 'text',
          isHidden: true,
          defaultValue: store.getters['defaultCompanyId']
        }
      ])),
      async fetch({params, cancelToken}) {
        const {data} = await axios({
          method: 'get',
          url: `${baseURL}/constructor/template/`,
          params,
          cancelToken,
        });

        return {
          data: {
            count: data.length,
            results: data.map((record, index) => ({
              ...record,
              index: index + 1,
            })),
          }
        }
      },
      recordActions: computed(() => ([
        {
          key: 'add',
          label: 'Редактировать',
          icon: 'pencil',
          async handler({record}) {
            await redirect({
              name: 'panel-constructor-template',
              params: {
                id: record.id,
              }
            })
          }
        },
        {
          key: 'remove',
          label: 'Удалить',
          icon: 'close',
          async handler({record}) {
            if((await confirmDialog({
              title: 'Удаление шаблона',
              message: `Вы действительно хотите удалить шаблон "${record.name}"?`,
              confirmLabel: 'Подтвердить'
            })).result) {
              try {
                await axios({
                  method: 'delete',
                  url: `${baseURL}/constructor/template/${record.id}/`
                });

                await showToast({
                  message: 'Шаблон успешно удалён',
                  type: 'info',
                });

                await fetchData();
              } catch (e) {
                await showToast({
                  message: e.message,
                  type: 'error',
                });
              }
            }
          }
        },
      ]))
    })

    return {
      columns,
      records,
      isFetching,
      recordActions,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
