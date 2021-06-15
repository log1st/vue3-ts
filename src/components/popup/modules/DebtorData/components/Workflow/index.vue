<template>
  <div class="d-data__content debtor__modal">
         <!-- Вкладки -->
        <div class="d-data__content-tabs">
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

        <div>
            <main-workflow v-if="currentTab === 0" :params="params" />
            
            <passport-workflow v-else-if="currentTab === 1" :params="params" />
            
            <egrn-workflow v-else-if="currentTab === 2" :params="params" />

            <egrn-transfer-workflow v-else-if="currentTab === 3" :params="params" /> 

            <payment-workflow v-else-if="currentTab === 4" :params="params" />

        </div>
  </div>
</template>

<script>
    // внутренние компоненты
    import MainWorkflow   from './components/MainWorkflow'; 
    import EGRN           from './components/EGRN';
    import EgrnTransfer   from './components/EgrnTransfer';
    import PassportOffice from './components/PassportOffice'; 
    import PaymentOrderOfStateDuty from './components/PaymentOrderOfStateDuty'; 

    export default {
        components: { 
            // Внутренние компоненты
            'main-workflow': MainWorkflow,
            'egrn-workflow': EGRN,
            'passport-workflow': PassportOffice,
            'payment-workflow' : PaymentOrderOfStateDuty,
            'egrn-transfer-workflow': EgrnTransfer,
        },
        props: {
            params: {
                type: Object
            }
        },
        data () {
            return {
                currentTab: 0,
                tabs: [
                    { title: 'Общий', id: 0 },
                    { title: 'Выписка из домовой книге', id: 1 },
                    { title: 'Выписка из ЕГРН', id: 2 },
                    { title: 'Выписка ЕГРН о переходе прав', id: 3 },
                    { title: 'ПП об оплате госпошлины', id: 4 },
                    { title: 'Судебное решение', id: 5 }
                ]
            }
        }
    }
</script>
