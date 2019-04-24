import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import i18n from "./lang"
import "common/js/boost"
/*import mock from "./mock"   /!*注:这里的mock会引发mock电子书渲染的问题,不建议使用,使用easy-mock或者在vue.config配置一个*!/*/
import "./common/styles/reset.scss"
import "./common/styles/icon.scss";
import "./common/js/rem"
import "./common/js/create-api"


Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
