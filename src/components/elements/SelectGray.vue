<template>
  <div class="select-gray" :class="[className, { 'is-error': error }]"  v-click-outside="hide" >
    <div class="select-gray__head" :class="{ 'is-open' : isOpen }" @click="handleClick">
      <div v-if="$slots['icon-' + current]" class="select-gray__head-icon">
        <slot :name="'icon-' + current"></slot>
      </div>
      <input class="select-gray__input" v-if="autocomplete" type="text" v-model="search" @focus="clearFilter" @input="filter" @blur="setDefault" ref="input-autocomplete">
      <span  v-else v-html="items[current]" ref="input"></span>

      <div v-if="error" class="select-gray__error">
        <span>{{ errorMessages[0] }}</span>
      </div>
    </div>
    <transition name="fade">
      <div v-if="isOpen && !disabled" class="select-gray__body" :class="{'select-gray__body--scrollable': scrollable }">
        <template v-for="(item, i) in filteredItems">
          <!-- <div v-if="current != i" -->
          <div
            class="select-gray__item"
            @click="handler({ $event, i })"
            :key="'slct2' + i"
          >
            <div v-if="$slots['icon-' + i]" class="select-gray__item-icon">
              <slot :name="'icon-' + i"></slot>
            </div>
            <span>{{ item }}</span>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import { listener } from '@/mixins/listener';
import ClickOutside from 'vue-click-outside';
import findIndex    from 'lodash/findIndex';
export default {
  directives: {
    ClickOutside
  },
  props: {
    items: Array,
    className: {
      type: String,
      required: false
    },
    scrollable: {
      type: Boolean,
      required: false,
      default: false
    },
    currentData:{
      required: false,
      type: String
    },
    value: {
      required: false
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    disabled:{
      type: Boolean,
      required: false,
      default: false
    },
    error: {
      type: Boolean,
      required: false,
      default: false
    },
    errorMessages: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    autocomplete: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mixins: [listener],
  methods: {
    hide () {

      this.isOpen = false;
    },
    handleClick () {
      if(this.$refs && this.$refs['input']) {
        // this.$refs['input'].click();
        this.isOpen = !this.isOpen
      } else if(this.$refs && this.$refs['input-autocomplete']) {
        this.$refs['input-autocomplete'].focus();
      }
    },
    handler ({ $event, i }) {
      this.isOpen = false;
      this.current = i;
      this.$emit('changeDataTo', $event.target.innerText);
      this.$emit('input', $event.target.innerText);
      this.search = this.filteredItems[this.current];
    },
    filter() {
      this.isOpen = true;
      this.filteredItems = this.items.filter(string => string.toUpperCase().includes(this.search.toUpperCase()));
    },
    setDefault() {
      this.search = this.filteredItems.find(i => i === this.search) || this.items[this.current] ;
    },
    clearFilter() {
      this.isOpen = !this.isOpen;
      this.filteredItems = this.items;
    },
    currentRegion () {
      if (this.currentData) {
        this.search = this.currentData
        let currentId = this.filteredItems.findIndex(e => e == this.currentData)
        this.current = currentId
      }
    }
  },
  watch: {
    items: {
      immediate: true,
      handler(val) {
        this.filteredItems = val;
        this.search = val[0]
      }
    },
    disabled: {
      immediate: true,
      handler(val) {
        // console.log(val)
      }
    }
  },
  mounted () {
    if (this.currentData != '') {
        this.search = this.currentData
      this.$nextTick(this.currentRegion()) // В админки все работает ок, а вот у пользователя получается херня поэтому вызываем два раза
    }
  },
  data () {
    return {
      current: 0,
      filteredItems: [],
      search: '',
      isOpen: false,
      listenerElement: '.select-gray',
      listenerValue: 'isOpen'
    }
  }
}
</script>
