<template>
  <div class="ebook-slide-bookmark">
    <div class="slide-bookmark-title">{{$t('book.bookmark')}} . {{bookmark ? bookmark.length : 0}}</div>
    <scroll class="slide-bookmark-list" :top="48" :bottom="48">
      <div class="slide-bookmark-item" v-for="(item,index) in bookmark" :key="index" @click="displayBookmark(item.cfi)">
        <div class="slide-bookmark-item-icon">
          <div class="icon-bookmark"></div>
        </div>
        <div class="slide-bookmark-item-text">{{item.text}}</div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from "vuex"
  import Scroll from "../../components/ebook-scroll/ebook-scroll.vue"
  import { getBookmark } from "common/js/localStorage"

  export default {
    name: 'EBookBookMark',
    data() {
      return {
        bookmark: null
      }
    },
    computed: {
      ...mapGetters({
        fileName: "Book/filename",
        currentBook: "Book/currentBook"
      })
    },
    methods: {
      displayBookmark(target){   /*链接跳转过去之后,需要隐藏标题和菜单面板,在这里省略...*/
        this.display(target)
      },
      display(target) {
        if (target) {
          return this.currentBook.rendition.display(target)
        } else {
          return this.currentBook.rendition.display()
        }
      }
    },
    mounted(){
      this.bookmark = getBookmark(this.fileName)
      console.log(this.bookmark)
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .ebook-slide-bookmark {
    width: 100%;
    .slide-bookmark-title {
      width: 100%;
      height: px2rem(48);
      font-size: px2rem(14);
      font-weight: bold;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      @include left
    }
    .slide-bookmark-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-bookmark-item {
        display: flex;
        padding: px2rem(15) 0;
        box-sizing: border-box;
        .slide-bookmark-item-icon {
          flex: 0 0 px2rem(29);
          @include left;
          .icon-bookmark {
            width: px2rem(20);
            height: px2rem(20);
            font-size: px2rem(12);
            border-radius: 50%;
            background: #bbb;
            @include center
          }
        }
        .slide-bookmark-item-text {
          font-size: px2rem(14);
          line-height: px2rem(15);
          min-height: px2rem(45);
          @include ellipsis2(3)
        }
      }
    }
  }
</style>
