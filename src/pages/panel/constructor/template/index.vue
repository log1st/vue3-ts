<template>
  <form
    :class="$style.container"
    @submit.prevent="submit"
  >
    <div :class="$style.form">
      <div :class="$style.fields">
        <SelectInput
          v-model="model.production_type"
          :class="$style.field"
          :label="t('module.label')"
          :placeholder="t('module.placeholder')"
          state="primary"
          :options="productionTypes"
          :errors="errorsMap.production_type"
        />
        <SelectInput
          v-model="model.template_type"
          :class="$style.field"
          :label="t('type.label')"
          :placeholder="t('type.placeholder')"
          state="primary"
          value-field="id"
          display-field="description"
          :options="templateTypes"
          :errors="errorsMap.template_type"
        />
        <TextInput
          v-model="model.name"
          :class="$style.field"
          :label="t('name.label')"
          :placeholder="t('name.placeholder')"
          state="primary"
          :errors="errorsMap.name"
        />
        <Btn
          :class="$style.addType"
          :label="t('addType.title')"
          state="primary"
          @click="showAddTypeDialog"
        />
      </div>
      <div
        :class="$style.editor"
      >
        <div
          v-once
          :id="editorId"
        />
      </div>
      <div
        v-if="'content' in errorsMap"
        :class="$style.error"
      >
        <div
          v-for="error in errorsMap.content"
          :key="error"
        >
          {{ error }}
        </div>
      </div>
    </div>
    <div :class="$style.side">
      <Btn
        :class="$style.submit"
        type="submit"
        :label="t(`${id ? 'update' : 'create'}Submit`)"
      />
      <div :class="$style.variablesWrapper">
        <template
          v-for="group in variableGroups"
          :key="group.id"
        >
          <div :class="$style.group">
            {{ group.name }}
          </div>
          <div :class="$style.variables">
            <button
              v-for="variable in group.vars"
              :key="variable.id"
              type="button"
              :class="$style.variable"
              @click="passVariable(variable)"
            >
              <Icon
                icon="add"
                :class="$style.variableCheck"
              />
              <span :class="$style.variableName">
                {{ variable.name }}
              </span>
              <TooltipWrapper
                :class="$style.variableHint"
                :label="variable.description"
              >
                <Icon icon="info-outline" />
              </TooltipWrapper>
            </button>
          </div>
        </template>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Btn from '@/components/btn/Btn.vue';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import {
  ConstructorTemplate,
  ConstructorVariable,
  ConstructorVariableGroup, CreateConstructorTemplateTypesModel,
  TemplateType,
  useConstructor,
} from '@/hooks/useConstructor';
import SelectInput from '@/components/selectInput/SelectInput.vue';
import { useActiveTable } from '@/hooks/useActiveTable';
import TextInput from '@/components/textInput/TextInput.vue';
import { SourceErrors, useErrors } from '@/hooks/useErrors';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import Icon from '@/components/icon/Icon.vue';
import TooltipWrapper from '@/components/tooltip/TooltipWrapper.vue';
import { getRandomString } from '@/utils/string';
import { IDialogComponent, useDialog } from '@/hooks/useDialog';
import { SignalType, useSignal } from '@/hooks/useSignal';

export default defineComponent({
  name: 'Index',
  components: {
    TooltipWrapper, Icon, TextInput, SelectInput, Btn,
  },
  props: {
    id: [String, Number] as PropType<ConstructorTemplate['id']>,
  },
  setup(props) {
    const { id } = toRefs(props);
    const { t } = useLocalI18n('panel.constructor.template');

    const {
      fetchConstructorTemplate,
      productionTypes,
      createTemplateType,
      fetchTemplateTypes,
      updateConstructorTemplate,
      createConstructorTemplate,
      fetchConstructorVariables,
    } = useConstructor();

    const editorId = getRandomString();
    const editor = ref<any>(null);
    onBeforeUnmount(() => {
      editor.value?.destroy();
      editor.value = null;
    });

    const originalName = ref<string | null>(null);

    const model = ref<Partial<ConstructorTemplate>>({
      name: '',
      template_type: null,
      content: '',
    });
    watch(id, async (newId) => {
      if (!newId) {
        return;
      }
      const { status, response } = await fetchConstructorTemplate(+newId);
      if (status) {
        model.value = response;
        originalName.value = response.name || null;
        if (editor.value) {
          editor.value?.setContent(response.content);
        }
      }
    }, {
      immediate: true,
    });

    const {
      records: templateTypes,
      fetchData: refetchTemplateTypes,
    } = useActiveTable<TemplateType, TemplateType, 'id'>({
      keyField: 'id',
      async fetch({ params, signal }) {
        const { response } = await fetchTemplateTypes({ ...params, signal });

        return response;
      },
      defaultLimit: ref(1000),
    });

    const {
      clearErrors,
      setErrors,
      errorsMap,
    } = useErrors<keyof ConstructorTemplate>();

    const router = useRouter();

    const submit = async () => {
      clearErrors();

      const { status, response } = (
        (id.value && model.value.is_editable)
          ? await updateConstructorTemplate({ id: id.value, model: model.value })
          : await createConstructorTemplate({
            ...model.value,
            name:
              (!originalName.value || (originalName.value !== model.value.name))
                ? model.value.name
                : t('copy', { name: model.value.name }),
            content: editor.value.getContent(),
          })
      );

      if (!status) {
        setErrors(Object.entries(response) as SourceErrors<keyof ConstructorTemplate>);
      } else {
        await router.push({ name: 'panel-constructor-templates' });
      }
    };

    const store = useStore();
    onMounted(async () => {
      await store.dispatch('thirdParty/loadTinyMCE');
      // @ts-ignore
      // eslint-disable-next-line prefer-destructuring
      editor.value = (await window.tinymce.init({
        menubar: true,
        language: 'ru',
        paste_data_images: true,
        content_css: '/constructor.css',
        fontsize_formats: '6pt 7pt 8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 32pt 36pt 38pt 40pt',
        content_style: 'body { font-family: Times New Roman; }',
        plugins: [
          'fullpage advlist autolink lists link image charmap print preview',
          'anchor searchreplace visualblocks code fullscreen insertdatetime',
          'media table paste code imagetools',
        ],
        toolbar:
          'insert | undo redo | fontselect | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify',
        selector: `#${editorId}`,
      }))[0];
      editor.value?.setContent(model.value.content);
    });

    const passVariable = async ({ name, var: variable }: ConstructorVariable) => {
      editor.value.selection.setContent(`<span style='background:#00BCD4;' title='Это переменная ${name}'>{{${variable}}}</span>`);
      model.value.content = editor.value.getContent();
    };

    const {
      records: variableGroups,
    } = useActiveTable<ConstructorVariableGroup, ConstructorVariableGroup, 'id'>({
      keyField: 'id',
      async fetch({ params, signal }) {
        const { response } = await fetchConstructorVariables({ ...params, signal });

        return response;
      },
      defaultLimit: ref(1000),
      filters: computed<Array<ActiveFormField<ConstructorTemplate>>>(() => ([
        {
          key: 'production_type',
          field: 'production_type',
          type: ActiveFormFieldType.input,
          defaultValue: model.value.production_type,
        },
      ])),
    });

    const {
      showDialog,
    } = useDialog();

    const {
      dispatchSignal,
      subscribeToSignal,
    } = useSignal();

    const signalId = getRandomString();

    const {
      errorsMap: typeErrorsMap,
      clearErrors: clearTypeErrors,
      setErrors: setTypeErrors,
    } = useErrors<keyof CreateConstructorTemplateTypesModel>();
    watch(typeErrorsMap, async (map) => {
      await dispatchSignal(SignalType.modelErrors, { id: signalId, errors: map });
    }, {
      immediate: true,
    });

    let unsubCreateTypeDialog: (() => void) | null = null;
    onBeforeUnmount(() => {
      unsubCreateTypeDialog?.();
    });

    onBeforeUnmount(subscribeToSignal(
      SignalType.model,
      async ({ id, model }:{id: string; model: CreateConstructorTemplateTypesModel}) => {
        if (id === signalId) {
          clearTypeErrors();
          const { status, response } = await createTemplateType(model);

          if (!status) {
            setTypeErrors(
              Object.entries(response) as SourceErrors<keyof CreateConstructorTemplateTypesModel>,
            );
          } else {
            unsubCreateTypeDialog?.();
            unsubCreateTypeDialog = null;
            await refetchTemplateTypes();
          }
        }
      },
    ));

    const showAddTypeDialog = async () => {
      unsubCreateTypeDialog?.();
      unsubCreateTypeDialog = await showDialog({
        component: IDialogComponent.model,
        payload: {
          isEditable: true,
          signal: signalId,
          fields: [
            {
              key: 'name',
              field: 'name',
              type: ActiveFormFieldType.input,
              options: {
                label: t('addType.name.label'),
                hint: t('addType.name.hint'),
              },
            },
            {
              key: 'description',
              field: 'description',
              type: ActiveFormFieldType.input,
              options: {
                label: t('addType.description'),
              },
            },
          ],
        },
      });
    };

    return {
      t,
      model,
      submit,

      productionTypes,
      templateTypes,

      errorsMap,

      variableGroups,
      passVariable,

      editorId,
      showAddTypeDialog,
    };
  },
});
</script>

<style lang="scss" module>
@import "./index";
</style>
