<template>
        <div class="main-container__row mt-20">
            <div class="main-container__col-12" style="width: 100%" :key="'asdasd12'">
                <div class="efb" style="width: 100%">
                    <div class="efb__wrapp" style="width: 100%">
                      <!-- <div class="efb__name">{{ name }}</div> -->
                      <div class="efb__input" style="width: 100%" :class="{ 'is-changed' : fileArray.fileName }" ref="efbInput">
                        <label class="download__just" :for="'efb-input-01'" 
                        @change="changeFile($event, true)"
                        v-bind:class="{ 'disabled' : false }">
                          <icon-base
                            v-if="fileArray.fileName"
                            width="9"
                            height="13"
                            viewbox="0 0 42 51"
                            iconColor="#ffffff"
                            ><icon-file />
                          </icon-base>
                          <span>{{ fileArray.fileName ? fileArray.fileName : 'Выберите файл' }}</span>
                          <input type="file"
                               name="efb-input"
                               :multiple="false"
                               accept=".csv, .xls, .xlsx"
                               id="efb-input-01"
                        >
                        </label>
                        
                      </div>
                    </div>
                  </div>
            </div>
          </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex' 

export default {
    data () {
        return {
            simbols: 11,
            fileArray: {   
                        fileName: '',
                        file: null
                      } 
        }
    },
    methods: {
        ...mapActions(['appLoadingChange', 'getLinearFile', 'setPopupComponent', 'importDebtors', 'toBase64']),
        validationLinearForm ( payload ) {
          console.log(payload)
          return new Promise ((resolve, reject) => {
             if (!this.selectedRegion) {
                this.setPopupComponent({ component: 'popupAlert', params: { title: 'Загрузка невозможна', text: 'Выберите регион' } })
                reject({status: false, id: 1})
              } else if (!this.fileArray.file) {
                  this.setPopupComponent({ component: 'popupAlert', params: { title: 'Загрузка невозможна', text: 'Загрузите файл' } })
                  reject({status: false, id: 2})
                // } else {
                //   resolve({status: true})
                // }
              }
               else {
                resolve({status: true})
              }
          })
        },
        clearFile () {
          this.fileArray.file = null
          this.fileArray.fileName = ''
        },
      /**
      * Формирует файл для его дальнейшего использования
      * @param {Object} e target инпута загрузки данных
      */
     async changeFile (e) {
        let name = e.target.files[0].name;
        if (name.length > this.simbols) name = name.slice(0, this.simbols) + '...'
            this.fileArray.fileName = name
            this.fileArray.file = await this.toBase64(e.target.files[0])
      },
      /**
       * Загрузка документа
       */
       uploadFileLinear ( payload ) {
        this.validationLinearForm(payload)
        .then (result => {
          if (result.status) {
            // this.fileArray.file = e.target.files[0] ? await this.toBase64(e.target.files[0]) : this.fileArray.file
            let defaultCompany = localStorage.getItem('defaultCompany')
            let companyId = typeof this.$store.state.companies.exchangedCompany != 'undefined' ? this.$store.state.companies.exchangedCompany.id : defaultCompany
            let data = {
              name: this.fileArray.fileName,
              file: this.fileArray.file,
              mode: 'linear',
              module: parseInt(this.$route.query.action) + 1,
              last: true,
              company: parseInt(companyId),
            }
            this.importDebtors (data)
            .then( result => {
              if (result.status) {
                  this.clearFile()
              } 
            })
            .catch( error => {
              console.log(error.msg)
              this.clearFile()
            })
          }
        }) 
        .catch ( err => {
          console.log(err)
        })
      },
    },
    computed: {
      ...mapGetters([
      'regionsList',
      'selectedRegion'
    ]),
    },
    mounted () {
      events.$on('load_doc_linear', (s) => {
        this.uploadFileLinear(false)
      })

      events.$on('clear_linear_file', () => {
        this.clearFile()
      })
    }
}
</script>
<style lang="scss">
  .upload__label-linear {
    width: 100%;
    height: 400px;
  }
</style>