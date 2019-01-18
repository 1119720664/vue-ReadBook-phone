import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./common/styles/reset.scss"
import "./common/styles/global.scss"
import "./common/styles/icon.css"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
