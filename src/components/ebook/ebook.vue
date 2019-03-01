<template>
  <div class="ebook">
    <book-title></book-title>
    <book-reader></book-reader>
    <book-menu></book-menu>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from "vuex"
  import BookTitle from "../../views/ebook-title/ebook-title.vue"
  import BookReader from "../../views/ebook-read/ebook-read.vue"
  import BookMenu from "../../views/ebook-menu/ebook-menu.vue"
  import { getReadTime, saveReadTime } from "common/js/localStorage"

  export default {
    name: "Ebook",
    computed: {
      ...mapGetters({fileName: "Book/filename"})
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
      }
    },
    mounted() {
      this.startLoopReadTime()
    },
    components: {
      BookReader,
      BookMenu,
      BookTitle
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
