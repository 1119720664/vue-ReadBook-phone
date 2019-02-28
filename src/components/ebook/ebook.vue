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
  import { getReadTime } from "common/js/localStorage"

  export default {
    name: "Ebook",
    computed: {
      ...mapGetters({fileName: "Book/filename"})
    },
    methods: {
      startLoopReadTime() {  /*获取阅读的时间*/
        let readTime = getReadTime(this.fileName)
        if (!readTime) {
          readTime = 0
        }
      }
    },
    components: {
      BookReader,
      BookMenu,
      BookTitle
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
