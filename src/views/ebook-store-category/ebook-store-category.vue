<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title" :ifShowBack="true"></shelf-title>
    <scroll
      class="store-shelf-scroll-wrapper"
      :top="0"
      :bottom="scrollBottom"
      @onScroll="onScroll"
      ref="scroll"
      v-if="shelfCategory.itemList && shelfCategory.itemList.length>0"
    >
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>
      {{$t('shelf.groupNone')}}
    </div>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  /*传入参数 :top="42"是解决滚动条上面的空白问题*/
  import { mapGetters, mapActions } from "vuex"
  import Scroll from "../../components/ebook-scroll/ebook-scroll.vue"
  import ShelfTitle from "../../views/ebook-shelf-title/ebook-shelf-title.vue"
  import ShelfList from "../../views/ebook-shelf-list/ebook-shelf-list.vue"
  import ShelfFooter from "../../views/ebook-shelf-footer/ebook-shelf-footer.vue"

  export default {
    name: "StoreCategory",
    data(){
      return {
        scrollBottom: 0
      }
    },
    computed: {
      ...mapGetters({
        shelfCategory: "Home/shelfCategory"
      })
    },
    methods: {
      onScroll() {

      }
    },
    mounted(){
      console.log(155555, this.shelfCategory)
    },
    components: {
      ShelfTitle,
      ShelfList,
      ShelfFooter,
      Scroll
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .store-shelf {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
  }

  .store-shelf-empty-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: px2rem(14);
    color: #333;
    @include center;
  }
</style>
