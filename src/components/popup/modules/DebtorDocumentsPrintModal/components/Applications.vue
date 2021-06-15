<template>
    <div class="row">
        <div class="col-12">
            <p class="m-0 print-modal-service-type p-2">Список документов в Приложении</p>

            <div class=" px-3">
                <div class="d-flex justify-content-end align-items-center">
                    <!-- <span style="font-size: 12px" class="mr-2">настройка печати:</span> -->

                    <div class="mr-2"  v-tooltip.top-center="{ content: 'Документ будет добавлен в список приложений без печати'}"
                        style="cursor: pointer"
                        @click="toggleAllDocuments(false)"
                    >
                        <!-- <icon-base :hasStroke="false" :width="18" :height="18" iconColor="#818181" viewBox="0 0 16 16">
                            <icon-eye />
                        </icon-base> -->
                    </div>
                    
                    <div class="mr-2" v-tooltip.top-center="{ content: 'Документ будет добавлен в список на печать и в приложение'}"
                        style="cursor: pointer"
                        @click="toggleAllDocuments(true)"
                    >
                        <!-- <icon-base :hasStroke="false" :width="30" :height="20" iconColor="#818181" viewBox="0 0 30 20">
                            <icon-print />
                        </icon-base> -->
                    </div>
                      
                </div>
            </div>
                  
            <vue-draggable
                v-model="applicationUserListClone"
                class="p-2"
                @change="moveApp($event)"
            >
                <div
                    v-for="(item, index) in applicationUserListClone"
                    :key="index"
                    class="modal__printeform__row"
                    v-show="item.is_show"
                >
                    <input type="checkbox" class="modal__printeform__checkbox toggle" @change="toggleDocument(item.id)" v-model="item.is_active" :id="`toggle-${index}`">
                    <label :for="`toggle-${index}`">{{`${index+1} ${item.name}`}}</label>
                    <!-- <span style="font-size: 12px" class="mr-1">{{ index + 1 }}.</span> -->
                    <!-- <span class="ml-2" style=" width: 100%">{{ item.name }}</span> -->
                    <div class="mx-2 d-flex">
                        <!-- <toggle-button 
                            :value="item.is_active"
                            :sync="true"
                            @change="toggleDocument(item.id)"
                            :color="{ checked: '#4b5eff', unchecked: '#4b5eff', disabled: '#4b5eff' }"
                            :labels="false"
                        /> -->
                    </div>
                </div>
            </vue-draggable>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import sortBy from 'lodash/sortBy'
import cloneDeep from 'lodash/cloneDeep'

export default {
    methods: {
        ...mapActions(['editApplicationDocument']),
        ...mapMutations(['apllicationListForUser']),
        moveApp ( event ) {
            // console.log(event)
            let item = event.moved.newIndex
            let id = event.moved.element.id
            
            this.editApplicationDocument({id:id, data: item,type:'move'});
            let clone = cloneDeep(this.applicationUserListClone)
            clone.forEach( (el, index) => {
                el.order_number = index
            })
            this.apllicationListForUser(clone)
        },
        /*
         * Выбрать/снять документ на печать
         */
        toggleDocument(id) {
            this.editApplicationDocument({id:id, data: false, type:'select'});
        },
        /**
         * Выбрать/снять все документы на печать 
         */ 
        toggleAllDocuments(flag) {
            this.$store.commit('statementsJudical/toggleAllDocuments', flag);
        },
    },
    computed: {
        ...mapGetters(['applicationUserList']),
        applicationUserListClone: {
            get () {
                let result = cloneDeep(this.applicationUserList)
                result = sortBy(result, 'order_number')
                return result 
            },
            set (val) {
                return val
            }
        }
    }
}
</script>