import Vue from 'vue'
import 'normalize.css'
import CompositionApi, {provide} from '@vue/composition-api'
import App from './App.vue'
import { createRouter } from './router'
import createStore from './store'
import { sync } from 'vuex-router-sync'
import sepnum from '@/filters/sepnum.js'
import formatdate from '@/filters/formatdate.js'
import '@/filters';
import '@/mixins';
import {installOutsideClick} from "@/direcvites/outsideClick";

import CabinetLayout from './layouts/CabinetLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import AccrualsLayout from './layouts/AccrualsLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'

installOutsideClick(Vue);

// const window = {}
import Calendar from 'v-calendar/lib/components/calendar.umd'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

Vue.use(CompositionApi);
Vue.component('calendar', Calendar)
Vue.component('date-picker', DatePicker)

const ButtonsGroup = () => import('@/components/elements/ButtonsGroup')
const MainSelect = () => import('@/components/elements/MainSelect')
const UrTable = () => import('@/components/elements/UrTable')
const CheckBox = () => import('@/components/elements/CheckBox')
const UrCheckbox = () => import('@/components/elements/UrCheckbox')

// const VueToast = () => import('./components/toaster')
const UrBtn = () => import('@/components/elements/Button')
import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
const appRating = () => import('@/components/elements/AppRating')
const pagination = () => import('@/components/elements/Pagination')
const checkBoxBig = () => import('@/components/elements/CheckBoxBig')
const popupWrapper = () => import('@/components/popup/modules/PopupWrapper')
const searchInput = () => import('@/components/elements/SearchInput')
const mainContainer = () => import('@/components/elements/MainContainer')


import VueToast          from './components/toaster';
import MaskedInput       from 'vue-text-mask';
import VueDraggable      from 'vuedraggable';
// ui
const PrintModal = () => import('@/components/elements/PrintModal')
const ChipsInput = () => import('@/components/ui/ChipsInput')
const UrSelect = () => import('@/components/ui/UrSelect')
const UrCardTabs = () => import('@/components/ui/UrCardTabs')
const RowHoverActions = () => import('@/components/elements/RowHoverActions')
const selectGray = () => import('@/components/elements/SelectGray')
const UrInput = () => import('@/components/ui/UrInput')

const UrInputX = () => import('@/components/elements/UrInputX')

import VueDirectiveMask from '@vuejs-community/vue-directive-mask'

Vue.use(VueDirectiveMask);

// import VueApexCharts from 'vue-apexcharts'
// Vue.use(VueApexCharts)

// Vue.component('apexchart', VueApexCharts)

// === UI === //
Vue.component('btn-group', ButtonsGroup);
Vue.component('main-select', MainSelect);
Vue.component('ur-table', UrTable);
Vue.component('check-box', CheckBox);
Vue.component('ur-checkbox', UrCheckbox);
Vue.component('vue-draggable', VueDraggable);
Vue.component('ur-btn', UrBtn);
Vue.component('base-scroll-wrapper', baseScrollWrapper);
Vue.component('app-rating', appRating);
Vue.component('pagination', pagination);
Vue.component('check-box-big', checkBoxBig);
Vue.component('search-input', searchInput);
Vue.component('chips-input', ChipsInput);
Vue.component('ur-input', UrInput);
Vue.component('ur-input-x', UrInputX);
Vue.component('ur-select', UrSelect);
Vue.component('ur-card-tabs', UrCardTabs);

Vue.component('row-hover-actions', RowHoverActions);
Vue.component('select-gray', selectGray);

Vue.component('print-modal', PrintModal);
Vue.component('popup-wrapper', popupWrapper);
Vue.component('main-container', mainContainer);
// ====== icons

import iconBase        from '@/components/icons-svg/IconBase';
import iconPrint       from '@/components/icons-svg/icons/IconPrint';
import iconLists       from '@/components/icons-svg/icons/IconLists';
import iconFolder      from '@/components/icons-svg/icons/IconFolder';
import iconPaper       from '@/components/icons-svg/icons/IconPaper';
import iconPdf         from '@/components/icons-svg/icons/IconPdf';
import iconSettings    from '@/components/icons-svg/icons/IconSettings';
import iconPanel       from '@/components/icons-svg/icons/IconPanel';
import iconZip         from '@/components/icons-svg/icons/IconZip';
import iconDownload2   from '@/components/icons-svg/icons/IconDownload2';
import iconStar        from '@/components/icons-svg/icons/IconStar';
import iconEye         from '@/components/icons-svg/icons/IconEye';
import iconUrrobot     from '@/components/icons-svg/icons/IconUrrobot';
import iconSearch      from '@/components/icons-svg/icons/IconSearch';
import iconClose       from '@/components/icons-svg/icons/IconClose';
import iconEdit        from '@/components/icons-svg/icons/IconEdit';
import iconMedia       from '@/components/icons-svg/icons/IconMedia';
import iconLitleSearch from '@/components/icons-svg/icons/IconLitleSearch';
import iconDecor       from '@/components/icons-svg/icons/IconDecor';
import iconDownload    from '@/components/icons-svg/icons/IconDownload';
import IconCheck       from '@/components/icons-svg/icons/IconCheck';
import IconCloseBig    from '@/components/icons-svg/icons/IconCloseBig';
import IconBell        from '@/components/icons-svg/icons/IconBell';
import IconArrowPrev   from '@/components/icons-svg/icons/IconArrowPrev';
import IconArrowNext   from '@/components/icons-svg/icons/IconArrowNext';
import IconEGRN        from '@/components/icons-svg/icons/IconEGRN';
import IconFile        from '@/components/icons-svg/icons/IconFile';
import IconMenu        from '@/components/icons-svg/icons/IconMenu';
import IconInfo        from '@/components/icons-svg/icons/IconInfo';
import IconMail        from '@/components/icons-svg/icons/IconMail';
import IconLogo        from '@/components/icons-svg/icons/IconLogo';
import IconExel        from '@/components/icons-svg/icons/IconExel';
import IconDollar      from '@/components/icons-svg/icons/IconDollar';
import IconHistory     from '@/components/icons-svg/icons/IconHistory';
import IconECP         from '@/components/icons-svg/icons/IconECP';
import IconUser		   from '@/components/icons-svg/icons/IconUser';
import IconLogOut 	   from '@/components/icons-svg/icons/iconLogOut';
import IconEmployees   from '@/components/icons-svg/icons/iconEmployees';
import IconTwoDocs	   from	'@/components/icons-svg/icons/IconTwoDocs';
import IconUploadFile  from	'@/components/icons-svg/icons/IconUploadFile';
import IconReload	   from	'@/components/icons-svg/icons/IconReload';
import IconLogoMin	   from	'@/components/icons-svg/icons/IconLogoMin';
import IconImport	   from	'@/components/icons-svg/icons/IconImport';
import IconExport	   from	'@/components/icons-svg/icons/IconExport';
import IconIntegration from	'@/components/icons-svg/icons/IconIntegration';
import IconCourts	   from '@/components/icons-svg/icons/IconCourts';
import IconPlus		   from '@/components/icons-svg/icons/IconPlus';
import IconEyeSolid    from '@/components/icons-svg/icons/IconEyeSolid'
import IconSendSMS	   from '@/components/icons-svg/icons/IconSendSMS'
import IconSendVoiceMsg from '@/components/icons-svg/icons/IconSendVoiceMsg'
import IconNotifyBell	from '@/components/icons-svg/icons/IconNotifyBell'

Vue.component('icon-notify-bell', IconNotifyBell)
Vue.component('icon-send-voice-msg', IconSendVoiceMsg)
Vue.component('icon-send-sms', IconSendSMS)
Vue.component('icon-plus', IconPlus);
Vue.component('icon-courts', IconCourts);
Vue.component('icon-integration', IconIntegration);
Vue.component('icon-import', IconImport);
Vue.component('icon-export', IconExport);
Vue.component('icon-reload', IconReload);
Vue.component('icon-base', iconBase);
Vue.component('icon-print', iconPrint);
Vue.component('icon-upload-file', IconUploadFile);
Vue.component('icon-logo-min', IconLogoMin);
Vue.component('icon-lists', iconLists);
Vue.component('icon-logout', IconLogOut);
Vue.component('icon-employees', IconEmployees);
Vue.component('icon-twodocs', IconTwoDocs);
Vue.component('icon-folder', iconFolder);
Vue.component('icon-pdf', iconPdf);
Vue.component('icon-paper', iconPaper);
Vue.component('icon-settings', iconSettings);
Vue.component('icon-panel', iconPanel);
Vue.component('icon-zip', iconZip);
Vue.component('icon-download2', iconDownload2);
Vue.component('icon-star', iconStar);
Vue.component('icon-solid-eye', IconEyeSolid)
Vue.component('icon-eye', iconEye);
Vue.component('icon-urrobot', iconUrrobot);
Vue.component('icon-search', iconSearch);
Vue.component('icon-close', iconClose);
Vue.component('icon-edit', iconEdit);
Vue.component('icon-media', iconMedia);
Vue.component('icon-litle-search', iconLitleSearch);
Vue.component('icon-decor', iconDecor);
Vue.component('icon-download', iconDownload);
Vue.component('icon-check', IconCheck);
Vue.component('icon-close-big', IconCloseBig);
Vue.component('icon-bell', IconBell);
Vue.component('icon-arrow-prev', IconArrowPrev);
Vue.component('icon-arrow-next', IconArrowNext);
Vue.component('icon-egrn', IconEGRN);
Vue.component('icon-file', IconFile);
Vue.component('icon-menu', IconMenu);
Vue.component('icon-info', IconInfo);
Vue.component('icon-mail', IconMail);
Vue.component('icon-logo', IconLogo);
Vue.component('icon-exel', IconExel);
Vue.component('icon-dollar', IconDollar);
Vue.component('icon-history', IconHistory);
Vue.component('icon-ecp', IconECP);
Vue.component('icon-user', IconUser);

Vue.component('masked-input', MaskedInput);

Vue.component('cabinet-layout', CabinetLayout)
Vue.component('auth-layout', AuthLayout)
Vue.component('accruals-layout', AccrualsLayout)
Vue.component('admin-layout', AdminLayout)

Vue.filter('sepnum', sepnum)
Vue.filter('formatdate', formatdate)

// import VueAgile from 'vue-agile';
// import VueGridLayout from 'vue-grid-layout';

// Vue.component('grid-layout', VueGridLayout.GridLayout);
// Vue.component('grid-item', VueGridLayout.GridItem);

// Vue.use(VueAgile);

Vue.use(VueToast);

import vSelect from 'vue-select'

Vue.component('v-select', vSelect)

import 'vue-select/dist/vue-select.css';

import VTooltip from 'v-tooltip'

Vue.use(VTooltip)
import ToggleButton from 'vue-js-toggle-button/dist/ssr.index'
Vue.use(ToggleButton)

Vue.config.productionTip = false

import axios from 'axios';

// axios.defaults.headers.common['Auth'] = 'fgeriot4548eoritgbne9585bfdgklj543bdrlgkjdneb56';
if (typeof window !== 'undefined') {
	window.axios = axios.create();
}

import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', function(el, binding) {
	if(!binding.value) {
		return;
	}
	VueMaskDirective.bind(el, binding);
});

import VueScrollTo from 'vue-scrollto'
Vue.use(VueScrollTo)

import { Pie, Line } from 'vue-chartjs'

Vue.component('line-chart', {
	extends: Line,
	mounted () {
	  this.renderChart({
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
		  {
			label: 'Data One',
			backgroundColor: '#f87979',
			data: [40, 39, 10, 40, 39, 80, 50]
		  }
		]
	  }, {responsive: true, maintainAspectRatio: false})
	}

  })

// lodash
import groupBy from 'lodash/groupBy';
if (typeof window !== 'undefined') {
	window.groupBy = groupBy;
}
import { http } from './services';
Vue.prototype.$http = http;
if (typeof window !== 'undefined') {
	window.$http = http;
	window.events = new Vue();
}
import download from 'downloadjs'
if (typeof window !== 'undefined') {
	window.download = download;
}
if (typeof window !== 'undefined') {
	Vue.prototype.window = window;
}

if (typeof document !== 'undefined') {
	Vue.prototype.document = document;
}



//Use the window object to make it available globally.


/**
* Экспортируем функции генерации модуля заявления
*/
// import { getDocumentsOrderList, getServicesList } from './store/modules/documents/statementsJudical';
export function createApp() {

	const store = createStore()
	const router = createRouter(store)

	sync(store, router)

	if (typeof window !== 'undefined') {
		window.axios.interceptors.response.use(response => {
			// Если пользователь не авторизован
			if (response.data[0] && response.data[0].Errors && response.data[0].Errors[1007]) {
				router.push('/login').catch(err => { err });
			}
			return response
			// return { ...response, cancelToken: source.token };
		});
	}

	const app = new Vue({
	  router,
	  store,
	  render: h => h(App),
    created() {
	    this.$store.$toast = this.$toast;
    },
    setup() {
	    provide('store', store);
    }
	})
	return {app, router, store}
}


