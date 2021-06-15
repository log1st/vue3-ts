<template>
<div class="popup__background"> 
  <div class="popup" @click="watchActions" v-on:click="outsideClickListener($event, false)">
    <div class="popup__outer" :style="'overflow-y:'+this.overflowy" @click="outsideClickListener($event, true)"> 
      <component v-if="getPopupComponent" 
        :is="getPopupComponent.component"
        :params="getPopupComponent.params"
      />
    </div>
  </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import confirm                      from '@/components/popup/modules/Confirm'
import calendar                     from '@/components/popup/modules/Calendar'
// import companyCart   from '@/components/popup/modules/CompanyCart'
import companyData               from '@/components/popup/modules/CompanyData'
import displaySettings           from '@/components/popup/modules/DisplaySettings'
import debtorData                from '@/components/popup/modules/DebtorData'
import Messages                  from '@/components/popup/modules/Messages'
import popupChangeStatusDebtor   from '@/components/popup/modules/PopupChangeStatusDebtor'
import popupCreateCourts         from '@/components/popup/modules/PopupCreateCourts'
import popupViewCourts           from '@/components/popup/modules/PopupViewCourts'
import popupAlert                from '@/components/popup/modules/PopupAlert'
import popupConfirmNewCompany    from '@/components/popup/modules/PopupConfirmNewCompany'
import AdminServiceApplication   from '@/components/popup/modules/AdminServiceApplication'
import AdminApplicationEdit      from '@/components/popup/modules/AdminApplicationEdit'
import AdminAddBalance           from '@/components/popup/modules/AdminAddBalance'
import NoneDebtorInfo            from '@/components/popup/modules/NoneDebtorInfo'
import QuestionPopup             from '@/components/popup/modules/QuestionPopup'
import debtorDocumentsPrintModal from '@/components/popup/modules/DebtorDocumentsPrintModal'
import debtorSetOfChargesPrintModal from '@/components/popup/modules/DebtorSetOfChargesPrintModal'
import AdminAddCompany           from '@/components/popup/modules/AdminAddCompany'
import CompanyAddEmployer        from '@/components/popup/modules/CompanyAddEmployer'
import CourtInformation          from '@/components/popup/modules/DebtorData/components/CourtInfomation'
import AdminAddCompanyChooser    from '@/components/popup/modules/AdminAddCompanyChoose'
import AdminAddCompanyFNS        from '@/components/popup/modules/AdminAddCompanyFNS'
import AdminTransferBalance      from '@/components/popup/modules/AdminTransferBalance'
import AdminEditVariable         from '@/components/popup/modules/AdminEditVariable'
import AdminChangeModuleTemplate from '@/components/popup/modules/AdminChangeModuleTemplate'
import AdminAddDocumentType      from '@/components/popup/modules/AdminAddDocumentType'
import NotifyModal               from '@/components/popup/modules/NotifyModal'
import AddCompanyApplication     from '@/components/popup/modules/AddCompanyApplication'
import PrintTemplatePopup        from '@/components/popup/modules/PrintTemplatePopup'

export default {
  props:{
    overflow: {
      type: Boolean
    }
  },
  data(){
    return{
      overflowy: 'auto',
    }
  },
  components: {
    confirm,
    calendar,
    displaySettings,
    debtorData,
    companyData,
    Messages,
    popupChangeStatusDebtor,
    popupCreateCourts,
    popupViewCourts,
    popupAlert,
    PrintTemplatePopup,
    popupConfirmNewCompany,
    AdminServiceApplication,
    AdminApplicationEdit,
    AdminAddBalance,
    NoneDebtorInfo,
    QuestionPopup,
    AdminAddCompany,
    CompanyAddEmployer,
    CourtInformation,
    AdminAddCompanyFNS,
    AdminAddCompanyChooser,
    AdminTransferBalance,
    AdminEditVariable,
    AdminChangeModuleTemplate,
    AdminAddDocumentType,
    AddCompanyApplication,
    'notify-modal': NotifyModal,
    'debtor-documents-print-modal': debtorDocumentsPrintModal,
    'debtor-set-of-charges-print-modal': debtorSetOfChargesPrintModal,
  },
  mounted () {
if (typeof document !== 'undefined') {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') { 
        this.setPopupState(false); 
      }
    })
}
    
    if(this.overflow == true){
      this.overflowy = 'auto'
    }else{
      this.overflowy = 'unset'
    }

  },
  methods: {
    ...mapActions(['setPopupState', 'setPopupConfirm']),
    watchActions (e) {
      // debugger
      return
      if (e.target.closest('.popup__outer') === null) {
        if (this.getPopupComponent.params) {
          if (this.getPopupComponent.params.action) this.getPopupComponent.params.action(false)
        }
        if (!e.target.classList.contains('btn-cancel')) this.setPopupState(false)
      }
    },
     outsideClickListener (event, status) {
      //  console.log(event, status)
       let element
        if (event.srcElement.className == "popup") {
        this.setPopupState(false); 
        // если модалку с выборкой (да\нет) закрыли без выбора, вырубить loading и disabled у кнопок
        events.$emit('close_popup_with_selection', false) 
        this.removeClickListener(); 
        }
      if (typeof document !== 'undefined') {
        document.addEventListener('click', this.outsideClickListener)
      }
     },
    removeClickListener() {
      if (typeof document !== 'undefined') {
        document.removeEventListener('click', this.outsideClickListener)
      }
    },
  },
  computed: mapGetters(['getPopupComponent'])
}
</script>
