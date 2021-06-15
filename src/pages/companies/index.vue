<template>
  <div class="main">
    <div class="main__head">
      <div class="main__head-title mt-6">Организации</div>
    </div>
    <div class="main__content mt-20">
        <div class="companies">
            <div class="companies__head">
            <div class="companies__controls">
                <div class="btn btn-icon companies__search" @click="searchOpen = !searchOpen">
                <icon-base v-if="!searchOpen" width="13" height="13" iconColor="#ffffff"><icon-search /></icon-base>
                <icon-base v-else width="9" height="9" iconColor="#ffffff" ><icon-close /></icon-base>
                </div>
                <div>
                  <!-- <div class="btn btn-primary" @click="setPopupComponent({ component: 'company-cart', params: { mode: 'new' } })"><span class="fz-22">+</span> Создать организацию</div> -->
                  <div class="btn btn-primary" @click="setPopupComponent({ component: 'popupConfirmNewCompany', params: { action: openCartNewCompany } })">
                      Создать организацию
                  </div>
                  <div class="btn btn-white" @click="setAffliateDefault()">Организация по умолчанию</div>
                </div>
            </div>
            <div class="companies__row">
                <div v-for="(item, i) in headСompaniesData" class="companies__col" :key="'cmphd' + i">
                <span class="is-sorted">{{ item }}</span>
                </div>
            </div>
            <transition name="fade">
                <div v-show="searchOpen" class="companies__row companies__row-search">
                <div v-for="j in 4" class="companies__col" :key="'cmpsrch' + j">
                    <search-input :params="{ placeholder: 'Введите текст' }" @changeInputValue="changeInputsValue($event, j - 1)" />
                </div>
                </div>
            </transition>
            </div>
            <div class="companies__body">
            <div v-for="(item, i) in getCompanies"
                class="companies__row companies__body-row"
                @mouseover="currentRowHovered = i"
                @mouseleave="currentRowHovered = null"
                :key="'cmprw' + i"
            >
                <div class="companies__col">
                <div class="companies__col-checkbox">
                    <ur-checkbox :checked="item.checked" @change="!item.checked ? setCompanyChecked(i) : null" />
                </div>
                <span>{{ item.name_full }}</span>
                </div>
                <div class="companies__col" @click="runActions(0)"><span>{{ item.name_short }}</span></div>
                <div class="companies__col" @click="runActions(0)"><span>{{ item.legal_address }}</span></div>
                <div class="companies__col" @click="runActions(0)"><span>{{ item.physical_address }}</span></div>
                <transition name="fade">
                <row-hover-actions v-if="currentRowHovered == i" :icons="['view', 'edit', 'close']" :elClass="i % 2 == 1 ? 'is-dark' : null" @setRowHoverAction="runActions($event)" />
                </transition>
            </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
 


export default {
    name: 'Companies',
    data () {
        return {
        searchOpen: false,
        currentRowHovered: null,
        currentAction: null,
        headСompaniesData: ['Полное наименование', 'Сокращенное наименование', 'Юридический адрес', 'Фактический адрес'],
        searchData: [
            { key: 'name_full', data: '' },
            { key: 'name_short', data: '' },
            { key: 'legal_address', data: '' },
            { key: 'physical_address', data: '' }
        ],
        setToDelete: null
        }
    },
    computed: {
        ...mapGetters(['getCompanies'])
    },
   
    methods: {
        ...mapActions([
            'setPopupState',
            'setPopupComponent',
            'openPopup',
            'setCompanyChecked',
            'setCheckedByDefault',
            'setCompanyFilterData',
            'removeCompany',
            'setCompanyDefault',
        ]),
        // handler для поиска
        changeInputsValue (event, i) {
            this.searchData[i].data = event.toLowerCase()
            this.setCompanyFilterData(this.searchData)
        },
        runActions (j) {
            // debugger
            if (j !== 2) {
                
                this.$store.dispatch('getCompanyById', {id: this.currentRowHovered})
                .then ( () => {
                this.setPopupComponent({ component: 'company-data', params: { mode: j === 0 ? 'view' : 'edit', index: this.currentRowHovered } })
                })

            } else if (this.getCompanies.length === 1) {
                this.setPopupComponent({ component: 'popupAlert', params: { title: 'Дейстивие запрещено', text: 'Невозможно удалить единственную компанию. Создайте новую компанию и после этого попробуйте еще раз.' } })
            } else {
                this.setToDelete = this.currentRowHovered
                this.setPopupComponent({ component: 'confirm', params: { title: `Подтвердите удаление компании<br>${this.getCompanies[this.currentRowHovered].name_short}`, btnConfirm: 'Удалить!', btnCancel: 'Отменить', action: this.confirmRemoveCompany } })
            }
        },
        confirmRemoveCompany (event) {
        if (event) {
            this.removeCompany(this.setToDelete)
        }
            this.setToDelete = null
        },
        /**
         * Установить организацию/филиал по умолчанию
         */
        setAffliateDefault () {
            this.setCompanyDefault();
            this.setPopupComponent({
                component: 'popupAlert',
                params: {
                    title: 'Настройки изменены',
                    text: `Организацией по умолчанию установлена:<br>${this.getCompanies.find(c => c.checked === true).name_full}`
                }
            })
        },
        openCartNewCompany () {
            this.setPopupComponent({ component: 'company-data', params: { mode: 'new' } })
        }
    },
   
    beforeDestroy () {
        this.setCheckedByDefault()
    }
}
</script>