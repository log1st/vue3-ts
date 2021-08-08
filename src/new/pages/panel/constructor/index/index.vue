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
              :options="templates.filter(({template_type}) => template_type === type.id)"
              value-prop="id"
              display-prop="name"
              v-model="defaultsMap[type.id]"
              :state="['dark', 'primary']"
              :class="$style.field"
              placeholder="Выберите шаблон"
              @update:modelValue="setDefaultTemplate(type.id, $event)"
            />
            <Btn
              state="quaternary"
              prepend-icon="close"
              :class="$style.itemReset"
              @click="setDefaultTemplate(type.id, null)"
              :is-disabled="false"
            />
          </div>
        </div>
      </div>
      <template v-for="{key, label, courts} in courtsSchema">
        <div :key="`${key}-label`" :class="$style.headline">{{label}}</div>
        <div :key="`${key}-list`" :class="$style.list">
          <div :class="$style.item" v-for="court in courts" :key="court.id">
            <div :class="$style.itemLabel">
              {{court.name}}
            </div>
            <div :class="$style.itemField">
              <SelectInput
                :options="templates"
                value-prop="id"
                display-prop="name"
                :state="['dark', 'primary']"
                :class="$style.field"
                placeholder="Выберите шаблон"
                :model-value="courtsMap[court.id].local"
                @update:modelValue="setCourtTemplate(court, 'local', $event)"
              />
              <Btn
                state="quaternary"
                prepend-icon="close"
                :class="$style.itemReset"
                :is-disabled="false"
                @click="setCourtTemplate(court, 'local', null)"
              />
            </div>
            <div :class="$style.itemField">
              <SelectInput
                :options="templates.filter(({template_type}) => template_type === shareholderTypeId)"
                value-prop="id"
                display-prop="name"
                :state="['dark', 'primary']"
                :class="$style.field"
                placeholder="Выберите шаблон"
                :model-value="courtsMap[court.id].shareholder"
                @update:modelValue="setCourtTemplate(court, 'shareholder', $event)"
              />
              <Btn
                state="quaternary"
                prepend-icon="close"
                :class="$style.itemReset"
                :is-disabled="false"
                @click="setCourtTemplate(court, 'shareholder', null)"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref, watch, computed} from '@vue/composition-api';
import {baseURL} from "@/settings/config";
import {useStore} from "@/new/hooks/useStore";
import SelectInput from "@/new/components/selectInput/SelectInput";
import Btn from "@/new/components/btn/Btn";
import {isDev} from "@/entry-server";

export default defineComponent({
  name: 'index',
  components: {Btn, SelectInput},
  setup() {
    const store = useStore();
    const companyId = computed(() => (store.getters['defaultCompanyId']));

    const magistrateCourts = ref([]);
    const regionalCourts = ref([]);
    const fetchCourts = async () => {
      const {data: magistrateCourtsData} = await axios({
        method: 'get',
        url: `${baseURL}/reference_books/magistrate_court_place/`,
        params: {
          company_id: companyId.value,
        }
      });
      magistrateCourts.value = magistrateCourtsData;

      const {data: regionalCourtsData} = await axios({
        method: 'get',
        url: `${baseURL}/reference_books/regional_court_place/`,
        params: {
          company_id: companyId.value,
        }
      });
      regionalCourts.value = regionalCourtsData;
    }
    const courts = computed(() => ([
      ...magistrateCourts.value,
      ...regionalCourts.value,
    ]))

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
        await fetchDocuments();
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

    const defaultsMap = computed(() => (
      types.value.reduce((acc, {id}) => ({
        ...acc,
        [id]: documents.value
          .filter(({court, regional_court}) => (
            !court && !regional_court
          ))
          .find(({template_obj: {template_type}}) => (
            template_type === id
          ))?.template || null,
      }), {})
    ))
    const setDefaultTemplate = async (typeId, templateId) => {
      const foundDocument = documents.value
        .filter(({court, regional_court}) => (
          !court && !regional_court
        ))
        .find(({template_obj: {template_type}}) => (
          template_type === typeId
        ));

      if(!templateId) {
        if(foundDocument) {
          await axios({
            method: 'delete',
            url: `${baseURL}/constructor/company/template/${foundDocument.id}/`
          })
        }
      } else if(foundDocument) {
        await axios({
          method: 'patch',
          url: `${baseURL}/constructor/company/template/${foundDocument.id}/`,
          data: {
            template: templateId,
          }
        })
      } else {
        await axios({
          method: 'post',
          url: `${baseURL}/constructor/company/template/`,
          data: {
            production_type: 'judicial',
            company: companyId.value,
            template: templateId,
          }
        })
      }

      await fetchDocuments();
    }

    const courtsSchema = computed(() => ([
      {
        key: 'magistrate',
        label: 'Выберите документ для участка мирового судьи',
        courts: magistrateCourts.value,
      },
      {
        key: 'regional',
        label: 'Выберите документ для участка регионального суда',
        courts: regionalCourts.value,
      },
    ]));

    const setCourtTemplate = async (court, type, templateId) => {
      const foundDocument = (type === 'local' ? [...documents.value].reverse() : documents.value)
        .filter(({court: m, regional_court: c}) => (
          ({m, c}[court.type]) === court.id
        ))
        .find(({template_obj}) => (
          type === 'local'
            ? (template_obj?.template_type !== shareholderTypeId.value)
            : (template_obj?.template_type === shareholderTypeId.value)
        ));

      if(!templateId) {
        if(foundDocument) {
          await axios({
            method: 'delete',
            url: `${baseURL}/constructor/company/template/${foundDocument.id}/`
          })
        }
      }  else if(foundDocument) {
        await axios({
          method: 'patch',
          url: `${baseURL}/constructor/company/template/${foundDocument.id}/`,
          data: {
            template: templateId,
          }
        })
      } else {
        await axios({
          method: 'post',
          url: `${baseURL}/constructor/company/template/`,
          data: {
            production_type: 'judicial',
            company: companyId.value,
            template: templateId,
            [{m: 'court', c: 'regional_court'}[court.type]]: court.id,
          }
        })
      }

      await fetchDocuments();
    }

    const shareholderTypeId = ref(isDev ? 11 : 10);

    const courtsMap = computed(() => (
      courts.value.reduce((acc, court) => {
        const courtTemplates = documents.value.filter(({court: m, regional_court: c}) => (
          (court.type === 'm' ? m : c) === court.id
        ));
        return {
          ...acc,
          [court.id]: {
            local: [...courtTemplates].reverse().find(
              ({template_obj: {template_type}}) => template_type !== shareholderTypeId.value
            )?.template || null,
            shareholder: courtTemplates.find(
              ({template_obj: {template_type}}) => template_type === shareholderTypeId.value
            )?.template || null,
          }
        }
      }, {})
    ));

    return {
      documents,
      templates,
      types,

      setDefaultTemplate,
      defaultsMap,

      courtsSchema,
      shareholderTypeId,

      setCourtTemplate,
      courtsMap,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
