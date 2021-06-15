<template>
    <popup-wrapper>
            <template v-slot:header>
             <p class="m-0">{{params.title}}</p>
            </template>
            <div class="popup__status">
                <div class="popup__message-text">
                     <p style="white-space: pre;"> {{params.description}} </p>
                </div>
                <div class="popup__status-button">
                    <div
                        class="btn btn-primary"
                        @click="answerData(false)"
                    >
                        <span>Нет</span>
                    </div>
                    <div
                        class="btn btn-red"
                        @click="answerData(true)"
                    >
                        <span>Да</span>
                    </div>
                  </div>
            </div>
    </popup-wrapper>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    props:{
        params:{
            require: true,
            type: Object
        }
    },
    methods:{
        ...mapActions(['setPopupState']),
        answerData (bool) {
            events.$emit('popup_answer', {
                question: this.params.comand,
                answer: bool
            })
            this.setPopupState(false)
        }
    }
}
</script>
<style lang="scss">
    .popup__status-button {
        display: flex;
    }
    .popup__message-text {
        margin-bottom: 1em;
    }
</style>