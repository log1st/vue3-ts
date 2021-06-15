<template>  
  <div class="d-data__content debtor__modal" >
    <!-- Вкладки -->
    <div class="d-data__content-tabs">
      <div
        class="d-data__content-tabs-btn mt-0"
        :key="index"
        v-for="(tab, index) in tabs"
        :class="{ 'd-data__content-tabs-btn--active' : subTabActive === index }"
        @click="changeTab(index)"
      >
        {{ tab.title }}
      </div>
    </div>
    <!-- Главная -->
    <div class="d-data__content-tab" v-if="subTabActive === 0">
      <div class="compib__row">
        <div class="compib__row-label">
          <span>ФИО</span>
        </div>
        <div class="compib__input">
          <search-input :params="{ placeholder: 'ФИО', value: params.debtor_main_profile.full_name, readonly: true }" />
        </div>
      </div>
      <div class="compib__row">
        <div class="compib__row-label">
          <span>Адрес</span>
        </div>
        <div class="compib__input">
          <search-input v-if="!params.clean_address" :params="{ placeholder: 'Адрес', value: params.clean_address, readonly: true }" />
          <search-input v-else :params="{ placeholder: 'Адрес', value: params.debtor_main_profile.address, readonly: true }" />
        </div>
      </div>
      <div class="compib__row">
        <div class="compib__row-label">
          <span>Адрес регистрации</span>
        </div>
        <div class="compib__input">
          <search-input :params="{ placeholder: 'Адрес', value: params.debtor_tenant_profiles[0].registration, readonly: true }" />
        </div>
      </div>
      <div class="compib__row">
        <div class="compib__row-label">
          <span>Телефон</span>
        </div>
        <div class="compib__input">
          <!-- <search-input :params="{ placeholder: 'Телефон', value: params.phone, readonly: true }" /> -->
          <ur-input
            class="debtor__modal-input"
            placeholder="Телефон"
            :value="params.debtor_main_profile.phone_number || '+7(9##) ### ## ##' "
            @input="($event) => { debtorDataInputs[j].value = $event }"
            type="text"
            :mask="'+7(9##) ### ## ##'"
          />
        </div>
      </div>
      <!-- Тут данные должника Обзая площадь телефон и тд -->
      <!-- <div class="compib__row">
        <div v-for="(item, j) in debtorDataInputs" class="compib__input"  :key="'ddta0id' + j" style="max-width: 534px; margin: 0">
           <search-input
            :params="{ ...item.input, readonly: !editDebtor, value: params[item.key] ? params[item.key] : null }"
            @changeInputValue="debtorDataInputs[j].value = $event"
          /> 
          
        </div>
      </div> -->
    </div>
    <div class="d-data__content-row debtor__modal-footer" v-if="subTabActive === 0">
        <template v-if="editDebtor">
          <div class="btn btn-primary" @click="saveEditedDebtorData">Обновить</div>
          <div class="btn btn-red" @click="removeDebtor">Удалить</div>
          <div class="btn btn-white btn-cancel" @click="cancelEdit">Отменить</div>
        </template>
        <template v-else>
          <div class="btn btn-edit" @click="editDebtor = true">
            <icon-base width="15" height="15" viewBox="0 0 15 15">
              <icon-edit/>
            </icon-base>
          </div>
        </template>
      </div>
    <!-- Список жильцов  -->
    <div class="modal-deb__info-box select-min active" v-if="subTabActive === 1" :style="'padding-bottom:'+styleParams.paddingBottom">
      <div class="modal-deb__scroll">
        
      <table class="modal-deb__table doc-tab">
                  <tr>
                    <th>
                      ФИО
                    </th>
                    <th class="width-110">Дата рождения</th>
                    <th class="width-110">Место рождения</th>
                    <th class="width-110">Граж-во</th>
                    <th class="width-110">Серия и № паспорта</th>
                    <th class="width-110">ИНН</th>
                    <th class="width-110">Дата выдачи</th>
                    <th class="width-110">Кем выдан паспорт</th>
                    <th class="width-110">Код подразделения</th>
                    <th class="width-110">Регистрация</th>
                    <th class="width-110">Дата регистрации</th>
                    <th class="width-110">Род.отношения</th>
                    <th></th>
                  </tr>
                  <!-- TABLE HEAD END -->
                  <tr v-for="(item, index) in params.debtor_tenant_profiles" :key="index">
                    <td class="width-110">{{item.full_name}}</td>
                    <td>
                        {{item.birth_date}}
                    </td>
                    <td>{{item.birth_place}}</td>
                    <td>{{citizenship || 'РФ'}}</td>
                    <td>{{item.num_of_passport}}</td>
                    <td>{{item.inn}}</td>
                    <td>{{item.date_of_passport_issue}}</td>
                    <td>{{passport_issued_by}}</td>
                    <td>-</td>
                    <td>
                      <div class="__select __select--full" data-state="">
                        <div class="__select__title" data-default="Долевая соб-ть">-
                        </div>
                        <div class="__select__content">
                          <input id="s0" class="__select__input" type="radio" name="reg-1" checked />
                          <label for="s0" class="__select__label">Временная</label>
                          <input id="s1" class="__select__input" type="radio" name="reg-1" />
                          <label for="s1" class="__select__label">Постоянная</label>
                          <input id="s2" class="__select__input" type="radio" name="reg-1" />
                          <!-- <label for="s2" class="__select__label">Временная</label>
                          <input id="s3" class="__select__input" type="radio" name="reg-1" /> -->

                        </div>
                      </div>
                    </td>
                    <td>{{item.registration_date}}</td>
                    <td>
                      <div class="__select __select--full" data-state="">
                        <div class="__select__title" data-default="Долевая соб-ть">-</div>
                        <div class="__select__content">
                          <input id="s0" class="__select__input" type="radio" name="rod-1" checked />
                          <label for="s0" class="__select__label">Сестра</label>
                          <input id="s1" class="__select__input" type="radio" name="rod-1" />
                          <label for="s1" class="__select__label">Отец</label>
                          <input id="s2" class="__select__input" type="radio" name="rod-1" />
                          <label for="s2" class="__select__label">Брат</label>
                          <input id="s3" class="__select__input" type="radio" name="rod-1" />

                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="doc-tab__edit-del">
                        <span class="doc-tab__edit"></span>
                        <span class="doc-tab__del"></span>
                      </span>
                    </td>
                  </tr>
      </table>
      </div>
      <!-- <div class="compib__row" :key="index" v-for="(row, index) in listResidents">
        <div v-for="(item, i) in listOfResidentsFields" class="compib__input"  :key="i + 'asssdas'" :style="{ minWidth: item.style.width, maxWidth: item.style.width }">
          <p v-if="index === 0" class="text-center" style="font-size: 12px; white-space: nowrap;">{{ item.input.placeholder }}</p>
          <ur-input
            v-if="!item.input.isSelect"
            v-model="fields[index][item.key]" :readonly="false"
            :mask="item.mask ? item.mask : null"
            :rules="item.required && [(value) => !!value || 'Поле обязательно к заполнению'] || []"
            ref="ur-input"
          />
          <search-input
            ref="ur-input"
            v-else
            :params="{ ...item.input, readonly: false, value: fields[index][item.key] }"
            @changeInputValue="fields[index][item.key] = $event"
          />
        </div>
        <div class="compib__input">
          <p v-if="index === 0" class="text-center" style="font-size: 12px; white-space: nowrap;">Удалить</p>
          <ur-btn class="btn btn-primary" style="height: 40px; padding: 9px 14px 15px;" @click.stop="deleteResident(row)">Удалить</ur-btn>
        </div>
      </div> -->
      <!-- Поля нового жильца -->
      <div class="compib__row" v-if="newResidentfields.length > 0" v-for="(row, index) in newResidentfields" :key="index + 'asd'">
        <div v-for="(item, i) in listOfResidentsFields" class="compib__input"  :key="i + 'assdsss' + index" :style="{ minWidth: item.style.width, maxWidth: item.style.width }">
          <ur-input
            v-if="!item.input.isSelect"
            v-model="newResidentfields[index][item.key]" :readonly="false"
            :mask="item.mask ? item.mask : null"
            :rules="item.required && [(value) => !!value || 'Поле обязательно к заполнению'] || []"
            ref="ur-input"
          />
          <search-input
            ref="ur-input"
            v-else
            :params="{ ...item.input, readonly: false, value: params[item.key] ? params[item.key] : null }"
            @changeInputValue="test({ e: $event, item: item, index: index })"
          />
        </div>
      </div>
      <div class="d-data__content-row resident-btn" v-if="subTabActive === 1">
        <div class="btn btn-primary" @click.stop="addResident">Добавить</div>
        <ur-btn class="btn btn-primary"  @click.stop="saveResidentsEditing">Сохранить</ur-btn>
        <div class="btn btn-white btn-cancel" @click.stop="cancelResidentEditing">Отменить</div>
      </div>
    </div>
    
    <!-- Жилплощадь -->
   <!-- <div class="d-data__content-tab" v-if="subTabActive === 2">
     <div class="compib__row">
       <div class="compib__row-label">
         <span>Жилплощадь</span>
       </div>
     </div>
   </div> -->
    <!-- Собственники -->
   <div class="d-data__content-tab" v-if="subTabActive === 2">
     <div class="compib__row">
       <!-- <div class="compib__row-label">
         <span>Собственники</span>
       </div> -->
        <owners :params="params"/>
       <!-- <div>
         test
       </div> -->
     </div>
   </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import popupWrapper from '@/components/popup/modules/PopupWrapper'
  import popupFilesContainer from '@/components/popup/modules/PopupFilesContainer'
  import searchInput from '@/components/elements/SearchInput'
  import appRating from '@/components/elements/AppRating'
  import UrBtn from "@/components/elements/Button";
  import cloneDeep from 'lodash/cloneDeep';
  import Vue from 'vue';
  // mask
  import { masks } from '@/mixins/masks';
  // inner components
  import Owners from './components/Owners';
  

  export default {
    props: {
      params: Object
    },
    mixins: [masks],
    components: {
        UrBtn,
        popupWrapper,
        popupFilesContainer,
        searchInput,
        appRating, 
        'owners': Owners    
    },
    data () {
      return {
        // вкладки
        tabs: [
          { title: 'Главная' },
          { title: 'Список жильцов' },
          // { title: 'Жилплощадь' },
          { title: 'Собственники' },
        ],
        updateIndex: 0,
        residentLoader: false,

        residentAdding: false, // флаг для v-if полей добавления жильца
        listResidents: [],
        styleParams:{
          paddingBottom: '0em'
        },  
        subTabActive: 0,
        headTabActive: 0,
        editDebtor: false,
        residentEditing: false,
        residentKey: 0,
        existingResidentEditing: {},
        // моделька для инпутов
        debtorDataInputs: [
          {
            key: 'PhoneDebt',
            value: '',
            input: { placeholder: 'Телефон', label: 'Телефон' }
          },
          // {
          //   key: 'TotalArea',
          //   value: '',
          //   input: { placeholder: 'Общая площадь', label: 'Общая площадь' }
          // },
          // {
          //   key: 'FormOfOwnership',
          //   value: '',
          //   input: { placeholder: 'Форма собственности', isSelect: true, items: ['Частная', 'Бюджетная'] }
          // }
        ],
        // поля дл язадолжников
        listOfResidentsFields: [
          {
            key: 'full_name',
            value: '',
            input: { placeholder: 'ФИО', label: '' },
            style: {
              width: '204px'
            },
            required: true
          },
          {
            key: 'birth_date',
            value: '',
            input: { placeholder: 'Дата рождения', label: '' },
            mask: this._dateMask,
            style: {
              width: '102px'
            },
            required: false
          },
          {
            key: 'birth_place',
            value: '',
            input: { placeholder: 'Место рождения', label: '' },
            style: {
              width: '195px'
            },
            required: false
          },
          {
            key: 'citizenship',
            value: '',
            input: { placeholder: 'Гражданство', label: '' },
            style: {
              width: '172px'
            }
          },
          {
            key: 'num_of_passport',
            value: '',
            mask: '## ## ######',
            input: { placeholder: 'Серия номер паспорта', label: '' },
            style: {
              width: '286px'
            }
          },
          {
            key: 'passport_issued_by',
            value: '',
            input: { placeholder: 'Паспорт выдан', label: '' },
            style: {
              width: '286px'
            }
          },
          {
            key: 'date_of_passport_issue',
            value: '',
            input: { placeholder: 'Дата выдачи', label: '' },
            mask: this._dateMask,
            style: {
              width: '89px'
            }
          },
          {
            key: 'DivisionСode',
            value: '',
            input: { placeholder: 'Код подразделения', label: '' },
            style: {
              width: '139px'
            }
          },

          {
            key: 'registration_date',
            value: '',
            input: { placeholder: 'Дата регистрации', label: '' },
            mask: this._dateMask,
            style: {
              width: '116px'
            }
          },
          // {
          //   key: 'DocDate',
          //   value: '',
          //   input: { placeholder: 'Дата выдачи паспорта', label: '' },
          //   mask: this._dateMask,
          //   style: {
          //     width: '116px'
          //   }
          // },
          {
            key: 'registration',
            value: '',
            input: { placeholder: 'Регистрация', label: '', isSelect: true, items: ['Временная', 'Постоянная'] },
            style: {
              width: '106px'
            }
          },
          {
            key: 'relationships',
            value: '',
            input: { placeholder: 'Род. отношения', label: '', isSelect: true, items: [ "Брат", "Сестра", "Отец", "Мать", "Сын", "Сестра" ]},
            style: {
              width: '96px'
            }
          },
        ],
        // модель для инпутов
        fields: [],
        newResidentfields: [], // новые должники
        buttons: {
          set: true,
          array: [
            { icon: 'print', width: 17, height: 17 },
            { icon: 'download', width: 12, height: 13 }
          ]
        }
      }
    },
    mounted() {
      if (this.listResidents.length > 0) {
        this.styleParams.paddingBottom = '13em'
        if (this.listResidents.length == 1) this.styleParams.paddingBottom = '0em'
        if (this.listResidents.length == 2) this.styleParams.paddingBottom = '8em'
        if (this.listResidents.length == 3) this.styleParams.paddingBottom = '5em'
        if (this.listResidents.length > 4) this.styleParams.paddingBottom = '0em'
      } 
    },
    created () {
      this.updateResidentsList();
      this.setFields();
      // this.saveInitialState();
    },
    computed: {
      ...mapGetters(['debtorsCourtProceedings']),
    },
    watch: {
      debtorsCourtProceedings: {
        deep: true,
        handler() {
          this.updateResidentsList();
          this.setFields();
        }
      }
    },
    methods: {
      ...mapActions([
        'editDebtorData',
        'editListResidents',
        'deleteResident'
      ]),
      test(payload) {
        let key = payload.item.key;
        let value = payload.e;
        this.newResidentfields[payload.index][key] = value
      },
      updateResidentsList() {
        this.listResidents = this.params.debtor_tenant_profiles || [];
      },
      inputHandler(data) {
        const { e, index, key } = data;
        if(this.fields.length > 0 ) {
          this.fields[index][key] = e;
        }
      },
      /**
       * Динамически устанавливает поля ввода для задолжников
       * @description Легаси код мать его за ногу, позже все переписать нахер по списку жильцов  
       */
      setFields() {
        const list = cloneDeep(this.params.debtor_tenant_profiles);
        let lsIndex = 0 
        let lsKey = Object.keys(list[0])
        let data = {}
        list.forEach( ls => {
          lsKey.forEach( key => {
            data[key] = ls[key]
          })
          this.fields[lsIndex] = data;
          data = {}
          lsIndex++
        })
      },
      saveInitialState() {
        
      },
      /**
       * Добавить жильца (создаются пустые поля для заполнения)
       */
      addResident () {
        const debtor = cloneDeep(this.params.ListResidents[0]);
        const emptyDebtorFields = {};
        for(const key in debtor) {
          emptyDebtorFields[key] = '';
        }
        this.newResidentfields.push(emptyDebtorFields);
        this.residentAdding = true;
      },
      deleteResident(item) {
        this.$store.dispatch('deleteResident', { 
          FioDebt: item.FioDebt,
          CurrentDebtor: this.params.RashSchet
        })
      },
      /**
       * Добавление нового должника
       */
      saveResidentEditing () {
        // this.newResidentfields
        const payload = this.fields[this.fields.length - 1];
        payload['CurrentDebtor'] = this.params.RashSchet;
        this.editListResidents({ fields: payload, RashSchet: this.params.RashSchet });
      },
      /**
       * Сохранение отредактированных полей и новых должников в цикле
       */ 
      async saveResidentsEditing () {
        // concat arrays
        const allFields = [...this.fields, ...this.newResidentfields];
        this.$refs['ur-input'].forEach(field => field.validateField && field.validateField());
        if(this.$refs['ur-input'].some(field => field.isError)) return

        for (const payload of allFields) {
          payload['CurrentDebtor'] = this.params.RashSchet;
          await this.editListResidents({ fields: payload, RashSchet: this.params.RashSchet });
        }
        // updating list
        this.fields = allFields;
        this.newResidentfields = [];
      },

      cancelResidentEditing () {
        if(this.newResidentfields.length > 0) {
          this.newResidentfields.pop();
        } else {
          this.$store.dispatch('setPopupState', false);
        }
      },
      /**
       * Сменить вкладку
       * @param index
       */
      changeTab (index) {
        this.subTabActive = index;
        this.residentKey++;
      },
      /**
       * Спросить поля
       */
      cancelEdit () {
        this.debtorDataInputs.forEach(el => {
          el.value = ''
        });
        this.editDebtor = false
      },
      /**
       * Удалить НЕ РЕАЛИЗОВАНО
       */
      removeDebtor () {
        console.log('removeDebtor')
      },
      /**
       * Обновить данные
       */
      saveEditedDebtorData () {
        const newData = { CurrentDebtor: this.params.RashSchet }
        this.debtorDataInputs.forEach(el => {
          if (el.value !== '') newData[el.key] = el.value
        });
        // console.log('saveEditedDebtorData', newData)
        this.editDebtorData({ fields: newData, RashSchet: this.params.RashSchet })
          .then(() => { this.cancelEdit() })
      },
      /**
       * Открыть для редактирования поля должника
       * @param index
       */
      editExistingDebtor(index) {
        this.existingResidentEditing[index].state = true;
      },
      saveExistingDebtor(index) {
        const payload = this.fields[index];
        payload['CurrentDebtor'] = this.params.RashSchet;
        this.editListResidents({ fields: payload, RashSchet: this.params.RashSchet });
        this.existingResidentEditing[index] =  { state: false };
      },
      /**
       * Отмена редактирования поля должника
       * @param index
       */
      cancelExistingDebtor(index) {
        this.fields.splice(index, 1, cloneDeep(this.params.ListResidents[index]));
        this.existingResidentEditing[index] =  { state: false };
      }
    }
  }
</script>

<style>
  .resident-btn {
    margin-top: 4em;
  }
  .btn-input {
    align-self: flex-end;
    border-radius: 4px;
    height: 40px;
    padding: 2px 20px;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: #ffffff;
    text-align: center;
  }
  .btn-input--primary {
    background-color: #495cff;
  }
  .btn-input--primary:hover {
    background-color: #6373ff;
  }
  .btn-input--white {
    background-color: transparent;
    border: 1px solid #c2cbd8;
    color: #99a2bb;
  }
  .btn-input--white:hover {
    webkit-box-shadow: 0 13px 11px -7px rgba(151, 151, 151, 0.37);
    box-shadow: 0 13px 11px -7px rgba(151, 151, 151, 0.37);
    background-color: #979797;
    color: #ffffff;
  }
</style>
