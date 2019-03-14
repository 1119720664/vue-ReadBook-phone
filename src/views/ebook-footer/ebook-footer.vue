<template>
  <div class="ebook-footer">
    <span class="ebook-footer-text">{{progress + '%'}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from "vuex"
  export default {
    name: "EBookFooter",
    computed: {
      ...mapGetters({progress: "Book/progress"})
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .ebook-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(48);
    padding: 0 px2rem(15);
    box-sizing: border-box;
    @include right;
    .ebook-footer-text {
      font-size: px2rem(12);
      color: #6d7178;
    }

  }
</style>
