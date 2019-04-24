import Vue from 'vue'
import Router from 'vue-router'
import EBook from './components/ebook/ebook.vue'
import EBookHome from './components/ebook-home/ebook-home.vue'
import EBookFamily from './views/ebook-family/ebook-family.vue'
import EBookRead from './views/ebook-read/ebook-read.vue'
import EBookList from './views/ebook-book-list/ebook-book-list.vue'
import EBookDetail from './views/ebook-book-detail/ebook-book-detail.vue'
import EBookFamilyShelf from './views/ebook-family-shelf/ebook-family-shelf.vue'
import EbookStoreCategory from './views/ebook-store-category/ebook-store-category.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home'
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
    {
      path: "/home",
      name: "EBookHome",
      component: EBookHome,
      redirect: '/home/family',
      children: [
        {
          path: "family",
          component: EBookFamily
        },
        {
          path: "category",
          component: EbookStoreCategory
        },
        {
          path: "list",
          component: EBookList
        },
        {
          path: "detail",
          component: EBookDetail
        },
        {
          path: "shelf",
          component: EBookFamilyShelf
        }
      ]
    }
  ]
})
