<template>
  <div class="popup" v-show="popupVisible">
    <transition name="fade">
      <div class="popup-bg" @click.stop.prevent="hide" v-show="visible"></div>
    </transition>
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-show="visible">
        <div class="popup-title" v-if="title&&title.length">{{title}}</div>
        <div class="popup-btn" :class="{'danger':item.type==='danger'}" v-for="(item,index) in btn" :key="index"
             @click="item.click">
          {{item.text}}
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  /*v-show="popupVisible" 的是解决动画没有效果的问题*/

  export default{
    name: 'popup',
    props: {
      title: {
        type: String
      },
      btn: {
        type: Array,
        default: []
      }
    },
    data(){
      return {
        popupVisible: false,
        visible: false    /*使用这个变量是解决菜单隐藏没有过度动画的问题,必须得先隐藏visible,在隐藏popupVisible才有过度动画*/
      }
    },
    methods: {
      show(){
        this.visible = true
        this.popupVisible = true
      },
      hide(){
        this.visible = false
        /*更新DOM,需要完成之后在修改popupVisible,解决菜单隐藏的过渡动画*/
        setTimeout(() => {
          this.popupVisible = false
        }, 100)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    .popup-bg {
      width: 100%;
      height: 100%
    }
    .popup-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 2000;
      width: 100%;
      background: white;
      .popup-title {
        width: 100%;
        height: px2rem(44);
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(12);
        line-height: px2rem(14);
        padding: px2rem(15);
        box-sizing: border-box;
        @include center;
        color: #999;
      }
      .popup-btn {
        width: 100%;
        height: px2rem(60);
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(16);
        color: #666;
        font-weight: bold;
        @include center;
        &.danger {
          color: $color-pink
        }
      }
    }
  }
</style>
