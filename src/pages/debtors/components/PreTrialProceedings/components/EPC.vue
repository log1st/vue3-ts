<template>
    <div class="epc-toaster" v-if="epcStatus !== null">
    <!-- <div class="epc-toaster" v-if="true"> -->
        <span>Инициализация</span>
        <div class="epc-toaster__row" v-for="(item, index) in steps" :key="index">
            <div class="epc-toaster__circle" v-if="item.finished === null"></div>
            <icon-base
                :hasStroke="false"
                :width="14"
                :height="14"
                :iconColor="item.finished ? '#2fbf25' : '#ff5750'"
                :viewBox="'0 0 12 12'"
                v-else
            >
                <icon-check v-if="item.finished === true" />
                <icon-close v-else-if="item.finished === false" />
            </icon-base>
            <span>{{ item.title }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'EPC',
    props: ['step'],
    mounted() {
        this.updateSteps();
    },
    computed: {
        ...mapGetters(['epcStatus'])
    },
    methods: {
        updateSteps() {
            if(this.epcStatus === null) {
                this.steps = this.steps.map(s => {
                    s.finished = null;
                    return s;
                }) 
            } else {
                const finded = this.steps.find((s, index) => index === this.epcStatus.step);
                finded.finished = this.epcStatus.value;

                this.steps.splice(this.epcStatus.step, 1, finded)
            }
        }
    },
    watch: {
        // step() {
        //     this.updateSteps();
        // },
        epcStatus(val) {
            this.updateSteps();
        }
    },
    data() {
        return {
            steps: [
                {
                    title: 'Шаг 1. Получение документа от сервера',
                    finished: null
                },
                {
                    title: 'Шаг 2. Подписание',
                    finished: null
                },
                {
                    title: 'Шаг 3. Отправка подписанного документа на сервер',
                    finished: null
                },
                {
                    title: 'Шаг 4. Проверка реквизитов подписи',
                    finished: null
                },
                {
                    title: 'Завершение',
                    finished: null
                }
            ]
        }
    }
}
</script>

<style lang="scss">
    .epc-toaster {
        position: fixed;
        top: 80px;
        right: 32px;
        color: white;
        background: #1B275F;
        font-size: 14px;
        padding: 8px;

        &__row {
            margin: 4px 0px;
            display: flex;
            align-items: center;

            span {
                margin-left: 4px
            }
        }

        &__circle {
            width: 8px;
            height: 8px;
            border: 2px solid white;
            border-radius: 50%;
            margin: 0 3px;
        }
    }
</style>