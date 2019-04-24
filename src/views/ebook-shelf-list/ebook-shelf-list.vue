<template>
  <div class="shelf-list" :style="{top:shelfListTop}">
    <transition-group name="list" tag="div" id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="(item,index) in shelfList" :key="item.id">
        <shelf-item :data="item" :style="{height:itemHeight}"></shelf-item>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from "vuex"
  import { realPx, px2rem } from "common/js/util"
  import ShelfItem from "../ebook-shelf-item/ebook-shelf-item.vue"

  export default {
    name: "EBookShelfList",
    props: {
      top: {
        type: Number,
        default: 94
      },
      shelfList: {
        type: Array,
        default:()=>{
            return []
        }
      }
    },
    computed: {
      itemHeight() {   /*这里使用屏幕的宽高和图书的宽高进行换算比,120是所有图书PADDING的和*/
        return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
      },
      shelfListTop() {
        return px2rem(this.top) + "rem"
      },
    },
    components: {
      ShelfItem
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";
  @import "~common/styles/home.scss";

  .shelf-list { /*让滚动l条超过tab时滚动并且隐藏,可以在ebook-shelf-search动态这是class,也可以在组件呗不使用css样式完成z-index*/
    position: absolute;
    top: px2rem(94);
    left: 0;
    z-index: 100;
    width: 100%;
    #shelf-list {
      display: flex;
      width: 100%;
      flex-flow: row wrap;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .shelf-list-item-wrapper {
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: px2rem(15);
        box-sizing: border-box;
        position: relative;
        &.list-leave-active {
          /*position: absolute;*/
          /*有时列表move动画下需要添加position: absolute,这里需要注意*/
          display: none;
        }
        &.list-move {
          transition: transform 0.5s;
        }
        .shelf-list-title-wrapper {
          margin-top: px2rem(10)
        }
      }
    }
  }
</style>
