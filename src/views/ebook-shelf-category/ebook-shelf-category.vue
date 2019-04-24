<template>
  <div class="shelf-item-category">
    <div class="shelf-item-category-list">
      <div v-if="data.itemList" class="shelf-item-category-item" v-for="(item,index) in data.itemList" :key="index">
        <img class="shelf-item-category-img" :src="item.img"/>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapActions } from "vuex"

  export default{
    name: "EBookShelfCategory",
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    methods: {
      ...mapActions({setShelfCategory: "Home/setShelfCategory"})
    },
    mounted(){    /*这里把分组的数据保存到vuex中*/
      this.setShelfCategory(this.data)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .shelf-item-category {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .shelf-item-category-list {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      height: 100%;
      padding-top: px2rem(5);
      box-sizing: border-box;
      .shelf-item-category-item {
        flex: 0 0 33.33%;
        width: 33.33%;
        height: 33.33%;
        box-sizing: border-box;
        &:nth-child(3n+1) {
          padding: 0 px2rem(2.5) px2rem(5) px2rem(5);
        }
        &:nth-child(3n+2) {
          padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5);
        }
        &:nth-child(3n+3) {
          padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
        }
        .shelf-item-category-img {
          width: 100%;
          height: 100%
        }
      }
    }
  }
</style>
