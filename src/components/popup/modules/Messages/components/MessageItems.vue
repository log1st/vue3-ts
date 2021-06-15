<template>
    <ul class="popup__messages-items">
      <li v-for="(item, i) in items" class="popup__messages-item" :class="{ 'is-new' : !item.read }" :key="'pppmsg' + i">
          <div class="popup__messages-item_icon" :style="{ backgroundImage: 'url(' + img + ')' }"></div>
            <div class="popup__messages-item_content">
            
            <template v-if="messagesType === 'email'">
              <div class="popup__messages-item_sender" v-html="item.sender"></div>
              <div class="popup__messages-item_title" v-html="item.title"></div>
            </template>
            <template v-esle-if="messagesType === 'message'">
              <div class="popup__messages-item_message" v-html="item.message"></div>
            </template>
          
          </div>
          <div class="popup__messages-item_time">
            <span v-html="$options.filters.formatdate(item.time)"></span>
          </div>
      </li>
    </ul>
</template>

<script>
export default {
  name: 'MessageItems',
  props: {
    items: {
      type: Array,
      required: true
    },
    messagesType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      img: './assets/images/urrobot-default.png'
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>
