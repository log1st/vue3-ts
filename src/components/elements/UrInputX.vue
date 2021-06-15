<template>
    <div class="form-group">
        <input 
        class="custom-input"
        :class="[elClass,
        isError ? 'error' : '',
        ]"
        :id="elId" 
        :placeholder="elPlaceholder"
        v-bind:value="value"
        v-bind="$attrs"
        v-on:input="updateValue($event.target.value)"
        v-mask="mask"
        @keyup="checkForLatinLetters($event)"
        v-on:focus="focusHandler"
        v-on:blur="blurHandler">
        <span class="error-text" v-if="isError && showHint" >{{ errors[0] }}</span>
        <span class="error-text empty" v-else></span>
        <!-- <div > -->
            <slot v-if="$slots['append']" name="append"></slot>
        <!-- </div> -->
    </div>
</template>
<script>
export default {
    name: 'ur-input-x',
    props:{
        value: {
            type: String,
            required: false
        },
        latin:{
            type: Boolean,
            required: false
        },
        elClass: {
            type: String
        },
        elId: {
            required: false,
            type: String
        },
        showHint: {
            type: Boolean,
            required: false,
            default: true
        },
        elPlaceholder: {
            type: String,
            required: false
        },
        required: {
            type: Boolean,
            default: false
        },
        mask: {
          type: null,
          required: false,
          default: ''
        },
        rules: {
          type: Array,
          required: false,
          default: () => {
            return []
          }
        },
    },
    data() {
      return {
        // isError: false,
        isFocused: false,
        errors: []
      }
    },
    computed: {
      isError() {
        return this.errors.length > 0
      }
    },
    methods: {
      updateValue: function (value) {
        // this.validateField();
        // console.log(value)
        if (value !== undefined || typeof value !== 'undefined') this.$emit('input', value)
      },
      validateField () {
        this.errors = this.rules.length > 0 && this.rules.map(r => r(this.value)).filter(r => r !== true) || [] || '';
        // console.log(this.errors);
      },
      focusHandler () {
        this.isFocused = true;
        this.errors = [];
      },
      blurHandler () {
        this.isFocused = false;
        this.validateField();
        this.$emit('blur');
      },
      checkForLatinLetters(e){
            if(this.latin == true){
                    this.value = this.value.replace(/[а-яА-Я]/g, '');
            }    
        },
    },
}
</script>