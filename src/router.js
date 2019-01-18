import Vue from 'vue'
import Router from 'vue-router'
import EBook from './components/ebook/ebook.vue'
import EBookRead from './views/ebook-read/ebook-read.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/ebook'
    },
    {
      path: '/ebook',
      name: 'EBook',
      component: EBook,
      children: [
        {
          path: ":filename",
          component: EBookRead
        }
      ]
    },
  ]
})
