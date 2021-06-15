<template>
    <popup-wrapper>
        <template v-slot:header>
                    <p class="m-0"></p>
        </template>
        <div class="popup__status">
          <div class="my-3">
              <div class="compib__row">
              <div class="compib__row-label">
                  <span>Наименование</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите Наименование суда" v-model="courtData.FullRegion">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>Адрес</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите адрес суда" v-model="courtData.Address">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>ФИО судьи</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите ФИО судьи" v-model="courtData.Magistrate">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>Секретарь судьи, телефон</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите данные Секретаря судьи, телефон" v-model="courtData.Secretary">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>Помощник мирового судьи, телефон</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите данные Помощника мирового судьи, телефон" v-model="courtData.AssistantJusticeOfThePeace">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>Начальник управления, телефон</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите данные Начальника управления, телефон" v-model="courtData.HeadOfTheOffice">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>Электронная почта</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите электронный адрес суда" v-model="courtData.EmailCourt">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>Получатель платежа</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите данные Получателя платежа" v-model="courtData.NamePaymentRecipient">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>БИК</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите БИК суда" v-model="courtData.BIC">
                        </div>
                    </div>
            </div>

            <div class="compib__row">
              <div class="compib__row-label">
                  <span>Счет получателя платежа</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите данные Счета получателя платежа" v-model="courtData.RecipientAaccountNumber">
                        </div>
                    </div>
            </div>
            
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>ИНН</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите ИНН" v-model="courtData.INN">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>KПП</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите KПП" v-model="courtData.KPP">
                        </div>
                    </div>
            </div>
            
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>OKTMO</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите OKTMO" v-model="courtData.OKTMO">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>Банк получателя платежа</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите Банк получателя платежа" v-model="courtData.NameRecipientBank">
                        </div>
                    </div>
            </div>
            <div class="compib__row">
              <div class="compib__row-label">
                  <span>КБК</span>
              </div>
                    <div class="compib__input">
                        <div class="search-input">
                            <input type="text" placeholder="Введите КБК" v-model="courtData.KBK">
                        </div>
                    </div>
            </div>
          </div>
        </div>
    </popup-wrapper>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
    props: {
        params:{
            type: Object
        }
    },
    data () {
        return {
            courtData: null
        }
    },

    created () {
        this.courtData = cloneDeep(this.params)
    },

    methods: {
        editCourtData () {

        }
    }
    
}
</script>