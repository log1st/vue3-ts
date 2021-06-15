<template>
    <popup-wrapper>
        <template v-slot:header>    
          <p class="m-0">Переименование переменной - "{{params.var.name}}"</p>
        </template>
        <div class="popup__status">
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Наименование</span>
                    </div>
                    <div class="compib__input">
                        <div class="search-input" style="height: 100%;" >
                            <input type="text" placeholder="Введите наименование переменной" v-model="variable.name">
                        </div>
                    </div>
                </div>
                <div class="compib__row">
                    <div class="compib__row-label">
                        <span>Описание</span>
                    </div>
                    <div class="compib__input">
                        <div class="search-input" style="height: 100%;" >
                            <input type="text" placeholder="Введите описание переменной" v-model="variable.description">
                        </div>
                    </div>
                </div>
                <div class="popup__status-button">
                  <ur-btn
                      class="btn btn-primary"
                      :loading="loading"
                      @click="submitEdit"
                      :disabled="disabled"
                  >
                      <span>Сохранить</span>
                  </ur-btn>
                </div>
        </div>
    </popup-wrapper>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    props: {
        params:{
            type: Object
        }
    },

    data () {
        return {
            variable: {
                name: undefined,
                description: undefined
            },

            loading: false,
            disabled: false
        }
    },
    
    created () {
        this.variable.name = this.params.var.name
        this.variable.description = this.params.var.name
    },

    methods: {
        ...mapActions(['editVariable', 'getEditorVars']),

        validation () {
            return new Promise ((resolve, reject) =>{
                if (this.variable.name === '' || typeof this.variable.name === 'undefined') {
                    this.$toast.open({
                         message: `Поле наименование не должно быть пустым`,
                        type: 'warning',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                    reject(false)
                } else if (this.variable.description === '' || typeof this.variable.description === 'undefined') {
                    this.$toast.open({
                         message: `Поле описание не должно быть пустым`,
                        type: 'warning',
                        duration: 5000,
                        dismissible: true,
                        position: 'top-right'
                    })
                    reject(false)
                } else {
                    resolve(true)
                }
            })
        },

        submitEdit () {
            this.loading = true
            this.disabled = true
            let data = {
                name: this.variable.name,
                description: this.variable.description
            }
            this.validation()
            .then( result => {
                if (result) {
                    this.editVariable({item: data, id: this.params.var.id})
                    .then( res => {
                        this.reloadData(this.params.docType)
                        this.loading = false
                        this.disabled = false
                    })
                }
            })
            
        },

        reloadData(e){
          let docModule;
          switch (e) {
            case 'Досудебное производство':
              docModule = 'pretrial'
              break;
            case 'Судебное производство':
              docModule = 'juridical'
              break;
            case 'Исполнительное производство':
              docModule = 'executive'
              break;
          }
          this.getEditorVars(docModule)
        },

    }
}
</script>