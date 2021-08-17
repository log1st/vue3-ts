<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Установка нового адреса</p>
        </template>
        <div class="popup__status admin-error__popup">
            <div style="width: 100%">
                    <span style="font-weight: bold">Не корректный адресс {{params.item.title}}</span>
            </div>

            <div class="compib__row">
                <div class="compib__row-label">
                    <span>Данные мирового суда</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <span>{{params.item.court}}</span>
                    </div>
                </div>
            </div>

            <div class="compib__row">
                <div class="compib__row-label">
                    <span>Данные окружного суда</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <span>{{params.item.court_local}}</span>
                    </div>
                </div>
            </div>

            <div class="compib__row">
                <div class="compib__row-label">
                    <span>Новый адрес для поиска</span>
                </div>
                <div class="compib__input">
                    <div class="search-input">
                        <input type="text" placeholder="Введите новый адресс" v-model="adress.newAdressTitle">
                    </div>
                </div>
            </div>
            
                <div class="compib__row">
                    <div class="popup__status-button">
                        <ur-btn
                            class="btn send__request"
                            :loading="loading"
                            @click="sendAdressToNewStand()"
                            :disabled="disabled"
                        >
                            <span>Отправить на стандартизацию</span>
                        </ur-btn>
                        <ur-btn
                            class="btn send__request"
                            :loading="loading"
                            @click="sendAdressToTelegram()"
                            :disabled="disabled"
                        >
                            <span>Отправить в телеграм</span>
                        </ur-btn>
                    </div>
                </div>
                
        </div>
    </popup-wrapper>
</template>
<script>
export default {
    data () {
        return {
            loading: false,
            disabled: false,

            adress: {
                newAdressTitle: undefined,
                sendMessageToTelegram: false,
                resultAdressTitle: undefined
            }
        }
    },

    props: {
        params: {
            type: Object
        }
    },

    methods: {
        sendAdressToNewStand () {
            //
        },

        sendAdressToTelegram () {
            //
        }
    }
}
</script>

<style lang="scss">
    $backgroundColor: #00082f;
    .admin-error__popup {
        .search-input {
            height: 100% !important;
        }
        .compib__row {
            margin: 0.8em 0;
        }
        .btn {
            &.send__request {
                padding: 0.5em;
                background-color: var(--colorBlue3);
                transition: all .4s ease-in-out;
                span {
                    color: #fff !important;
                }
                &:hover {
                    background-color: var(--colorLightBlueActive);
                }
            }

        }
    }
</style>