<template>
    <div class="regions__wrapper">
        <div class="d-data__content-row">
            <p style="margin-left: 4px">Выберите регион: </p>
                <v-select
                  :options="regionsListName"
                  class="fs-12 regions-select"
                  scrollable
                  label="name"
                  :placeholder="selectedRegion"
                  autocomplete
                  v-model="selectedRegion"
                  @input="regionError = false"
                  :error="regionError"
                  :error-messages="['Поле обязательно']"
                />
                <!-- :currentData="curentRegion" -->
                <div class="btn__wrapper-regions">
                    <ur-btn
                        class="btn btn-primary"
                        :loading="loading"
                        @click="setUserRegion"
                        :disabled="disabled"
                    >
                        <span>Установить регион</span>
                    </ur-btn>
                </div>
        </div>
    </div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import selectGray from '@/components/elements/SelectGray'
import UrBtn from '@/components/elements/Button'

export default {
    components: {
        'ur-btn': UrBtn,
        selectGray
    },
    props: {
        company:{
            required: true,
            type: Object
        }
    },
    data () {
        return {
            loading: false,
            disabled: false,
            selectedRegion: '',
            regionError: false,
            curentRegion: this.company.Region,
            setedRegion: undefined,
        }
    },
    created () {
        this.getCompanySettingsById({id: this.company.id})
        .then( resp => {
            // console.log(resp)
            if (resp && this.adminCompanySettings.default_region) {
                let region = this.regionsList.find( c => c.id === this.adminCompanySettings.default_region )
                this.selectedRegion = region.name
            }
        })
    },
    computed: {
        ...mapGetters([
            'regionsList', 
            'adminCompanySettings'
        ]),
        regionsListName () {
            return this.regionsList.map( d => d.name)
        }
    },
    methods: {
        ...mapActions(['getCompanySettingsById']),
        setUserRegion () {
            let region = this.regionsList.find( r => r.name ===  this.selectedRegion)
            this.loading = true
            this.disabled = true
            this.$http({
                command: `/api/account/company-settings/${this.company.id}/`,
                method: 'PATCH',
                data: {
                    default_region: region.id
                }
            }).then(res => {
                console.log(res)
                this.loading = false
                this.disabled = false
            })
        }
    }
}
</script>
<style lang="scss">
    .regions__wrapper{
        margin: 2em 0;
    }
    .btn__wrapper-regions {
        margin-top: 1em;
    }
    .regions-select .vs__search {
        display: block !important;
    }
    .regions-select .vs__search::placeholder {
      color: #000;
    }
</style>