<template>
  <div class="efb">
    <div class="efb__wrapp">
      <div class="efb__name">{{ name }}</div>
      <div class="efb__input" :class="{ 'is-changed' : fileName }" ref="efbInput">
        <label for="efb-input" @click="$refs.efbInputFile.click()" v-bind:class="{ 'disabled' : disabled }">
          <icon-base
            v-if="fileName"
            width="9"
            height="13"
            viewbox="0 0 42 51"
            iconColor="#ffffff"
            ><icon-file />
          </icon-base>
          <span>{{ fileName ? fileName : 'Выберите файл' }}</span>
        </label>
        <input type="file"
               name="efb-input"
               :multiple="false"
               @change="changeFile"
               accept=".csv"
               ref="efbInputFile"
               :disabled="disabled"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExchangeFileButton',
  props: {
    name: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      fileName: null,
      simbols: 11
    }
  },
  mounted () {
    this.simbols = (this.$refs.efbInput.offsetWidth / 10).toFixed(0)
  },
  methods: {
    changeFile () {
      let name = this.$refs.efbInputFile.files[0].name
      if (name.length > this.simbols) name = name.slice(0, this.simbols) + '...'
      this.fileName = name
      this.$emit('fileSelect', this.$refs.efbInputFile.files[0])
      // console.log(this.$refs.efbInputFile.files[0].name)
    }
  }
}
</script>

<style scoped>
  .disabled {
    cursor: default;
    opacity: 0.6;
  }
</style>
