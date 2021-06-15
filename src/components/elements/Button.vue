<template>
  <component
      :is="to ? 'router-link' : 'button'"
      :to="to"
      v-bind="$attrs"
      @mousedown.prevent
      @click="(loading || disabled) ? null : $emit('click', $event)"
      :class="{ 'is-disabled' : disabled }"
  >
    <slot v-if="loading" name="loader">
      <!-- <div class="ur-btn-loader-default">
        <div class="lds-ring">
          <div></div><div></div><div></div><div></div>
        </div>
      </div> -->
      <div class="ur-btn">
      <span class="ur-btn--loader">
        <div role="progressbar" aria-valuemin="0" aria-valuemax="100" class="ur-btn-progress-circular ur-btn-progress-circular--indeterminate" style="height: 23px; width: 23px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="21.904761904761905 21.904761904761905 43.80952380952381 43.80952380952381" style="transform: rotate(0deg);">
          <circle fill="transparent" cx="43.80952380952381" cy="43.80952380952381" r="20" stroke-width="3.8095238095238093" stroke-dasharray="125.664" stroke-dashoffset="125.66370614359172px" class="ur-btn-progress-circular__overlay">
            </circle>
          </svg>
            <div class="ur-btn-progress-circular__info">
            </div>
        </div>
      </span>
      </div>
    </slot>
    <slot v-else></slot>
  </component>
</template>

<script>
import { VNode } from 'vue'

export default {
  name: 'ur-btn',
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    to: {
      type: [Object, String],
      required: false,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      required: false,
      default: false
    },
    rounded: {
      type:Boolean,
      required: false,
      default: false
    }
  },
}
</script>
<style lang="scss">
  .lds-ring {
    display: inline-block;
    position: relative;
    width: 50px;
    height: 50px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 8px;
    border: 4px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  .ur-btn--round {
  border-radius: 50%;
}

.ur-btn--rounded {
  border-radius: 28px;
}

.ur-btn--tile {
  border-radius: 0;
}
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .ur-btn-progress-circular {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
}
.ur-btn--block {
  display: flex;
  flex: 1 0 auto;
  min-width: 100% !important;
  max-width: auto;
}
.ur-btn-progress-circular > svg {
  width: 100%;
  height: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}
.ur-btn-progress-circular--indeterminate > svg {
  -webkit-animation: progress-circular-rotate 1.4s linear infinite;
          animation: progress-circular-rotate 1.4s linear infinite;
  transform-origin: center center;
  transition: all 0.2s ease-in-out;
}
.ur-btn-progress-circular--indeterminate .ur-btn-progress-circular__overlay {
  -webkit-animation: progress-circular-dash 1.4s ease-in-out infinite;
          animation: progress-circular-dash 1.4s ease-in-out infinite;
  stroke-linecap: round;
  stroke-dasharray: 80, 200;
  stroke-dashoffset: 0px;
}
.ur-btn-progress-circular__info {
  align-items: center;
  display: flex;
  justify-content: center;
}
.ur-btn-progress-circular__underlay {
  stroke: rgba(0, 0, 0, 0.1);
  z-index: 1;
}
.ur-btn-progress-circular__overlay {
  stroke: currentColor;
  z-index: 2;
  transition: all 0.6s ease-in-out;
}
.ur-btn {
  align-items: center;
  border-radius: 4px;
  width: 100%;
  min-width: 165px;
  display: inline-flex;
  flex: 0 0 auto;
  font-weight: 500;
  letter-spacing: 0.0892857143em;
  justify-content: center;
  outline: 0;
  position: relative;
  text-decoration: none;
  text-indent: 0.0892857143em;
  text-transform: uppercase;
  transition-duration: 0.28s;
  transition-property: box-shadow, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}
.ur-btn--loader {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
@-webkit-keyframes progress-circular-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0px;
  }
  50% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -15px;
  }
  100% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -125px;
  }
}

@keyframes progress-circular-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0px;
  }
  50% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -15px;
  }
  100% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -125px;
  }
}
@-webkit-keyframes progress-circular-rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes progress-circular-rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
