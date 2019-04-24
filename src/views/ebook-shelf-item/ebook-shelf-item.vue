<template>
  <div class="shelf-item" :class="{'shelf-item-shadow':data.type===1||data.type===2}" @click="onItemClick">
    <component class="shelf-item-comp" :class="{'is-edit':isEditMode && data.type===2}" :is="item"
               :data="data"></component>
    <div class="icon-selected" :class="{'is-selected':data.selected}" v-show="isEditMode&&data.type===1"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from "vuex"
  import { gotoStoreHome } from "common/js/util"
  import ShelfBook from "../ebook-shelf-book/ebook-shelf-book.vue"
  import ShelfAdd from "../ebook-shelf-add/ebook-shelf-add.vue"
  import ShelfCategory from "../ebook-shelf-category/ebook-shelf-category.vue"

  export default {
    name: "EBookShelfItem",
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        book: ShelfBook,
        add: ShelfAdd,
        category: ShelfCategory
      }
    },
    computed: {
      item() {
        return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
      },
      ...mapGetters({
        isEditMode: "Home/isEditMode",
        shelfSelected: "Home/shelfSelected"
      })
    },
    methods: {
      onItemClick() {   /*这里有处于编辑模式和非编辑模式两种*/
        if (this.isEditMode) {
          this.data.selected = !this.data.selected
          if (this.data.selected) {
            console.log(this.shelfSelected)
            this.setShelfSelected(this.shelfSelected.pushWithoutDuplicate(this.data))
          } else {
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
        } else {
          if (this.data.type === 1) {
            this.showBookDetail(this.data)
          } else if (this.data.type === 2) {
            this.$router.push({
              path: "/home/category",
              query: {
                title: this.data.title
              }
            })
          } else if (this.data.type === 3) {
            gotoStoreHome(this)
          }
        }
      },
      showBookDetail(book) {
        this.$router.push({
          path: `/home/detail`,
          query: {
            fileName: book.fileName,
            category: book.categoryText
          }
        })
      },
      ...mapActions({
        setShelfSelected: "Home/setShelfSelected"
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .shelf-item {
    position: relative;
    width: 100%;
    height: 100%;
    &.shelf-item-shadow {
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, 0.3);
    }
    .shelf-item-comp {
      opacity: 1;
      &.is-edit {
        opacity: 0.5;
      }
    }
    .icon-selected {
      position: absolute;
      bottom: px2rem(2);
      right: px2rem(2);
      font-size: px2rem(18);
      color: rgba(0, 0, 0, 0.4);
      &.is-selected {
        color: $color-blue
      }
    }
  }
</style>
