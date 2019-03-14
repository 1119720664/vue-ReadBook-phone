<template>
  <div class="ebook" ref="ebook">
    <book-header></book-header>
    <book-title></book-title>
    <book-reader></book-reader>
    <book-menu></book-menu>
    <book-mask></book-mask>
    <book-footer></book-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from "vuex"
  import BookTitle from "../../views/ebook-title/ebook-title.vue"
  import BookReader from "../../views/ebook-read/ebook-read.vue"
  import BookMenu from "../../views/ebook-menu/ebook-menu.vue"
  import BookMask from "../../views/ebook-mask/ebook-mask.vue"
  import BookHeader from "../../views/ebook-header/ebook-header.vue"
  import BookFooter from "../../views/ebook-footer/ebook-footer.vue"
  import { getReadTime, saveReadTime } from "common/js/localStorage"

  export default {
    name: "Ebook",
    computed: {
      ...mapGetters({
        fileName: "Book/filename",
        offsetY: "Book/offsetY",
        menuVisible: "Book/menuVisible",
        bookAvailable: "Book/bookAvailable"
      })
    },
    methods: {
      startLoopReadTime() {  /*获取阅读的时间*/
        let readTime = getReadTime(this.fileName)
        /*记录阅读时间的功能*/
        if (!readTime) {
          readTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          if (readTime % 30 === 0) {
            saveReadTime(this.fileName, readTime)
          }
        }, 1000)
      },
      move(v) {
        console.log(v)
        this.$refs.ebook.style.top = v + "px"
      },
      restore() {
        this.$refs.ebook.style.top = 0
        this.$refs.ebook.style.transition = "all 0.2s linear"
        setTimeout(() => {
          this.$refs.ebook.style.transition = ''
        }, 200)
      }
    },
    mounted() {
      this.startLoopReadTime()
    },
    components: {
      BookReader,
      BookMenu,
      BookTitle,
      BookMask,
      BookHeader,
      BookFooter
    },
    watch: {
      offsetY(v) {
        if (!this.menuVisible && this.bookAvailable) {  /*当菜单面板出现时或者标题面板出现不做下拉菜单*/
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore()
          }
        }
      }
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
