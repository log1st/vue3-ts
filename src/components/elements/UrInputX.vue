<template>
    <div class="form-group">
        <input
        class="custom-input"
        :class="[elClass,
        isError ? 'error' : '',
        ]"
        :id="elId"
        :type="type"
        :placeholder="elPlaceholder"
        v-bind:value="value"
        v-bind="$attrs"
        v-on:input="updateValue($event.target.value)"
        v-mask="mask"
        @keyup="checkForLatinLetters($event)"
        v-on:focus="focusHandler"
        v-on:blur="blurHandler">
        <span class="error-text" v-if="isError && showHint" >{{ error || errors[0] }}</span>
        <span class="error-text empty" v-else></span>
        <!-- <div > -->
            <slot name="append"></slot>
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
      type: {
        type: String,
        default: 'text',
      },
      error: {
        type: String,
      }
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
        return (this.error || (this.errors.length > 0))
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
.custom-input {
  font-weight: 500;
  font-size: 12px;
  outline: none;
  color: #828282;
  background-color: transparent;
  padding: 10px;
  width: 100%;
  border-width: 0 0 1px 0;
  border-color: #bdbdbd;
  border-style: solid;
  &.error {
    border-color: #ff7d7d;
  }
}
.error-text {
  font-weight: 500;
  color: #ff7d7d;
  text-align: left;
  display: block;
  padding: 3px 10px 0;
  &.empty {
    height: 17px;
  }
}
.checkbox-custom {
  &__input {
    display: none;
    &:checked {
      + .checkbox-custom__label::before {
        transform: scale(1);
      }
      + .checkbox-custom__label::after {
        background-color: #cbd0e7;
      }
    }
  }
  &__label {
    position: relative;
    padding-left: 25px;
    color: var(--text-color);
    a {
      color: inherit;
      text-decoration: underline;
    }
    &::after,
    &::before {
      content: "";
      position: absolute;
    }
    &::after {
      top: 0;
      left: 0;
      width: 15px;
      height: 15px;
      border-radius: 3px;
      background-color: #d2d2d2;
      transition: background-color 0.1s linear;
      cursor: pointer;
    }
    &::before {
      width: 9px;
      height: 9px;
      border-radius: 9px;
      background-color: #21317a;
      top: 3px;
      left: 3px;
      z-index: 2;
      transform: scale(0);
      transition: transform 0.19s linear;
    }
  }
}
</style>
