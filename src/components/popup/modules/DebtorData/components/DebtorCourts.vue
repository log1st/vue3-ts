<template>
    <div class="d-data__content debtor__modal">
        <div class="d-data__content-tabs" style="margin: 0">
            <div
                class="d-data__content-tabs-btn mt-0"
                :key="index"
                v-for="(tab, index) in tabs"
                @click="currentTab = tab.id"
                :class="{ 'd-data__content-tabs-btn--active' : currentTab === index }"
            >
                {{ tab.title }}
            </div>
        </div>
        <div class="debtor__modal-content">
            <div class="debtor__modal-content-title">
                <span>
                    Карточка истории судебных дел
                </span>
                <div style="height: 40px; padding-top: 10px" class="btn btn-accept-outline" @click="openCourtInfoModal()">
                    Реквизиты участка мирового судьи
                </div>
            </div>
            <div class="debtor__modal-court-item"
            v-for="(item, index) in courts"
            :key="index"
            >
                <div class="debtor__modal-court-item-period">
                <span style="font-weight: 600;
                             font-size: 14px;
                             line-height: 17px;
                             color: #000000;
                             ">Период:</span>
                             <span>
                                 {{ null }}
                             </span>
                </div>
                <div class="debtor__modal-court-item-table-head">
                    <div class="debtor__modal-court-item-table-head__item"
                    v-for="(tbhead, index) in tbheads"
                    :key="index"
                    >
                    {{ tbhead }}
                    </div>
                </div>
                <div class="debtor__modal-court-item-table-body">
                    <div class="debtor__modal-court-item-table-body__item">
                        {{ item.id }}
                    </div>
                    <div class="debtor__modal-court-item-table-body__item">
                        {{ item.case_id }}
                    </div>
                    <div class="debtor__modal-court-item-table-body__item">
                        {{ item.case_number }}
                    </div>
                    <div class="debtor__modal-court-item-table-body__item">
                        {{ item.date_start }}
                    </div>
                    <div class="debtor__modal-court-item-table-body__item">
                        {{ item.date_view }}
                    </div>
                    <div class="debtor__modal-court-item-table-body__item">
                        {{ item.date_of_active }}
                    </div>
                    <div class="debtor__modal-court-item-table-body__item">
                        {{ item.full_name_of_judge }}
                    </div>
                    <div class="debtor__modal-court-item-table-body__item">
                        {{ item.status }}
                    </div>
                    <div class="debtor__modal-court-item-table-body__item">
                        {{ item.history_status }}
                    </div>
                    <div class="debtor__modal-court-item-table-body__item" style="justify-content: flex-end">
                        <div class="debtor__modal-court-item-table-body__item-action">
                            <span>
                                <icon-base width="20" height="20">
                                    <icon-solid-eye/>
                                </icon-base>
                            </span>
                            <span>
                                <icon-base width="20" height="20">
                                    <icon-download2/>
                                </icon-base>
                            </span>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex' 

export default {
    props:{
        params: {
            type: Object
        }
    },
    data () {
        return {
            tabs: [
                {
                    id: 0,
                    title: 'Участок мирового судьи'
                },
                {
                    id: 1,
                    title: 'Участок районного суда'
                }
            ],

            tbheads: [
                "№",
                "Идентификатор дела",
                "№ дела",
                "Дата поступления",
                "Дата рассмотрения",
                "Дата вступления решения в силу",
                "ФИО судьи",
                "Статус оплаты",
                "История статусов"
            ],

            courts_local: [
                {
                    id: "1",
                    case_id: "000000000",
                    case_number: "0000000",
                    date_start: "01.01.2021",
                    date_view: "01.01.2021",
                    date_of_active: "01.01.2021",
                    full_name_of_judge: "Иванов Иван Иванович",
                    status: "Оплачено",
                    history_status: ""
                }
            ],

            courts_mir: [
                {
                    id: "1",
                    case_id: "000000000",
                    case_number: "0000000",
                    date_start: "01.01.2021",
                    date_view: "04.01.2021",
                    date_of_active: "01.04.2021",
                    full_name_of_judge: "Иванов Иван Иванович",
                    status: "Не оплачено",
                    history_status: ""
                }
            ],

            currentTab: 0,

        }
    },
    computed: {
        /**
         * Определяем активную вкладку и выводим по ней данные
         * @returns {array} Массив суд участков
         */
        courts () {
            let result = this.currentTab === 1 ? this.courts_local : this.courts_mir
            return result
        }
    },
    methods: {
        ...mapActions(['setPopupComponent']),
        openCourtInfoModal () {
            let data = this.currentTab === 0 ? this.params.court_details_mirsud : this.params.court_details_district 
            this.setPopupComponent({ component:'CourtInformation',  params:data })
        }
    }
}
</script>