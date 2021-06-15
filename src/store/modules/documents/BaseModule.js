const JSZip = require("jszip");
// import JSZip from 'jszip'
const zip = new JSZip();
import qs from 'qs'
import { URL as baseUrl } from '@/settings/config'

// export default class BaseModule {

    // constructor() {
        // this.state = {};
        // this.mutations = {};
        const actions = {
            /**
             * Open document in new tab
             * @param {String} - blob
             * @return {Promise}
             */
            openDocument(state, blob) {
                return new Promise((resolve) => {
                    const url = URL.createObjectURL(blob);
                    setTimeout(() => {
                        window.open(url, '_blank')
                        resolve("document was opened");
                    }, 1000)
                });
            },
            /**
             * Download document
             * @param {Object} - { name: String; blob: Blob } 
             * @return {Promise} 
             */
            downloadDocument(state, { name = 'document.pdf', blob }) {
                return new Promise((resolve) => {
                    const a = document.createElement("a");
                    a.download = name;
                    a.href = URL.createObjectURL(blob);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    resolve('document was downloaded');
                })
            },
            /**
             * Create document zip archive and downoad it
             * @param {Object} - { name: String; blob: Blob } 
             */
            zipAndDownloadDocument(state, { name = 'document.zip', blob }) {
                zip.file(name, blob);
                zip.generateAsync({ type: "blob" }).then(function (content) {
                    saveAs(content, name);
                    return content
                });
            },
            /**
             * Generate document base64 string to blob
             * @param {String} - base64 string
             * @return {blob} 
             */
            generateDocumentBlob(state, str) {
                let binary = atob(str.replace(/\s/g, ''))
                let len = binary.length
                let buffer = new ArrayBuffer(len)
                let view = new Uint8Array(buffer)
                for (let i = 0; i < len; i++) {
                    view[i] = binary.charCodeAt(i)
                }
                return new Blob([view], { type: 'application/pdf' })
            },
            /**
             * Заменяет символ "=" на "*"
             * @param {String} - base64 string
             * @return {String} - base64 string
             */
            prepareBase64(state, str) {
                return str.replace(/=/g, "*");
            },
            /**
             * Возвращает тело строки base64
             * @param {String} str 
             */
            getBase64StringBody(state, str) {
                debugger
                return str.split(',')[1];
            },
            /**
             * Печать документов
             */
            mergePdf (state, arrowstPdf) {
                return $http({
                    data: {
                        command: 'MergePdfFull2',
                        arrowstPdf: JSON.stringify(arrowstPdf),
                        removeMarker: 1
                    }
                })
            },
            /**
             * Подписать документ
             * @param {} param0
             * @param {*} payload
             */
            signDocument({ dispatch }, payload) {
                let { template, rashSchet } = payload;
                debugger
                // template = template.replace(/\*/g, "=")
                return paradocsWidget.sign({
                    content: template, //
                    name: rashSchet, //
                    ext: "pdf"
                },
                {
                    // type: "legal", // ожидает установленный сертификат
                    //inn: "175648530269", // inn - ожижание, что у подписиь такой же инн
                    // snils: "000000000" // snils - ожижание, что у подписиь такой же снилс
                }).then(async (result) => { //
                    console.log('ответ после подписи', result, result.document.id);
                    // debugger
                    await dispatch('addIdSignedDownload', {
                        IdDocument: result.document.id,
                        PaymentAccount: rashSchet
                    });
                }).catch(function (error) {
                    console.log("sign document error", error);
                });
            },

        }
        // this.getters = {};
    // }

// }

export {
    actions
}