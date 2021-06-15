<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Выбор метода создание организации</p>
        </template>
            <div class="popup__status">
                <div class="my-3">
                    <div class="btn btn-primary" @click="openModal({type: 1})">Создание компании по ФНС</div>
                    <div class="btn btn-primary" @click="openModal({type: 2})">Создание компании аналогово</div>
                </div>
            </div>
    </popup-wrapper>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    methods: {
        ...mapActions([ 'setPopupComponent' ]),
        /**
         * Получаем данные для открытия одного из модальных окон по добавлению компании
         * @param {Int} type Тип модального окна ( 1 - Для добавления по ФНС ), ( 2 - Для аналогово добавления )
         */
        openModal( { type } ) {
            if ( type === 1 ) {
                this.setPopupComponent({ component: 'AdminAddCompanyFNS' })
            } else if ( type === 2 ) {
                this.setPopupComponent({ component: 'AdminAddCompany' })
            }
        }
    }
}
</script>