<template>
  <div class="ebook-header">
    <span class="ebook-header-text">{{getSectionName()}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from "vuex"

  export default {
    name: "EBookHeader",
    computed: {
      ...mapGetters({section: "Book/section", navigation: "Book/navigation"})
    },
    methods: {
      getSectionName() {
        console.log(this.navigation)
        return this.section ? this.navigation[this.section].label : ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .ebook-header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(48);
    padding: 0 px2rem(15);
    box-sizing: border-box;
    overflow: hidden;
    @include left;
    .ebook-header-text {
      font-size: px2rem(12);
      color: #6d7178
    }
  }
</style>
