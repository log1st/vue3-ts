<template>
  <div class="d-data__content" >
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
          <search-input :params="{ placeholder: 'ФИО', value: params.FIO, readonly: true }" />
        </div>
      </div>
      <div class="compib__row">
        <div class="compib__row-label">
          <span>Адрес</span>
        </div>
        <div class="compib__input">
          <search-input :params="{ placeholder: 'Адрес', value: params.Adres, readonly: true }" />
        </div>
      </div>
      <div class="compib__row compib__row--dark">
        <span>Данные</span>
      </div>
      <div class="compib__row" >
        <div v-for="(item, j) in debtorDataInputs" class="compib__input"  :key="'ddta0id' + j" style="max-width: 534px; margin: 0">
          <!-- <search-input
            :params="{ ...item.input, readonly: !editDebtor, value: params[item.key] ? params[item.key] : null }"
            @changeInputValue="debtorDataInputs[j].value = $event"
          /> -->
          <ur-input
            placeholder="Телефон"
            :value="params.PhoneDebt"
            @input="($event) => { debtorDataInputs[j].value = $event }"
            type="text"
            :mask="'+7(9##) ### ## ##'"
          />
        </div>
      </div>

      <div class="d-data__content-row">
        <template v-if="editDebtor">
          <div class="btn btn-primary" @click="saveEditedDebtorData">Обновить</div>
          <div class="btn btn-red" @click="removeDebtor">Удалить</div>
          <div class="btn btn-white btn-cancel" @click="cancelEdit">Отменить</div>
        </template>
        <template v-else>
          <div class="btn btn-primary" @click="editDebtor = true">Редактировать</div>
        </template>
      </div>
    </div>
    <!-- Список жильцов  -->
    <div class="d-data__content-tab" v-if="subTabActive === 1" >

      <div class="compib__row" :key="index" v-for="(row, index) in listResidents">
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
      </div>
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
            @changeInputValue="newResidentfields[index].value = $event"
          />
        </div>
      </div>

      <div class="d-data__content-row">
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

       <div>
         test
       </div>
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
  

  export default {
    props: {
      params: Object
    },
    mixins: [masks],
    components: {UrBtn, popupWrapper, popupFilesContainer, searchInput, appRating },
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
            key: 'FioDebt',
            value: '',
            input: { placeholder: 'ФИО', label: '' },
            style: {
              width: '204px'
            },
            required: true
          },
          {
            key: 'DateBirthDebt',
            value: '',
            input: { placeholder: 'Дата рождения', label: '' },
            mask: this._dateMask,
            style: {
              width: '102px'
            },
            required: true
          },
          {
            key: 'PlaceBirthDebt',
            value: '',
            input: { placeholder: 'Место рождения', label: '' },
            style: {
              width: '195px'
            },
            required: true
          },
          {
            key: 'Citizenship',
            value: '',
            input: { placeholder: 'Гражданство', label: '' },
            style: {
              width: '172px'
            }
          },
          {
            key: 'Docno',
            value: '',
            mask: '## ## ######',
            input: { placeholder: 'Серия номер паспорта', label: '' },
            style: {
              width: '286px'
            }
          },
          {
            key: 'PassportIssued',
            value: '',
            input: { placeholder: 'Паспорт выдан', label: '' },
            style: {
              width: '286px'
            }
          },
          {
            key: 'DateIssue',
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
            key: 'RegistrationDate',
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
            key: 'Registration',
            value: '',
            input: { placeholder: 'Регистрация', label: '', isSelect: true, items: ['Временная', 'Постоянная'] },
            style: {
              width: '106px'
            }
          },
          {
            key: 'FamilyRelationship',
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
      updateResidentsList() {
        const debtor = this.debtorsCourtProceedings.find(d => d.RashSchet == this.params.RashSchet);
        this.listResidents = Object.values(debtor.ListResidents) || [];
      },
      inputHandler(data) {
        const { e, index, key } = data;
        if(this.fields.length > 0 ) {
          this.fields[index][key] = e;
        }
      },
      /**
       * Динамически устанавливает поля ввода для задолжников
       */
      setFields() {
        const list = cloneDeep(this.listResidents);
        for(const key in list) {
          Vue.set(this.fields, key, list[key]);
          // Vue.set(this.existingResidentEditing, key, { state: false });
        }
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
