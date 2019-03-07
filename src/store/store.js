import Vue from 'vue'
import Vuex from 'vuex'
import Book from './modules/book'
import createLogger from 'vuex/dist/logger'
const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {Book},
  strict: false,
  /*plugins: debug ? [createLogger()] : []*/
})

export default store
