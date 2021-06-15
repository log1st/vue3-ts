// templates
// import JudicialOrderStatement from '@/documents/templates/judicialOrderStatement.js';
// import JudicialOrderStatementChel     from '@/documents/templates/judicialOrderStatementChel.js';
// import JudicialOrderStatementChelDoly from '@/documents/templates/judicialOrderStatementChelDoly.js';

// new templates
import JudicialOrderStatement from '@/documents/templates/JudicialOrderStatement/index.js';

import CalculationPeni        from '@/documents/templates/calculationPeni.js';
import PaymentForm            from '@/documents/templates/paymentForm.js';
import SetOfCharges           from '@/documents/templates/setOfCharges.js';
import CourtOrder             from '@/documents/templates/courtOrder.js';

import DocumentPDF            from '@/documents/index.js';
import { baseURL }      from '@/settings/config';

var JSZip = require("jszip");
import cloneDeep from "lodash/cloneDeep";

import isEmpty from 'lodash/isEmpty';

const judicialOrderStatement = new JudicialOrderStatement();                 // класс шаблона заявления
// const judicialOrderStatementChel = new JudicialOrderStatementChel();         // класс шаблона заявления
// const judicialOrderStatementChelDoly = new JudicialOrderStatementChelDoly(); // класс шаблона заявления
const calculationPeni        = new CalculationPeni();                        // класс шаблона пени
const paymentForm            = new PaymentForm();                            // класс шаблона формы поплаты
const setOfCharges           = new SetOfCharges();                           // класс шаблона начислений лс
const courtOrder             = new CourtOrder();                             // класс судебное решение
const documentPDF            = new DocumentPDF();                            // класс документа
const zip                    = new JSZip();

// import базовых функций 
import { actions as baseActions } from './BaseModule.js'; 

import store from '../../index';
import Axios from 'axios';


const state = {
    documentsOrderList: [
        {
            id: 5,
            title: 'Выписка ЕГРЮЛ',
            checkedJudicialOrder: false,
            checked: false
        },
    ],
    servicesList: [],
    applicationLists: []
};

const actions = {
    ...baseActions,

    /**
     * Печать одиночного свода начислений
     */
    printSetOfChargesTemplate ( {state}, payload) {
        const { id } = payload
        console.log(payload)
        Axios({
            url: baseURL + '/api/template_setofcharges/',
            data:{
                id_debtor: id
            },
            method: 'POST'
        }).then( resp => {
            console.log(resp)
            window.open(baseURL+resp.data.file, '_blank')
        })
    },
    /**
     * Печать свод начислений
     */
    async printSetOfChargesDocument (context, payload) {
        let { dispatch, state } = context;
        let { debtors, company, format, services } = payload

        let arrowstPdf = {}
        for(const key in debtors) {
            arrowstPdf[debtors[key].RashSchet] = await Promise.all(cloneDeep(state.documentsOrderList).filter(d => d.id === -9).map(d => {
                return d.templateGeneratorMethod({
                    debtor: debtors[key],
                    company: company,
                    services: services
                })
            }));
        }
        for(const key in arrowstPdf) {
            let test  = await Promise.all(arrowstPdf[key].map(async document => {
                if(document.length <= 2) {
                    return Number(document)
                } else {
                    return await documentPDF.generate(document, 'название', { tableAutoSize: true })
                }
            }))
            arrowstPdf[key] = test.map(str => {
                    if(typeof str === 'number') {
                        return str
                    } else {
                        return str.replace(/=/g, "*")
                    }
                }
            )
        }
        if (format == 'print') {
            let { result } = await dispatch("mergePdf", arrowstPdf); // склеиваем и открываем
                result = await dispatch('getBase64StringBody', result);
                const blob = await dispatch('generateDocumentBlob', result);
                await dispatch('openDocument', blob);
        }
    },
    /**
     * Печать документов новое
     */
    async printStatementsJudicalDocument(context, payload) {
        let { dispatch, state } = context;
        let { debtors, company, format } = payload
        debugger
        let arrowstPdf = {};
        for(const key in debtors) {
            arrowstPdf[debtors[key].RashSchet] = await Promise.all(cloneDeep(state.documentsOrderList).filter(d => d.checked).map(d => {
                return d.templateGeneratorMethod({
                    debtor: debtors[key],
                    company: company,
                    services: state.servicesList
                })
            }));
        }
        // костыльная функция - генерит массив типа [-1 , -2... , base64, ... -5]
        for(const key in arrowstPdf) {
            let test  = await Promise.all(arrowstPdf[key].map(async document => {
                if(document.length <= 2) {
                    return Number(document)
                } else {
                    return await documentPDF.generate(document, 'название', { tableAutoSize: true })
                }
            }))
            arrowstPdf[key] = test.map(str => {
                    if(typeof str === 'number') {
                        return str
                    } else {
                        return str.replace(/=/g, "*")
                    }
                }
            )
        }
        
        switch (format) {
            // Открыть документ в новой вкладке
            case 'print':
                let { result } = await dispatch("mergePdf", arrowstPdf); // склеиваем и открываем
                result = await dispatch('getBase64StringBody', result);
                const blob = await dispatch('generateDocumentBlob', result);
                await dispatch('openDocument', blob);
                break;
            // Если ЕЦП, то передаем сформированный массив дургому методу
            case 'ecp':
                debugger
                dispatch('printDigitalSignature', { arrowstPdf });
                break;
                // TODO: Ниже нужно вызывать экшены для генерации zip или для скачивания
            default:
                alert( "Нет таких значений" );
        }
    },
    /**
     * Подписать заявление ЭПЦ для каждого должника
     */
    async printDigitalSignature (context, payload) {
        let { commit, dispatch, state } = context;
        let { arrowstPdf } = payload
        let templates = {};
        for(const key in arrowstPdf) {
            // склеиваем и кладем base в шаблоны
            templates[key] = await dispatch("mergePdf", arrowstPdf[key]);
            // убираем заголовки у base64
            templates[key] = await dispatch('getBase64StringBody', templates[key]['result']);
            // заменяем 
            templates[key] = templates[key].replace(/\*/g, "=");
            debugger
            // каждый склеенный шаблон подписываем
            const result = await dispatch("signDocument", {
                template: templates[key],
                rashSchet: key
            });
        }
    }
};

const mutations = {
    setIndexSetOfCharges (state) {
        let index = state.documentsOrderList.findIndex(doc => doc.id === -9);
        state.documentsOrderList[index].checked = true; 
    },
    /**
     * Выбрать (снять выделение) услугу
     */
    toggleService(state, id) {
        let index = state.servicesList.findIndex(ser => ser.id === id);
        state.servicesList[index].checked = !state.servicesList[index].checked; 
    },
    /**
     * Выбрать (снять выделение) все услуги
     */
    toggleAllServices() {
        // Если хоть один выбран
        if(state.servicesList.every(ser => ser.checked)) {

            state.servicesList.forEach(ser => ser.checked = false);
        
        } else if(state.servicesList.every(ser => !ser.checked)) {

            state.servicesList.forEach(ser => ser.checked = true);
        
        } else if(state.servicesList.some(ser => ser.checked)) {
            state.servicesList.forEach(ser => ser.checked = true);
        }
    },
    /**
     * Выбрать (снять выделение) документ
     */
    toggleDocument(state, id) {
        let index = state.documentsOrderList.findIndex(doc => doc.id === id);
        state.documentsOrderList[index].checked = !state.documentsOrderList[index].checked; 
    },
    /**
     * Выбрать (снять выделение) всех документов 
     */
    toggleAllDocuments(state, flag) {
        if(flag) {
            state.documentsOrderList.forEach(doc => doc.checked = true);
        } else {
            state.documentsOrderList.forEach(doc => doc.checked = false);
        }
    },
    /**
     * Установить порядок документов
     * @param {*} payload 
     */
    setDocumentsOrder(state, payload) {
        state.documentsOrderList = payload;
    },
    /**
     * Установить поле в сторе
     */
    setStateField(state, payload) {
        state[payload.field] = payload.value
    },
    /**
     * Добавить в массив документов новые документы динамичесски
     * @param {*} documentsArray 
     */
    mergeDocuments(state, documentsArray) {
        state.documentsOrderList = [...documentsArray, ...state.documentsOrderList];
    }
};

const getters = {
    
    /**
     * Возвращает список услуг
     */
    services(state) {
        return state.servicesList
    },
    /**
     * Возвращает список документов
     */
    documentsList(state) {
        return state.documentsOrderList;
    }
}

/**
 * Получить файлы из организации
 * Устав, Свидетельство о гос.Регситрации и Протокол. 
 * Возможны дополнительные файлы
 */
const getOrganizationDocuments = () => {
    // документы
    let items = [], id = 11;
    // TODO: првоерка файлов
    const documents = store.getters.getDefaultCompany.FileCertificate.Regulation;
    // debugger
    for(const key in documents) {
        items.push({
            id: id,
            title: key,
            checked: true,
            templateGeneratorMethod: (params) => {
                console.log(documents[key])
                return documents[key]
            },
            type: 'headerBase64'
        })
        id++
    }
    // console.log(items)
    // debugger
    store.commit('statementsJudical/mergeDocuments', items);
}
/**
 * Определяет тип заявления и возвращает метод:
 * - Дольщики 
 * - Жильцы
 */
const defineOrderStatementGeneratorFunction = async (params) => {
    // TODO: Здесь будет определяться какой шаблон к какой компании относится
    // где-то здесь добавится 

    // определяем если ли дольщики или брать данные у жильцов 
    const { data } = await store.dispatch('getStatusDischarge', { 
        PaymentAccount: params.debtor.RashSchet 
    });
    // судебный участок
    let court = store.getters.getCourts[0]

    switch(true) {
        // если есть дольщики - возвращаем метод для дольщиков
        case !isEmpty(data[1].return.Info[1]):
            let equityРolders = Object.values(data[1].return.Info[1]); 
            let documentsOrderList = cloneDeep(store.state.statementJudical.documentsOrderList);
            documentsOrderList.shift();
            let servicesList = store.state.statementJudical.servicesList;
            let payload = { ...params, court, equityРolders, documentsOrderList, servicesList };
            
            return judicialOrderStatement.createChelyabinskDolyTemplate(payload);
        // по умолчанию обычное заявление
        default:
            return judicialOrderStatement.createChelyabinskSozhiteliTemplate(params);
    }
    // Метод старого заявления. Пока не понятно зачем оно нужно и как его выводить, но оно точно будет использовано
    // скорей всего когда будет реализована привязка документов к аккаунтам через админку
    // return judicialOrderStatement.createDefaultTemplate(params);
}

/**
 * Получить список документов, доступных для печати и/или приложения
 * Мерджит статичесские документы и динамичесские (пользователь загрузил их сам)
 */
const getDocumentsOrderList = () => {
    // берем настройки из хранилища
    console.log(window.__INITIAL_STATE__)
    
    if ( typeof store.state.user.user.user !== null) {
       const { AdminSettings, AdminApplications } = store.state.user.user.user;
    let applicationsMode = AdminSettings.ApplicationsMode;
    // console.log(store.state);
    // debugger
    // Первым документом всегда будет заявление. Его добавляем первым в массив
    // UDP: Заявление теперь генерируется на backend стороне
    let documents = [
        // {
        //     id: 999,
        //     title: 'Заявление',
        //     checked: true,
        //     visible: false,
        //     templateGeneratorMethod: (params) => {
        //         return defineOrderStatementGeneratorFunction(params);
        //     },
        //     type: 'template'
        // }    
    ];
    // debugger
    switch(true) {
        case applicationsMode === 'User': 
            // если настройки доступны пользователю, то просто делаем у всех документов ckecked = false
            documents = [...documents, ...AdminApplications.map(i => {
                return {
                    id: Number(i.FileID),
                    title: i.Type,
                    checked: false,
                    visible: true,
                    templateGeneratorMethod: (params) => {
                        switch(true)  {
                            case i.FileID === '-10': 
                                return calculationPeni.createTemplate(params);
                            // case i.FileID === '-9': 
                            //     return setOfCharges.createTemplate(params);
                            default:
                                return i.FileID
                        }
                    },
                    type: 'template'
                }
            })]
            break

        case applicationsMode === 'Admin': 
            // конвертим массив в нужный нам и мерджим с заявлением
            // defaultServices = AdminServices.map(i => {
            documents = [...documents, ...AdminApplications.map(i => {
                return { 
                    id: Number(i.FileID),
                    title: i.Type,
                    checked: Boolean(i.Select),
                    visible: true,
                    templateGeneratorMethod: (params) => {
                        switch(true)  {
                            case i.FileID === '-10': 
                                return calculationPeni.createTemplate(params);
                            default:
                                return i.FileID
                        }
                    },
                    type: 'template'
                }
            })]
            // console.log(documents);
            break

        default: 
             // по умоляанию все документы из админки и ckecked = false
             documents = [...documents, ...AdminApplications.map(i => {
                return {
                    id: Number(i.FileID),
                    title: i.Type,
                    checked: false,
                    visible: true,
                    templateGeneratorMethod: (params) => {
                        switch(true)  {
                            case i.FileID === '-10': 
                                return calculationPeni.createTemplate(params);
                            default:
                                return i.FileID
                        }
                    },
                    type: 'template'
                }
            })]
            break
    }
    // debugger
    // const defaultDocuments = [
    //     {
    //         id: 0,
    //         title: 'Выписка из домовой книги',
    //         checked: false,
    //         templateGeneratorMethod: ({ debtor }) => {
    //             const docArr = Object.values(debtor.AllFileDebtPassportOffice)
    //             return store.dispatch('downloadFile', { 
    //                 PaymentAccount: debtor.RashSchet,
    //                 File: docArr[docArr.length - 1].FileName,
    //                 PassportOffice: true
    //             });
    //         },
    //         type: 'headerBase64'
    //     },
    //     {
    //         id: 1,
    //         title: 'История начислений за период',
    //         checked: false,
    //         templateGeneratorMethod: (params) => {
    //             return setOfCharges.createTemplate(params);
    //         },
    //         type: 'template'
    //     },
    //     {
    //         id: 2,
    //         title: 'Расчет пени за коммунарные услуги',
    //         checked: false,
    //         templateGeneratorMethod: (params) => {
    //             return calculationPeni.createTemplate(params) 
    //         },
    //         type: 'template'
    //     },
    //     {
    //         id: 3,
    //         title: 'Выписка из ЕГРН (копия)',
    //         checked: true,
    //         templateGeneratorMethod: ({ debtor }) => {
    //             const ergnArray = Object.values(debtor.AllFileDebtFromEgrn);
    //             return store.dispatch('downloadFile', { 
    //                 PaymentAccount: debtor.RashSchet,
    //                 // File: ergnArray[ergnArray.length - 1].FileName,
    //                 File: '22_10_2020__23_23_Rosreestr.pdf', // проблема с именем
    //                 FromEgrn: true 
    //             });
    //         },
    //         type: 'base64'
    //     },
    //     {
    //         id: 4,
    //         title: 'Платежное поручение об оплате госпошлины',
    //         checked: false,
    //         templateGeneratorMethod: setOfCharges.createTemplate
    //     },
    //     {
    //         id: 5,
    //         title: 'Выписка ЕГРЮЛ (копия)',
    //         checked: false,
    //         templateGeneratorMethod: () => {
    //             return cloneDeep(store.rootGetters.getDefaultCompany.FileEGRUL)
    //         },
    //         type: 'base64'
    //     },
        
    //     {
    //         id: 6,
    //         title: 'Доверенность на представителя (копия)',
    //         checked: false,
    //         templateGeneratorMethod: setOfCharges.createTemplate
    //     },
    //     {
    //         id: 7,
    //         title: 'Свидетельство о государственной регистрации (копия)',
    //         checked: false,
    //         templateGeneratorMethod: setOfCharges.createTemplate
    //     },
    //     {
    //         id: 8,
    //         title: 'Выписка из устава (копия)',
    //         checked: false,
    //         templateGeneratorMethod: setOfCharges.createTemplate
    //     },
    //     {
    //         id: 9,
    //         title: 'Протокол внеочередного общего собрания участников (копия)',
    //         checked: false,
    //         templateGeneratorMethod: setOfCharges.createTemplate
    //     }
    // ]
    // утанавливаем массив документов в хранилище
    // console.log(documents);
    // debugger
    store.commit('statementsJudical/setStateField', { field: 'documentsOrderList', value: documents });
    }
}
/**
 * Получить список сервисов/услуг для документа заявления
 * Мерджит статические поля и новые.
 */
const getServicesList = () => {
    console.log(store)
    if ( typeof store.state.user.user.user !== 'null' || typeof store.state.user.user.user !== 'undefined' ) {
    const { ServicesMode, AdminServices, AdminApplications, Adminservices } = store.state.user.user.user;
    
    let defaultServices = [];
    switch(true) {
        case ServicesMode === 'User': 
            defaultServices = [
                { checked: false, title: 'Электроснабжение ОДН', id: 0 },
                { checked: false, title: 'Водоотведение', id: 1 },
                { checked: false, title: 'Газоснабжение', id: 2 },
                { checked: false, title: 'Отопление', id: 3 },
                { checked: false, title: 'Холодное в/с', id: 4 },
                { checked: false, title: 'Горячее в/с', id: 5 },
                { checked: false, title: 'Содержание ж/ф', id: 6 },
                { checked: false, title: 'ТКО', id: 7 }
            ]
            break

        case ServicesMode === 'Admin': 
            // defaultServices = AdminServices.map(i => {
            defaultServices = Adminservices.map(i => {
                return { 
                    checked: i.Select === 1 ? true : false,
                    title: i.Type,
                    id: Number(i.IdServices)
                }
            })
            break

        default: 
            defaultServices = [
                { checked: false, title: 'Электроснабжение ОДН', id: 0 },
                { checked: false, title: 'Водоотведение', id: 1 },
                { checked: false, title: 'Газоснабжение', id: 2 },
                { checked: false, title: 'Отопление', id: 3 },
                { checked: false, title: 'Холодное в/с', id: 4 },
                { checked: false, title: 'Горячее в/с', id: 5 },
                { checked: false, title: 'Содержание ж/ф', id: 6 },
                { checked: false, title: 'ТКО', id: 7 }
            ]
            break
    }
    // debugger
    store.commit('statementsJudical/setStateField', { field: 'servicesList', value: defaultServices });
    }
};
export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};

export { getDocumentsOrderList, getOrganizationDocuments, getServicesList };
