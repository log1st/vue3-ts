<template>
<div class="constructor__wrapper">
    <p>Выберите шаблон, заполните смарт-опросник и внесите реквизиты. Документ готов!</p>
    <div class="constructor-input__wrapper">
      <div class="btn btn-primary" @click="openModalCreateType">
            Добавить тип документа
          </div>
    <div class="compib__row">
      <div class="compib__row-label">
        <span>Тип модуля документа</span>
      </div>
      <div class="compib__input">
        <div>
          <search-input :params="input.inputParams" @changeInputValue="changeInputsValue($event)"/>
        </div>
      </div>
    </div>
    <div class="compib__row">
      <div class="compib__row-label">
        <span>Тип шаблона</span>
      </div>
      <div class="compib__input">
        <div class="search-input is-select no-select-input">
          <v-select label="description" :options="allDocsTypes" v-model="templateDocsType" @change="checkOrganizationType()"></v-select>
        </div>
      </div>
    </div>
    <div class="compib__row">
      <div class="compib__row-label">
        <span>Название</span>
      </div>
      <div class="compib__input">
        <div class="search-input is-select">
          <input type="text" v-model="templateName">
        </div>
      </div>
    </div>
    </div>
    <div class="constructor">
    <div class="editor">
      <editor :apiKey="tinyAPIKey" :init="{
         height: 700,
         menubar: true,
         language: 'ru',
         entity_encoding: 'raw',
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
        }"
        @onInit="loaded"
        @onSelectionChange="selection"
        v-model="template"
        />
    </div>
    <div class="custom-sidebar">
      <div class="custom-sidebar__accept">
        <ur-btn
        v-if="!editMod"
        @click="saveTemplate"
        :loading="loading"
        class="btn btn-primary"
        :disabled="disabled" 
        >Сохранить шаблон</ur-btn>
        
        <ur-btn 
        v-if="editMod" 
        :loading="loading"
        class="btn btn-primary"
        :disabled="disabled" 
        @click="editTemplate"
        >
          Изменить шаблон
        </ur-btn>
      </div>
      <div class="custom-sidebar__item" v-for="(group, index) in allGroupsVariables" :key="index">
        <div class="custom-sidebar__checkboxes">
          <div class="custom-sidebar__checkboxes-item">
            <b>{{group.name}}</b>
          </div>
          <div class="custom-sidebar__checkboxes-item" :key="index" v-for="(el,index) in group.vars" @click="setVar(el)">
            <checkBox :checked="variable == el.var" :isDisabled="!isSet" />
            <span>{{el.name}}</span>
            <div class="vardesc__info-icon" :title="el.description">
               <icon-base width="3" height="10" iconColor="#fff">
                  <icon-info />
                </icon-base>
            </div>
                <div @click="editConstructorVariable(el)" style="cursor:pointer">
                  <icon-base width="15" height="15" iconColor="#848aa1">
                    <icon-edit></icon-edit>
                  </icon-base>
                </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  
</template>
<script>
import Editor from '@tinymce/tinymce-vue';
import { useConstructor } from '@/new/hooks/useConstructor';
import { baseURL } from '@/settings/config'
import searchInput from '@/components/elements/SearchInput'
import checkBox from '@/components/elements/CheckBox'
import MultilevelAccordion from "vue-multilevel-accordion";
// import chargesTable from './docs/setOfChargesTable.json'
import { mapActions, mapGetters } from 'vuex';
 

export default {
  name: 'Constructor',

  components: {
    'editor': Editor,
    checkBox,
    MultilevelAccordion,
    searchInput,
  },

  props:{
    params:{
      require: false,
      type: Object
    }
  },

  data() {
    return {
      templateName: '',
      templateModule: '',
      templateDocsType: '',
      template: undefined,
      
      loading: false,
      disabled: false,
      
      editMod: false,

      editorSelected: false,
      toCourt: false,
      variable: '',
      editor: null,
      input: {
       key:'templateModule',
       label: 'Назначить модуль документа', 
       inputParams: { 
         placeholder: 'Выберите модуль документа', 
         isSelect: true, 
         items: ['Досудебное производство', 'Судебное производство', 'Исполнительное производство'], 
         value: '' 
        } 
      },

      curVal: '',
      isSet: false
    }
  },
  created () {
      this.getDocumentTypes()
  },
  computed: {
    ...mapGetters(['allDocsTypes', 'allGroupsVariables']),
    organizationVars () {
      return this.$store.state.admin.organizationVars
    },

    generalVars () {
      return this.$store.state.admin.generalVars
    },

    debtorVars () {
      return this.$store.state.admin.debtorVars
    },

    courtVars () {
      return this.$store.state.admin.courtVars
    },

    debtorMainVars () {
      return this.$store.state.admin.debtorMainVars
    },

    teantVars () {
      return this.$store.state.admin.tenantVars
    },

    tinyAPIKey() {
      return process.env.VUE_APP_TINY_API_KEY || 'mq1rr60ffnl7cslwz6lo4jt635t7axolbn6ycowpao8t6zhn'
    },

  },
  mounted() {
    if (this.params != null) {
      this.editMod = true
      this.templateDocsType = this.allDocsTypes.find( al => al.id === this.params.template_type)
      this.editedId = this.params.id
      this.changeInputsValue('Досудебное производство')
      this.input.value = 'Досудебное производство'
      this.templateName = this.params.name
      let toHtml = this.params.content
      this.template = toHtml
    }
  },
  methods: {
    ...mapActions(['getEditorVars', 'getDocumentTypes', 'editVariable', 'setPopupComponent']),

    editConstructorVariable (payload) {
      this.setPopupComponent({component: 'AdminEditVariable', 
      params: {
        var: payload,
        docType: this.templateDocsType
      }})
    },  
    openModalCreateType () {
      this.setPopupComponent({ component: 'AdminAddDocumentType'})
    },  

    changeInputsValue(e){
      this.templateModule = e
      let docModule;
      switch (e) {
        case 'Досудебное производство':
          docModule = 'pretrial'
          break;
        case 'Судебное производство':
          docModule = 'judicial'
          break;
        case 'Исполнительное производство':
          docModule = 'executive'
          break;
      }
      this.getEditorVars(docModule)
    },

    setTemplate(id){
      this.toCourt = true
      this.template = ''
    },

    templateToHtml(string) {
      return decodeURIComponent(atob(string).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    },

    /**
     * Валидация шалона перед сохранением
     * @param {Int} payload 1 - сохранение, 2 - редактирование
     */
    editorValidation (payload) {
      return new Promise ((resolve, reject) => {
        if (this.templateDocsType === '') {
          reject ({status:false, msg: 'Тип документа'})
        } else if (typeof this.template === 'undefined' ) {
          reject({status:false, msg: 'Шаблон'})
        } else if (this.templateName === '') {
          reject ({status:false, msg: 'Имя шаблона'})
        } else {
          resolve({status:true})
        }
      })
    },

    TemplateToBase64(string) {
      return window.btoa(unescape(encodeURIComponent(string)));
    },

    saveTemplate () {
      this.editorValidation( 1 )
      .then ( async result => {
        if (result.status) {
          this.loading = true
          this.disabled = true
          let a = true
          // Обрезаем 38 символов от начала до конца </head>, tiny вставляет чистый head в разметку его и обрезаем
          // и заменяем на свой head с charset.
          let templateParse = this.template
          await this.$store.dispatch("setEncoding", {template:templateParse})
          .then( resp => {
            // console.log(resp)
          templateParse = `${resp.result}`
          if (templateParse.includes('zerotemplate!=0') == true) {  // Обрезаем дубль в конструкторе (если он есть)
            templateParse = templateParse.split('zerotemplate!=0')[0]
          } else {
            // console.log('2')
          }
          this.template = templateParse
            axios({
            url:`${baseURL}/constructor/template/`,
            data:{
              name: this.templateName,
              content: this.template,
              template_type: this.templateDocsType.id
            },
            method: 'POST'
            })
          .then((resp) => {
            this.loading = false
            this.disabled = false
            this.template = undefined
            if (resp.status === 200 || resp.status === 201) {
              this.$toast.open({
                  message: `Шаблон сохранен`,
                  type: 'success',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
              })
            }
          })
          .catch( err => {
            this.$toast.open({
                  message: err,
                  type: 'erorr',
                  duration: 5000,
                  dismissible: true,
                  position: 'top-right'
                })
              })
            })
          }
      })
      .catch ( err => {
        console.log(err)
        this.$toast.open({
            message: `поле ${err.msg} обязательно к заполнению`,
            type: 'warning',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
        })
      }) 
    },

    editTemplate () {
      this.loading = true
      this.disabled = true
      let templateParse = this.template
      // if (templateParse.includes('<meta charset="UTF-8"><meta content="text/html; charset=utf-8" http-equiv="Content-Type">') == false) {
      //   templateParse = this.template.slice(38)
      //   templateParse = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta content="text/html; charset=utf-8" http-equiv="Content-Type"></head>${templateParse}`
      // }
      if (templateParse.includes('zerotemplate!=0') == true) {  // Обрезаем дубль в конструкторе (если он есть)
        templateParse = templateParse.split('zerotemplate!=0')[0]
      } 
      this.template = templateParse

      this.$http({
          command: `/constructor/template/${this.editedId}/`,
          data: {
            name: this.templateName,
            content: this.template,
            template_type: this.templateDocsType.id
          },
          method: "PATCH"
      }).then( res => {
        this.$toast.open({
          message: `Шаблон изменен`,
          type: 'success',
          duration: 5000,
          dismissible: true,
          position: 'top-right'
        })
        // console.log(res)
        this.loading = false
        this.disabled = false
        this.template = undefined
      })
    },
    selection(event) {
      const val = this.editor.selection.getContent({format: 'text'});
      if (val)
        this.editorSelected = val;
      else this.editorSelected = false;
    },

    setVar (v) {
        if (this.editorSelected) {
          v.selected = this.editorSelected
          this.editor.selection.setContent(` <span style='background:#00BCD4;' title='Это переменная ${v.name}'>{{${v.var}}}</span> `);
          this.isSet=false;
        }
      },

    loaded(event,editor) {
      this.editor = editor;
    },

  }
}

</script>

<style lang="scss">
// TODO: Перенести в файл стилей
.constructor__wrapper {
  .compib__row {
    margin: 1.5em 0;
  }
  
}
    .no-select-input {
        display: flex;
        align-items: center;
        width: 100%;
        .v-select {
            width:  100%;
            .vs__dropdown-toggle {
            min-height: 27px;
            }
        }
        .vs__search {
            display: none;
        }
    }

</style>
