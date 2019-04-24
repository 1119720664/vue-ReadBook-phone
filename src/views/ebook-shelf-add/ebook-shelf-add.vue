<template>
  <div class="shelf-item-add">
    <span class="icon-add"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'EBookShelfAdd'
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .shelf-item-add {
    width: 100%;
    height: 100%;
    border: px2rem(1) solid #ccc;
    box-sizing: border-box;
    @include center;
    .icon-add {
      font-size: px2rem(40);
      color: #ccc
    }
  }
</style>
