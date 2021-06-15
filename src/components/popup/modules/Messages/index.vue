<template>
  <popup-wrapper>

    <template v-slot:header>
        <div class="d-data__header row align-items-center justify-content-between no-gutters">
            <p class="m-0 col-xs-12 d-data__header-title">Сообщения</p>
        </div>
    </template>

    <template>
    <div class="popup__messages">
      <!-- <baseScrollWrapper :height="'329px'"> -->
       <message-items :items="items" :messagesType="messagesType" />
      <!-- </baseScrollWrapper> -->
      <!-- <div class="popup__messages-btn">
        <a href="javascript:void(0);" @click="readAllMessages(messagesType)">
          <span>Прочитать все сообщения</span>
        </a>
      </div> -->
      <div class="popup__messages-btn">
        <a href="javascript:void(0);" @click="removeAllMessages(messagesType)">
          <span>Удалить все сообщения</span>
        </a>
      </div>
    </div>
    </template>
  </popup-wrapper>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// inner components
import MessageItems from './components/MessageItems';

import baseScrollWrapper from '@/components/elements/BaseScrollWrapper'

export default {
    components: { 
        baseScrollWrapper,
        'message-items': MessageItems
    },
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
        },
        items() {
            if(this.messagesType === 'email') {
              return this.getEmails;
            } else if (this.messagesType === 'message') {
              return this.getMessages;
            }
        }
    }
}
</script>
