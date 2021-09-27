<template>
    <div class="templates__wrapper">
        <div class="main__head">
            <div class="main__head-title mt-6">Список шаблонов</div>
        </div>
        <div class="main__content pt-20">
            <div class="template__wrapper">
                <div class="organization__table">
                    <div class="search__result-template" style="padding: 10px">
                        <table style="width: 100%" CELLSPACING=0 CELLPADDING=5>
                            <thead>
                                <tr>
                                    <td>
                                        Поиск: <input class="search__templates-input" type="text" v-model="searchData.value" placeholder="Поиск по имени шаблона">
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr class="search__result-template-head__row">
                                    <td>Имя шаблона <span @click="sortByType({type: 1})" v-show="!types.byName">▼</span> <span @click="sortByType({type: 1})" v-show="types.byName">▲</span> </td>
                                    <td>Тип шаблона <span @click="sortByType({type: 2})" v-show="!types.byType">▼</span> <span @click="sortByType({type: 2})" v-show="types.byType">▲</span> </td>
                                    <td>Автор <span @click="sortByType({type: 3})" v-show="!types.byAuthor">▼</span> <span @click="sortByType({type: 3})" v-show="types.byAuthor">▲</span></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                              <tr v-show="!!!searchData.value || searchData.value.length == 0" class="searchdata" v-for="(item, index) in $store.state.admin.allTemplates" :key="index">
                                      <td>{{item.name || 'Нет Данных'}}</td>
                                      <td> {{ item.template_type_obj.description || 'Нет данных'}}</td>
                                      <td> {{ authorName(item.author) }}</td>
                                      <td @click="editTamplate(item.id)" title="Редактировать шаблон"> 
                                        <icon-base  width="15" height="15" iconColor="#848aa1">
                                          <icon-edit />
                                        </icon-base>
                                      </td>
                                      <td @click="deleteDocumentTemplateConfirm(item.id)" title="Удалить шаблон" style="cursor:pointer"> 
                                        <icon-base  width="10" height="10" iconColor="#848aa1">
                                          <icon-close />
                                        </icon-base>
                                      </td>
                              </tr>
                              <tr v-show="!!searchData.value || searchData.value.length > 0"
                                  class="searchdata"
                                  v-for="(item) in searchedTemplate"
                                  :key="`${item.id}-custom-${Math.floor(Math.random() * 100)}`"
                                  >
                                    <td>{{ item.name || 'Нет Данных'}}</td>
                                    <td> {{ item.template_type_obj.description || 'Нет данных'}}</td>
                                    <td> {{ authorName(item.author) }}</td>
                                    <td @click="editTamplate(item.id)" title="Редактировать шаблон"> 
                                      <icon-base  width="15" height="15" iconColor="#848aa1">
                                        <icon-edit />
                                      </icon-base>
                                    </td>
                                    <td @click="deleteDocumentTemplateConfirm(item.id)" title="Удалить шаблон" style="cursor:pointer"> 
                                      <icon-base  width="10" height="10" iconColor="#848aa1">
                                        <icon-close />
                                      </icon-base>
                                    </td>
                              </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import './editor-template.scss'
export default {
    name: 'Template',
    data () {
        return {
            searchData:{
                value: undefined
            },
            clonedItems: [],

        }
    },
    created () {
        this.getAllTemplate()
        this.getDocumentTypes()
    },
    methods: {
        ...mapActions(['getAllTemplate','setPopupComponent', 'deleteDocumentTemplate', 'editDocumentTemplate', 'getDocumentTypes', 'sortByType']),

        /**
         * Отправка шаблона на редактирование 
         */
        editTamplate (id) {
            this.editDocumentTemplate(id)
            .then( res => {
                if (res) {
                    events.$emit('goToEditor', {
                        tabNumber: 0,
                        template: res,
                        edit: true
                    })
                }
            })
        },
        /**
         * Подтверждение перед удалением шаблона
         * @param {Int} payload id Удаляемого шаблона 
         */
        deleteDocumentTemplateConfirm (payload) {
            this.setPopupComponent({component: 'confirm',
                params: {
                  title: `Вы уверены что хотите удалить шаблон id ${payload}?`,
                  btnConfirm: 'Подтвердить',
                  btnCancel: 'Отмена',
                  action: this.deleteDocumentTemplate,
                  data: payload
                }}) 
        }
    },
    computed: {
        ...mapGetters(['docsTemplates', 'allDocsTypes', 'types']),

        /**
         * Поиск шаблонов
         */
        searchedTemplate () {
            if (!!this.searchData.value) {
                let returnArray = []
                const search = this.searchData.value.toLowerCase();
                this.docsTemplates.forEach( item => {
                    if (item.name.toLowerCase().indexOf(search) != -1) returnArray.push(item)
                    if (!!item.author) {
                        if (item.author.toLowerCase().indexOf(search) != -1) returnArray.push(item)
                    } 
                })
            return returnArray
            }
        },

        authorName () {
            return payload => {
                if (!!!payload) {
                    return 'Администратор'
                } else {
                    return payload
                }
            }
        }

    },
}
</script>