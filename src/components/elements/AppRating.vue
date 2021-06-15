<template>
  <div class="app-rating">
    <div v-for="i in 5" class="app-rating__star" :key="'ad582' + i">
      <icon-base
        :width="starWidth"
        :height="starHeigth"
        :iconColor="parseInt(rating) >= i ? '#4c5fff' : '#bdc0da'"
        :viewBox="viewBox"
        ><icon-star />
      </icon-base>
    </div>
    <span v-if="hasTextRating" class="app-rating__text d-none d-sm-inline">{{ parseFloat(rating).toFixed(1) + '/5' }}</span>
  </div>
</template>

<script>
export default {
  props: {
    rating: [String, Number],
    starWidth: {
      type: String,
      default: '9'
    },
    starHeigth: {
      type: String,
      default: '8'
    },
    viewBox: {
      type: String
    },
    hasTextRating: {
      type: Boolean,
      default: false
    }
  }
}
</script>
