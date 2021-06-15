<template>
  <div class="home__diagram">
    <div class="home__diagram-outer">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="242" height="242" viewBox="0 0 242 242">
        <defs>
          <filter id="Oval_Copy_4" x="0" y="0" width="242" height="242" filterUnits="userSpaceOnUse">
            <feOffset dy="-1" input="SourceAlpha"/>
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feFlood flood-color="#495cff" flood-opacity="0.478"/>
            <feComposite operator="in" in2="blur"/>
            <feComposite in="SourceGraphic"/>
          </filter>
        </defs>
        <g id="Group_9" data-name="Group 9" transform="translate(20 21)">
          <circle id="Oval" cx="101" cy="101" r="101" fill="none" stroke="#f2f6fc" stroke-miterlimit="10" stroke-width="10"/>
          <g transform="matrix(1, 0, 0, 1, -20, -21)" filter="url(#Oval_Copy_4)">
            <circle id="Oval_Copy_4-2" data-name="Oval Copy 4" cx="101" cy="101" r="101" transform="translate(20 21)" :stroke-dasharray="`${percentData} ${634.8456 - percentData}`" stroke="#495cff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="10" fill="none"/>
            <!-- <circle id="Oval_Copy_4-2" data-name="Oval Copy 4" cx="101" cy="101" r="101" transform="translate(20 21)" stroke-dasharray="315 320" stroke="#495cff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="10" fill="none"/> -->
          </g>
        </g>
      </svg>
    </div>
    <div class="home__diagram-inner">
      <div class="home__diagram-title">
        <span>{{ params.part | sepnum }} Чел.</span>
      </div>
      <div class="home__diagram-subtitle">
        <span>Из {{ params.whole | sepnum }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    params: Object
  },
  data () {
    return {
      percentData: 0
    }
  },
  mounted () {
    const percent = (this.params.part / this.params.whole).toFixed(4) * 100
    this.percentData = 2 * 3.1428 * 101 * percent / 100
  }
}
</script>
