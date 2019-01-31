<template>
  <div class="ebook">
    <book-title></book-title>
    <book-reader></book-reader>
    <book-menu></book-menu>
  </div>
</template>

<script type="text/ecmascript-6">
  import BookTitle from "../../views/ebook-title/ebook-title.vue"
  import BookReader from "../../views/ebook-read/ebook-read.vue"
  import BookMenu from "../../views/ebook-menu/ebook-menu.vue"
  export default {
    name: "Ebook",
    components: {
      BookReader,
      BookMenu,
      BookTitle
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
