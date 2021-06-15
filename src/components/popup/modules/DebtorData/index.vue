<template>
  <popup-wrapper :popupWidth="1676">
    <template v-slot:header>
      <div class="d-data__header row align-items-center justify-content-between no-gutters">
        <p class="m-0 col-xs-12 d-data__header-title">Данные должника: <span class="d-data__header-title--fio">{{ params.debtor_main_profile.full_name }}</span></p>
        <div class="d-flex align-items-center col-xs-12">
          <app-rating
            :starWidth="'14'"
            :starHeigth="'14'"
            :rating="params.Reiting"
            :viewBox="'0 0 9 8'"
            :hasTextRating="true"
          />
        </div>
      </div>
    </template>

    <template>
      <div class="d-data__head-tabs">
        <div class="d-data__head-tabs--carousel d-block d-sm-none">
          <div class="slide__button--prev" @click="$refs.carousel.goToPrev()">
            <icon-base :width="24" :height="24" iconColor="white" viewBox="-4 -2 24 24">
              <icon-arrow-prev />
            </icon-base>
          </div>
          <agile :navButtons="false" :dots="false" ref="carousel">
            <div 
              class="slide"
              v-for="(item, i) in headTabs"
              :class="{ active : i == headTabActive}"
              @click="headTabActive = i"
              :key="'ddthtc' + i"
            >
              <div @click="headTabActive = i" class="slide__tab">
                <icon-base :width="item.icon.width" :height="item.icon.height" iconColor="white" :viewBox="item.icon.viewBox">
                  <component :is="'icon-' + item.icon.name" />
                </icon-base>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </agile>
          <div class="slide__button--next" @click="$refs.carousel.goToNext()">
            <icon-base :width="24" :height="24" iconColor="white" viewBox="-4 -2 16 24">  
              <icon-arrow-next />
            </icon-base>
          </div>
        </div>
       
        <div class="d-data__head-tabs--default d-none d-sm-block">
          <ul>
            <li v-for="(item, i) in headTabs"
                class="d-data__head-tab"
                :class="{ active : i == headTabActive}"
                @click="headTabActive = i"
                :key="'ddtht' + i"
                v-if="item.module === activeModule || item.module === 'all'"
            >
              <span style="margin-right: 10px">{{ item.name }}</span>

              <!-- <icon-base
                :width="item.icon.width"
                :height="item.icon.height"
                :iconColor="headTabActive == i ? '#41485d' : '#9fa3ae'"
                :viewBox="item.icon.viewBox"
              >
                <component :is="'icon-' + item.icon.name" />
              </icon-base> -->
            </li>
          </ul>
        </div>
        
      </div>
      <!-- Вкладка "Общие данные" -->
      <main-tab v-if="headTabActive === 0" :params="params" />
      <!-- вкладка "Документооборот"   -->
      <workflow v-if="headTabActive == 1" :params="params" />
      <!-- Финансовые данные -->
      <finance v-if="headTabActive == 2" :params="params" />
      <!-- Справочник судов -->
      <debtor-courts v-if="headTabActive == 3 && debtorsModuleActive === 1" :params="params" />
      <!-- История -->
      <debtor-history @changeTab="changeTab($event)" v-if="headTabActive == 4" :params="params" />
    </template>
  </popup-wrapper>
</template>

<script type="module">
  import { mapActions, mapGetters } from 'vuex'
  import popupWrapper from '@/components/popup/modules/PopupWrapper'
  import popupFilesContainer from '@/components/popup/modules/PopupFilesContainer'
  import searchInput from '@/components/elements/SearchInput'
  // import { VueAgile } from "vue-agile"
  // components
  import MainTab  from './components/MainTab';
  import Workflow from './components/Workflow';
  import DebtorHistory from './components/DebtorHistory';
  import Finance from './components/Finance';
  import DebtorCourts from './components/DebtorCourts';

  export default {
    props: {
      params: Object
    },
    components: { 
      'popup-wrapper': popupWrapper, 
      popupFilesContainer, 
      // agile: VueAgile,
      searchInput,
      'main-tab': MainTab,
      'Workflow': Workflow,
      'debtor-history': DebtorHistory,
      'finance': Finance,
      'debtor-courts': DebtorCourts,
    },
    data () {
      return {
        subTabsData: [
          { title: 'Главная' },
          { title: 'Список жильцов' },
          { title: 'Жилплощадь' }
        ],
        subTabActive: 0,
        headTabActive: 0,
        editDebtor: false,
        residentEditing: false,
        residentKey: 0,
        headTabs: [
          {
            name: 'Общая информация',
            module: 'all',
            disabled: false,
            icon: { name: 'info', width: 20, height: 20 }
          },
          {
            name: 'Документооборот',
            module: 'all',
            disabled: false,
            icon: { name: 'twodocs', width: 16, height: 20 }
          },
          {
            name: 'Финансовые данные',
            module: 'all',
            disabled: false,
            icon: { name: 'dollar', width: 20, height: 20  }
          },
          {
            name: 'Справочник суда и судебных дел',
            module: 'judicial',
            disabled: false,
            icon: { name: 'courts', width: 20, height: 20 }
          },
          // {
          //   name: 'Карточка уведомлений',
          //   module: 'pretrial',
          //   disabled: true,
          //   icon: { name: 'notify-bell', width: 20, height: 20 }
          // },
          {
            name: 'История',
            module: 'all',
            disabled: false,
            icon: { name: 'history', width: 18, height: 18 }
          }
        ],
        debtorDataInputs: [
          {
            key: 'PhoneDebt',
            value: '',
            input: { placeholder: 'Телефон', label: 'Телефон' }
          },
          {
            key: 'TotalArea',
            value: '',
            input: { placeholder: 'Общая площадь', label: 'Общая площадь' }
          },
          {
            key: 'FormOfOwnership',
            value: '',
            input: { placeholder: 'Форма собственности', isSelect: true, items: ['Частная', 'Бюджетная'] }
          }
        ],
        listOfResidentsFields: [
          {
            key: 'full_name',
            value: '',
            input: { placeholder: 'ФИО', label: '' },
            style: {
              width: '204px'
            }
          },
          {
            key: 'DateBirthDebt',
            value: '',
            input: { placeholder: 'Дата рождения', label: '' },
            style: {
              width: '102px'
            }
          },
          {
            key: 'PlaceBirthDebt',
            value: '',
            input: { placeholder: 'Место рождения', label: '' },
            style: {
              width: '195px'
            }
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
            style: {
              width: '106px'
            }
          },
          {
            key: 'DivisionСode',
            value: '',
            input: { placeholder: 'Код подразделения', label: '' },
            style: {
              width: '144px'
            }
          },

          {
            key: 'RegistrationDate',
            value: '',
            input: { placeholder: 'Дата регистрации', label: '' },
            style: {
              width: '140px'
            }
          },
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
            input: { placeholder: 'Родственные отношения', label: '', isSelect: true, items: [ "Брат", "Сестра", "Отец", "Мать", "Сын", "Сестра", "Ответственное лицо"] },
            style: {
              width: '146px'
            }
          },
        ]
      }
    },
    mounted () {
      // console.log(this.params)
    },
    computed: {
      ...mapGetters(['debtorsModuleActive']),
      activeModule () {
        
        switch (this.debtorsModuleActive) {
          case 0:
            return 'pretrial'
            break;
          case 1:
            return 'judicial'
            break;
          case 2:
            return 'executive'
            break;
        }
      },
      listResidents () {
        return Object.values(this.params.ListResidents) || []
      },
      mainResidentFields () {
        const mainResidentFields = [...this.listOfResidentsFields];
        mainResidentFields[0].value = this.params.FIO;
        mainResidentFields[1].value = this.params.FIO;

        return mainResidentFields;
      }
    },
    methods: {
      ...mapActions(['editDebtorData', 'editListResidents']),
      changeTab ({ index, payload }) {
        this.headTabActive = index;
        // debugger
      },
      addResident () {
        this.residentEditing = true;
        this.residentKey++;
      },
      saveResidentEditing () {
        const payload = {};
        this.listOfResidentsFields.forEach(f => {
          payload[f.key] = f.value;
        });
        payload['CurrentDebtor'] = this.params.RashSchet
        this.editListResidents(payload);
      },
      cancelResidentEditing () {
        this.residentEditing = false;
      },
      changeSubTab (index) {
        this.subTabActive = index;
        this.residentKey++;
      },
      cancelEdit () {
        this.debtorDataInputs.forEach(el => {
          el.value = ''
        });
        this.editDebtor = false
      },
      removeDebtor () {
        console.log('removeDebtor')
      },
      // saveEditedDebtorData () {
      //   const newData = { CurrentDebtor: this.params.RashSchet }
      //   this.debtorDataInputs.forEach(el => {
      //     if (el.value !== '') newData[el.key] = el.value
      //   });
      //   // console.log('saveEditedDebtorData', newData)
      //   this.editDebtorData(newData).then(() => { this.cancelEdit() })
      // }
    }
  }
</script>
