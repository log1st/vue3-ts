<template>
    <div class="adress__error-wrapper">
        <div class="main-container__head">
            <div class="main-container__title">Список адресов</div>
        </div>
        <div class="admin-adress__wrapper-table">
            <div class="table__adress">
                <div class="table__adress-head">
                    <div>Наименование участа</div>
                    <div>Статус ошибки</div>
                </div>
                <div class="table__adress-rows">
                    <div class="table__adress-row" v-for="(item, index) in list" :key="index">
                        <div class="item" style="width:100%; display:flex" v-for="(key, index) in Object.entries(item)" :key="index">
                            <div class="pcs1" style="width:50%">{{key[0]}}</div>
                            <div class="pcs2" style="width:50%">{{key[1]}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        company:{
            type: Object,
            required: true
        }
    },
    data () {
        return {
            list: [],
            loading: false,
        }
    },
    mounted () {
        this.$nextTick(this.getAdressList())
    },
    
    methods:{
        getAdressList () {
            this.loading = true
            this.$http({
                data:{
                    comand: 'ListUndisclosedCourtPrecincts',
                    phone: this.company.Phone,
                    email: this.company.Email
                }
            }).then(res => {
                this.list = res.result
                console.log(res)
                this.loading = false
            })
        }
    }
}
</script>
<style lang="scss">
    .table__adress-rows {
        padding: 1em 22px;
        max-height: 10em;
        overflow-y: auto;
    }
    .table__adress-head {
        padding: 1em;
        display: flex;
        flex-direction: row;
            border-bottom: 0.5px solid #f2f6fc;
        div {
            color: #5e6476;
            width: 50%;
            font-weight: bold;
        }
    }
</style>