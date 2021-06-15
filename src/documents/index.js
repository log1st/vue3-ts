import pdfMake       from "pdfmake/build/pdfmake";
import htmlToPdfmake from "html-to-pdfmake";
import pdfFonts      from "./fonts/custom-fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  TimesNewRoman: {
    normal: 'times.ttf',
    bold: 'timesbd.ttf',
    italics: 'timesi.ttf',
    bolditalics: 'timesbi.ttf'
  }
};

export default class DocumentPDF {
    constructor(params) {
        this.docDefinition = {
            content: [],
            pageBreakBefore: function (currentNode) {
                // we add a page break before TABLE with the classname "pdf-pagebreak-before"
                return currentNode.table && currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1
            },
            defaultStyle: { font: 'TimesNewRoman' },
            pageMargins: [ 40, 14, 30, 12 ],
            pageOrientation: 'portrait'
        };
        this.pdf = null;
        this.resultingTemplate = '';
    }

    async generate(template, documentName, tableAutoSize = { tableAutoSize: false }, pageOrientation = 'portrait') {
        //console.log('template in documents.js', template);
        this.docDefinition.content[0] = htmlToPdfmake(template, tableAutoSize);
        this.docDefinition.info = {
            title: documentName || 'document',
            author: 'urrobot',
            subject: 'subject of document',
            keywords: 'keywords for document',
        }
        this.docDefinition.pageOrientation = pageOrientation;
        const pdfDocGenerator = pdfMake.createPdf(this.docDefinition);
        // const getBase64 = (data) => ({ data });
        return new Promise((resolve, reject) => {
          pdfDocGenerator.getBase64(data => {
            resolve(data);
          });
        });
    }

    async generateFromImage(imageBase64, documentName, tableAutoSize = { tableAutoSize: false }, pageOrientation = 'portrait') {
        //console.log('template in documents.js', template);
        this.docDefinition.content[0] = {
            // image: 'data:image/jpeg;base64,' + imageBase64
            image: imageBase64,
            width: 500,
        }
        this.docDefinition.info = {
            title: documentName || 'document',
            author: 'urrobot',
            subject: 'subject of document',
            keywords: 'keywords for document',
        }
        this.docDefinition.pageOrientation = pageOrientation;
        const pdfDocGenerator = pdfMake.createPdf(this.docDefinition);
        // const getBase64 = (data) => ({ data });
        return new Promise((resolve, reject) => {
          pdfDocGenerator.getBase64(data => {
            resolve(data);
          });
        });
    }

    generateFromArray (templates) {
        templates.forEach(t => {
            this.resultingTemplate += t;
        });
        this.docDefinition.content[0] = htmlToPdfmake(this.resultingTemplate);
        pdfMake.createPdf(this.docDefinition).open();
        //console.log('generateFromArray');
        return this;
    }

    openPDF() {
        // pdfMake.createPdf(this.docDefinition).open();
    }

// .open();  // pdfMake.createPdf(docDefinition).open();

// const pdfDocGenerator = pdfMake.createPdf(docDefinition);
// // const getBase64 = (data) => ({ data });
// return new Promise((resolve, reject) => {
//   pdfDocGenerator.getBase64(data => {
//     resolve(data);
//   });
// });

}









