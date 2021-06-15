<template>
    <div class="login__wrapp">
        <div class="login__wrapp-head">
            <div class="login__wrapp-title">Восстановление пароля</div>
        </div>
        <div class="login__wrapp-body">
            <div class="login__wrapp-text">
                <p>Инструкции по восстановлению пароля отправленны на ваш e-mail</p>
            </div>
        </div>
        <div class="login__button">
            <button class="btn btn-indigo" @click="setAuthLayout(0)">
                <span>Назад</span>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';

    export default {
        name: 'ur-reset-password-guide',
        methods: {
            ...mapMutations(['setAuthLayout'])
        }
    }
</script>