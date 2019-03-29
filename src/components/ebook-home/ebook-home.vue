<template>
  <div class="home">
   <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
      name:"EBookHome1"
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";
  .home {
    width: 100%;
    height: 100%
  }
</style>
