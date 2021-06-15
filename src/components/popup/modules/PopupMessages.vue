<template>
  <popupWrapper title="Сообщения">
    <div class="popup__messages">
      <baseScrollWrapper :height="'329px'">
        <ul class="popup__messages-items">
          <template v-if="messagesType == 'email'" >
            <li v-for="(item, i) in getEmails" class="popup__messages-item" :class="{ 'is-new' : !item.read }" :key="'pppmsg' + i">
              <div class="popup__messages-item_icon" :style="{ backgroundImage: 'url(' + img + ')' }"></div>
              <div class="popup__messages-item_content">
                <div class="popup__messages-item_sender" v-html="item.sender"></div>
                <div class="popup__messages-item_title" v-html="item.title"></div>
              </div>
              <div class="popup__messages-item_time">
                <span v-html="$options.filters.formatdate(item.time)"></span>
              </div>
            </li>
          </template>
          <template v-if="messagesType == 'message'" >
            <li v-for="(item, i) in getMessages" class="popup__messages-item" :class="{ 'is-new' : !item.read }" :key="'pppmsg7' + i">
              <div class="popup__messages-item_icon" :style="{ backgroundImage: 'url(' + img + ')' }"></div>
              <div class="popup__messages-item_content">
                <div class="popup__messages-item_message" v-html="item.message"></div>
              </div>
              <div class="popup__messages-item_time">
                <span v-html="$options.filters.formatdate(item.time)"></span>
              </div>
            </li>
          </template>
        </ul>
      </baseScrollWrapper>
      <div class="popup__messages-btn">
        <a href="javascript:void(0);" @click="readAllMessages(messagesType)">
          <span>Прочитать все сообщения</span>
        </a>
      </div>
      <div class="popup__messages-btn">
        <a href="javascript:void(0);" @click="removeAllMessages(messagesType)">
          <span>Удалить все сообщения</span>
        </a>
      </div>
    </div>
  </popupWrapper>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import popupWrapper from '@/components/popup/modules/PopupWrapper'
import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'
export default {
  components: { popupWrapper, baseScrollWrapper },
  data () {
    return {
      img: './assets/images/urrobot-default.png'
    }
  },
  methods: {
    ...mapActions(['removeAllMessages', 'readAllMessages'])
  },
  computed: {
    ...mapGetters(['getEmails', 'getMessages', 'getPopupComponent']),
    messagesType () {
      return this.getPopupComponent.type
    }
  }
}
</script>
