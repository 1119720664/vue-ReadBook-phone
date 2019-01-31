import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import i18n from "./lang"
import "./common/styles/reset.scss"
import "./common/styles/icon.scss";
import "./common/js/rem"


Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
