<template>
  <div class="main__content mt-20">
    <div class="main__content-row">
      <div class="main__content-col main__content-col--826">
        <main-container :title="'Данные и реквизиты в договоре'">
          <template slot="nobody">
            
            <div class="set-form">
              <div class="set-form__row">
                <div class="set-form__label">Номер договора</div>
                <div class="set-form__input">
                  <template>
                    <ur-input placeholder="Номер договора" v-model="infoINNContractsForm.ContractNumber" type="text" readonly />
                  </template>
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">Полное название организации</div>
                <div class="set-form__input">
                  <template>
                    <ur-input placeholder="Введите название организации" v-model="infoINNContractsForm.FullNameOrganization" type="text" />
                    <div class="set-form__input-text">Например: Товарищество собственников жилья «Комфорт"</div>
                  </template>
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">Сокращенное название организации</div>
                <div class="set-form__input">
                  <template>
                    <ur-input placeholder="Введите сокращенное название организации" v-model="infoINNContractsForm.ShortNameOfTheOrganization" type="text" />
                    <div class="set-form__input-text">Например: ТСЖ "Комфорт"</div>
                  </template>
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">ИНН</div>
                <div class="set-form__input">
                  <ur-input 
                    placeholder="Введите ИНН"
                    v-model="infoINNContractsForm.INN"
                    type="text"
                    mask="##########"
                    :rules="[
                      value => !!value || 'Поле ИНН обязательно к заполнению',
                      value => value.length === 10 || 'Введите правильный ИНН - 10 цифр',
                      inputNumber => {
                        inputNumber = '' + inputNumber;
                        inputNumber = inputNumber.split('');
                        if((inputNumber.length == 10) && (inputNumber[9] == ((2 * inputNumber[  0] + 4 * inputNumber[1] + 10 * inputNumber[2] + 3 * inputNumber[3] + 5 * inputNumber[4] + 9 * inputNumber[5] + 4 * inputNumber[6] + 6 * inputNumber[7] + 8 * inputNumber[8]) % 11) % 10)){
                          return true;
                        } else {
                          return 'Введите кореектный ИНН';
                        } 
                      }
                    ]"
                  />
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">КПП</div>
                <div class="set-form__input">
                  <ur-input 
                    placeholder="Введите КПП"
                    v-model="infoINNContractsForm.KPP"
                    type="text"
                    mask="#########"  
                    :rules="[ 
                      val => !!val || 'Поле оязательно к заполнению',
                      val => val.length === 9 || 'Введите правильный КПП - 9 цифр',
                    ]"  
                  />
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">ОГРН</div>
                <div class="set-form__input">
                  <ur-input 
                    placeholder="Введите ОГРН"
                    v-model="infoINNContractsForm.OGRN"
                    type="text"
                    mask="#############"  
                    :rules="[ 
                      val => !!val || 'Поле оязательно к заполнению',
                      val => val.length === 13 || 'Введите правильный ОГРН - 13 цифр',
                    ]"  
                  />
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">Юридический адрес</div>
                <div class="set-form__input">
                  <ur-input 
                    placeholder="Введите юридический адрес"
                    v-model="infoINNContractsForm.UrAddress"
                    type="text"
                    :rules="[ val => !!val || 'Поле оязательно к заполнению' ]"  
                  />
                </div>
              </div>
              
              <div class="set-form__row">
                <div class="set-form__label">Почтовый адрес с индексом</div>
                <div class="set-form__input">
                  <template>
                    <ur-input 
                      placeholder="Введите почтовый адрес"
                      v-model="infoINNContractsForm.PochtAddress"
                      type="text" 
                      :rules="[ val => !!val || 'Поле оязательно к заполнению']"  
                    />
                    <div class="set-form__input-text">Например: 123456, Москва ул. Мира д.12 офис 2</div>
                  </template>
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">Фамилия и инициалы подписанта договора</div>
                <div class="set-form__input">
                  <template>
                    <ur-input 
                      placeholder="Введите фамилию и инициалы подписанта"
                      v-model="infoINNContractsForm.SurnameAndInitialsOfTheSignatory"
                      type="text"
                      :rules="[
                        val => !!val || 'Поле оязательно к заполнению',
                        val => !/\d+/g.test(val) || 'Поле Фамилия и инициалы подписанта не может содержать цифр',
                        val => !/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,@#]/g.test(val) || 'Поле Фамилия и инициалы подписанта не может содержать специальных симфолов',
                      ]"
                    />
                    <div class="set-form__input-text">Например: Красилов А.С.</div>
                  </template>
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">ФИО подписанта договора в родительном падеже</div>
                <div class="set-form__input">
                  <template>
                    <ur-input 
                      placeholder="Введите ФИО подписанта договора в родительном падеже"
                      v-model="infoINNContractsForm.FullNameOfTheSignatoryInTheGenitiveCase"
                      type="text"
                      :rules="[
                        val => !!val || 'Поле оязательно к заполнению',
                        val => !/\d+/g.test(val) || 'Поле ФИО подписанта не может содержать цифр',
                        val => !/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/g.test(val) || 'Поле ФИО подписанта не может содержать специальных симфолов',
                      ]"
                    />
                    <div class="set-form__input-text">Например: Красилова Андрея Сергеевича</div>
                  </template>
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">Основание полномочий подписанта</div>
                <div class="set-form__input">
                    <search-input 
                      :params="{ placeholder: 'Выберите верное значение', isSelect: true, items: ['Устава', 'Доверенности', 'Свидетельства о регистрации'], value: infoINNContractsForm.BasisOfTheSignatorysAuthority }" 
                      @changeInputValue="infoINNContractsForm.BasisOfTheSignatorysAuthority = $event" 
                    />
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">БИК</div>
                <div class="set-form__input">
                  <ur-input placeholder="Введите БИК" v-model="infoINNContractsForm.BIC" type="text" readonly />
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">Наименование банка</div>
                <div class="set-form__input">
                  <ur-input 
                    placeholder="Введите наименование банка"
                    v-model="infoINNContractsForm.FullNameBank" 
                    type="text"
                    :rules="[
                      val => !!val || 'Поле оязательно к заполнению'
                    ]"  
                  />
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">Корреспондентский счет</div>
                <div class="set-form__input">
                  <ur-input 
                    placeholder="Введите корреспондентский счет"
                    v-model="infoINNContractsForm.korSchet" 
                    type="text"
                    :rules="[
                      val => !!val || 'Поле оязательно к заполнению',
                      val => !/(?!^\d+$)^.+$/.test(val) || 'Поле корреспондентский счет не может содержать символы'
                    ]"  
                  />
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">Расчетный счет</div>
                <div class="set-form__input">
                  <ur-input 
                    placeholder="Введите расчетный счет"
                    v-model="infoINNContractsForm.RasSchet"
                    type="text"
                    :rules="[
                      val => !!val || 'Поле оязательно к заполнению',
                      val => !/(?!^\d+$)^.+$/.test(val) || 'Поле расчетный счет не может содержать символы'
                    ]"  
                  />
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">ФИО бухгалтера</div>
                <div class="set-form__input">
                  <template>
                    <ur-input 
                      placeholder="Введите ФИО бухгалтера" 
                      v-model="infoINNContractsForm.FIOBuh" 
                      type="text"
                      :rules="[
                        val => !!val || 'Поле оязательно к заполнению',
                        val => !/\d+/g.test(val) || 'Поле ФИО не может содержать цифр',
                        val => !/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/g.test(val) || 'Поле ФИО не может содержать специальных симфолов',
                      ]"  
                    />
                    <div class="set-form__input-text">Например: Красилова Мария Петровна</div>
                  </template>
                </div>
              </div>

              <div class="set-form__row">
                <div class="set-form__label">Телефон бухгалтера</div>
                <div class="set-form__input">
                  <template>
                    <ur-input 
                      placeholder="Введите телефон бухгалтера" 
                      v-model="infoINNContractsForm.PhoneBuh" 
                      type="text" 
                      :mask="'8-9##-###-##-##'"
                      :rules="[(val) => !!val || 'Поле оязательно к заполнению']"  
                    />
                    <div class="set-form__input-text">Например: 8-911-921-21-11</div>
                  </template>
                </div>
              </div>

              <div class="set-form__footer mt-20">
                <div class="btn btn-primary" @click="saveEditFormData()">Сохранить</div>
                <div class="btn btn-white" @click="cancelEditFormData()">Отменить</div>
              </div>
            </div>

          </template>
        </main-container>
      </div>
      <div class="main__content-col main__content-col--315">
        <main-container :title="'Договоры'">
          <template slot="nobody">
            <div class="panel-contracts">
              <div class="panel-contracts__item">
                <div class="panel-contracts__item-icon">
                  <icon-base width="14" height="18" iconColor="#ff4e4e"><icon-pdf/></icon-base>
                </div>
                <div class="panel-contracts__item-filename" @click="printModal = true">Договор-оферта на оказание услуг</div>
                <transition name="fade">
                  <print-modal v-model="printModal" @print="runModuleAction"/>
                </transition>
              </div>
            </div>
          </template>
        </main-container>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import searchInput                from '@/components/elements/SearchInput'
import createContractForServices  from '@/documents/ContractForServices';
import cloneDeep from 'lodash/cloneDeep';

export default {
  components: { searchInput },
  data () {
    return {
      updateContent: 0,
      newData: {},
      printModal: false,
      
      infoINNContractsForm: {
          BIC: "112211",
          ContractNumber: "2/04-ДГО/2020",
          FIOBuh: "Медвева Мария Петровна",
          FullNameBank: "Банк",
          FullNameOfTheSignatoryInTheGenitiveCase: "Маскалева Александра Николаевича",
          FullNameOrganization: "МУНИЦИПАЛЬНОЕ ПРЕДПРИЯТИЕ ГОРОДСКОГО ПОСЕЛЕНИЯ ЩЁЛКОВО 'ДИРЕКЦИЯ ЕДИНОГО ЗАКАЗЧИКА ЖИЛИЩНО-КОММУНАЛЬНОГО ХОЗЯЙСТВА'",
          GroundsPowersSignatory: "Устав",
          INN: "5050026941",
          KPP: "505001001",
          OGRN: "1035010203800",
          PhoneBuh: "8-911-921-21-44",
          PochtAddress: "141108, обл. Московская, р-н Щелковский, г. Щелково, ул. Краснознаменская, д.3",
          RasSchet: "112211",
          ShortNameOfTheOrganization: 'МП ГПЩ "ДЕЗ ЖКХ"',
          SurnameAndInitialsOfTheSignatory: "Маскалев А.Н.",
          UrAddress: "141108, обл. Московская, р-н Щелковский, г. Щелково, ул. Краснознаменская, д.3",
          korSchet: "112211",

          BasisOfTheSignatorysAuthority: 'Устава'
      }
    }
  },
  watch: {
    getInfoINNContracts: {
      immediate: true,
      handler (val) {
        if (val) {  
          // debugger
          const cloned = cloneDeep(this.getInfoINNContracts);
          for (const key in cloned) {
            this.infoINNContractsForm[key] = cloned[key]
          }
          // this.setPanelParams(this.getInfoINNContracts)
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getInfoINNContracts', 'getInfoINNSharedData', 'debtorsModules']),
  },
  methods: {
    ...mapActions(['loadInfoINNContracts', 'companyContractsEdit']),
    runModuleAction(e) {
      // console.log('open', 'save');
      this.createContractForServices();
      this.printModal = false;
    },
    /**
     * Генерация договора
     */
    createContractForServices() {
      const company = this.newData;
      createContractForServices({ company, companySharedData: this.getInfoINNSharedData, debtorsModules: this.debtorsModules }, 'open');
    },
    setPanelParams (defaultCompanyInfoInn) {
      this.formData.forEach(el => {
        if (defaultCompanyInfoInn[el.key]) {
          el.input.value = defaultCompanyInfoInn[el.key]
        }
      });
      this.newData.ContractNumber = defaultCompanyInfoInn.ContractNumber
      this.updateContent++
    },
    /**
     * Сохраняет отредактированные данные
     */
    saveEditFormData () {
        this.companyContractsEdit(this.infoINNContractsForm);
    },
    cancelEditFormData () {
      this.setPanelParams()
    },
    changeInputsValue (key, event) {
      if (event === '') return false
      this.newData[key] = event
    }
  }
}
</script>
