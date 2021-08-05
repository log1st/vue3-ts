<template>
  <div :class="$style.page">
    <div :class="$style.header">
      <div :class="$style.content">
        <div :class="$style.title">
          {{ id ? 'Редактировать' : 'Создать' }} документ
        </div>
        <div :class="$style.menu" v-if="'menu' in $slots">
          <slot name="menu"/>
        </div>
      </div>
    </div>
    <form @submit.prevent="submit" :class="$style.body">
      <div :class="$style.mainContent">
        <div :class="$style.form">
          <div :class="$style.field">
            <SelectInput
              placeholder="Выберите модуль документа"
              label="Тип модуля документа"
              :state="['primary', 'dark', 'boldLabel']"
              :options="modules"
              v-model="model.module"
              :is-disabled="isLoading"
              :error="errorsMap.module"
            />
          </div>
          <div :class="$style.field">
            <SelectInput
              placeholder="Выберите вид документа"
              label="Вид документа"
              :state="['primary', 'dark', 'boldLabel']"
              :options="types"
              v-model="model.template_type"
              :is-disabled="isLoading"
              :error="errorsMap.template_type"
            />
          </div>
          <div :class="$style.field">
            <TextInput
              placeholder="Введите название"
              :state="['primary', 'dark', 'boldLabel']"
              label="Название"
              v-model="model.name"
              :is-disabled="isLoading"
              :error="errorsMap.name"
            />
          </div>
          <div :class="$style.field">
            <Btn
              state="primary"
              label="Добавить тип документа"
              @click="showAddTypeDialog"
              :class="$style.addType"
            />
          </div>
        </div>
        <Editor
          :class="$style.editor"
          :apiKey="apiKey"
          :init="editorOptions"
          @onInit="onEditorLoaded"
          v-model="model.content"
        />
        <div :class="$style.error" v-if="'content' in errorsMap">
          {{errorsMap.content}}
        </div>
      </div>
      <div :class="$style.side">
        <div :class="$style.submitWrapper">
          <Btn
            :class="$style.submit"
            state="primary"
            :label="id ? 'Изменить шаблон' : 'Создать шаблон'"
            type="submit"
            :is-disabled="isLoading"
          />
        </div>
        <div :class="$style.variablesWrapper" v-if="model.module">
          <template v-for="group in variables">
            <div :key="`${group.id}-header`" :class="$style.variablesHeader">
              {{group.name}}
            </div>
            <div :key="`${group.id}-variables`" :class="$style.variables">
              <div
                :class="$style.variable"
                v-for="variable in group.vars"
                :key="variable.id"
                @click="passVariable(variable)"
              >
                <Icon :class="$style.variableCheckbox" icon="add"/>
                <div :class="$style.variableName">
                  <span>
                    {{variable.var}}
                  </span>
                  <TooltipWrapper align="end" :text="variable.description" :class="$style.variableHint">
                    <Icon icon="info-outline" :class="$style.variableHintIcon"/>
                  </TooltipWrapper>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {defineComponent, ref, watch, computed, onMounted} from '@vue/composition-api';
import SelectInput from "@/new/components/selectInput/SelectInput";
import TextInput from "@/new/components/textInput/TextInput";
import {baseURL, tinyApiKey} from "@/settings/config";
import Btn from "@/new/components/btn/Btn";
import Icon from "@/new/components/icon/Icon";
import TooltipWrapper from "@/new/components/tooltip/TooltipWrapper";
import Editor from '@tinymce/tinymce-vue';
import {useDialog} from "@/new/hooks/useDialog";
import {useToast} from "@/new/hooks/useToast";
import {useErrors} from "@/new/hooks/useErrors";

export default defineComponent({
  name: 'index',
  components: {TooltipWrapper, Icon, Btn, TextInput, SelectInput, Editor},
  props: {
    id: [Number, String],
  },
  setup(props) {
    const getEmptyModel = () => ({
      id: null,
      template_type: null,
      module: null,
      name: '',
      content: '',
    });

    const {
      showDialog,
    } = useDialog();
    const {
      showToast,
    } = useToast();

    const model = ref(getEmptyModel());

    const isLoading = ref(false);
    const fetchModel = async () => {
      if(!props.id) {
        model.value = getEmptyModel();
        return;
      }

      isLoading.value = true;
      const {data} = await axios({
        method: 'get',
        url: `${baseURL}/constructor/template/${props.id}`,
      });

      model.value = data;
      isLoading.value = false;
    }

    watch(computed(() => props.id), () => {
      requestAnimationFrame(fetchModel);
    }, {
      immediate: true,
    })

    const modules = ref([
      {
        value: 'pretrial',
        label: 'Досудебное производство',
      },
      {
        value: 'judicial',
        label: 'Судебное производство',
      },
      {
        value: 'executive',
        label: 'Исполнительное производство',
      },
    ]);

    const types = ref([]);

    const {
      errorsMap: typeErrorsMap,
      clearErrors: clearTypeErrors,
      setErrors: setTypeErrors,
    } = useErrors();

    const showAddTypeDialog = async () => {
      setTypeErrors([]);
      await showDialog({
        component: 'editModel',
        payload: {
          isEditable: true,
          model: {
            name: '',
            description: '',
          },
          fields: [
            {key: 'name', label: 'Наименование типа документа', hint: 'Использовать латиницу без пробелов'},
            {key: 'description', label: 'Описание типа документа'},
          ],
          errors: typeErrorsMap,
          isInitiallyEditing: true,
          onSave: async (model) => {
            clearTypeErrors();
            try {
              await axios({
                method: 'post',
                url: `${baseURL}/constructor/template_type/`,
                data: model,
              });
              return {
                status: true,
              }
            } catch (e) {
              if(e?.response) {
                setTypeErrors(Object.entries(e?.response.data).reduce((acc, [field, errors]) => ([
                  ...acc,
                  ...errors.map(error => ([field, error]))
                ]), []))
              }
              return {
                status: false,
              }
            }
          }
        }
      })
    }
    const fetchTypes = async () => {
      const {data} = await axios({
        method: 'get',
        url: `${baseURL}/constructor/template_type/`,
        params: {
          production_type: model.value.module,
        }
      });

      types.value = data.map(({id, description}) => ({
        value: id,
        label: description,
      }));
    }
    onMounted(fetchTypes);

    const variables = ref([]);
    const fetchVariables = async () => {
      const {data} = await axios({
        method: 'get',
        url: `${baseURL}/constructor/vars`,
        params: {
          production_type: model.value.module,
        }
      });

      variables.value = data.groups;
    }

    watch(computed(() => (model.value.module)), () => {
      requestAnimationFrame(fetchVariables);
    }, {
      immediate: true,
    });

    const apiKey = tinyApiKey;
    const editor = ref();
    const onEditorLoaded = (event, newEditor) => {
      editor.value = newEditor;
    }
    const editorOptions = ref({
      menubar: true,
      language: 'ru',
      paste_data_images: true,
      content_css: '/constructor.css',
      fontsize_formats: '6pt 7pt 8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 32pt 36pt 38pt 40pt',
      content_style: 'body { font-family: Times New Roman; }',
      plugins: [
        'fullpage advlist autolink lists link image charmap print preview',
        'anchor searchreplace visualblocks code fullscreen insertdatetime',
        'media table paste code imagetools'
      ],
      toolbar:
        'insert | undo redo | fontselect | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify'
    });

    const passVariable = async ({name, var: variable}) => {
      editor.value.selection.setContent(`<span style='background:#00BCD4;' title='Это переменная ${name}'>{{${variable}}}</span>`);
      model.value.content = editor.value.getContent();
    }

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors();

    const submit = async () => {
      clearErrors();
      try {
        isLoading.value = true;
        const {data} = await axios({
          method: props.id ? 'patch' : 'post',
          url: `${baseURL}/constructor/template/${props.id ? `${props.id}/` : ''}`,
          data: {
            content: model.value.content.replace(/(.*|)zerotemplate=!0(.*)/, '$1'),
            name: model.value.name,
            template_type: model.value.template_type,
          }
        });
        await showToast({
          message: `Шаблон успешно ${props.id ? 'изменён' : 'сохранён'}`,
          type: 'success',
        });
      } catch (e) {
        if(e?.response) {
          setErrors(Object.entries(e?.response.data).reduce((acc, [field, errors]) => ([
            ...acc,
            ...errors.map(error => ([field, error]))
          ]), []))
        }
        await showToast({
          message: `Ошибка ${props.id ? 'изменения' : 'сохранения'} шаблона`,
          type: 'error',
        });
      } finally {
        isLoading.value = false;
      }
    }

    return {
      model,
      modules,
      types,
      variables,

      submit,

      isLoading,

      passVariable,

      apiKey,
      onEditorLoaded,
      editorOptions,

      showAddTypeDialog,
      errorsMap,
    }
  }
});
</script>

<style lang="scss" module>
@import "./index";
</style>
