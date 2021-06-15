<template>
  <div class="cart">
    <div v-if="params.mode === 'new'" class="cart__head">
      <div class="cart__title">Создать новую организацию</div>
    </div>

    <div v-else class="cart__head">
      <div class="cart__title">{{ getCompanyGeneralData(params._id).ShortNameOfTheOrganization }}</div>
      <div v-if="params.mode === 'view'" class="btn btn-icon btn-title" @click="setPopupComponent({ component: 'company-cart', params: { mode: 'edit', _id: params._id } })">
        <icon-base width="11" height="11" iconColor="#8e9baf"><icon-edit /></icon-base>
        <div class="btn-title__label">Изменить</div>
      </div>
      <div v-if="params.mode === 'edit'" class="cart__head-text">Режим редактирования</div>
    </div>

    <ur-card-tabs :tabs="tabs">
      <template slot="tab-1">
        <!-- company info block -->
        <div class="compib">
          <div class="compib__header">
            <div class="compib__row compib__row--dark">
              <div class="compib__title">
                <span>Общие данные организации</span>
              </div>
            </div>
          </div>
          <div class="compib__body" :key="updateContent">
            <div v-for="(item, i) in companyData" :key="'sdfsdk' + i">
              <div class="compib__row compib__row--dark">
                <span>{{ item.title }}</span>
              </div>
              <div v-for="(input, j) in item.inputs" class="compib__row" :key="i + 'xcvsdf' + j">
                <div class="compib__row-label">
                  <span>{{ input.label }}</span>
                  <span v-if="input.action" class="compib__row-label_action" @click.prevent="input.action(input.key)">Как юр.адрес</span>
                </div>
                <div class="compib__input" :key="input.action ? updateContentInner[input.key] + 'asdasd' : null">
                  <search-input :params="input.inputParams" @changeInputValue="changeInputsValue({ key: input.key, event: $event })"/>
                </div>
              </div>
            </div>
            <!-- Файлы ЕГРЮЛ -->
            <div v-if="params.mode === 'view' && getCompanyGeneralData(0).FileEGRUL" class="compib__row compib__row--align_top">
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
      <template slot="tab-4">
        <!-- <div class="cart__content-item_head">
          <span>Файлы обслуживаемых домов</span>
          <div class="btn btn-primary">Выбрать</div>
        </div> -->
        <div style="padding: 30px 20px;">
          <popupFilesContainer />
        </div>
      </template>
      <template slot="tab-3">
        <div class="cart__content-wrapp">
          <wgroup v-for="(item, j) in wGroupParams" :params="item" :key="'wgrp' + j"/>
        </div>
      </template>

      <template slot="tab-2">
        <div class="cart__content-item_head">
          <div class="btn btn-primary">Добавить сотрудника</div>
        </div>
        <company-cart-table />
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
        <div class="btn btn-white" @click="setPopupComponent({ component: 'company-cart', params: { mode: 'view', _id: params._id } })">Отменить</div>
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
import searchInput from '@/components/elements/SearchInput'
import download from 'downloadjs'
export default {
  props: {
    params: Object
  },
  components: { companyCartTable, wgroup, popupFilesContainer, searchInput },
  data () {
    return {
      updateContent: 0,
      updateContentInner: {
        FactAddress: 0,
        PochtAddress: 0
      },
      active: 0,
      bodyAfterHeight: '80px',
      // tabs: ['Общая информация', 'Обслуживание дома', 'Отделы и должности', 'Сотрудники'],
      tabs: ['Общая информация', 'Сотрудники'],
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
            FullNameOrganization: { key: 'FullNameOrganization', label: 'Полное наименование', noEdit: true, inputParams: {} },
            ShortNameOfTheOrganization: { key: 'ShortNameOfTheOrganization', label: 'Сокращенное наименование', noEdit: true, inputParams: {} }
          }
        },
        {
          title: 'Деятельность',
          inputs: {
            TypeOfOrganization: { key: 'TypeOfOrganization', label: 'Тип организации', inputParams: { placeholder: 'Выберите тип организации', isSelect: true, height: '250px' } },
            OKOPF: { key: 'OKOPF', label: 'ОКОПФ', noEdit: true, inputParams: {} },
            TaxationSystem: { key: 'TaxationSystem', label: 'Система налогообложения', inputParams: { placeholder: 'Выберите организационно-правовую форму', isSelect: true, items: null } },
            TypePeniCalculation: { key: 'TypePeniCalculation', label: 'Тип расчета пени', inputParams: { placeholder: 'Выберите тип расчета пени', isSelect: true, items: [] } }
          }
        },
        {
          title: 'Контакты',
          inputs: {
            Phone1: { key: 'Phone1', label: 'Телефон', inputParams: { placeholder: 'Введите номер телефона' } },
            Phaks: { key: 'Phaks', label: 'Факс', inputParams: { placeholder: 'Введите номер факса' } },
            Site: { key: 'Site', label: 'Сайт', inputParams: { placeholder: 'Введите сайт' } },
            Email1: { key: 'Email1', label: 'E-mail приемной', inputParams: { placeholder: 'Введите e-mail' } },
            Email_buh: { key: 'Email_buh', label: 'E-mail бухгалтерии', inputParams: { placeholder: 'Введите e-mail' } }
          }
        },
        {
          title: 'Дирекция',
          inputs: {
            GeneralManager: { key: 'GeneralManager', label: 'Генеральный директор', noEdit: true, inputParams: { placeholder: 'Введите Фамилия Имя Отчество' } },
            GroundsPowersSignatory: { key: 'GroundsPowersSignatory', label: 'Основание полномочий подписанта', inputParams: { placeholder: 'Выберите из списка', isSelect: true } },
            RepresentativePowerAttorney: { key: 'RepresentativePowerAttorney', label: 'Представитель по доверенности', noRequared: true, inputParams: { placeholder: 'Введите Фамилия Имя Отчество' } }
          }
        },
        {
          title: 'Адреса',
          inputs: {
            UrAddress: { key: 'UrAddress', label: 'Юридический адрес', noEdit: true, inputParams: { placeholder: 'Введите юридический адрес' } },
            FactAddress: { key: 'FactAddress', label: 'Фактический адрес', inputParams: { placeholder: 'Введите фактический адрес' } },
            PochtAddress: { key: 'PochtAddress', label: 'Почтовый адрес', inputParams: { placeholder: 'Введите почтовый адрес' } }
          }
        },
        {
          title: 'Реквизиты',
          inputs: {
            INN: { key: 'INN', label: 'ИНН', noEdit: true, inputParams: { placeholder: 'Введите ИНН' } },
            KPP: { key: 'KPP', label: 'КПП', noEdit: true, inputParams: { placeholder: 'Введите КПП' } },
            OGRN: { key: 'OGRN', label: 'ОГРН', inputParams: { placeholder: 'Введите ОГРН' } },
            RasSchet: { key: 'RasSchet', label: 'Расчетный счет', inputParams: { placeholder: 'Введите расчетный счет' } },
            BIC: { key: 'BIC', label: 'БИК', inputParams: { placeholder: 'Введите БИК' } },
            FullNameBank: { key: 'FullNameBank', label: 'Полное наименование банка', inputParams: { placeholder: 'Введите полное наименование банка' } },
            KorSchet: { key: 'KorSchet', label: 'Корреспондентский счет', inputParams: { placeholder: 'Введите корреспондентский счет' } }
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
    ...mapActions(['saveNewCompany', 'setPopupComponent', 'editCompanyGeneralData']),
    saveEdits () {
      if (this.validateForm()) {
        this.editCompanyGeneralData({ _id: this.params._id, data: this.newCompanyData })
          .then(() => {
            this.setPopupComponent({ component: 'company-cart', params: { mode: 'view', _id: this.params._id } })
          })
      }
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
      this.setPopupComponent({ component: 'popupAlert', params: { title: 'Наконец то!', text: 'Боги сжалились и случилось чудо - новая компания сохранена' } })
    },
    changeInputsValue ({ event, key }) {
      if (event !== 'нет данных') this.newCompanyData[key] = event
      if (key === 'FactAddress' || key === 'PochtAddress') this.updateContentInner[key] = null
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
      if (this.params.mode !== 'view') newObj.inputs[key].inputParams.value = this.companyData[index].inputs.UrAddress.inputParams.value
      this.companyData.splice(index, 1, newObj)
      this.updateContentInner[key]++
    },
    setCompanyData () {
      switch (this.params.mode) {
        case 'view':
          for (let i = 0; i < this.companyData.length; i++) {
            for (const key in this.companyData[i].inputs) {
              const value = this.getCompanyGeneralData(0)[key] !== '' ? this.getCompanyGeneralData(0)[key] : ''
              this.companyData[i].inputs[key].inputParams.value = value
              this.companyData[i].inputs[key].inputParams.readonly = true
            }
          }
          break
        case 'edit':
          for (let i = 0; i < this.companyData.length; i++) {
            for (const key in this.companyData[i].inputs) {
              let value = this.getCompanyGeneralData(0)[key] !== '' ? this.getCompanyGeneralData(0)[key] : ''
              if (this.newCompanyData[key]) {
                if (this.newCompanyData[key] !== '' && this.newCompanyData[key] !== ' ') value = this.newCompanyData[key]
              }
              this.companyData[i].inputs[key].inputParams.value = value
              if (this.companyData[i].inputs[key].noEdit) this.companyData[i].inputs[key].inputParams.readonly = true
              if (key === 'FactAddress' || key === 'PochtAddress') this.companyData[i].inputs[key].action = this.setNewAddress
            }
          }
          break
        case 'new':
          for (let i = 0; i < this.companyData.length; i++) {
            for (const key in this.companyData[i].inputs) {
              if (this.companyData[i].inputs[key].noEdit) this.companyData[i].inputs[key].inputParams.readonly = true
              if (key === 'FactAddress' || key === 'PochtAddress') this.companyData[i].inputs[key].action = this.setNewAddress
            }
          }
          break
      }
      // костыль, почему так?
      const activities = this.companyData.find(el => el.title === 'Деятельность')
      activities.inputs.TypeOfOrganization.inputParams.items = this.getCompaniesNamesLists.ListTypeOrganization
      activities.inputs.OKOPF.inputParams.items = this.getCompaniesNamesLists.ListOKOPF
      activities.inputs.TaxationSystem.inputParams.items = this.getCompaniesNamesLists.ListTaxSystems
      activities.inputs.TypePeniCalculation.inputParams.items = this.getCompaniesNamesLists.ListPenaltyCalculation
      this.companyData.find(el => el.title === 'Дирекция').inputs.GroundsPowersSignatory.inputParams.items = this.getCompaniesNamesLists.ListGroundsPowersSignatory
    },
    runFilesActions (action) {
      switch (action) {
        case 'close':
          console.log('delete file')
          break
        case 'media':
          download('data:application/pdf;base64, ' + this.getCompanyGeneralData(0).FileEGRUL, this.getCompanyGeneralData(0).ShortNameOfTheOrganization.replace(/ /ig, '_') + '.pdf', 'application/pdf')
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
