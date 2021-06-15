<template>
  <div class="search-input" :class="[params.class, { 'is-select' : params.isSelect && !params.readonly, 'is-focused' : focused, 'select-opened': selectOpen }]">
    <!-- select -->
    <template v-if="params.isSelect" >
      <input :type="params.type ? params.type : 'text'"
        :name="params.name ? params.name : getRandomName()"
        :placeholder="params.placeholder ? params.placeholder : 'Search'"
        @click="selectOpen = !selectOpen; setNoError()"
        v-model="value"
        readonly
      >
      <transition name="fade">
        <div v-if="!params.readonly && selectOpen" class="search-input__select">
          <baseScrollWrapper v-if="params.height" :height="params.height" >
            <template v-for="(item, i) in params.items">
              <div v-if="!item.Id" class="search-input__select-item" :key="'bla-' + i" @click="value = item; selectOpen = false" v-html="item"></div>
              <div v-if="item.Id" class="search-input__select-item" :key="'bla-' + i" @click="value = item.Name; selectOpen = false; id = item.Id" v-html="item.Name"></div>
            </template>
          </baseScrollWrapper>
          <template v-else>
            <!-- <div v-if="value != ''" class="search-input__select-item" :key="'bla-'+selectOpen" @click="value = ''; selectOpen = false" v-html="params.placeholder"></div> -->
            <template v-for="(item, i) in params.items">
              <div v-if="!item.Id" class="search-input__select-item" :key="'bla-' + i" @click="value = item; selectOpen = false" v-html="item"></div>
              <div v-if="item.Id"  class="search-input__select-item" :key="'bla-' + i" @click="value = item.Name; selectOpen = false; id = item.Id" v-on:click="templateChange(item)" v-html="item.Name"></div>
            </template>
          </template>
        </div>
      </transition>
      <div v-if="!params.readonly" class="search-input__icon" @click="selectOpen = !selectOpen">
        <icon-base
          width="5"
          height="9"
          iconColor="#b6bed1"
          ><icon-two-triangle />
        </icon-base>
      </div>
    </template>
    <!-- label -->
    <template v-else-if="params.label">
      <div class="search-input--label">
        <label v-if="params.label" for="a1" v-html="params.label"></label>
        <div>
          <input
            :type="params.type ? params.type : 'text'"
            :name="params.name ? params.name : getRandomName()"
            v-model="value"
            @focus="!params.readonly ? focused = true : null"
            @blur="focused = false"
            @keypress="params.onlynumber ? onlyNumber($event) : null"
            :readonly="params.readonly"
          >
        </div>
      </div>
    </template>
    <input v-else
      :type="params.type ? params.type : 'text'"
      :name="params.name ? params.name : getRandomName()"
      :placeholder="params.placeholder ? params.placeholder : ''"
      v-model="value"
      @focus="!params.readonly ? focused = true : null; $emit('focused')"
      @blur="focused = false; $emit('blur')"
      @keypress="params.onlynumber ? onlyNumber($event) : null"
      :readonly="params.readonly"
    >
    <div v-if="params.view" class="search-input__view-icon" @mouseenter="params.type = 'text'" @mouseleave="params.type = 'password'">
      <icon-base
        width="14"
        height="10"
        iconColor="#495cff"
        ><icon-view />
      </icon-base>
    </div>
  </div>
</template>

<script>
import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
import iconTwoTriangle from '@/components/icons-svg/icons/IconTwoTriangle'
import iconView from '@/components/icons-svg/icons/IconView'
import { listener } from '@/mixins/listener'
export default {
  props: {
    params: Object
  },
  components: { iconTwoTriangle, iconView, baseScrollWrapper },
  mixins: [listener],
  data () {
    return {
      focused: false,
      value: '',
      id: null,
      selectOpen: false,
      listenerElement: '.search-input__select',
      listenerValue: 'selectOpen'
    }
  },
  mounted () {
    if (this.params.value) {
      this.value = this.params.value  
    } 
    if (this.params.readonly) {
      this.params.placeholder = ''
      if (!this.params.value) this.value = ' '
    }
      events.$on('newvaluepeni', (data) => {
        if(this.params.type == 'peni'){
          this.value = data.peni
        }
      })
      
      
  },
  methods: {
    templateChange(data){
      events.$emit('templateid', {
        type: data.DocumentType,
        id: this.id
      })
    },
    onlyNumber (event) {
      var regex = new RegExp('^[0-9]+$')
      var key = String.fromCharCode(!event.charCode ? event.which : event.charCode)
      if (!regex.test(key)) {
        event.preventDefault()
        return false
      }
    },
    setNoError () {
      if (this.params.class === 'is-error') {
        this.params.class = ''
        this.$emit('noerror', true)
      }
    },
    getRandomName () {
      return 'inputname' + Math.floor(Math.random() * 10000)
    }
  },
  watch: {
    value (value) {
      this.$emit('changeInputValue', value)
    },
    focused (value) {
      if (value && this.value === 'нет данных') this.value = ''
      this.setNoError()
    }
  }
}
</script>
