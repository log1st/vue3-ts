<template>
    <div>
        <div class="row no-gutters title m-2">
            <span class="title__header mr-2">Выбор услуги</span>
            <span class="title__toggle-button"
               @click="toggleAllServices"
            >
                {{ this.services.some(s => !s.checked) ? 'Выбрать всех' : 'Снять выделение со всех' }}
            </span>
        </div>

        <div class="row no-gutters">
            <div class="d-flex align-items-center col-6" v-for="(i, index) in services" :key="index">
                <ur-checkbox
                    class="mx-2"
                    :checked="i.checked"
                    @change="toggleService(i.id)"
                />
                <span>{{ i.title }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'PrintServices',
    computed: {
      ...mapGetters('statementsJudical', ['services']),
      /**
       * Нет ни одной выбранной услуги
       */
      emptyServicesCheckboxes() {
        return this.services.every(s => !s.checked)
      },
    },
    methods: {
        /**
         * Выбрать/(снять выделение) услугу
         */
        toggleService(id) {
            this.$store.commit('statementsJudical/toggleService', id);
        },
        /**
         * Выбрать (снять выделение) все услуги
         */
        toggleAllServices () {
            this.$store.commit('statementsJudical/toggleAllServices');
        }
    }
}
</script>

<style lang="scss" scoped>
    .title {
        &__header {
            font-size: 16px;
            font-weight: 500;
            color: #5e6476;
        }

        &__toggle-button {
            font-size: 14px;
            font-weight: 400;
            color: #949baf;
            border-bottom: 1px dashed #99a2bb;
            cursor: pointer;
        }
    }
</style>