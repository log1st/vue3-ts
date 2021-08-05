<template>
  <div :class="$style.page">
    <div :class="$style.header">
      <div :class="$style.content">
        <div :class="$style.title">
          Конструктор документов
        </div>
        <div :class="$style.menu" v-if="'menu' in $slots">
          <slot name="menu"/>
        </div>
      </div>
    </div>
    <div :class="$style.wideBody">
      <div :class="$style.headline">Выберите документ по умолчанию</div>
      <div :class="$style.list">
        <div :class="$style.item" v-for="type in types" :key="type.id">
          <div :class="$style.itemLabel">
            {{type.description}}
          </div>
          <div :class="$style.itemField">
            <SelectInput
              :options="templates"
              value-prop="id"
              display-prop="name"
              :state="['dark', 'primary']"
              :class="$style.field"
              v-model="map[type.id]"
              placeholder="Выберите шаблон"
              @update:modelValue="submit"
              :is-disabled="isSubmitting"
            />
            <Btn state="quaternary" prepend-icon="close" :class="$style.itemReset" @click="resetItem(type.id)"
                 :is-disabled="isSubmitting"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref, watch, computed, onBeforeUnmount} from '@vue/composition-api';
import {baseURL} from "@/settings/config";
import {useStore} from "@/new/hooks/useStore";
import SelectInput from "@/new/components/selectInput/SelectInput";
import Btn from "@/new/components/btn/Btn";
import {useToast} from "@/new/hooks/useToast";

export default defineComponent({
  name: 'index',
  components: {Btn, SelectInput},
  setup() {
    const store = useStore();
    const companyId = computed(() => (store.getters['defaultCompanyId']));

    const types = ref([]);
    const fetchTypes = async () => {
      const {data} = await axios({
        method: 'get',
        url: `${baseURL}/constructor/template_type/`,
      });
      types.value = data;
    }
    onMounted(fetchTypes);

    const documents = ref([]);
    const fetchDocuments = async () => {
      const {data} = await axios({
        method: 'get',
        url: `${baseURL}/constructor/company/template/`,
        params: {
          company_id: store.getters['defaultCompanyId'],
        }
      });

      documents.value = data;
    }
    watch(companyId, () => {
      requestAnimationFrame(fetchDocuments)
    }, {
      immediate: true,
    });

    const templates = ref([]);
    const fetchTemplates = async () => {
      const {data} = await axios({
        method: 'get',
        url: `${baseURL}/constructor/template/`,
      });

      templates.value = data;
    };
    onMounted(fetchTemplates);

    const map = ref({});
    watch(documents, (docs) => {
      map.value = {
        ...types.value.reduce((acc, {id}) => ({
          ...acc,
          [id]: null
        }), {}),
        ...(docs.reduce((acc, cur) => ({
          ...acc,
          [cur.template_obj.template_type]: cur.template
        }), {}))
      }
    }, {
      immediate: true,
      deep: true,
    });

    const {showToast} = useToast();

    const isSubmitting = ref(false);
    let submitTimeout;
    onBeforeUnmount(() => {
      clearTimeout(submitTimeout);
    })
    const submit = async () => {
      clearTimeout(submitTimeout);
      if(isSubmitting.value) {
        return;
      }
      submitTimeout = setTimeout(async() => {
        isSubmitting.value = true;
        await showToast({
          message: 'Обновление данных',
          type: 'warning'
        });

        const toRemove = documents.value.filter(({template_obj: {template_type}, template}) => (
          !map.value[template_type]
        )).map(({id}) => id);

        const toEdit = documents.value.filter(({template, template_obj: {template_type}, id}) => (
          !toRemove.includes(id) && (template !== map.value[template_type])
        )).map(({id, template_obj: {template_type}}) => ({id, template_type}));

        const existingTypes = documents.value.map(({template_obj: {template_type}}) => template_type);
        const toCreate = types.value.filter(({id}) => (
          !existingTypes.includes(id) && map.value[id]
        )).map(({id}) => id);

        try {
          await Promise.all([
            ...toRemove.map(async id => axios({
              method: 'delete',
              url: `${baseURL}/constructor/company/template/${id}/`,
            })),
            ...toEdit.map(async ({id, template_type}) => axios({
              method: 'patch',
              url: `${baseURL}/constructor/company/template/${id}/`,
              data: {
                template: map.value[template_type],
              }
            })),
            ...toCreate.map(async (id) => axios({
              method: 'post',
              url: `${baseURL}/constructor/company/template/`,
              data: {
                company: companyId.value,
                template: map.value[id],
                production_type: 'pretrial'
              }
            }))
          ]);

          await showToast({
            message: 'Данные обновлены',
            type: 'success'
          });
        } catch (e) {
          await showToast({
            message: 'Ошибка обновления данных',
            type: 'error'
          });
        } finally {
          isSubmitting.value = false;
        }
      }, 1000);
    }

    const resetItem = (id) => {
      map.value[id] = null;
      submit();
    }

    return {
      documents,
      templates,
      types,
      map,

      submit,
      resetItem,

      isSubmitting,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
