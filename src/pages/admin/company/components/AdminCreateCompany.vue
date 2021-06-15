<template>
    <div class="d-data__content-row">
        <ur-btn
            class="btn btn-primary"
            :loading="loading"
            :disabled="disabled"
            @click="openAddCompanyModal"
        >
            <span>Создание организации</span>
        </ur-btn>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    data () {
        return {
            loading: false,
            disabled: false
        }
    },
    methods: {
        ...mapActions(['setPopupState', 'setPopupComponent', 'openPopup',]),
        openAddCompanyModal () {
            this.loading = false
            this.disabled = false
            this.setPopupComponent({component: 'AdminAddCompanyChooser'})
        }
    },
    mounted () {
        events.$on('CompanyWasCreated', c => {
            if (c === true)
            {
                this.loading  = false
                this.disabled = false
            }
        })
    }  
}
</script>