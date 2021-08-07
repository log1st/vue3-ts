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
      <template v-for="[key, label, list, model, options] in courtsSchema">
        <div :key="`${key}-label`" :class="$style.headline">
          {{label}}
        </div>
        <div :key="`${key}-list`" :class="$style.list">
          <div :class="$style.item">
            <div :class="$style.label">Суд</div>
            <div :class="$style.label">Судебный приказ</div>
            <div :class="$style.label">Судебный приказ (дольщики)</div>
          </div>
          <div :class="$style.item" v-for="item in list" :key="item.id">
            <div :class="$style.itemLabel">{{item.name}}</div>
            <div :class="$style.itemField" v-for="field in ['court_order', 'court_order_p']" :key="field">
              <SelectInput
                v-if="model[item.id]"
                :options="options"
                value-prop="id"
                display-prop="name"
                :state="['dark', 'primary']"
                :class="$style.field"
                v-model="model[item.id][field]"
                placeholder="Выберите шаблон"
                @update:modelValue="submitCourt(key, item.id, field, $event)"
                :is-disabled="isSubmitting"
              />
              <Btn state="quaternary" prepend-icon="close" :class="$style.itemReset" @click="resetCourt(key, item.id, field)"
                   :is-disabled="isSubmitting"/>
            </div>
          </div>
        </div>
      </template>
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

    const courts = ref([]);
    const regionalCourts = ref([]);
    const fetchCourts = async () => {
      const {data: courtsData} = await axios({
        method: 'get',
        url: `${baseURL}/reference_books/magistrate_court_place/`,
        params: {
          company_id: companyId.value,
        }
      });
      courts.value = courtsData;

      const {data: regionalCourtsData} = await axios({
        method: 'get',
        url: `${baseURL}/reference_books/regional_court_place/`,
        params: {
          company_id: companyId.value,
        }
      });
      regionalCourts.value = regionalCourtsData;
    }

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
    watch(companyId, (id) => {
      if(!id) {
        return;
      }
      requestAnimationFrame(async () => {
        await fetchCourts();
        fetchDocuments();
      })
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
    const courtsMap = ref({});
    const regionalCourtsMap = ref({});
    watch(documents, (docs) => {
      map.value = {
        ...types.value.reduce((acc, {id}) => ({
          ...acc,
          [id]: null
        }), {}),
        ...(docs.filter(({court, regional_court}) => (
          !court && !regional_court
        )).reduce((acc, cur) => ({
          ...acc,
          [cur.template_obj.template_type]: cur.template
        }), {}))
      }
      courtsMap.value = {
        ...docs.filter(({court}) => court).reduce((acc, cur) => ({
          ...acc,
          [cur.court]: (
            ['court_order', 'court_order_p'].reduce((subAcc, subCur) => ({
              ...subAcc,
              [subCur]: cur.template_obj.template_type_obj.name === subCur ? (
                cur.template
              ) : (acc[cur.court]?.[subCur] || null)
            }), acc[cur.court] || {})
          )
        }), courts.value.reduce((acc, {id}) => ({
          ...acc,
          [id]: ['court_order', 'court_order_p'].reduce((subAcc, subCur) => ({...subAcc, [subCur]: null}), {}),
        }), {}))
      };
      regionalCourtsMap.value = {
        ...docs.filter(({regional_court}) => regional_court).reduce((acc, cur) =>
          ({
            ...acc,
            [cur.regional_court]: (
              ['court_order', 'court_order_p'].reduce((subAcc, subCur) => ({
                ...subAcc,
                [subCur]: cur.template_obj.template_type_obj.name === subCur ? (
                  cur.template
                ) : (acc[cur.regional_court]?.[subCur] || null)
              }), acc[cur.regional_court] || {})
            )
          }), regionalCourts.value.reduce((acc, {id}) => ({
          ...acc,
          [id]: ['court_order', 'court_order_p'].reduce((subAcc, subCur) => ({...subAcc, [subCur]: null}), {}),
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

    const submitCourt = async (type, id, field, value) => {
      const foundDocument = documents.value.find(({template_obj: {type}, court, regional_court}) => (
        id === {courts: court, regionalCourts: regional_court}[field]
      ));

      if(!foundDocument) {
        await axios({
          method: 'post',
          url: `${baseURL}/constructor/company/template/`,
          data: {
          company: store.getters['defaultCompanyId'],
          production_type: 'judicial',
          template: value,
          [{courts: 'court', regionalCourts: 'regional_court'}[type]]: id,
        }
        })
      } else {
        if(!value) {
          await axios({
            method: 'delete',
            url: `${baseURL}/constructor/company/template/${foundDocument.id}/`,
          });
        } else {
          await axios({
            method: 'patch',
            url: `${baseURL}/constructor/company/template/${foundDocument.id}/`,
            data: {
              template: value,
            }
          });
        }
      }
    }

    const resetCourt = async (type, id, field) => {
      ({
        courts: courtsMap,
        regionalCourts: regionalCourtsMap
      }[type]).value[id][field] = null;
      await submitCourt(type, id, field, null);
    }

    const courtOptions = computed(() => (
      templates.value.filter(({template_type_obj: {name}}) => name === 'court_order')
    ))

    const regionalCourtOptions = computed(() => (
      templates.value.filter(({template_type_obj: {name}}) => name === 'court_order_p')
    ));

    const courtsSchema = computed(() => (
      [
        ['courts', 'Выберите документ для участка мирового судьи', courts.value, courtsMap.value, courtOptions.value],
        ['regionalCourts', 'Выберите документ для участка регионального суда', regionalCourts.value, regionalCourtsMap.value, regionalCourtOptions.value],
      ]
    ))

    return {
      courtsSchema,
      documents,
      templates,
      types,
      map,

      submit,
      resetItem,

      isSubmitting,

      courts,
      courtsMap,

      regionalCourts,
      regionalCourtsMap,

      submitCourt,
      resetCourt,

      courtOptions,
      regionalCourtOptions,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
