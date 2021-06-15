<template>
    <div class="switch-button" @click="change" :class="myResult ? 'on' : 'off'">
        <span>{{ myResult ? "onn" : "off" }}</span>
    </div>
</template>

<script>
    export default {
    props: ['value'],
    data () {
        return {
            myResult: this.result
        }
    },
    methods: {
        change() {
            this.$emit('change', $event)
            this.myResult = !this.myResult
        }
    },
    watch: {
        result: function (val) {
            this.myResult = val //
        },
        myResult: function (val) {
            this.$emit('update:my-result', val) 
        }
    }

    }
</script>

<style lang="scss">

.switch-button {
  position: relative;
  width: 300px;
  height: 130px;
  background: linear-gradient(to right, #fd1a15 0, #fc8b34 45%, #7fd03e 55%, #007177 100%) 0 0;
  background-size: 650px 100%;
  border-radius: 70px;
  padding: 7px;
  cursor: pointer;
  box-shadow: 0 0px 10px rgba(0, 0, 0, 0.2) inset;
  margin-bottom: 10px;
  
  span {
    width: 116px;
    height: 116px;
    position: absolute;
    left: 7px;
    top: 7px;
    border-radius: 100%;
    background: #fff;
    text-align: center;
    line-height: 116px;
    font-family: "Cabin", sans-serif;
    font-size: 35px;
    font-weight: bold;
    color: #fd1a15;
    letter-spacing: 3px;
    text-transform: uppercase;
   transition: left 500ms ease, color 500ms ease;
  }
    
  &.off {
    background-position: 0 0; 
  }
  &.on {
    background-position-x: -350px;
    
    span {
      color: #007177;
      left: 177px;
    }
  }
  

}

input[type="button"]  {
  display: inline-block;
  position: relative;
  text-decoration: none;
  font-family: 'Montserrat', arial, sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  width: 11em;
  height: 4.5em;
  box-shadow: 0 3px 5px #282828;
  transition: all 0.6s cubic-bezier(0.37, 0.74, 0.15, 1.65);
  background-color: #fc2161;
  color: #fff;
  text-shadow: 0 1px 1px #b50236;
  border: none 0;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    backround: darken(#fc2161, 10%);
  }
}

</style>
