<template>
    <div class="main">
        <div class="main__head">
            <div class="main__head-title mt-6">Статистика</div>
        </div>
        <div class="main__content pt-20 admin-stats">
            <div class="admin-stats__wrapper">
                <template v-if="!selected">
                    <div class="admin-stats__info">
                        Для вывода статистики, выберите пользователя на вкладке <router-link :to="{ name: 'AdminCompany' }">"Список организаций"</router-link>
                    </div>
                </template>
                <div v-else class="admin-stats__content">
                    <div class="admin-stats__head-title">
                        Данные статистики по пользователю - {{company.AbbreviatedName}}
                    </div>
                <!-- список ошибок в проверке адрессов должников -->
                <admin-adress-error :company="this.company" v-if="selected"></admin-adress-error>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import AdminAdressError from './components/AdminAdressError'
import cloneDeep from 'lodash/cloneDeep';

export default {
    name: 'AdminStatistic',
    data () {
        return {
            selected: false,
            company: null
        }
    },
    components:{
      'admin-adress-error':AdminAdressError,
    },
    mounted() {
        if (this.$store.state.admin.checkedCompany != null && this.$store.state.admin.checkedCompany.checked) {
            let preCloneData = this.$store.state.admin.checkedCompany
            this.company = preCloneData
            this.selected = true
        } else {
            this.company = null
            this.selected = false
        }
    },
}
</script>
<style lang="scss">
.admin-stats{
    &__wrapper {
        margin-top: 1em;
        border-radius: 6px;
        background-color: #ffffff;
    }
    &__info {
        padding:12px;
    }
    &__head-title {
        padding: 1em;
        font-weight: 500;
        font-size: 14px;
        color: #5e648c;
    }
}
    
</style>