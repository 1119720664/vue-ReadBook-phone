<template>
  <div class="bookmark" :style="style" ref="bookSave"></div>
</template>

<script type="text/ecmascript-6">
  import { px2rem } from "common/js/util"

  export default {
    name: "BookSave",
    props: {
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      color: {
        type: String,
        default: ''
      }
    },
    computed: {
      style(){
        return {
            borderColor: `${this.color} ${this.color} transparent ${this.color}`}
      }
    },
    methods: {
      refresh(){
        if (this.height && this.width) {
          this.$refs.bookSave.style.borderWidth = `${px2rem(this.height - 5)}rem ${px2rem(this.width / 2)}rem  ${px2rem(5)}rem  ${px2rem(this.width / 2)}rem`
        }
      }
    },
    mounted(){
      this.refresh()
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .bookmark {
    width: 0;
    height: 0;
    border-width: px2rem(30) px2rem(10) px2rem(10) px2rem(10);
    border-style: solid;
    border-color: white white transparent white;
  }
</style>
