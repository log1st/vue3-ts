<template>
  <header class="header">
    <div class="header__info">
      <!-- <div class="header__info-data" v-for="(item, index) in judicialPracticeHeader" v-show="item.show" :key="index">
        <div class="header__info-data-count">{{ item.count }}</div>
         <div class="header__info-data-title">{{ item.title }}</div> -->
      </div>
    </div>

    <!-- <div class="header__messages" @mouseleave="dropdownMessageOpen = false; eventMessage = null">
      <div class="header__message">
        <div class="header__mail-icon" :class="{ 'has-new' : newEmails, 'empty-data': !newEmails }" @mouseover="messageMenuOpen('email')" @click="openPopup('email')">
          <icon-base
            width="26"
            height="26"
            :style="{ opacity: eventMessage === 'email' ? 0.5 : 1 }"
            iconColor="#ffffff"
            ><icon-mail />
          </icon-base>
        </div>
      </div>
      <div class="header__message">
        <div class="header__bell-icon" :class="{ 'has-new' : newMessages, 'empty-data': !newMessages }" @mouseover="messageMenuOpen('message')" @click="openPopup('message')">
          <icon-base
            width="25"
            height="25"
            :style="{ opacity: eventMessage === 'message' ? 0.5 : 1 }"
            iconColor="#ffffff"
            ><icon-bell />
          </icon-base>
        </div>
      </div>
      <transition name="fade">
        <div v-if="dropdownMessageOpen" class="header__messages-dropdown">
          <div class="header__messages-dropdown_body" :key="'sdkjfsj' + eventMessage">
            <base-scroll-wrapper :height="scrollWrapperHeigth">
              <ul class="header__messages-items">
                <transition-group name="fade">
                  <template v-if="eventMessage === 'email'">
                    <li v-for="(item, i) in getEmailsNew" class="header__messages-item" :key="'hdrmssdri' + i">
                      <a href="javascript:void(0);">
                        <h3 class="header__messages-item--sender" v-html="item.sender"></h3>
                        <p class="header__messages-item--title" v-html="item.title"></p>
                      </a>
                      <span class="header__messages-item--time" v-html="$options.filters.formatdate(item.time)"></span>
                    </li>
                  </template>
                  <template v-if="eventMessage === 'message'">
                    <li class="header__messages-item" key="dasasdi" v-if="penaltyStatus">
                      <a href="javascript:void(0);">
                        <p class="header__messages-item--message">{{ penaltyProgress }}% Загрузка должников</p>
                      </a>
                      <div class="header__messages-loader">
                        <div class="header__messages-loader--inner" :style="{ width: penaltyProgress * 156 / 100 + 'px' }"></div>
                        <div class="header__messages-loader--outer"></div>
                      </div>
                    </li>
                    <li v-for="(item, i) in getMessagesNew" class="header__messages-item" :key="'hdrmssdri' + i">
                      <a href="javascript:void(0);">
                        <p class="header__messages-item--message" v-html="item.message"></p>
                      </a>
                      <span class="header__messages-item--time" v-html="$options.filters.formatdate(item.time)"></span>
                    </li>
                  </template>
                </transition-group>
              </ul>
            </base-scroll-wrapper>
          </div>
          <div class="header__messages-dropdown_footer">
            <div class="btn btn-blue--dark">
              <a href="javascript:void(0);" class="btn btn-blue--darken" @click="readAllMessages(eventMessage)">{{ eventMessage === 'email' ? 'Прочитать все уведомления': 'Прочитать все сообщения' }}</a>
            </div>
            <div class="btn btn-blue--dark">
              <a href="javascript:void(0);" class="btn btn-blue--darken" @click="removeAllMessages(eventMessage)">{{ eventMessage === 'email' ? 'Удалить все уведомления': 'Удалить все сообщения' }}</a>
            </div>
          </div>
        </div>
      </transition>
    </div> -->

    <div class="header__user">
      <!-- <div class="header__user-avatar" :style="{ backgroundImage: 'url(' + user.img + ')' }"></div> -->
      <div class="header__user-avatar">
        <icon-base :width="40" :height="40">
            <icon-user />
        </icon-base>
      </div>

      <div class="header__user-data" :class="{ 'is-open' : dropdownProfileOpen }" @click="dropdownProfileOpen = !dropdownProfileOpen">
        <div class="header__user-name" >{{$store.getters.getDefaultCompanyShortName}}</div>
        <div class="header__user-balans"> {{ balance ? balance : 0 | sepnum }}&nbsp;&#8381;</div>
        <div class="header__user-user" v-if="$store.getters.userData">
          {{[$store.getters.userData.first_name, $store.getters.userData.last_name].filter(Boolean).join(' ')}}
        </div>
      </div>
      <transition name="fade">
        <div v-if="dropdownProfileOpen" class="dropdown-content">
          <!-- <div class="dropdown-item">
              <span>Изменение темы</span>
              <div class="theme-changer">
                  <input type="checkbox" v-model="localThemeState" @change="dayNnight()" title="Изменение темы" id="theme-changer">
                  <label for="theme-changer"></label>
              </div>
          </div> -->
          <div class="dropdown-item" @click="$router.push('/admin/admin-panel')" v-if="adminRole && !adminPage">Войти в админ панель</div>
          <div class="dropdown-item" @click="$router.push('/debtors')" v-if="adminRole && adminPage">Выйти из админ панели</div>
          <div class="dropdown-item" @click="$router.push('/settings?tab=1')">Сменить пароль</div>
          <div class="dropdown-item" @click="logoutHandler()">Выход</div>
        </div>
      </transition>
    </div>
    <div class="header__logout" @click="logoutHandler()">
      <icon-base width="25" height="25" viewBox="0 0 25 25" >
        <icon-logout/>
      </icon-base>
    </div>
  </header>
</template>
<style lang="scss">
.toggle__theme {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .v-switch-input {
    display: none;
  }
  .v-switch-button {
    background-color: #fff;
    border-radius: 50%;
  }
}
</style>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { baseURL } from '@/settings/config'
import { listener } from '@/mixins/listener'
import axios from 'axios'

export default {
  mixins: [listener],
  data () {
    return {
      dropdownProfileOpen: false,
      dropdownMessageOpen: false,
      eventMessage: null,
      listenerElement: ['.header__user-dropdown', '.header__user-data'],
      listenerValue: 'dropdownProfileOpen',
      localThemeState: true,

      unActiveTime: 0,
      timeToCheck: true,

      user: {
        name: 'ООО "Компания"',
        // img: './assets/images/user-avatar.jpg',
        img: './assets/images/empty_avatar.png',
        mails: 2,
        bells: 1,
        balans: 13540,
        debtors: 353,
        penalties: 15,
        inWork: 25,
      },
      timerId: null
    }
  },
  created () {
    if (this.$store.state.user.appTheme == 'day') {
        document.documentElement.setAttribute('data-theme', 'day');
    } else if (this.$store.state.user.appTheme == 'night'){
        document.documentElement.setAttribute('data-theme', 'night');
    }
  },

  methods: {
    ...mapActions(['removeAllMessages', 'readAllMessages', 'setPopupState', 'setPopupComponent', 'logout', 'changeAppTheme', 'uploadCompanies']),
    ...mapMutations(['setInitialized']),
    dayNnight () {
      this.localThemeState = !this.localThemeState
      if (!this.localThemeState) {
        this.changeAppTheme('night')
        document.documentElement.setAttribute('data-theme', 'night');
      } else {
        document.documentElement.setAttribute('data-theme', 'day');
        this.changeAppTheme('day')
      }
    },

    async logoutHandler() {
      const DBDeleteRequest = window.indexedDB.deleteDatabase("urrobot");

      DBDeleteRequest.onsuccess = function(event) {
        console.log("Database deleted successfully");
        console.log(event.result); // should be undefined
      };
      await this.logout().then(() => {
        this.$router.push('/sign/in');
        // this.setInitialized(false);
      }).catch(err => console.log(err))
      this.$store.commit('clearVisitedPages');
    },
    messageMenuOpen (event) {
      this.eventMessage = event
      if (event === 'email' && this.newEmails) {
        this.dropdownMessageOpen = true
      } else if (event === 'email' && !this.newEmails && this.dropdownMessageOpen) this.dropdownMessageOpen = false
      if (event === 'message' && this.newMessages) {
        this.dropdownMessageOpen = true
      } else if (event === 'message' && !this.newMessages && this.dropdownMessageOpen) this.dropdownMessageOpen = false
    },
    openPopup (event) {
      this.dropdownMessageOpen = false
      this.setPopupComponent({ component: 'Messages', type: this.eventMessage })
      this.setPopupState(true)
    },
    func () {
      this.logout().then(() => this.$router.push('/sign/in'))
    }
  },
  computed: {
    ...mapGetters([
      'getMessagesNew',
      'getEmailsNew',
      'penaltyProgress',
      'penaltyStatus',
      'penalty',
      'judicialPractice',
      'judicialPracticeHeader',
      'getDefaultCompany',
      'isLoggedIn',
      'balance'
    ]),
    newEmails () {
      return this.getEmailsNew.length > 0
    },
    newMessages () {
      return this.getMessagesNew.length > 0
    },
    scrollWrapperHeigth () {
      let ht = '100px'
      if (this.eventMessage === 'email') {
        if (this.getEmailsNew.length === 2) ht = '200px'
        if (this.getEmailsNew.length >= 3) ht = '300px'
      }
      if (this.eventMessage === 'message') {
        if (this.getMessagesNew.length === 2) ht = '200px'
        if (this.getMessagesNew.length >= 3) ht = '300px'
      }
      return ht
    },
    /**
     * Возвращает роль пользователя
     */
    adminRole() {
      let user;
      if (typeof window !== 'undefined') {
				  user = localStorage.getItem('user');
          user = JSON.parse(user);
          return user.role === 'admin'
			  } else {
          user = {
            role: 'company'
          }
          return user.role === 'company'
        }
    },
    adminPage() {
      let admin = this.$route.path.split('/')[1];
      return admin === 'admin';
    },
    isAuth () {
      return this.isLoggedIn
    }
  },
  beforeDestroy () {
    clearTimeout(this.timerId)
  },
  watch: {
    getDefaultCompany: {
      deep: true,
      immediate: true,
      handler(val) {
        if(val && val.ShortNameOfTheOrganization) {
          this.user.name = val.ShortNameOfTheOrganization
        }
      }
    },

    isLoggedIn: {
      immediate: true,
      handler (val) {
        if (val) {
          let token = localStorage.getItem('token')
          if (token != '') {
          axios.defaults.headers.common['X-Auth-Token'] = token
          } else {
            delete axios.defaults.headers.common["X-Auth-Token"];
          }
        }
      }
    },

    localThemeState:{
      deep: true,
      immediate: true,
      handler (val) {
        if (this.$store.state.user.appTheme === 'night') {
          this.localThemeState = true
        } else if (this.$store.state.user.appTheme === 'day') {
          this.localThemeState = false
        }
      }
    },
    timeToCheck:{
      handler (val) {
        // if ( this.timeToCheck == true ) {
        //     setInterval(() => {
        //         let user = localStorage.getItem('user')
        //         user = JSON.parse(user)

        //         if (user) {
        //           let data = {
        //             session_key: user.token
        //           }
        //           let url = baseURL+'/api/check_user_auth/'
        //           axios({
        //             url: url,
        //             data: data,
        //             method: "POST"
        //           })
        //           .then(res => {
        //             if (res.auth === false || res.data.auth === false) {
        //               this.logoutHandler()
        //             } else if (res.data.error || res.error) {
        //               this.logoutHandler()
        //             }
        //           })
        //         }
        //     }, 30000)
        //   }
      },
      immediate: true
    },
    unActiveTime:{
      // handler (val){
      //   if (val <= 36 && val < 37) {
      //     this.timeToCheck = true
      //     setTimeout(() => {
      //           this.unActiveTime++;
      //       }, 1000);
      //   } else if (val >= 35) {
      //     this.timeToCheck = false
      //     // console.log('Вы не активны более 35 секунд')
      //   }
      // },
      // immediate: true
    }
  }
}
</script>
