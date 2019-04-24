<template>
  <transition name="fade">
    <div class="toast-bg-wrapper">
      <div class="toast-bg" v-show="visible">
        <div class="toast-wrapper">
          <div class="toast" v-html="showText"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "Toast",
    props: {
      text: {
        type: [Number, String],
        default: ''
      },
      timeout: {
        type: Number,
        default: 1500
      }
    },
    data() {
      return {
        visible: false,
        showText: ""
      }
    },
    methods: {
      hide() {
        this.visible = false
      },
      show() {
        this.updateText(this.text)
        /*文本是根据下载进行变化的*/
        this.task = null
        this.visible = true
        this.task = setTimeout(() => {
          this.visible = false
        }, this.timeout)

      },
      continueShow() {
        clearTimeout(this.task)
        this.task = null
        this.visible = true
      },
      updateText(text){
        this.showText = text
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .toast-bg-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2500;
    .toast-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 0 0 -50%;
      z-index: 2000;
      width: 100%;
      @include center;
      .toast-wrapper {
        width: 60%;
        line-height: px2rem(20);
        padding: px2rem(10) px2rem(20);
        box-sizing: border-box;
        background: #ccc;
        border-radius: px2rem(10);
        font-size: px2rem(14);
        color: white;
        .toast {
          text-align: center;
          word-break: break-all;
        }
      }
    }
  }
</style>
