<template>
    <popup-wrapper>
        <template v-slot:header>
             <p class="m-0">Внимание!</p>
        </template>
        <div class="popup__status">
                <div class="my-3">
                     <p>Ваш список должников пуст! Для продолжения работы внесите должников в разделе <router-link :to="{ name: 'Import' }" > <span @click="closePopup()">Обмен данными</span></router-link> </p>
                </div>
                <div class="popup__status-button">
                    <div
                        class="btn btn-primary"
                        @click="closePopup()"
                    >
                        <span class="nolinkstyle"><router-link :to="{ name: 'Import' }">Перейти</router-link></span>
                    </div>
                  </div>
            </div>
    </popup-wrapper>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    methods:{
        ...mapActions(['setPopupState']),
        closePopup () {
            this.setPopupState(false)
        }
    }
}
</script>
<style lang="scss">
    .nolinkstyle > a {
        color: #fff;
        text-decoration: none;
    }
</style>