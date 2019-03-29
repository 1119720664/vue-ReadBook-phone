<template>
  <div class="store-home">
    <e-book-search-bar></e-book-search-bar>
    <flap-card :data="random"></flap-card>
    <e-book-scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <img class="banner-img" :src="banner">
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <recommend :data="recommend" class="recommend"></recommend>
      <featured :data="featured" class="featured" :titleText="$t('home.featured')"
                :btnText="$t('home.seeAll')">
      </featured>
      <div class="category-list-wrapper" v-for="(item,index) in categoryList" :key="index">
        <CategoryBook :data="item"></CategoryBook>
      </div>
      <CategoryType class="categories" :data="categories"></CategoryType>
    </e-book-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapActions } from "vuex"
  import { home } from "../../api"
  import EBookScroll from "../../components/ebook-scroll/ebook-scroll.vue"
  import EBookSearchBar from "../ebook-searchBar/ebook-searchBar.vue"
  import FlapCard from "../ebook-flap-card/ebook-flap-card.vue"
  import GuessYouLike from "../ebook-guess-you-like/ebook-guess-you-like.vue"
  import Recommend from "../ebook-recommend/ebook-recommend.vue"
  import Featured from "../ebook-featured/ebook-featured.vue"
  import CategoryBook from "../ebook-category-book-item/ebook-category-book-item.vue"
  import CategoryType from "../ebook-category/ebook-category.vue"

  export default {
    name: "EBookFamily",
    created() {
      home().then(res => {
        if (res && res.status === 200) {
          const data = res.data
          const randomIndex = Math.floor(Math.random() * data.random.length)
          this.random = data.random[randomIndex]
          this.banner = data.banner
          this.guessYouLike = data.guessYouLike
          this.recommend = data.recommend
          this.featured = data.featured
          this.categoryList = data.categoryList
          this.categories = data.categories
        }
      })
    },
    data() {
      return {
        scrollTop: 94,
        random: null,
        banner: "", /*首页的图片*/
        guessYouLike: null,
        recommend: null,
        featured: null,
        categoryList: null,
        categories: null
      }
    },
    methods: {
      onScroll(offsetY){
        this.setOffsetY(offsetY)
        if (offsetY > 0) {
          this.scrollTop = 52
          /*动画移动去除滚动条上面的空白，高度是42像素*/
        } else {
          this.scrollTop = 94
        }
        this.$refs.scroll.refresh()
      },
      ...mapActions({setOffsetY: "Book/setOffsetY"})
    },
    components: {
      EBookSearchBar,
      EBookScroll,
      FlapCard,
      GuessYouLike,
      Recommend,
      Featured,
      CategoryBook,
      CategoryType
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .store-home {
    width: 100%;
    height: 100%;
    .banner-wrapper {
      padding: px2rem(10);
      box-sizing: border-box;
      .banner-img {
        width: 100%; /*也可以换成div背景图的方式修改和background-size*/
        height: px2rem(140)
      }
    }
    .recommend {
      margin-top: px2rem(20);
    }
    .featured {
      margin-top: px2rem(20);
    }
    .category-list-wrapper {
      margin-top: px2rem(20)
    }
    .categories {
      margin-top: px2rem(20);
    }
  }
</style>
