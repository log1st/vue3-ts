<template>
  <div class="chip-container ">
    <div class="chip" v-for="(chip, i) of chips" :key="chip.label">
      {{ chip }}
      <i class="material-icons" @click="deleteChip(i)">clear</i>
    </div>
    <input
      v-model="currentInput"
      @keypress.enter="saveChip"
      @keydown.delete="backspaceDelete"
      @paste="pasteHandler"
      :key="inputKey"
      :placeholder="chips.length == 0 && placeholder || ''"
    >
  </div>
</template>

<script>
  export default {
    data() {
      return {
        chips: [],
        search: '',
        dataPasted: false,
        inputKey: 0
      }
    },
    props: ['placeholder'],
    computed: {
      currentInput: {
        get () {
          return this.search;
        },
        set (value) {
          if(this.dataPasted) {
            const strings = value.split(' ');
            this.chips = [...this.chips, ...strings];
            this.dataPasted = false;
            this.search = '';
            this.inputKey++;
            this.$emit('change', this.chips.join(','));
          } else {
            this.search = value;
          }
        }
      }
    },
    methods: {
      pasteHandler() {
        this.dataPasted = true;
      },
      saveChip() {
        const {chips, search} = this;
        chips.indexOf(search) === -1 && this.search.length > 0 && chips.push(search);
        this.search = '';
        this.$emit('change', this.chips.join(','));
      },
      deleteChip(index) {
        this.chips.splice(index, 1);
      },
      backspaceDelete({ which }) {
        which == 8 && this.search === '' && this.chips.splice(this.chips.length - 1);
      }
    }
  }
</script>

<style lang="scss">
  .chip-container {
    // min-height: 40px;
    padding: 5px 6px;
    border-radius: 4px;
    border: 1px solid rgba(153, 162, 187, 0.3);
    -webkit-transition: border-color .3s linear;
    transition: border-color .3s linear;
    justify-content: center;
    width: 100%;
    min-height: 34px;
    display:flex;
    flex-wrap: wrap;
    align-content: space-between;
    max-height: 2.7em;
    overflow-y: auto;

    .chip {
      margin: 0px 4px;
      background: #01bff5;
      padding:0px 4px;
      border: 1px solid #ccc;
      border-radius: 3px;
      display: flex;
      align-items: center;
      color: #ffffff;
      font-size: 11px;
      i {
        cursor: pointer;
        opacity: .56;
        margin-left:8px;
      }
    }
    input {
      flex: 1 1 auto;
      width: 50%;
      border: none;
      outline: none;
      padding: 4px;
      color: #6f788f;
      font-size: 11px;
      font-weight: 500;
      line-height: 21px;
    }
  }
</style>
