<template>
  <div class="status-label" :class="{ 'status-label--error' : !status }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    status: Boolean
  }
}
</script>
