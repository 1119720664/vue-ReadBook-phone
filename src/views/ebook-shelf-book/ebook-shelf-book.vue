<template>
  <div class="shelf-item-book shelf-item-shadow">
    <img class="shelf-item-book-cover" :src="data.cover"/>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'EBookShelfBook',
    props: {
      data: {
        type: Object
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .shelf-item-book {
    width: 100%;
    height: 100%;
    .shelf-item-book-cover {
      width: 100%;
      height: 100%;
    }
    &.shelf-item-shadow {
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, 0.3);
    }
  }
</style>
