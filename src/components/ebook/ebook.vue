<template>
  <div class="ebook">
    <book-reader></book-reader>
  </div>
</template>

<script type="text/ecmascript-6">
  import BookReader from "../../views/ebook-read/ebook-read.vue"
  export default {
    name: "Ebook",
    components: {
      BookReader
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
