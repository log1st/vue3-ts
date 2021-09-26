<template>
  <div :class="$style.page">
    <div :class="$style.block">
      <div :class="$style.title">
        {{ t('defaultDocument') }}
      </div>
      <div :class="$style.lines">
        <div
          v-for="type in templateTypes"
          :key="type.id"
          :class="$style.line"
        >
          <div :class="$style.label">
            {{ type.description }}
          </div>
          <div :class="$style.field">
            <SelectInput
              :options="constructorTemplates.filter(({template_type}) => template_type === type.id)"
              value-field="id"
              display-field="name"
              :class="$style.input"
              :placeholder="t('selectTemplate')"
              state="primary"
              :model-value="defaultsMap[type.id]"
              @update:modelValue="setDefaultTemplate(type.id, $event)"
            />
            <Btn
              :class="$style.reset"
              prepend-icon="close"
              state="quinary"
              @click="setDefaultTemplate(type.id, null)"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-for="[key, courts] in [['magistrate', magistrateCourts], ['regional', regionalCourts]]"
      :key="key"
      :class="$style.block"
    >
      <div :class="$style.title">
        {{ t(`${key}Court`) }}
      </div>
      <div :class="$style.lines">
        <div :class="$style.line">
          <div :class="$style.hint">
            {{ t('court.court') }}
          </div>
          <div :class="$style.hint">
            {{ t('court.decision') }}
          </div>
          <div :class="$style.hint">
            {{ t('court.shareholder') }}
          </div>
        </div>
        <div
          v-for="court in courts"
          :key="court.id"
          :class="$style.line"
        >
          <div :class="$style.label">
            {{ court.name }}
          </div>
          <div
            v-for="field in ['local', 'shareholder']"
            :key="field"
            :class="$style.field"
          >
            <SelectInput
              :options="
                field === 'local'
                  ? constructorTemplates
                  : constructorTemplates.filter(
                    ({template_type}) => template_type === shareholderTypeId
                  )"
              value-field="id"
              display-field="name"
              :class="$style.input"
              :placeholder="t('selectTemplate')"
              state="primary"
              :model-value="courtsMap[court.id][field]"
              @update:modelValue="setCourtTemplate(court, field, $event)"
            />
            <Btn
              :class="$style.reset"
              prepend-icon="close"
              state="quinary"
              @click="setCourtTemplate(court, field, null)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useActiveTable } from '@/hooks/useActiveTable';
import { Court, CourtType, useCourts } from '@/hooks/useCourts';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { useDefaultCompany } from '@/hooks/useDefaultCompany';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import {
  ConstructorTemplate,
  ProductionType,
  Template,
  TemplateType,
  useConstructor,
} from '@/hooks/useConstructor';
import SelectInput from '@/components/selectInput/SelectInput.vue';
import Btn from '@/components/btn/Btn.vue';
import { isDev } from '@/utils/env';

export default defineComponent({
  name: 'Index',
  components: { Btn, SelectInput },
  setup() {
    const { t } = useLocalI18n('panel.constructor.settings');
    const {
      company,
    } = useDefaultCompany();

    const {
      fetchRegionalCourts,
      fetchMagistrateCourts,
    } = useCourts();

    const {
      records: regionalCourts,
    } = useActiveTable<Court, Court, 'id'>({
      keyField: 'id',
      async fetch({ params, signal }) {
        const { response } = await fetchRegionalCourts({ ...params, signal });

        return response;
      },
      defaultLimit: ref(1000),
      filters: computed<Array<ActiveFormField<Court>>>(() => ([
        {
          key: 'company_id',
          field: 'company_id',
          type: ActiveFormFieldType.input,
          defaultValue: company.value?.id,
        },
      ])),
    });

    const {
      records: magistrateCourts,
    } = useActiveTable<Court, Court, 'id'>({
      keyField: 'id',
      async fetch({ params, signal }) {
        const { response } = await fetchMagistrateCourts({ ...params, signal });

        return response;
      },
      defaultLimit: ref(1000),
      filters: computed<Array<ActiveFormField<Court>>>(() => ([
        {
          key: 'company_id',
          field: 'company_id',
          type: ActiveFormFieldType.input,
          defaultValue: company.value?.id,
        },
      ])),
    });

    const {
      fetchTemplateTypes,
      fetchTemplates,
      fetchConstructorTemplates,
      removeTemplate,
      updateTemplate,
      createTemplate,
    } = useConstructor();

    const {
      records: templateTypes,
    } = useActiveTable<TemplateType, TemplateType, 'id'>({
      keyField: 'id',
      async fetch({ params, signal }) {
        const { response } = await fetchTemplateTypes({ ...params, signal });

        return response;
      },
      defaultLimit: ref(1000),
    });

    const {
      records: templates,
      fetchData: refetchTemplates,
    } = useActiveTable<Template, Template, 'id'>({
      keyField: 'id',
      async fetch({ params, signal }) {
        const { response } = await fetchTemplates({ ...params, signal });

        return response;
      },
      defaultLimit: ref(1000),
      filters: computed<Array<ActiveFormField<Template>>>(() => ([
        {
          key: 'company_id',
          field: 'company_id',
          type: ActiveFormFieldType.input,
          defaultValue: company.value?.id,
        },
      ])),
    });

    const {
      records: constructorTemplates,
    } = useActiveTable<ConstructorTemplate, ConstructorTemplate, 'id'>({
      keyField: 'id',
      async fetch({ params, signal }) {
        const { response } = await fetchConstructorTemplates({ ...params, signal });

        return response;
      },
      defaultLimit: ref(1000),
    });

    const defaultsMap = computed(() => (
      templateTypes.value.reduce((acc, { id }) => ({
        ...acc,
        [id]: templates.value
          .filter(({ court, regional_court }) => (!court && !regional_court))
          .find(({ template_obj: { template_type } }) => template_type === id)?.template || null,
      }), {})
    ));

    const shareholderTypeId = ref(isDev ? 11 : 10);

    const courts = computed(() => ([
      ...magistrateCourts.value,
      ...regionalCourts.value,
    ]));

    const courtsMap = computed(() => (
      courts.value.reduce((acc, court) => {
        const courtTemplates = templates.value.filter(({ court: m, regional_court: c }) => (
          (court.type === CourtType.magistrate ? m : c) === court.id
        ));
        return {
          ...acc,
          [court.id]: {
            local: [...courtTemplates].reverse().find(
              ({ template_obj: { template_type } }) => template_type !== shareholderTypeId.value,
            )?.template || null,
            shareholder: courtTemplates.find(
              ({ template_obj: { template_type } }) => template_type === shareholderTypeId.value,
            )?.template || null,
          },
        };
      }, {})
    ));

    const setDefaultTemplate = async (typeId: TemplateType['id'], templateId: ConstructorTemplate['id']) => {
      const foundDocument = templates.value
        .filter(({ court, regional_court }) => (
          !court && !regional_court
        ))
        .find(({ template_obj: { template_type } }) => (
          template_type === typeId
        ));

      if (!templateId) {
        if (foundDocument) {
          await removeTemplate(foundDocument.id);
        }
      } else if (foundDocument) {
        await updateTemplate({
          id: foundDocument.id,
          model: {
            template: templateId,
          },
        });
      } else {
        await createTemplate({
          production_type: ProductionType.pretrial,
          company: company.value!.id,
          template: templateId,
        });
      }

      await refetchTemplates();
    };

    const setCourtTemplate = async (
      court: Court,
      type: 'local' | 'shareholder',
      templateId: ConstructorTemplate['id'],
    ) => {
      const foundDocument = (type === 'local' ? [...templates.value].reverse() : templates.value)
        .filter(({ court: m, regional_court: c }) => (
          (({ m, c } as Record<CourtType, Court['id']>)[court.type]) === court.id
        ))
        .find(({ template_obj }) => (
          type === 'local'
            ? (template_obj?.template_type !== shareholderTypeId.value)
            : (template_obj?.template_type === shareholderTypeId.value)
        ));

      if (!templateId) {
        if (foundDocument) {
          await removeTemplate(foundDocument.id);
        }
      } else if (foundDocument) {
        await updateTemplate({
          id: foundDocument.id,
          model: {
            template: templateId,
          },
        });
      } else {
        await createTemplate({
          production_type: ProductionType.pretrial,
          company: company.value!.id,
          template: templateId,
          [{
            [CourtType.regional]: 'regional_court',
            [CourtType.magistrate]: 'court',
          }[court.type]]: court.id,
        });
      }

      await refetchTemplates();
    };

    return {
      t,

      regionalCourts,
      magistrateCourts,
      templateTypes,
      templates,
      constructorTemplates,

      defaultsMap,
      shareholderTypeId,
      courtsMap,

      setDefaultTemplate,
      setCourtTemplate,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
