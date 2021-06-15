<template>
  <ul class="pag">
    <li class="pag__prev" :class="{ active : current >= 2 }" @click="current = 1"></li>
    <li class="pag__prev-one" :class="{ active : current >= 2 }" @click="current--"></li>
    <template v-if="pages <= 6">
      <li v-for="i in pages"
        :class="{ 'pag__current' : i == current }"
        @click="current = i"
        :key="'pag' + i"
      >
        {{ i }}
      </li>
    </template>
    <template v-else>
      <li v-if="current > 2" :class="{ 'pag__current' : 1 == current }" @click="current = 1" >1</li>
      <li v-if="current >= 4">...</li>
      <template v-for="i in pages">
        <li v-if="i === current - 1 || i === current || i === current + 1"
          :class="{ 'pag__current' : i == current }"
          @click="current = i"
          :key="'pag' + i"
        >
          {{ i }}
        </li>
      </template>
      <li v-if="current < pages - 2">...</li>
      <li v-if="current < pages - 1" :class="{ 'pag__current' : pages == current }" @click="current = pages" >{{ pages }}</li>
    </template>

    <li class="pag__next-one" :class="{ active : current <= pages - 1 }" @click="current++"></li>
    <li class="pag__next" :class="{ active : current <= pages - 1 }" @click="current = pages"></li>
  </ul>
</template>

<script>
export default {
  props: {
    pages: {
      type: Number,
      default: 3
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      current: 1
    }
  },
  mounted () {

  },
  watch: {
    currentPage (val) {
      this.current = val;
    },
    current (val) {
      this.$emit('changeCurrentPage', val)
    }
  }
}
</script>
