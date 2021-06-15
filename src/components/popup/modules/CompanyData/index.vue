<template>
  <div class="cart">
    <div v-if="params.mode === 'new'" class="cart__head">
      <div class="cart__title">Создать новую организацию</div>
    </div>

    <div v-else class="cart__head">
      <div class="cart__title">{{ getCompanyGeneralData(params.index).name_short }}</div>

      <div class="d-flex" style="display: flex">
        <div v-if="params.mode === 'view'" class="btn btn-icon btn-title"
          @click="setPopupComponent({ component: 'company-data', params: { mode: 'edit', index: params.index } })">
          <icon-base width="20" height="20" iconColor="#8e9baf"><icon-edit /></icon-base>
          <div class="btn-title__label">Изменить</div>
        </div>

      <div v-if="params.mode === 'edit'" class="cart__head-text" style="display: flex;align-items: center;margin-right: 1em;">Режим редактирования</div>

        <div class="btn btn-icon btn-title"
          @click="$store.dispatch('setPopupState', false)">
          <div class="btn-title__label">Закрыть</div>
          <div class="btn btn-icon btn-title" >
          <icon-base width="11" height="11" iconColor="#8e9baf"><icon-close /></icon-base>
          </div>
        </div>
      </div>

    </div>

    <ur-card-tabs :tabs="tabs">
      <template slot="tab-1">
        <!-- company info block -->
        <div class="compib">
          <div class="compib__header company__title__main">
            <div class="compib__row compib__row--dark">
              <div class="compib__title">
                <span>Общие данные организации</span>
              </div>
            </div>
          </div>
          <div class="compib__body" :key="updateContent">
            <div v-for="(item, i) in companyData" :key="'sdfsdk' + i">
              <div class="compib__row compib__row--dark company__title__sub">
                <span>{{ item.title }}</span>
              </div>
              <div v-for="(input, j) in item.inputs" class="compib__row" :key="i + 'xcvsdf' + j">
                <div class="compib__row-label">
                  <span>{{ input.label }}</span>
                  <span v-if="input.action" class="compib__row-label_action" @click.prevent="input.action(input.key)">Как юр.адрес</span>
                  <span v-if="input.key === 'bic'" class="compib__row-label_action" @click="getBankData()">Получить данные банка</span>
                </div>
                <div class="compib__input" :key="input.action ? updateContentInner[input.key] + 'asdasd' : null">
                  <search-input :params="input.inputParams" class="company__modal-input" @changeInputValue="changeInputsValue({ key: input.key, event: $event })"/>
                </div>
              </div>
            </div>
            <!-- Файлы ЕГРЮЛ -->
            <div v-if="params.mode === 'view' && getCompanyGeneralData(params.index).FileEGRUL" class="compib__row compib__row--align_top">
              <div class="compib__row-label">
                <span>Файлы ЕГРЮЛ</span>
              </div>
              <div class="compib__files">
                <div class="compib__files-item">
                  <div class="compib__files-item_img" :style="{ backgroundImage: 'url(./assets/images/bitmap.jpg)' }"></div>
                  <div class="compib__files-item_icons">
                    <div v-for="(item, i) in filesActionsIcons" class="compib__files-item_icon" @click="runFilesActions(item.name)" :key="'flsacti' + i">
                      <icon-base
                        :width="item.width"
                        :height="item.height"
                        iconColor="#8e9baf"
                        ><component :is="'icon-' + item.name" />
                      </icon-base>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <company-info-block
          :companyData="companyData"
          :mode="params.mode"
          :updateContent="updateContent"
          @changeInputsValue="changeInputsValue($event)"
        ></company-info-block> -->
      </template>
      <template slot="tab-6">
        <!-- <div class="cart__content-item_head">
          <span>Файлы обслуживаемых домов</span>
          <div class="btn btn-primary">Выбрать</div>
        </div> -->
        <div style="padding: 30px 20px;">
          <popupFilesContainer />
        </div>
      </template>
      <template slot="tab-5">
        <div class="cart__content-wrapp">
          <wgroup v-for="(item, j) in wGroupParams" :params="item" :key="'wgrp' + j"/>
        </div>
      </template>
      <template slot="tab-2">
        <employee :id="getCompanyGeneralData(params.index).id"/>
      </template>
      <template slot="tab-3">
        <documents :id="getCompanyGeneralData(params.index).id"/>
      </template>
    </ur-card-tabs>
    
    <div v-if="params.mode === 'new'" class="cart__footer">
      <div class="cart__footer-button">
        <div class="btn btn-primary" @click="saveNew()">Сохранить</div>
        <div class="btn btn-white" @click="$store.dispatch('setPopupState', false)">Отменить</div>
      </div>
    </div>
    <div v-if="params.mode === 'edit'" class="cart__footer">
      <div class="cart__footer-button">
        <div class="btn btn-primary" @click="saveEdits()">Сохранить изменения</div>
        <div class="btn btn-white" @click="setPopupComponent({ component: 'company-data', params: { mode: 'view', index: params.index } })">Отменить</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import wgroup from '@/components/modules/WorkersGroup'
// import companyInfoBlock from '@/components/modules/companies/CompanyInfoBlock'
import companyCartTable from '@/components/modules/companies/CompanyCartTable'
import popupFilesContainer from '@/components/popup/modules/PopupFilesContainer'
import download from 'downloadjs';

// components
import Employee       from './components/Employee';
import Documents      from './components/Documents';

export default {
  props: {
    params: Object
  },
  components: { 
    companyCartTable,
    wgroup,
    popupFilesContainer,
    // components
    'employee': Employee,
    'documents': Documents,
  },
  data () {
    return {
      updateContent: 0,
      updateContentInner: {
        physical_address: 0,
        postal_address_zip_code: 0
      },
      active: 0,
      bodyAfterHeight: '80px',
      // tabs: ['Общая информация', 'Обслуживание дома', 'Отделы и должности', 'Сотрудники'],
      tabs: [
        {
          title:'Общая информация',
          icon: 'info',
          width: '17',
          height: '17',
          viewBox: '0 0 20 20'
        },
        {
          title:'Сотрудники',
          icon: 'employees',
          width: '16',
          height: '16',
          viewBox: '0 0 18 16'
        },
        {
          title:'Документы',
          icon: 'twodocs',
          width: '16',
          height: '16',
          viewBox: '0 0 20 20'
        }, 
        ],
      filesActionsIcons: [{ name: 'close', width: 9, height: 9 }, { name: 'media', width: 9, height: 9 }, { name: 'litle-search', width: 8, height: 8 }],
      wGroupParams: [
        {
          name: 'Администрация',
          wGroupItems: ['Генеральный директор', 'Главный инженер', 'Исполнительный директор', 'Управляющий']
        },
        {
          name: 'Правление',
          wGroupItems: ['Председатель правления', 'Ревизор', 'Управляющий', 'Член правления']
        },
        {
          name: 'Линейные сотрудники',
          wGroupItems: ['Охранник', 'Разнорабочий', 'Сантехник', 'Электрик']
        },
        {
          name: 'ПТО',
          wGroupItems: ['Ведущий инженер', 'Зав. складом', 'Инженер', 'Начальник ПТО']
        },
        {
          name: 'Администрация',
          wGroupItems: ['Генеральный директор', 'Главный инженер', 'Исполнительный директор', 'Управляющий']
        },
        {
          name: 'Правление',
          wGroupItems: ['Председатель правления', 'Ревизор', 'Управляющий', 'Член правления']
        },
        {
          name: 'Линейные сотрудники',
          wGroupItems: ['Охранник', 'Разнорабочий', 'Сантехник', 'Электрик']
        },
        {
          name: 'ПТО',
          wGroupItems: ['Ведущий инженер', 'Зав. складом', 'Инженер', 'Начальник ПТО']
        }
      ],
      companyData: [
        {
          title: 'Название',
          inputs: {
            name_full: { key: 'name_full', noEdit: true, label: 'Полное наименование', inputParams: {} },
            name_short: { key: 'name_short', noEdit: true, label: 'Сокращенное наименование', inputParams: {} }
          }
        },
        {
          title: 'Деятельность',
          inputs: {
            type: { key: 'type', noEdit: true, label: 'Тип организации', inputParams: { placeholder: 'Выберите тип организации', isSelect: true, height: '250px' } },
            okopf: { key: 'okopf', noEdit: true, label: 'ОКОПФ', inputParams: {} },
            taxation_system: { key: 'taxation_system', label: 'Система налогообложения', inputParams: { placeholder: 'Выберите организационно-правовую форму', isSelect: true, items: null } },
            type_peni_calculation: { key: 'type_peni_calculation', label: 'Тип расчета пени', inputParams: { placeholder: 'Выберите тип расчета пени', isSelect: true, items: ['155 ЖК РФ', '395 ГК РФ', '317.1 ГК РФ', '330 ГК РФ'] } }
          }
        },
        {
          title: 'Контакты',
          inputs: {
            phone: { key: 'phone', label: 'Телефон', inputParams: { placeholder: 'Введите номер телефона' } },
            phaks: { key: 'fax', label: 'Факс', inputParams: { placeholder: 'Введите номер факса' } },
            site: { key: 'site', label: 'Сайт', inputParams: { placeholder: 'Введите сайт' } },
            email: { key: 'email', label: 'E-mail приемной', inputParams: { placeholder: 'Введите e-mail' } },
            email_buh: { key: 'email_buh', label: 'E-mail бухгалтерии', inputParams: { placeholder: 'Введите e-mail' } }
          }
        },
        {
          title: 'Дирекция',
          inputs: {
            director: { key: 'director', noEdit: true, label: 'Генеральный директор', inputParams: { placeholder: 'Введите Фамилия Имя Отчество' } },
            GroundsPowersSignatory: { key: 'GroundsPowersSignatory', noEdit: true, label: 'Основание полномочий подписанта', inputParams: { placeholder: 'Выберите из списка', isSelect: true } },
            representative_power_attorney: { key: 'representative_power_attorney', label: 'Представитель по доверенности', noRequared: true, inputParams: { placeholder: 'Введите Фамилия Имя Отчество' } }
          }
        },
        {
          title: 'Адреса',
          inputs: {
            legal_address: { key: 'legal_address', noEdit: true, label: 'Юридический адрес',  inputParams: { placeholder: 'Введите юридический адрес' } },
            physical_address: { key: 'physical_address', label: 'Фактический адрес', inputParams: { placeholder: 'Введите фактический адрес' } },
            postal_address_zip_code: { key: 'postal_address_zip_code', label: 'Почтовый адрес', inputParams: { placeholder: 'Введите почтовый адрес' } }
          }
        },
        {
          title: 'Реквизиты',
          inputs: {
            inn: { key: 'inn', label: 'ИНН', noEdit: true, inputParams: { placeholder: 'Введите ИНН' } },
            kpp: { key: 'kpp', label: 'КПП', noEdit: true, inputParams: { placeholder: 'Введите КПП' } },
            ogrn: { key: 'ogrn', label: 'ОГРН', noEdit: true, inputParams: { placeholder: 'Введите ОГРН' } },
            ras_schet: { key: 'ras_schet', label: 'Расчетный счет', inputParams: { placeholder: 'Введите расчетный счет' } },
            bic: { key: 'bic', label: 'БИК', inputParams: { placeholder: 'Введите БИК' } },
            full_name_bank: { key: 'full_name_bank', label: 'Полное наименование банка', inputParams: { placeholder: 'Введите полное наименование банка' } },
            kor_schet: { key: 'kor_schet', label: 'Корреспондентский счет', inputParams: { placeholder: 'Введите корреспондентский счет' } }
          }
        }
      ],
      newCompanyData: {}
    }
  },
  created () {
      this.setCompanyData()
  },
  methods: {
    ...mapActions(['saveNewCompany', 'setPopupComponent', 'editCompanyGeneralData', 'setCompanyDefault', 'getDataByBIC']),

    /**
     * Получение данных банка по БИК
     */
    getBankData () {
      this.getDataByBIC({bic: this.newCompanyData.bic, id: this.newCompanyData.id } )
      .then( result => {
        if (result.status) {
            this.setPopupComponent({ component: 'company-data', params: { mode: 'view', index: this.params.index } })
        }
      })
    },  

    saveEdits () {
      // if (this.validateForm()) {
        this.editCompanyGeneralData({ index: this.params.index, data: this.newCompanyData })
          .then(() => {
            this.setPopupComponent({ component: 'company-data', params: { mode: 'view', index: this.params.index } })
          })
      // }
    },
    validateForm () {
      let errors = 0
      for (let i = 0; i < this.companyData.length; i++) {
        for (const key in this.companyData[i].inputs) {
          if (!this.companyData[i].inputs[key].noEdit && !this.companyData[i].inputs[key].noRequared) {
            if (!this.newCompanyData[key] || this.newCompanyData[key] === '' || this.newCompanyData[key] === ' ') {
              this.companyData[i].inputs[key].error = true
              this.companyData[i].inputs[key].inputParams.class = 'is-error'
              errors++
            }
          }
        }
      }
      if (errors === 0) return true
      else {
        this.setCompanyData()
        this.updateContent++
        return false
      }
    },
    saveNew () {
      this.saveNewCompany(this.newCompanyData)
      // this.setPopupComponent({ component: 'popupAlert', params: { title: 'Наконец то!', text: 'Боги сжалились и случилось чудо - новая компания сохранена' } })
    },
    changeInputsValue ({ event, key }) {
      if (event !== 'нет данных') this.newCompanyData[key] = event
      if (key === 'physical_address' || key === 'postal_address_zip_code') this.updateContentInner[key] = null
    },
    setNewAddress (key) {
      if (this.params.mode === 'view') return false
      const newObj = {}
      const index = this.companyData.findIndex(el => el.title === 'Адреса')
      Object.assign(newObj, this.companyData[index])
      // if (this.params.mode === 'new') {
      //   if (this.newCompanyData.UrAddress && this.newCompanyData.UrAddress !== '') newObj.inputs[key].inputParams.value = this.newCompanyData.UrAddress
      //   else return false
      // }
      if (this.params.mode !== 'view') newObj.inputs[key].inputParams.value = this.companyData[index].inputs.legal_address.inputParams.value
      this.companyData.splice(index, 1, newObj)
      this.updateContentInner[key]++
    },
    setCompanyData () {
      switch (this.params.mode) {
        case 'view':
          for (let i = 0; i < this.companyData.length; i++) {
            for (const key in this.companyData[i].inputs) {
              const value = this.getCompanyGeneralData(this.params.index)[key] !== '' ? this.getCompanyGeneralData(this.params.index)[key] : ''
              this.companyData[i].inputs[key].inputParams.value = value
              this.companyData[i].inputs[key].inputParams.readonly = true
            }
          }
          break
        case 'edit':
          for (let i = 0; i < this.companyData.length; i++) {
            for (const key in this.companyData[i].inputs) {
              let value = this.getCompanyGeneralData(this.params.index)[key] !== '' ? this.getCompanyGeneralData(this.params.index)[key] : ''
              this.newCompanyData.id = this.getCompanyGeneralData(this.params.index).id
              if (this.newCompanyData[key]) {
                if (this.newCompanyData[key] !== '' && this.newCompanyData[key] !== ' ') value = this.newCompanyData[key]
              }
              this.companyData[i].inputs[key].inputParams.value = value
              if (this.companyData[i].inputs[key].noEdit) this.companyData[i].inputs[key].inputParams.readonly = true
              if (key === 'physical_address' || key === 'postal_address_zip_code') this.companyData[i].inputs[key].action = this.setNewAddress
            }
          }
          break
        case 'new':
          for (let i = 0; i < this.companyData.length; i++) {
            for (const key in this.companyData[i].inputs) {
              if (this.companyData[i].inputs[key].noEdit) this.companyData[i].inputs[key].inputParams.readonly = true
              if (key === 'physical_address' || key === 'postal_address_zip_code') this.companyData[i].inputs[key].action = this.setNewAddress
            }
          }
          break
      }
      // костыль, почему так?
      const activities = this.companyData.find(el => el.title === 'Деятельность')
      activities.inputs.type.inputParams.items = this.getCompaniesNamesLists.ListTypeOrganization
      activities.inputs.okopf.inputParams.items = this.getCompaniesNamesLists.ListOKOPF
      activities.inputs.TaxationSystem.inputParams.items = this.getCompaniesNamesLists.ListTaxSystems
      // activities.inputs.type_peni_calculation.inputParams.items = this.getCompaniesNamesLists.ListPenaltyCalculation
      this.companyData.find(el => el.title === 'Дирекция').inputs.GroundsPowersSignatory.inputParams.items = this.getCompaniesNamesLists.ListGroundsPowersSignatory
    },
    runFilesActions (action) {
      switch (action) {
        case 'close':
          console.log('delete file')
          break
        case 'media':
          download('data:application/pdf;base64, ' + this.getCompanyGeneralData(this.params.index).FileEGRUL, this.getCompanyGeneralData(this.params.index).name_short.replace(/ /ig, '_') + '.pdf', 'application/pdf')
          break
        case 'litle-search':
          console.log('search file')
          break
      }
    }
  },
  computed: {
    ...mapGetters(['getCompanyGeneralData', 'getCompaniesNamesLists'])
  }
}
</script>
