const URL = process.env.VUE_APP_API_URL;
const baseURL = process.env.VUE_APP_API_URL;

const keys = [
  'GroundsPowersSignatory',
  'FullNameOrganization',
  'ShortNameOfTheOrganization',
  'TypeOfOrganization',
  'OKOPF',
  'TaxationSystem',
  'TypePeniCalculation',
  'Phone1',
  'Phaks',
  'Email1',
  'Email_buh',
  'Site',
  'GeneralManager',
  'RepresentativePowerAttorney',
  'UrAddress',
  'FactAddress',
  'PochtAddress',
  'INN',
  'KPP',
  'OGRN',
  'RasSchet',
  'BIC',
  'FullNameBank',
  'KorSchet'
]

const statusesDebtors = [
  ['Новый', 'В работе', '1-е уведомление отправлено', '2-е уведомление отправлено'],
  ['Новый', 'В работе', 'Подано в суд', 'Вынесено решение', 'Отозвано', 'Досудебное урегулирование'],
  ['В работе', 'Взыскано', 'Судебные приставы', 'Банки']
]

const timeZones = ['Калининград', 'Москва', 'Самара', 'Екатеринбург', 'Омск', 'Красноярск', 'Иркутск', 'Якутстк', 'Владивосток', 'Магадан', 'Камчатка']

const discountData = [
  { color: '#495CFF', percent: 10, text: 'От <b>1 000</b> до <b>4 999</b> лицевых счетов' },
  { color: '#6abe49', percent: 20, text: 'От <b>5 000</b> до <b>9 999</b> лицевых счетов' },
  { color: '#49a5ff', percent: 30, text: 'От <b>10 000</b> лицевых счетов' }
]

const debtorPaidColNames = ['AccruedCsv', 'PaidCsv', 'TotalDebt', 'PeniCsv', 'StateDuty', 'collected']

export { URL, keys, timeZones, discountData, debtorPaidColNames, statusesDebtors, baseURL }
