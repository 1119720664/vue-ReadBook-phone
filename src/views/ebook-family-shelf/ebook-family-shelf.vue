<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper" :top="0" :bottom="scrollBottom" @onScroll="onScroll" ref="scroll">
      <shelf-search></shelf-search>
      <shelf-list :shelfList="shelfList"></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapActions, mapGetters } from "vuex"
  import { shelf } from "../../api"
  import { addendAddToShelf } from "common/js/util"
  import { getBookShelf, saveBookShelf } from "common/js/localStorage"
  /*获取本地保存的电子书,方便离线缓存观看*/
  import ShelfTitle from "../ebook-shelf-title/ebook-shelf-title.vue"
  import Scroll from "../../components/ebook-scroll/ebook-scroll.vue"
  import ShelfSearch from "../ebook-shelf-search/ebook-shelf-search.vue"
  import ShelfList from "../ebook-shelf-list/ebook-shelf-list.vue"
  import ShelfFooter from "../ebook-shelf-footer/ebook-shelf-footer.vue"

  export default {
    name: "EBookFamilyShelf",
    created() {
      shelf().then(res => {
        if (res.status === 200 && res.data) {
          this.shelfList = getBookShelf()
          if (!this.shelfList) {
            this.shelfList = res.data.guessYouLike
            this.shelfList = addendAddToShelf(res.data.guessYouLike)
            /*从接口获取的数据保存到本地存储中*/
            saveBookShelf(this.shelfList)
          }
          this.setShelfList(this.shelfList)
        }
      })
    },
    data(){
      return {
        shelfList: [],
        scrollBottom: 0    /*处于编辑模式下的scroll不能全屏显示,防止最下面的图标题挡住*/
      }
    },
    computed: {
      ...mapGetters({isEditMode: "Home/isEditMode"})
    },
    methods: {
      onScroll(offsetY) {
        this.setOffsetY(offsetY)
      },
      getCategoryList(title) {  /*过滤type=2的书并且和title保持一致,保存下来*/
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      },
      ...mapActions({
        setOffsetY: "Book/setOffsetY",
        setShelfList: "Home/setShelfList",
        setShelfCategory: "Home/setShelfCategory",
        setCurrentType: "Home/setCurrentType"
      })
    },
    mounted() {
      this.getCategoryList(this.$route.query.title)
      this.setShelfCategory([])
      this.setCurrentType(1)
    },
    components: {
      ShelfTitle,
      Scroll,
      ShelfSearch,
      ShelfList,
      ShelfFooter
    },
    watch: {
      isEditMode(isEditMode) {
        this.scrollBottom = isEditMode ? 48 : 0
        this.$nextTick(() => {   /*isEditMode会触发DOM的变化,所以使用$nextTick完成dom更新后在刷新*/
          this.$refs.scroll.refresh()
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .store-shelf {
    width: 100%;
    height: 100%;
    background: white;
    position: relative;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
  }
</style>
