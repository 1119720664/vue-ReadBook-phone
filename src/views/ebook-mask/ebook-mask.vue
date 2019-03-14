<template>
  <div class="ebook-bookmark" ref="bookMark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle: {} ">
      <book-save :width="15" :height="15" :color="WHITE"></book-save>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from "vuex"
  import BookSave from "../ebook-save/ebook-save.vue"
  import { realPx } from "common/js/util"
  import { getBookmark, saveBookmark } from "common/js/localStorage"

  export default {
    name: 'EbookMask',
    data(){
      return {
        text: this.$t('book.pulldownAddMark'),
        WHITE: "white",
        isFixed: false
      }
    },
    computed: {
      height() {
        return realPx(35)
      },
      threshhold() {
        return realPx(55)
      },
      fixedStyle() {
        return {
          position: "fixed",
          top: 0,
          right: `${(window.innerWidth - this.$refs.bookMark.clientWidth) / 2}px`
        }
      },
      ...mapGetters({
        offsetY: "Book/offsetY",
        isBookMask: "Book/isBookMask",
        bookAvailable: "Book/bookAvailable",
        currentBook: "Book/currentBook",
        fileName: "Book/filename"
      })
    },
    methods: {
      restore(){
        setTimeout(() => {   /*延迟200毫秒解决transition的动画,看起来更加流畅*/
          this.$refs.bookMark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = `rotate(0deg)`
        }, 200)
        if (this.isFixed) {
          this.setBookMask(true)
          /*书签显示并且添加书签*/
          this.addBookMark()
        } else {
          this.setBookMask(false)
          /*书签隐藏并且删除书签*/
          this.removeBookMark()
        }
      },
      addBookMark() {
        this.bookmark = getBookmark(this.fileName)
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`
        this.currentBook.getRange(cfirange).then(range => {
          const text = range.toString().replace(/\s\s/g, "")
          this.bookmark.push({
            cfi: currentLocation.start.cfi,
            text: text
          })
          saveBookmark(this.fileName, this.bookmark)
          /*把获取页面的文本书签,保存在localstorage中*/
        })
      },
      removeBookMark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName)
        if (this.bookmark) {
          this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
          saveBookmark(this.fileName, this.bookmark)
        }
      },
      ...mapActions({setBookMask: "Book/setBookMask"})
    },
    watch: {
      offsetY(v) {
        if (!this.bookAvailable || this.menuVisible || this.settingVisible) {  /*书加载时或者菜单和设置面板都显示时,则书签不做处理*/
          return
        }
        if (v > this.height && v < this.threshhold) {  /*未到达零界状态*/
          this.$refs.bookMark.style.top = `${-v}px`
          if (this.isBookMask) {
            this.text = this.$t('book.pulldownDeleteMark')
            this.WHITE = "blue"
          } else {
            this.text = this.$t('book.pulldownAddMark')
            this.WHITE = "white"
          }
          const iconDown = this.$refs.iconDown
          if (iconDown.style.transform === 'rotate(180deg)') {
            iconDown.style.transform = `rotate(0deg)`
          }
          this.isFixed = false
        } else if (v >= this.threshhold) {            /*超越零界状态状态*/
          this.$refs.bookMark.style.top = `${-v}px`
          if (this.isBookMask) {
            this.text = this.$t('book.releaseDeleteMark')
            this.WHITE = "blue"
            this.isFixed = false
            /*是书签的时候,让他显示,不是书签的时候，让其隐藏*/
          } else {
            this.text = this.$t('book.releaseAddMark')
            this.WHITE = "white"
            this.isFixed = true
          }
          const iconDown = this.$refs.iconDown
          if (iconDown.style.transform === '' || iconDown.style.transform === `rotate(0deg)`) {
            iconDown.style.transform = `rotate(180deg)`
          }
        } else if (v > 0 && v < this.height) {  /*起始的位置*/
          if (this.isBookMask) {
            this.text = this.$t('book.pulldownDeleteMark')
            this.WHITE = "blue"
          } else {
            this.text = this.$t('book.pulldownAddMark')
            this.WHITE = "white"
          }
          this.isFixed = false
        } else if (v === 0) {   /*归位还原*/
          this.restore()
        }
      },
      isBookMask(isBookMask){
        if (isBookMask) {
          this.WHITE = "white"
          this.isFixed = true
        } else {
          this.WHITE = "blue"
          this.isFixed = false

        }
      }
    },
    components: {
      BookSave
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    background: red;
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all 0.2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        color: white;
        font-size: px2rem(14);
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
