<template>
  <div class="ur-input__wrap">
    <div 
      class="ur-input" 
      :class="[ 
        isError ? 'ur-input--is-error' : '',
        isFocused ? 'ur-input--is-focused' : '',
        large ? 'ur-input--large' : '',
        small ? 'ur-input--small' : '',
        outlined ? 'ur-input--outlined' : '',
        dark ? 'ur-input--dark' : ''
      ]">
      <input
        :class="[ 
          large ? 'large' : '' ,
          small ? 'small' : '' ,
        ]"
        v-bind:value="value"
        v-bind="$attrs"
        v-on:input="updateValue($event.target.value)"
        v-mask="mask"
        @keyup="checkForLatinLetters($event)"
        v-on:focus="focusHandler"
        v-on:blur="blurHandler"
      >
    </div>
      <div v-if="$slots['append']" class="ur-input__append">
        <slot name="append"></slot>
      </div>
    <span class="ur-input__hint" v-if="isError && showHint">{{ errors[0] }}</span>
  </div>
</template>

<script>
  export default {
    name: 'ur-input',
    props: {
      // id: {
      //   type: String
      // },
      // label: {
      //   type: String,
      //   required: true
      // },
      latin:{
        type: Boolean,
        required: false
      },
      value: {
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
      large: {
        type: Boolean,
        required: false,
        default: false
      },
      small: {
        type: Boolean,
        required: false,
        default: false
      },
      showHint: {
        type: Boolean,
        required: false,
        default: true
      },
      outlined: {
        type: Boolean,
        required: false,
        default: true
      },
      dark: {
        type: Boolean,
        required: false,
        default: false
      },
      // readOnly: {
      //   type: Boolean,
      //   required: false,
      //   default: false
      // }
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

<style lang="scss">
  .ur-input {
    margin: 0 0 0px 0;
    display: flex;
    height: 40px;
    padding: 2px 12px;
    border-radius: 4px;
    border: none;
    -webkit-transition: all .2s linear;
    transition: all .2s linear;
    overflow: hidden;
    flex-wrap: wrap;

    &__wrap {
      position: relative;
      width: 100%;
    }

    &__hint {
      color: #ff5750 !important;
      font-size: 12px;
      // position: absolute;
      // top: 106%;
    }

    &__append {
      position: absolute;
      right: 8px;
      top: 24%;
      cursor: pointer;
    }

    &--is-error {
      border: 1px solid #ff5750;
      background: rgba(255, 87, 80, 0.1)
    }

    &--is-focused {
      border: 1px solid #4e569f;
    }

    input {
      width: 100%;
      color: #6f788f;
      background-color: transparent;
      font-size: 12px;
      font-weight: 500;
      line-height: 21px;
      border: none;
      outline: none;
      text-overflow: ellipsis;
    }
    input:focus {
      outline: none;
    }

    input.large {
      font-size: 100%;
    }
  }

  .ur-input--large {
    height: 57px;
    .ur-input__append {
      top: 30%;
    }
  }

  .ur-input--small {
    height: 29px;
  }

  .ur-input--outlined {
    border: 1px solid rgba(153, 162, 187, 0.3);
  }

  .ur-input--dark {
    background-color: #DFE3EB;
  }
  .ur-input--dark:focus {
      border: 1px solid #979797;
  }

</style>
