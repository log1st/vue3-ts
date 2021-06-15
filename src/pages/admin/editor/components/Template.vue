<template>
    <div class="">
        <div class="main__head">
            <div class="main__head-title mt-6">Список шаблонов</div>
        </div>
        <div class="main__content pt-20">
            <div class="template__wrapper">
                <div class="organization__table">
                    <div class="search__result-template" style="padding: 10px">
                        <table style="width: 100%" CELLSPACING=0 CELLPADDING=5>
                            <tbody>
                              <tr class="searchdata" v-for="(item, index) in filteredTemplates" :key="index">
                                      <td>Имя: {{item.name || 'Нет Данных'}}</td>
                                      <td>Тип шаблона: {{ item.template_type || 'Нет данных'}}</td>
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
import cloneDeep from 'lodash/cloneDeep'

export default {
    name: 'Template',
    data () {
        return {
            searchData:{
                value: null
            },
            clonedItems: []
        }
    },
    created () {
        this.getAllTemplate()
        this.getDocumentTypes()
    },
    methods: {
        ...mapActions(['getAllTemplate','setPopupComponent', 'deleteDocumentTemplate', 'editDocumentTemplate', 'getDocumentTypes']),

        /**
         * Поиск по шаблонам
         * @description Функционал пока что отключен
         */
        changeInputsValueSearch (event) {
            this.searchData.value = event
            this.filterSearchData(this.searchData)
        },

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
                  title: 'Вы уверены что хотите удалить этот шаблон?',
                  btnConfirm: 'Подтвердить',
                  btnCancel: 'Отмена',
                  action: this.deleteDocumentTemplate,
                  data: payload
                }}) 
        }
    },
    computed: {
        ...mapGetters(['docsTemplates', 'allDocsTypes']),
        
        filteredTemplates () {
            this.clonedItems = cloneDeep(this.docsTemplates)
            let types = this.allDocsTypes
            let type;
            this.clonedItems.forEach( i => {
                type = types.find( t => t.id === i.template_type)
                if (!!type) {
                    i.template_type = typeof type.description === 'undefined' ? 'Ошибка' : type.description
                }
            })
            return this.clonedItems
        }
    },
}
</script>
<style lang="scss">
    .search__result-template {
        margin-top: 1.5em;
        background-color: #fff;
        border-radius: .4rem;
    }
    .searchdata {
        cursor: pointer;
        font-size: 11px;
        font-weight: 500;
        padding: 5px 10px;
        line-height: 18px;
        color: #687189;
    }
    .search__result-template table tr:nth-child(odd) {
        background-color: #d3e7ff;
    }
</style>