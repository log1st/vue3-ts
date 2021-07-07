<template>
    <div class="signer__wrapper">
        <div class="main-container__head">
            <div class="main-container__title">Доверенность</div>
        </div>
        <div class="d-data__content-row">
            <div class="my-3">
                     <div class="compib__row">
                        <div class="compib__row-label">
                            <span><b> Подписант </b></span>
                        </div>
                        <div class="compib__input">
                            <div class="search-input">
                                <input type="text" placeholder="Введите представителя по доверенности" v-model="documents.signer">
                            </div>
                        </div>
                    </div>
                    <div class="compib__row">
                        <div class="compib__row-label">
                            <span><b>ФИО представителя </b></span>
                        </div>
                        <div class="compib__input">
                            <div class="search-input">
                                <input type="text" placeholder="Введите ФИО представителя" v-model="documents.signer_name">
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <div class="d-data__content-row">
            <div class="f-container" >
                <div class="">
                    <div class="company-document-item">
                        <div class="company-document-status">
                            <icon-base width="18" height="18" viewbox="0 -2 12 18" iconColor="#7989a0"><icon-check /></icon-base>
                            <span v-if="documents.file">Файл загружен</span> <span style="margin-left: 1em"> <a :href="documents.file"> скачать</a> </span>
                            <span v-if="!documents.file">Файл не загружен</span>
                        </div>
                        <div class="company-document-actions">
                          <template v-if="document.file">
                            <row-hover-actions :icons="actionsIcons" @setRowHoverAction="runActions({ e: $event, document: document })" />
                          </template>
                        </div>
                    </div>
                    <div class="f-container__input">
                        <input 
                          type="file" 
                          name="f-container-file"
                          @change="changeFile({ ref: 'admin_organization_documents', document: document, index: 0 })" 
                          ref="admin_organization_documents" 
                        >
                        <label for="f-container-file" class="f-container__input-label">
                          <div class="f-container__placeholder">
                              <span>Выбрать файл</span>
                          </div>
                          <div class="f-container__button" @click="$refs.admin_organization_documents.click()">
                            <div class="btn btn-primary">Выбрать</div>
                          </div>
                          <div class="f-container__button" @click="deleteDocument(document.id)" v-if="document.file">
                            <div class="btn btn-red">Удалить</div>
                          </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { baseURL } from '@/settings/config'

export default {
    props:{
         company: {
          type: Object,
          required: true
      }
    },
    data () {
        return {
            highlight: false,
            isLoading: false,
            isDownloading: false,

            

            currentRowHovered: null,
            actionsIcons: ['view', 'download'],
            newDocument: {
                file: undefined
            },
            documents:
                {
                    signer_name: null,
                    signer: null,
                    file: undefined
                }
            
        }
    },
    computed: {
      ...mapGetters(['documentsByCompanyId']),
    },
    created () {
        this.getSignersDocument()
    },
    methods: {
        ...mapActions(['toBase64']),
        getSignersDocument () {
            let companyDocs = this.documentsByCompanyId(this.company.id)
            this.documents = companyDocs.find( doc => doc.signer )
            if (!this.documents) 
            {
                this.documents = {
                    signer_name: null,
                    signer: null,
                    file: undefined
                }
                console.log(`signers: empty`)
            } 
            else 
            {
                console.log(this.documents) 
            }
        },
        changeFile ({ ref, document, index }) {
            // console.log(this.$refs[ref].files[0])
            this.upFiles(this.$refs[ref].files[0], document);
        },
        /**
       * Загрузить файл представителя
       */
      async upFiles (files, document) {
        //   console.log(files)
        return this.$http({
            command: '/api/account/document/',
            method: 'POST',
            data: {
                name: this.documents.signer_name,
                signer_name: this.documents.signer_name,
                signer: this.documents.signer,
                file: await this.toBase64(files),
                klass: 'attorney',
                company: this.company.id 
            }
        })
        .then( resp => {
            this.$toast.open({
                message: `Подписант создан`,
                type: 'success',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
            })
            console.log(resp)
        })
        .catch( error => {
            console.log(error)
            this.$toast.open({
                message: `Ошибка добавления подписанта`,
                type: 'error',
                duration: 5000,
                dismissible: true,
                position: 'top-right'
            })
        })
      },
    },
}
</script>
<style lang="scss">
    .signer__wrapper {
        margin: 2em 0;
    }
</style>