<template>
    <div class="row">
        <div class="col-12">
            <p class="m-0 print-modal-service-type" style="padding: 12px 6px">Выбор печатной формы</p>
        </div>
        <div class="col-12 row justify-content-center">
            <div 
                v-for="(item, index) in actions"
                :key="index"
                class="btn btn-accept-outline" 
                :class="{ 'disabled-epc' : bool }"
                @click="item.action.func(item.action.type)"
            >
            <!-- <icon-base :hasStroke="false" :width="40" :height="30" iconColor="#818181" :viewBox="'0 0 40 30'">
                <component :is="item.icon" />
            </icon-base> -->
                <span v-html="item.title"></span>
            </div>
        </div>
    </div>
</template>

<script>
import { baseURL } from '@/settings/config'
import { mapActions } from 'vuex'

export default {
    name: 'PrintActions',
    props: {
        disabled: {
            type: Boolean,
            required: true,
            default: false
        },
        servicesMode: {
            type: String,
            // required: true,
            default: 'Admin'
        },
        debtorInn: {
            type: String,
        },
        debtors: {
            type: Array
        }
    },
    data() {
        return {
            bool: this.disabled,
            token: false,
            actions: [
                // { title: 'Запустить склейку', action: { func: this.compileAttachment } },
                { title: 'Формирование и печать документа', icon: 'icon-print', action: { func: this.compileAttachment, type: 'print' } },
                // { title: 'Подписать и отправить <br> по ЭЦП', icon: 'icon-ecp', action: { func: this.printDocument, type: 'ecp'} },
            ]
        }
    },
    watch:{
        disabled:{
            immediate: true,
            deep: true,
            handler(val) { 
                if (this.servicesMode != 'User') {
                    this.bool = false
                }
                if ( this.servicesMode == 'User' &&  this.disabled == true ) {
                    this.bool = true
                } else if (this.servicesMode == 'User' && this.disabled == false){
                    this.bool = false
                }  
            }
        }
    },
    methods: {
        ...mapActions(['refreshApplication']),
        compileAttachment () {
            let defaultCompany = localStorage.getItem('defaultCompany')
            let debtors = this.debtors.map(debt => debt.debtor.pk)
            let getCompileDoc;
            this.refreshApplication()
            .then( result => {
                this.$http({
                command: '/document_attachments/generate_merged/',
                data: {
                    production_type: 'judicial',
                    company_id: defaultCompany,
                    debtor_ids: debtors
                },
                method: 'POST'
                })
                .then( (resp) => {
                    this.token = resp.id
                    this.$toast.open({
                        message: `Запрос на склейку отправлен, ожидайте`,
                        type: 'warning',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                    getCompileDoc = setInterval(() => {
                        this.getStatusCompileDoc()
                        .then( result => {
                            if (result.status) {
                                clearInterval(getCompileDoc)
                            }                        
                        })
                    }, 5000)
                })
                .catch( () => {
                    this.$toast.open({
                        message: `Запрос на склейку отправлен, ожидайте`,
                        type: 'warning',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                    getCompileDoc = setInterval(() => {
                        this.getStatusCompileDoc()
                        .then( result => {
                            console.log(result)
                            if (result.status) {
                                if (result.type === 'error') {
                                    this.$toast.open({
                                        message: `Ошибка формирования документов`,
                                        type: 'error',
                                        duration: 5000,
                                        dismissible: true,
                                        position: 'top-right'
                                    })
                                } else if (result.type === 'success') {
                                    this.$toast.open({
                                        message: `Документ готов и отправлен вам на почту`,
                                        type: 'success',
                                        duration: 5000,
                                        dismissible: true,
                                        position: 'top-right'
                                    })
                                }
                                clearInterval(getCompileDoc)
                            }
                        })
                    }, 5000)

                })
            })
            
        },

        getStatusCompileDoc () {
            return new Promise ((resolve, reject) => {
                this.$http({
                    command: `/document_attachments/status/${this.token}/`,
                    method: 'GET',
                })
                .then (response => {
                    if (response.status === 1) {
                        resolve({status: true, type: 'success', link: response.file_pdf})
                            this.$toast.open({
                                message: `Документ готов и cейчас будет открыт`,
                                type: 'success',
                                duration: 5000,
                                dismissible: true,
                                position: 'top-right'
                            })
                        setTimeout(()=> {
                        window.open(response.file_pdf,'_blank');
                        }, 2000)
                    } else if (response.status === 2) {
                        resolve({status: true, type: 'error'})
                    } else {
                        reject({status: false})
                    }
                    // console.log(response)
                })
            })
        },

        printDocument(type) {
            // this.$emit('print', type);
            let companyId = localStorage.getItem('defaultCompany')
            axios({
                url: baseURL + '/api/api_to_fns_file/',
                data: {
                    id: companyId
                },
                method: 'POST'
            }).then( res => {
                // console.log(res)
                window.open(`https://api-2.urrobot.net${res.data.url}`, '_blank')
            })
        }
    }
}
</script>