<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input class="slide-contents-search-input" v-model="searchText" @click="showSearchPage"
               @keyup.enter.exact="search"
               type="text"
               :placeholder="$t('book.searchHint')"/>
      </div>
      <div class="slide-contents-search-cancel" @click="hideSearchPage" v-if="searchVisible">
        {{$t('book.cancel')}}
      </div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img"/>
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          {{metadata.title}}
        </div>
        <div class="slide-contents-book-author">
          {{metadata.creator}}
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
      </div>
    </div>
    <e-book-scroll class="slide-contents-list" :top="156" :bottom="48" ref="scroll" v-show="!searchVisible">
      <div class="slide-contents-item" v-for="(item,index) in navigation" :key="index">
        <span class="slide-contents-item-label" :class="{'selected':section===index}"
              :style="contentItemStyle(item)" @click="display(item.href)">{{item.label}}</span>
        <span class="slide-contents-item-page"></span>
      </div>
    </e-book-scroll>
    <e-book-scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisible">
      <div class="slide-search-item" v-for="(item,index) in searchList" :key="index" v-html="item.excerpt"
           @click="display(item.cfi,true)"></div>
    </e-book-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from "vuex"
  import { saveLocation, getReadTime } from "common/js/localStorage"
  import { px2rem } from "common/js/util"
  import EBookScroll from "../../components/ebook-scroll/ebook-scroll.vue"

  export default {
    name: 'EBookContent',
    data() {
      return {
        searchVisible: false,
        searchList: null,
        searchText: ''
      }
    },
    computed: {
      ...mapGetters({
        progress: "Book/progress",
        metadata: "Book/metadata",
        cover: "Book/cover",
        fileName: "Book/filename",
        navigation: "Book/navigation",
        section: "Book/section",
        currentBook: "Book/currentBook",
      })
    },
    methods: {
      showSearchPage() {
        this.searchVisible = true
      },
      hideSearchPage() {
        this.searchVisible = false
        this.searchText = ''
        this.searchList = null
      },
      contentItemStyle(item) {
        return {
          marginLeft: `${px2rem(item.level * 15)}rem`
        }
      },
      display(href, highlight = false) {
        if (href) {
          this.setSection(href)
          this.currentBook.rendition.display(href).then(() => {
            this.refreshLocation()
          })
          if (highlight) {
            this.currentBook.rendition.annotations.highlight(href)
          }
        }
      },
      refreshLocation() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
        const startCfi = currentLocation.start.cfi;
        /*通过第一个字获取当前读取进度*/
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi)
        /*最后关闭所有的菜单和面板,代码省略,必须在自己的方法里写，否则会影响其他面板的功能*/
      },
      getReadTimeText() {
        return this.$t('book.haveRead').replace('$1', this.getReadTimeByMinute(this.fileName))
      },
      getReadTimeByMinute() {
        const readTime = getReadTime(this.fileName)
        if (!readTime) {
          return 0
        } else {
          return Math.ceil(readTime / 60)
        }
      },
      doSearch(q) {
        return Promise.all(
          this.currentBook.spine.spineItems.map(
            section => section.load(this.currentBook.load.bind(this.currentBook))
              .then(section.find.bind(section, q))
              .finally(section.unload.bind(section)))
        ).then(results => {
          return Promise.resolve([].concat.apply([], results))
        })
      },
      search() {
        if (this.searchText && this.searchText.length > 0) {
          this.doSearch(this.searchText).then(list => {
            this.searchList = list
            this.searchList.map(item => {
              item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
              return item
            })
          })
        }
      },
      ...mapActions({
        setSection: "Book/setSection",
        setProgress: "Book/setProgress"
      })
    },
    components: {
      EBookScroll
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .ebook-slide-contents {
    width: 100%;
    font-size: 0;
    .slide-contents-search-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(36);
      margin: px2rem(20) 0 px2rem(10) 0;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-search-input-wrapper {
        flex: 1;
        @include center;
        .slide-contents-search-icon {
          flex: 0 0 px2rem(28);
          font-size: px2rem(12);
          @include center;
        }
        .slide-contents-search-input {
          flex: 1;
          width: 100%;
          height: px2rem(32);
          font-size: px2rem(14);
          background: transparent;
          border: none;
          &:focus {
            outline: none
          }
        }
      }
      .slide-contents-search-cancel {
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        @include right
      }
    }
    .slide-contents-book-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(90);
      padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
      box-sizing: border-box;
      .slide-contents-book-img-wrapper {
        flex: 0 0 px2rem(45);
        .slide-contents-book-img {
          width: px2rem(45);
          height: px2rem(60);
        }
      }
      .slide-contents-book-info-wrapper {
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        .slide-contents-book-title {
          font-size: px2rem(14);
          width: px2rem(153.75); /*总宽度的0.85倍减去padding的值和图片的宽度*/
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .slide-contents-book-author {
          font-size: px2rem(12);
          @include ellipsis;
          width: px2rem(153.75); /*总宽度的0.85倍减去padding的值和图片的宽度*/
        }
      }
      .slide-contents-book-progress-wrapper {
        flex: 0 0 px2rem(70);
        .slide-contents-book-progress {
          .progress {
            font-size: px2rem(14);
          }
          .progress-text {
            font-size: px2rem(12);
          }
        }
        .slide-contents-book-time {
          font-size: px2rem(12);
        }
      }
    }
    .slide-contents-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-item {
        padding: px2rem(20) 0;
        box-sizing: border-box;
        display: flex;
        .slide-contents-item-label {
          font-size: px2rem(14);
          line-height: px2rem(16);
          flex: 1;
          @include ellipsis
        }
      }
    }
    .slide-search-list {
      width: 100%;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-search-item {
        font-size: px2rem(14);
        line-height: px2rem(16);
        padding: px2rem(20) 0;
        box-sizing: border-box;
      }
    }
  }
</style>
