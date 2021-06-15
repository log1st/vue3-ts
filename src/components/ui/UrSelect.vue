<template>
  <div class="search-input"
  >

  <!--       :class="[params.class, { 'is-select' : params.isSelect && !params.readonly, 'is-focused' : focused }]"-->
<!--    <template v-if="params.isSelect" >-->
<!--      <input-->
<!--        :type="params.type ? params.type : 'text'"-->
<!--        :placeholder="params.placeholder ? params.placeholder : 'Search'"-->
<!--        @click="selectOpen = !selectOpen"-->
<!--        v-model="value"-->
<!--        readonly-->
<!--      >-->
<!--      <transition name="fade">-->
<!--        <div v-if="selectOpen"  class="search-input__select">-->
<!--          <baseScrollWrapper v-if="height" :height="height" >-->
<!--            <template v-for="(item, i) in items">-->
<!--              <div class="search-input__select-item" :key="'bla-' + i" @click="value = item; selectOpen = false" v-html="item"></div>-->
<!--            </template>-->
<!--          </baseScrollWrapper>-->
<!--          <template v-else>-->
<!--             <div v-if="value != ''" class="search-input__select-item" :key="'bla-'+selectOpen" @click="value = ''; selectOpen = false" v-html="params.placeholder"></div> -->
<!--            <template v-for="(item, i) in items">-->
<!--              <div class="search-input__select-item" :key="'bla-' + i" @click="value = item; selectOpen = false" v-html="item"></div>-->
<!--            </template>-->
<!--          </template>-->
<!--        </div>-->
<!--      </transition>-->
<!--      <div v-if="!params.readonly" class="search-input__icon" @click="selectOpen = !selectOpen">-->
<!--        <icon-base-->
<!--          width="5"-->
<!--          height="9"-->
<!--          iconColor="#b6bed1"-->
<!--        ><icon-two-triangle />-->
<!--        </icon-base>-->
<!--      </div>-->
<!--    </template>-->
  </div>
</template>

<script>
  import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
  import iconTwoTriangle from '@/components/icons-svg/icons/IconTwoTriangle'
  import iconView from '@/components/icons-svg/icons/IconView'
  export default {
    props: {
      items: {
        type: Array
      },
      height: {
        required: false,
        default: '100px'
      },
    },
    components: {
      iconTwoTriangle,
      iconView,
      baseScrollWrapper
    },
    data () {
      return {
        // focused: false,
        // value: '',
        selectOpen: false,
        // listenerElement: '.search-input__select',
        // listenerValue: 'selectOpen'
      }
    },
    mounted () {
      // if (this.params.value) this.value = this.params.value
      // if (this.params.readonly) {
      //   this.params.placeholder = ''
      //   if (!this.params.value) this.value = ' '
      // }
    },
    methods: {
      onlyNumber (event) {
        var regex = new RegExp('^[0-9]+$')
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode)
        if (!regex.test(key)) {
          event.preventDefault()
          return false
        }
      },
    },
    watch: {
      // value (value) {
      //   this.$emit('changeInputValue', value)
      // },
      // focused (value) {
      //   if (value && this.value === 'нет данных') this.value = ''
      //   this.setNoError()
      // }
    }
  }
</script>
