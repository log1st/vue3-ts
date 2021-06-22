// templates
import JudicialOrderStatement from '@/documents/templates/judicialOrderStatement.js';
import JudicialOrderStatementChel from '@/documents/templates/judicialOrderStatementChel.js';
import JudicialOrderStatementChelDoly from '@/documents/templates/judicialOrderStatementChelDoly.js';
import CalculationPeni        from '@/documents/templates/calculationPeni.js';
import PaymentForm            from '@/documents/templates/paymentForm.js';
import SetOfCharges           from '@/documents/templates/setOfCharges.js';
import CourtOrder             from '@/documents/templates/courtOrder.js';
import { baseURL } from '@/settings/config'

import DocumentPDF            from '@/documents/index.js';
var JSZip = require("jszip");
import cloneDeep from "lodash/cloneDeep";
import flattenDeep from "lodash/flattenDeep";
import { blobToBase64String } from 'blob-util'

import isEmpty from 'lodash/isEmpty';

const judicialOrderStatement = new JudicialOrderStatement(); // класс шаблона заявления
const judicialOrderStatementChel = new JudicialOrderStatementChel(); // класс шаблона заявления
const judicialOrderStatementChelDoly = new JudicialOrderStatementChelDoly(); // класс шаблона заявления
const calculationPeni        = new CalculationPeni();        // класс шаблона пени
const paymentForm            = new PaymentForm();            // класс шаблона формы поплаты
const setOfCharges           = new SetOfCharges();            // класс шаблона начислений лс
const courtOrder             = new CourtOrder();            // класс судебное решение
const documentPDF            = new DocumentPDF();            // класс документа
const zip                    = new JSZip();

function _allProgress (promises, progressCallback) {
    let d = 0;
    progressCallback(0);
    for (const p of promises) {
      p.then(() => {
        d++;
        progressCallback((d * 100) / promises.length)
      })
    }
    return Promise.all(promises)
}

export default {
    state: () => ( {
        generatingTemplateProgress: 0,
        mergeTemplateProgress: 0,

        status: null,

        services: {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false
        },

        DateFiltrStart: '',
        DateFiltrStop: '',

        printDocumentsOrder: [
            {
                id: 999,
                title: 'Заявление',
                checked: false,
                checkedJudicialOrder: false,
                visible: false
            },
            {
                id: 0,
                title: 'Выписка из домовой книги',
                checkedJudicialOrder: false,
                checked: false
            },
            {
                id: 1,
                title: 'История начислений за период',
                checkedJudicialOrder: false,
                checked: false
            },
            {
                id: 2,
                title: 'Расчет пени за коммунарные услуги',
                checkedJudicialOrder: false,
                checked: false
            },
            {
                id: 3,
                title: 'Выписка из ЕГРН (копия)',
                checkedJudicialOrder: false,
                checked: false
            },
            {
                id: 4,
                title: 'Платежное поручение об оплате госпошлины',
                checkedJudicialOrder: false,
                checked: false
            },
            {
                id: 5,
                title: 'Выписка ЕГРЮЛ (копия)',
                checkedJudicialOrder: false,
                checked: false
            },
            {
                id: 6,
                title: 'Доверенность на представителя (копия)',
                checkedJudicialOrder: false,
                checked: false
            },
            {
                id: 7,
                title: 'Свидетельство о государственной регистрации (копия)',
                checkedJudicialOrder: false,
                checked: false
            },
            {
                id: 8,
                title: 'Выписка из устава (копия)',
                checkedJudicialOrder: false,
                checked: false
            },
            {
                id: 9,
                title: 'Протокол внеочередного общего собрания участников (копия)',
                checkedJudicialOrder: false,
                checked: false
            },
            // {
            //   id: 7,
            //   title: 'Справка с сайта реформа ЖКХ об управлении домами',
            //   checkedJudicialOrder: true,
            //   checked: false
            // }
          ]

    }),
    mutations: {
        setGeneratingTemplateProgress(state, value) {
            state.generatingTemplateProgress = value;
        },
        setMergeTemplateProgress(state, value) {
            state.mergeTemplateProgress = value;
        },
        setEPCLoader(state, status) {
            state.status = status
        },
        setService(state, { index, value }) {
            state.services[index] = value
        },
        clearServices(state) {
            state.services = {
                0: false,
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false
            }
        },
        setStateField(state, payload) {
            const { key, value } = payload;
            state[key] = value
        },

        setDocumentsOrder(state, order) {
            state.printDocumentsOrder = order
        },
        // для печати
        checkDocumentInOrder(state, index) {
            state.printDocumentsOrder[index].checked = !state.printDocumentsOrder[index].checked
        },
        checkDocumentInOrderAll(state) {
            state.printDocumentsOrder = state.printDocumentsOrder.map(doc => {
                if(doc.id !== 999) doc.checked = true
                return doc
            });
        },
        // для приложения
        checkDocumentInJudicialOrder(state, index) {
            state.printDocumentsOrder[index].checkedJudicialOrder = !state.printDocumentsOrder[index].checkedJudicialOrder
        },
        checkDocumentInJudicialOrderAll(state) {
            state.printDocumentsOrder = state.printDocumentsOrder.map(doc => {
                if(doc.id !== 999) doc.checkedJudicialOrder = true
                return doc
            });
        }
    },
    actions: {
        _prepareBase64 (str) {
            let result = str.replace(/=/g, "*"); // заменяем = на *
            result = result.split(',')[1];
            return result;
        },

        /**
         * Файл из инпута оборачиваем в base64
         * @param {Binary} file это файл думаю и так понятно
         * @returns
         */
        toBase64 ({state}, file) {
            return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            })
        },

        /**
         * Вообще это не совсем обратное из base, и классические atob/btoa и тд не используются
         * @param {*} base должен быть base64
         * @returns
         */
        fromBase64 ( {state}, base ) {
                var arr = base.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);

                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }

                return new File([u8arr], filename, {type:mime});
        },
        getEgrnStatus ( {state}, payload ) {
            const { id } = payload
            return new Promise ((resolve, reject) => {
                axios({
                    method: 'GET',
                    url: `${baseURL}/rosreestr/single_status/`,
                    params: {
                        debtor_id: id
                    }
                })
                .then( resp => {
                    console.log(resp)
                    let typeData = resp.data.filter(type => type.request_type === 'data')
                    let typeRights = resp.data.filter(type => type.request_type === 'rights')
                    resolve({status: true, items: {
                        data: typeData,
                        rights: typeRights
                    } })
                })
            })
        },
        getEgrnRightDoc ({state}, payload) {
            const { id } = payload
            return new Promise ((resolve, reject) => {
                axios({
                    method: 'GET',
                    url: `${baseURL}/documents/extract_from_egrn_transfer_of_rights/`,
                    params: {
                        debtor_id: id
                    }
                })
                .then ( resp => {
                    if (resp.data.length > 0) {
                        resolve({status: true, items: resp.data })
                    } else {
                        reject({status: false})
                    }
                }).catch ( err => {
                    if (err.response.data.detail === 'Не найдено.') {
                        reject({status: false})
                    }
                })
            })
        },
        getEgrnDoc ( {state}, payload ) {
            const { id } = payload
            return new Promise ((resolve, reject) => {
                axios({
                    method: 'GET',
                    url: `${baseURL}/documents/extract_from_egrn/`,
                    params: {
                        debtor_id: id
                    }
                })
                .then ( resp => {
                    if (resp.data.length > 0) {
                        resolve({status: true, items: resp.data })
                    } else {
                        reject({status: false})
                    }
                }).catch ( err => {
                    if (err.response.data.detail === 'Не найдено.') {
                        reject({status: false})
                    }
                })
            })
        },
        /**
         * Печать судебное решение
         */
        async printCourtOrder ({ commit, dispatch, state, getters }, { debtors, company, format }) {
            if(debtors.length <= 0) return;

            // ниже блок проверок данных для генерации документа. Если нет данных - меня никак не волнует. Обратитесь к поставщикам
            debtors = debtors.map(async debtor => {
                // Проверка ФИО пользователя
                const fioNotChecked = !debtor.FIO || debtor.FIO.split(' ').length < 3 || debtor.FIO.split(' ').length > 3
                if(fioNotChecked) {
                    alert(`У должника (${debtor.RashSchet}) не указано ФИО или указано с ошибками. Генерация документа невозможна`);
                    return
                }
                // Проверка даты рождения
                const dateBirthNotChecked =
                    !debtor.ListResidents[0].DateBirthDebt ||
                    debtor.ListResidents[0].DateBirthDebt.split('.').length < 3 ||
                    debtor.ListResidents[0].DateBirthDebt.split('.').length > 3 ||
                    debtor.ListResidents[0].DateBirthDebt.split('.')[0].length !== 2 ||
                    debtor.ListResidents[0].DateBirthDebt.split('.')[1].length !== 2 ||
                    debtor.ListResidents[0].DateBirthDebt.split('.')[2].length !== 4
                if(dateBirthNotChecked) {
                    alert(`У должника (${debtor.RashSchet}) не указана дата рождения или указана с ошибками. Генерация документа невозможна`);
                    return
                }
                // Проверка паспортных данных
                const docnoNotChecked =
                    !debtor.ListResidents[0].Docno ||
                    debtor.ListResidents[0].Docno.length < 10 ||
                    debtor.ListResidents[0].Docno.length > 11

                if(docnoNotChecked) {
                    alert(`У должника (${debtor.RashSchet}) не указаны серия/номер паспорта или указаны с ошибками. Генерация документа невозможна`);
                    return
                }

                const INN = await dispatch('getDebtorInn', {
                    // fam: 'Орехов',
                    // name: "Владимир",
                    // otch: "Анатольевич",
                    // bdate: '14.11.1987',
                    // docno: "4509 490060"
                    fam: debtor.FIO.split(' ')[0],
                    name: debtor.FIO.split(' ')[1],
                    otch: debtor.FIO.split(' ')[2],
                    bdate: debtor.ListResidents[0].DateBirthDebt,
                    docno: debtor.ListResidents[0].Docno,
                    docdate: debtor.ListResidents[0].DocDate
                }, { root: true })
                debtor.INN = INN
                // if(!debtor.INN) {
                //     alert(`У должника (${debtor.RashSchet}) не указан ИНН или указаны с ошибками. Генерация документа невозможна`);
                //     return
                // }
                return debtor;
            });

            debtors = await Promise.all(debtors);

            debtors = debtors.filter(d => d !== undefined)

            if(debtors.length <= 0) {
                alert('Отсутствуют должники с наличием корректных для генерации документа данных');
                return
            }

            // let services = state.services || null
            let templates = [];

            debtors.forEach((debtor, index) => {
                templates.push(courtOrder.createTemplate({ debtor: debtor, company: company }));
            });

            templates = await Promise.all(templates);

            templates = templates.map(template => {
                return documentPDF.generate(template, 'Судебное решение', { tableAutoSize: true });
            })

            templates = await Promise.all(templates);

            templates = templates.map(str => str.replace(/=/g, "*"));

            templates = Object.assign({}, templates);
            // dispatch('appLoadingChange', true, { root: true });
            return dispatch("mergePDF", templates).then(async (res) => {
                let name =  Object.values(templates).length === 2 ? `${debtors[0].RashSchet}_${debtors[0].FIO.split(' ').join('_')}` : 'Судебное_решение';
                let zipBlob;

                var binary = atob(res.replace(/\s/g, ''))
                var len = binary.length
                var buffer = new ArrayBuffer(len)
                var view = new Uint8Array(buffer)
                for (var i = 0; i < len; i++) {
                  view[i] = binary.charCodeAt(i)
                }

                var blob = new Blob([view], { type: 'application/pdf' })

                let blobURL = URL.createObjectURL(blob);

                if(format === 'open') {
                    var url = URL.createObjectURL(blob)
                    setTimeout(() => {
                        window.open(url, '_blank')
                    }, 1000)
                } else if (format === 'download') {
                    // create the blob object with content-type "application/pdf"
                    let a = document.createElement("a")
                    a.download = `${name}.pdf`
                    a.href = blobURL
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                } else if (format === 'zip') {
                    zip.file(name, blob);
                    zipBlob = await zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, `${name}.zip`);
                        return content
                    });
                }

                return {
                    base64PDF: res,
                    zipBlob: zipBlob || null,
                    name: zipBlob ? `${name}.zip` : `${name}.pdf`
                };

            }).then(async (data) => {
                return
                const { base64PDF, zipBlob, name } = data;
                // data:application/x-zip-compressed;base64,
                // data:application/pdf;base64,
                let file;

                if(zipBlob != null) {
                    file = await blobToBase64String(zipBlob);
                    file = 'data:application/x-zip-compressed;base64,' + file;
                } else {
                    file = 'data:application/pdf;base64,' + base64PDF;
                }
                const historyNotes = debtors.map(d => {
                    return Promise.all([
                        dispatch('addHistoryNote', {
                            Names: 'Печать заявления',
                            DataTime: new Date(),
                            Status: 'Формирование судебного приказа',
                            PaymentAccount: d.RashSchet
                        }, { root: true }),

                        dispatch('saveDebtorFile', {
                            FileName: name,
                            Data: new Date(),
                            Production: 'Cудебное производство', // всегда будет таким
                            Status: 'Формирование судебного приказа',
                            PaymentAccount: d.RashSchet,
                            File: file
                        }, { root: true })
                    ]);

                });
                await Promise.all(historyNotes);
            })
        },
        /**
         * Печать заявления
         */
        async printStatementsJudicalModule ({ commit, dispatch, state, getters }, { debtors, company, format }) {
            if(debtors.length <= 0) return;
            // Услуги
            let services = state.services || null
            // Документы в приложении
            let documentsList = state.printDocumentsOrder.filter(d => d.checkedJudicialOrder);
            // Документы на печать
            let documentsForPrint = state.printDocumentsOrder.filter(d => d.checked);

            let templates = [];
            // if(format === 'zip') {
            //     dispatch('zipDocuments', { debtors, company, format })
            //     return
            // }

            templates = debtors.map(async (debtor, index) => {
                let listTemplates = [
                    {
                        template: await judicialOrderStatement.createTemplate({
                            debtor: debtor,
                            company: company,
                            templateIndex: index,
                            services: services,
                            documentsList: documentsList
                        }),
                        type: 'template',
                        paymentAccount: debtor.RashSchet
                    }
                ]

                for(const document of documentsForPrint) {
                    if(document.id === 1) {
                    const chargesItem = setOfCharges.getCharges(debtor)
                        listTemplates.push( {
                            template: await setOfCharges.createTemplate({
                                debtor: debtor,
                                company: company,
                                services: services,
                                charges: chargesItem
                            }),
                            type: 'template',
                            paymentAccount: debtor.RashSchet
                        })
                    }

                    if(document.id === 2) {
                        listTemplates.push({
                            template: await calculationPeni.createTemplate({
                                debtor: debtor,
                                company: company,
                                DateFiltrStart: state.DateFiltrStart,
                                DateFiltrStop: state.DateFiltrStop
                            }),
                            type: 'template',
                            paymentAccount: debtor.RashSchet
                        })
                    }

                    if(document.id === 5 && getters.getDefaultCompany && getters.getDefaultCompany.FileEGRUL) {
                        listTemplates.push({
                            template: cloneDeep(getters.getDefaultCompany.FileEGRUL),
                            type: 'base64',
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 0 && debtor.hasOwnProperty('AllFileDebtPassportOffice') && !isEmpty(debtor.AllFileDebtPassportOffice)) {
                        const ergnArray = Object.values(debtor.AllFileDebtPassportOffice)

                        const AllFileDebtPassportOffice = await dispatch('downloadFile', { PaymentAccount: debtor.RashSchet, File: ergnArray[ergnArray.length - 1].FileName, PassportOffice: true });

                        listTemplates.push({
                            template: AllFileDebtPassportOffice,
                            type: 'headerBase64',
                            id: 0,
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 3 && debtor.hasOwnProperty('AllFileDebtFromEgrn') && !isEmpty(debtor.AllFileDebtFromEgrn)) {
                        const ergnArray = Object.values(debtor.AllFileDebtFromEgrn)
                        const AllFileDebtFromEgrn = await dispatch('downloadFile', { PaymentAccount: debtor.RashSchet, File: ergnArray[ergnArray.length - 1].FileName, FromEgrn: true });

                        listTemplates.push({
                            template: AllFileDebtFromEgrn,
                            type: 'base64',
                            paymentAccount: debtor.RashSchet
                        });
                    };

                }
                // console.log(listTemplates);
                // debugger
                return listTemplates
                //  = await Promise.all(listTemplates);

            });
            // console.log(templates);
            templates = await Promise.all(templates);
            templates = flattenDeep(templates);
            // debugger
            // return
            // templates = cloneDeep(state.printDocumentsOrder).filter((doc, index) => {
            //     return doc.checked
            // }).map(doc => {
            //     let templ = templates.find(t => t.id === doc.id);
            //     if(templ) return templ;
            // })

            templates = templates.map(async (template) => {
                if(template.type === 'template') {
                    return {
                        paymentAccount: template.paymentAccount,
                        fileBase64: await documentPDF.generate(template.template, 'Судебный приказ', { tableAutoSize: true })
                    }
                } else if(template.type === 'headerBase64') {
                    return {
                        paymentAccount: template.paymentAccount,
                        fileBase64: template.template.split(',')[1]
                    }
                } else {
                    return {
                        paymentAccount: template.paymentAccount,
                        fileBase64: template.template
                    }
                }
            })
            // debugger
            templates = await Promise.all(templates);

            // templates = templates.map(item => item.fileBase64.replace(/=/g, "*"));
            templates.forEach(item => item.fileBase64 = item.fileBase64.replace(/=/g, "*"));
            // templates.forEach(item => item.fileBase64 = 'data:application/pdf;base64,' + item.fileBase64);

            // debugger
            // templates = Object.assign({}, templates);
            // dispatch('appLoadingChange', true, { root: true });
            return dispatch("MergePdfFull", templates).then(async (res) => {
                // debugger
                res = res.split(',')[1];
                let name =  Object.values(templates).length === 2 ? `${debtors[0].RashSchet}_${debtors[0].FIO.split(' ').join('_')}` : 'Судебный_приказ';
                let zipBlob;
                let fio_ls = `${debtors[0].RashSchet}_${debtors[0].FIO.split(' ').join('_')}`
                var binary = atob(res.replace(/\s/g, ''))
                var len = binary.length
                var buffer = new ArrayBuffer(len)
                var view = new Uint8Array(buffer)
                for (var i = 0; i < len; i++) {
                  view[i] = binary.charCodeAt(i)
                }

                var blob = new Blob([view], { type: 'application/pdf' })

                let blobURL = URL.createObjectURL(blob);

                if(format === 'open') {
                    var url = URL.createObjectURL(blob)
                    setTimeout(() => {
                        window.open(url, '_blank')
                    }, 1000)
                } else if (format === 'download') {
                    // create the blob object with content-type "application/pdf"
                    let a = document.createElement("a")
                    a.download = `${fio_ls}.pdf`
                    a.href = blobURL
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                } else if (format === 'zip') {
                    zip.file(name, blob);
                    zipBlob = await zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, `${name}.zip`);
                        return content
                    });
                }

                return {
                    base64PDF: res,
                    zipBlob: zipBlob || null,
                    name: zipBlob ? `${name}.zip` : `${name}.pdf`
                };

            }).then(async (data) => {
                const { base64PDF, zipBlob, name } = data;
                // data:application/x-zip-compressed;base64,
                // data:application/pdf;base64,
                let file;

                if(zipBlob != null) {
                    file = await blobToBase64String(zipBlob);
                    file = 'data:application/x-zip-compressed;base64,' + file;
                } else {
                    file = 'data:application/pdf;base64,' + base64PDF;
                }
                // const historyNotes = debtors.map(d => {
                //     return Promise.all([
                //         dispatch('addHistoryNote', {
                //             Names: 'Печать заявления',
                //             DataTime: new Date(),
                //             Status: 'Формирование судебного приказа',
                //             PaymentAccount: d.RashSchet
                //         }, { root: true }),

                //         dispatch('saveDebtorFile', {
                //             FileName: name,
                //             Data: new Date(),
                //             Production: 'Cудебное производство', // всегда будет таким
                //             Status: 'Формирование судебного приказа',
                //             PaymentAccount: d.RashSchet,
                //             File: file
                //         }, { root: true })
                //     ]);

                // });
                // await Promise.all(historyNotes);
            })
        },
        /**
         * Печать заявления Челябинск
         */
        async printStatementsJudicalModuleChel ({ commit, dispatch, state, getters }, { debtors, company, format }) {
            if(debtors.length <= 0) return;
            // Услуги
            let services = state.services || null
            // Документы в приложении
            let documentsList = state.printDocumentsOrder.filter(d => d.checkedJudicialOrder);
            // Документы на печать
            let documentsForPrint = state.printDocumentsOrder.filter(d => d.checked);

            let templates = [];
            // if(format === 'zip') {
            //     dispatch('zipDocuments', { debtors, company, format })
            //     return
            // }

            templates = debtors.map(async (debtor, index) => {
                let listTemplates = [
                    {
                        template: await judicialOrderStatementChel.createTemplate({
                            debtor: debtor,
                            company: company,
                            templateIndex: index,
                            services: services,
                            documentsList: documentsList
                        }),
                        type: 'template',
                        paymentAccount: debtor.RashSchet
                    }
                ]

                for(const document of documentsForPrint) {
                    if(document.id === 1) {
                    const chargesItem = setOfCharges.getCharges(debtor)
                        listTemplates.push( {
                            template: await setOfCharges.createTemplate({
                                debtor: debtor,
                                company: company,
                                services: services,
                                charges: chargesItem
                            }),
                            type: 'template',
                            paymentAccount: debtor.RashSchet
                        })
                    }

                    if(document.id === 2) {
                        listTemplates.push({
                            template: await calculationPeni.createTemplate({
                                debtor: debtor,
                                company: company,
                                DateFiltrStart: state.DateFiltrStart,
                                DateFiltrStop: state.DateFiltrStop
                            }),
                            type: 'template',
                            paymentAccount: debtor.RashSchet
                        })
                    }

                    if(document.id === 5 && getters.getDefaultCompany && getters.getDefaultCompany.FileEGRUL) {
                        listTemplates.push({
                            template: cloneDeep(getters.getDefaultCompany.FileEGRUL),
                            type: 'base64',
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 0 && debtor.hasOwnProperty('AllFileDebtPassportOffice') && !isEmpty(debtor.AllFileDebtPassportOffice)) {
                        const ergnArray = Object.values(debtor.AllFileDebtPassportOffice)

                        const AllFileDebtPassportOffice = await dispatch('downloadFile', { PaymentAccount: debtor.RashSchet, File: ergnArray[ergnArray.length - 1].FileName, PassportOffice: true });

                        listTemplates.push({
                            template: AllFileDebtPassportOffice,
                            type: 'headerBase64',
                            id: 0,
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 3 && debtor.hasOwnProperty('AllFileDebtFromEgrn') && !isEmpty(debtor.AllFileDebtFromEgrn)) {
                        const ergnArray = Object.values(debtor.AllFileDebtFromEgrn)
                        const AllFileDebtFromEgrn = await dispatch('downloadFile', { PaymentAccount: debtor.RashSchet, File: ergnArray[ergnArray.length - 1].FileName, FromEgrn: true });

                        listTemplates.push({
                            template: AllFileDebtFromEgrn,
                            type: 'base64',
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 7 && getters.getDefaultCompany && getters.getDefaultCompany.FileCertificate.CertificateRegistrations.length > 0) {
                        listTemplates.push({
                            template: cloneDeep(getters.getDefaultCompany.FileCertificate.CertificateRegistrations),
                            type: 'headerBase64',
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 8 && getters.getDefaultCompany && getters.getDefaultCompany.FileCertificate.Regulation.length > 0) {
                        listTemplates.push({
                            template: cloneDeep(getters.getDefaultCompany.FileCertificate.Regulation),
                            type: 'headerBase64',
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 9 && getters.getDefaultCompany && getters.getDefaultCompany.FileCertificate.Protocol.length > 0) {
                        listTemplates.push({
                            template: cloneDeep(getters.getDefaultCompany.FileCertificate.Protocol),
                            type: 'headerBase64',
                            paymentAccount: debtor.RashSchet
                        });
                    };
                }
                // console.log(listTemplates);
                // debugger
                return listTemplates
                //  = await Promise.all(listTemplates);

            });
            // console.log(templates);
            templates = await Promise.all(templates);
            templates = flattenDeep(templates);
            // debugger
            // return
            // templates = cloneDeep(state.printDocumentsOrder).filter((doc, index) => {
            //     return doc.checked
            // }).map(doc => {
            //     let templ = templates.find(t => t.id === doc.id);
            //     if(templ) return templ;
            // })

            templates = templates.map(async (template) => {
                if(template.type === 'template') {
                    return {
                        paymentAccount: template.paymentAccount,
                        fileBase64: await documentPDF.generate(template.template, 'Судебный приказ', { tableAutoSize: true })
                    }
                } else if(template.type === 'headerBase64') {
                    return {
                        paymentAccount: template.paymentAccount,
                        fileBase64: template.template.split(',')[1]
                    }
                } else {
                    return {
                        paymentAccount: template.paymentAccount,
                        fileBase64: template.template
                    }
                }
            })
            // debugger
            templates = await Promise.all(templates);

            // templates = templates.map(item => item.fileBase64.replace(/=/g, "*"));
            templates.forEach(item => item.fileBase64 = item.fileBase64.replace(/=/g, "*"));
            // templates.forEach(item => item.fileBase64 = 'data:application/pdf;base64,' + item.fileBase64);

            // debugger
            // templates = Object.assign({}, templates);
            // dispatch('appLoadingChange', true, { root: true });
            return dispatch("MergePdfFull", templates).then(async (res) => {
                // debugger
                res = res.split(',')[1];
                let name =  Object.values(templates).length === 2 ? `${debtors[0].RashSchet}_${debtors[0].FIO.split(' ').join('_')}` : 'Судебный_приказ';
                let zipBlob;

                var binary = atob(res.replace(/\s/g, ''))
                var len = binary.length
                var buffer = new ArrayBuffer(len)
                var view = new Uint8Array(buffer)
                for (var i = 0; i < len; i++) {
                  view[i] = binary.charCodeAt(i)
                }

                var blob = new Blob([view], { type: 'application/pdf' })

                let blobURL = URL.createObjectURL(blob);

                if(format === 'open') {
                    var url = URL.createObjectURL(blob)
                    setTimeout(() => {
                        window.open(url, '_blank')
                    }, 1000)
                } else if (format === 'download') {
                    // create the blob object with content-type "application/pdf"
                    let a = document.createElement("a")
                    a.download = `${name}.pdf`
                    a.href = blobURL
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                } else if (format === 'zip') {
                    zip.file(name, blob);
                    zipBlob = await zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, `${name}.zip`);
                        return content
                    });
                }

                return {
                    base64PDF: res,
                    zipBlob: zipBlob || null,
                    name: zipBlob ? `${name}.zip` : `${name}.pdf`
                };

            }).then(async (data) => {
                const { base64PDF, zipBlob, name } = data;
                // data:application/x-zip-compressed;base64,
                // data:application/pdf;base64,
                let file;

                if(zipBlob != null) {
                    file = await blobToBase64String(zipBlob);
                    file = 'data:application/x-zip-compressed;base64,' + file;
                } else {
                    file = 'data:application/pdf;base64,' + base64PDF;
                }
                // const historyNotes = debtors.map(d => {
                //     return Promise.all([
                //         dispatch('addHistoryNote', {
                //             Names: 'Печать заявления',
                //             DataTime: new Date(),
                //             Status: 'Формирование судебного приказа',
                //             PaymentAccount: d.RashSchet
                //         }, { root: true }),

                //         dispatch('saveDebtorFile', {
                //             FileName: name,
                //             Data: new Date(),
                //             Production: 'Cудебное производство', // всегда будет таким
                //             Status: 'Формирование судебного приказа',
                //             PaymentAccount: d.RashSchet,
                //             File: file
                //         }, { root: true })
                //     ]);

                // });
                // await Promise.all(historyNotes);
            })
        },
        /**
         * Печать заявления Челябинск ДОЛИ
         */
        async printStatementsJudicalModuleChelDoly ({ commit, dispatch, state, getters }, { debtors, company, format }) {
            if(debtors.length <= 0) return;

            let court = getters.getCourts[0]
            debugger

            // Услуги
            let services = state.services || null
            // Документы в приложении
            let documentsList = state.printDocumentsOrder.filter(d => d.checkedJudicialOrder);
            // Документы на печать
            let documentsForPrint = state.printDocumentsOrder.filter(d => d.checked);

            let templates = [];


            // templates = debtors.map(async (debtor, index) => {
                for(const debtor of debtors) {
                    let listTemplates = [];
                // debugger
                const data = await dispatch('getStatusDischarge', { PaymentAccount: debtor.RashSchet });
                if(!isEmpty(data.data[1].return) && !isEmpty(data.data[1].return.Info[1])) {
                    let equityРolders = Object.values(data.data[1].return.Info[1]);
                    listTemplates = equityРolders.map(async polder => {
                        return {
                            template: await judicialOrderStatementChelDoly.createTemplate({
                                debtor: debtor,
                                company: company,
                                court: court,
                                services: services,
                                documentsList: documentsList,
                                equityРolder: polder
                            }),
                            type: 'template',
                            paymentAccount: debtor.RashSchet
                        }
                    });
                } else {
                    listTemplates.push({
                        template: await judicialOrderStatementChel.createTemplate({
                            debtor: debtor,
                            company: company,
                            services: services,
                            documentsList: documentsList
                        }),
                        type: 'template',
                        paymentAccount: debtor.RashSchet
                    })
                }

                for(const document of documentsForPrint) {
                    if(document.id === 1) {
                    const chargesItem = setOfCharges.getCharges(debtor)
                        listTemplates.push( {
                            template: await setOfCharges.createTemplate({
                                debtor: debtor,
                                company: company,
                                services: services,
                                charges: chargesItem
                            }),
                            type: 'template',
                            paymentAccount: debtor.RashSchet
                        })
                    }

                    if(document.id === 2) {
                        listTemplates.push({
                            template: await calculationPeni.createTemplate({
                                debtor: debtor,
                                company: company,
                                DateFiltrStart: state.DateFiltrStart,
                                DateFiltrStop: state.DateFiltrStop
                            }),
                            type: 'template',
                            paymentAccount: debtor.RashSchet
                        })
                    }

                    if(document.id === 5 && getters.getDefaultCompany && getters.getDefaultCompany.FileEGRUL) {
                        listTemplates.push({
                            template: cloneDeep(getters.getDefaultCompany.FileEGRUL),
                            type: 'base64',
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 0 && debtor.hasOwnProperty('AllFileDebtPassportOffice') && !isEmpty(debtor.AllFileDebtPassportOffice)) {
                        const ergnArray = Object.values(debtor.AllFileDebtPassportOffice)

                        const AllFileDebtPassportOffice = await dispatch('downloadFile', { PaymentAccount: debtor.RashSchet, File: ergnArray[ergnArray.length - 1].FileName, PassportOffice: true });

                        listTemplates.push({
                            template: AllFileDebtPassportOffice,
                            type: 'headerBase64',
                            id: 0,
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 3 && debtor.hasOwnProperty('AllFileDebtFromEgrn') && !isEmpty(debtor.AllFileDebtFromEgrn)) {
                        const ergnArray = Object.values(debtor.AllFileDebtFromEgrn)
                        const AllFileDebtFromEgrn = await dispatch('downloadFile', { PaymentAccount: debtor.RashSchet, File: ergnArray[ergnArray.length - 1].FileName, FromEgrn: true });

                        listTemplates.push({
                            template: AllFileDebtFromEgrn,
                            type: 'base64',
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 7 && getters.getDefaultCompany && getters.getDefaultCompany.FileCertificate.CertificateRegistrations.length > 0) {
                        listTemplates.push({
                            template: cloneDeep(getters.getDefaultCompany.FileCertificate.CertificateRegistrations),
                            type: 'headerBase64',
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 8 && getters.getDefaultCompany && getters.getDefaultCompany.FileCertificate.Regulation.length > 0) {
                        listTemplates.push({
                            template: cloneDeep(getters.getDefaultCompany.FileCertificate.Regulation),
                            type: 'headerBase64',
                            paymentAccount: debtor.RashSchet
                        });
                    };

                    if(document.id === 9 && getters.getDefaultCompany && getters.getDefaultCompany.FileCertificate.Protocol.length > 0) {
                        listTemplates.push({
                            template: cloneDeep(getters.getDefaultCompany.FileCertificate.Protocol),
                            type: 'headerBase64',
                            paymentAccount: debtor.RashSchet
                        });
                    };
                }
                listTemplates = await Promise.all(listTemplates);
                templates.push(listTemplates);
                //  = await Promise.all(listTemplates);

            // });
            }
            templates = flattenDeep(templates);
            // templates = await Promise.all(templates);
            // debugger

            // return
            // templates = cloneDeep(state.printDocumentsOrder).filter((doc, index) => {
            //     return doc.checked
            // }).map(doc => {
            //     let templ = templates.find(t => t.id === doc.id);
            //     if(templ) return templ;
            // })

            templates = templates.map(async (template) => {
                if(template.type === 'template') {
                    return {
                        paymentAccount: template.paymentAccount,
                        fileBase64: await documentPDF.generate(template.template, 'Судебный приказ', { tableAutoSize: true })
                    }
                } else if(template.type === 'headerBase64') {
                    return {
                        paymentAccount: template.paymentAccount,
                        fileBase64: template.template.split(',')[1]
                    }
                } else {
                    return {
                        paymentAccount: template.paymentAccount,
                        fileBase64: template.template
                    }
                }
            })
            templates = await Promise.all(templates);

            // templates = templates.map(item => item.fileBase64.replace(/=/g, "*"));
            templates.forEach(item => item.fileBase64 = item.fileBase64.replace(/=/g, "*"));
            // templates.forEach(item => item.fileBase64 = 'data:application/pdf;base64,' + item.fileBase64);

            // debugger
            // templates = Object.assign({}, templates);
            // dispatch('appLoadingChange', true, { root: true });
            return dispatch("MergePdfFull", templates).then(async (res) => {
                // debugger
                res = res.split(',')[1];
                let name =  Object.values(templates).length === 2 ? `${debtors[0].RashSchet}_${debtors[0].FIO.split(' ').join('_')}` : 'Судебный_приказ';
                let zipBlob;

                var binary = atob(res.replace(/\s/g, ''))
                var len = binary.length
                var buffer = new ArrayBuffer(len)
                var view = new Uint8Array(buffer)
                for (var i = 0; i < len; i++) {
                  view[i] = binary.charCodeAt(i)
                }

                var blob = new Blob([view], { type: 'application/pdf' })

                let blobURL = URL.createObjectURL(blob);

                if(format === 'open') {
                    var url = URL.createObjectURL(blob)
                    setTimeout(() => {
                        window.open(url, '_blank')
                    }, 1000)
                } else if (format === 'download') {
                    // create the blob object with content-type "application/pdf"
                    let a = document.createElement("a")
                    a.download = `${name}.pdf`
                    a.href = blobURL
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                } else if (format === 'zip') {
                    zip.file(name, blob);
                    zipBlob = await zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, `${name}.zip`);
                        return content
                    });
                }

                return {
                    base64PDF: res,
                    zipBlob: zipBlob || null,
                    name: zipBlob ? `${name}.zip` : `${name}.pdf`
                };

            }).then(async (data) => {
                const { base64PDF, zipBlob, name } = data;
                // data:application/x-zip-compressed;base64,
                // data:application/pdf;base64,
                let file;

                if(zipBlob != null) {
                    file = await blobToBase64String(zipBlob);
                    file = 'data:application/x-zip-compressed;base64,' + file;
                } else {
                    file = 'data:application/pdf;base64,' + base64PDF;
                }
                // const historyNotes = debtors.map(d => {
                //     return Promise.all([
                //         dispatch('addHistoryNote', {
                //             Names: 'Печать заявления',
                //             DataTime: new Date(),
                //             Status: 'Формирование судебного приказа',
                //             PaymentAccount: d.RashSchet
                //         }, { root: true }),

                //         dispatch('saveDebtorFile', {
                //             FileName: name,
                //             Data: new Date(),
                //             Production: 'Cудебное производство', // всегда будет таким
                //             Status: 'Формирование судебного приказа',
                //             PaymentAccount: d.RashSchet,
                //             File: file
                //         }, { root: true })
                //     ]);

                // });
                // await Promise.all(historyNotes);
            })
        },
        /**
         * Архивировать файл
         * @param {*} param0
         * @param {*} param1
         */
        async zipDocuments({ commit, dispatch, state }, { debtors, company, format }) {

            let services = state.services || null

            let templates = debtors.map(async (debtor, index) => {
                return {
                    0: await judicialOrderStatement.createTemplate({ debtor: debtor, company: company, templateIndex: index, services }),
                    1: await calculationPeni.createTemplate({ debtor: debtor, company: company })
                }
            });

            templates = await Promise.all(templates);

            templates = templates.map(async template => {
                return {
                    0: await documentPDF.generate(template[0], 'Судебный приказ1'),
                    1: await documentPDF.generate(template[1], 'Судебный приказ2'),
                }
            })

            templates = await Promise.all(templates);

            templates = templates.map(template => {
                return {
                    0: template[0].replace(/=/g, "*"),
                    1: template[1].replace(/=/g, "*")
                }
            })

            templates = templates.map(async template => {
                return await dispatch("mergePDF", template)
            })

            templates = await Promise.all(templates);

            templates.forEach((template, index) => {

                var binary = atob(template.replace(/\s/g, ''))
                var len = binary.length
                var buffer = new ArrayBuffer(len)
                var view = new Uint8Array(buffer)
                for (var i = 0; i < len; i++) {
                    view[i] = binary.charCodeAt(i)
                }

                var blob = new Blob([view], { type: 'application/pdf' })

                // var url = URL.createObjectURL(blob)
                // setTimeout(() => {
                //     window.open(url, '_blank')
                // }, 1000)

                zip.file(`${debtors[index].FIO}.pdf`, blob);
            })

            let zipBlob = await zip.generateAsync({ type: "blob" }).then(function (content) {
                saveAs(content, `debtors.zip`);
                return content
            });
        },


        /**
         * Печать формы оплаты
         * @param {*} param0
         * @param {*} param1
         */
        async printPaymentForm({ commit, dispatch, state }, { debtors, format }) {
            dispatch('setPopupComponent', {component: 'PrintTemplatePopup', params: {checkedDebtor: debtors}})
        },
        /**
         * Печать свода начислений
         * @param {*} param0
         * @param {*} param1
         */
        async printSetOfCharges({ commit, dispatch, state }, { debtors, format, services, company }) {
            if(debtors.length <= 0) return;

            let templates = [];
            debtors.forEach(debtor => {
                const chargesItem = setOfCharges.getCharges(debtor),
                template = setOfCharges.createTemplate({ debtor: debtor, company: company, services: services, charges: chargesItem })
                templates.push(template);
            });

            templates = await Promise.all(templates);
            templates = templates.map(template => documentPDF.generate(template, null, { tableAutoSize: true }));
            templates = await Promise.all(templates);
            templates = templates.map(str => str.replace(/=/g, "*"));
            templates = Object.assign({}, templates);

            return dispatch("mergePDF", templates).then(async (res) => {
                let name =  Object.values(templates).length < 2 ? `${debtors[0].RashSchet}_${debtors[0].FIO.split(' ').join('_')}` : 'Свод';
                let zipBlob;

                var binary = atob(res.replace(/\s/g, ''))
                var len = binary.length
                var buffer = new ArrayBuffer(len)
                var view = new Uint8Array(buffer)
                for (var i = 0; i < len; i++) {
                    view[i] = binary.charCodeAt(i)
                }

                var blob = new Blob([view], { type: 'application/pdf' })

                let blobURL = URL.createObjectURL(blob);

                if(format === 'open') {
                    var url = URL.createObjectURL(blob)
                    setTimeout(() => {
                        window.open(url, '_blank')
                    }, 1000)
                } else if (format === 'download') {
                    // create the blob object with content-type "application/pdf"
                    let a = document.createElement("a")
                    a.download = `${name}.pdf`
                    a.href = blobURL
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                } else if (format === 'zip') {
                    zip.file(name, blob);
                    zipBlob = await zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, `${name}.zip`);
                        return content
                    });
                }

                return {
                    base64PDF: res,
                    zipBlob: zipBlob || null,
                    name: zipBlob ? `${name}.zip` : `${name}.pdf`
                };

            }).then(async (data) => {
                const { base64PDF, zipBlob, name } = data;
                // data:application/x-zip-compressed;base64,
                // data:application/pdf;base64,
                let file;

                if(zipBlob != null) {
                    file = await blobToBase64String(zipBlob);
                    file = 'data:application/x-zip-compressed;base64,' + file;
                } else {
                    file = 'data:application/pdf;base64,' + base64PDF;
                }
                const historyNotes = debtors.map(d => {
                    return Promise.all([
                        dispatch('addHistoryNote', {
                            Names: 'Печать бланка ПД-4сб',
                            DataTime: new Date(),
                            Status: 'Формирование бланка ПД-4сб',
                            PaymentAccount: d.RashSchet
                        }, { root: true }),

                        dispatch('saveDebtorFile', {
                            FileName: name,
                            Data: new Date(),
                            Production: 'Cудебное производство', // всегда будет таким
                            Status: 'Формирование бланка ПД-4сб',
                            PaymentAccount: d.RashSchet,
                            File: file
                        }, { root: true })
                    ]);

                });
                await Promise.all(historyNotes);
            })

        },

        /**
         * Подписать заявление ЭПЦ
         */
        async printDigitalSignature ({ commit, dispatch, state }, { debtors, company, format, digitalSignature = false }) {
            if(debtors.length <= 0) return;
            let services = state.services || null
            let templates = {};

            for(const debtor of debtors) {
                commit('setEPCLoader', { step: 0, value: true })

                templates[debtor.RashSchet] = await Promise.all([
                    judicialOrderStatement.createTemplate({ debtor: debtor, company: company, services, ecp: true }),
                    // calculationPeni.createTemplate({ debtor: debtor, company: company }),
                ])
                commit('setEPCLoader', { step: 1, value: true })
                // debugger
                templates[debtor.RashSchet] = await Promise.all([
                    documentPDF.generate(templates[debtor.RashSchet][0], 'Судебный приказ'),
                    // documentPDF.generate(templates[debtor.RashSchet][1], 'Расчет пени')
                ])
                commit('setEPCLoader', { step: 2, value: true })
                templates[debtor.RashSchet] = templates[debtor.RashSchet].map(str => {
                    return str.replace(/=/g, "*")
                });
                templates[debtor.RashSchet] = await dispatch("mergePDF", { 0: templates[debtor.RashSchet][0], 1: templates[debtor.RashSchet][1] });
                commit('setEPCLoader', { step: 3, value: true })

                const result = await dispatch("signDocument", {
                  template: templates[debtor.RashSchet],
                  RashSchet: debtor.RashSchet,
                  debtor: debtor
                });
                commit('setEPCLoader', { step: 4, value: true })
                await dispatch('createNotificationMessage', 'Подписание судебного приказа по ЭЦП', { root: true });
                commit('setEPCLoader', null)
            }
            setTimeout(() => {
                dispatch('getDebtorsCourtProceedingsList', true, { root: true });
            }, 5000)
        },
        /**
         * Подписать документ
         * @param {} param0
         * @param {*} payload
         */
        signDocument({ dispatch, commit }, { template, RashSchet, debtor }) {
            // template = template.replace(/\*/g, "=")
            return paradocsWidget.sign({
                content: template, //
                name: RashSchet, //
                ext: "pdf"
            },
            {
                // type: "legal", // ожидает установленный сертификат
                //inn: "175648530269", // inn - ожижание, что у подписиь такой же инн
                // snils: "000000000" // snils - ожижание, что у подписиь такой же снилс
            }).then(async (result) => { //
                // console.log(result.document.id);
                await dispatch('addIdSignedDownload', {
                    IdDocument: result.document.id,
                    PaymentAccount: RashSchet
                });

                await dispatch('getNewStatusOne', {
                  id: debtor._id,
                  status: 'Подано в суд',
                  debtRaschSchet: debtor.RashSchet
                });
                // записываем в историю
                await dispatch('addHistoryNote', {
                  Names: 'Смена статуса должника',
                  DataTime: new Date(),
                  Status: 'Подано в суд',
                  PaymentAccount: debtor.RashSchet
                });

            }).catch(function (error) {
                console.log("error");
                console.log(error);
                commit('setEPCLoader', { step: 4, value: false })
            });
        },

        /**
        * Добавить ID(PDF) подписанного документа для скачивания
        * @returns {Promise<unknown>}
        */
        addIdSignedDownload ({ commit, state, dispatch, getters }, payload) {
            return $http({
                data: {
                    command: 'AddIdSignedDownload',
                    OrganizationId: 0,
                    IdDocument: payload.IdDocument,
                    PaymentAccount: payload.PaymentAccount,
                }
            }).then(res => {
                if (res.add === 'Complete') {
                    // this.userLogin = this.forgotData;
                } else {
                    console.error('addIdSignedDownload method error')
                }
            }).catch(e => {
                console.error(e, 'sentPinForNewPassword fetch error')
            }).finally(() => {
                // TODO: loader off
            });
        },
        /**
        * Массив id pdf подписанных документа для скачивания
        * @returns {Promise<unknown>}
        */
        getListIdSignedDownload (context, payload) {
            return $http({
                data: {
                    command: 'ListIdSignedDownload',
                }
            }).then(res => {
                if (res.result) {
                    // this.userLogin = this.forgotData;
                } else {
                    console.error('addIdSignedDownload method error')
                }
            }).catch(e => {
                console.error(e, 'sentPinForNewPassword fetch error')
            }).finally(() => {
            });
        },
        /**
        * Удалить все id pdf подписанных документов для скачивания
        * @returns {Promise<unknown>}
        */
        _getListIdSignedDownload ({ commit, state, dispatch }, payload) {
            dispatch('appLoadingChange', true, { root: true });
            return $http({
                data: {
                    command: 'DeleteIdSignedDownload',
                    OrganizationId: 0
                }
            }).then(res => {
                if (res.delete === 'complete') {
                    // this.userLogin = this.forgotData;
                } else {
                    console.error('addIdSignedDownload method error')
                }
            }).catch(e => {
                console.error(e, 'sentPinForNewPassword fetch error')
            }).finally(() => {
                dispatch('appLoadingChange', false, { root: true });
            });
        },
        setEPCLoader({ commit }, payload) {
            commit('setEPCLoader', paylaod);
        },
        /**
         * Image to pdf
         */
        async imageToPDFConverter({ state }, imagebase64) {
            return await documentPDF.generateFromImage(imagebase64);
            // var binary = atob(res.replace(/\s/g, ''))
            // var len = binary.length
            // var buffer = new ArrayBuffer(len)
            // var view = new Uint8Array(buffer)
            // for (var i = 0; i < len; i++) {
            //     view[i] = binary.charCodeAt(i)
            // }

            // var blob = new Blob([view], { type: 'application/pdf' })

            // var url = URL.createObjectURL(blob)
            // setTimeout(() => {
            //     window.open(url, '_blank')
            // }, 1000)
        }
    },
    getters: {
        generatingTemplateProgress: state => {
            return state.generatingTemplateProgress
        },
        mergeTemplateProgress: state => state.mergeTemplateProgress,

        epcStatus: state => state.status,

    }
  }
