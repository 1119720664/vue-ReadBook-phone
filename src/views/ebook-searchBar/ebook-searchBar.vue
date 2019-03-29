<template>
  <div>
    <div class="search-bar" :class="{'hide-title':!titleVisible,'hide-shadow':!shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title':!titleVisible}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title':!titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title':!titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input
            class="input"
            type="text"
            :placeholder="$t('home.hint')"
            v-model="searchText"
            @click="showHotSearch"
            @keyup.13.exact="search"
          />
        </div>
      </div>
    </div>
    <search-list v-show="hotSearchVisible" ref="SearchList"></search-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from "vuex"
  import SearchList from "../ebook-search-list/ebook-search-list.vue"

  /* .search-bar-blank是占位符,是给动画实现的*/
  export default {
    name: "EBookSearchBar",
    data() {
      return {
        searchText: '',
        titleVisible: true,
        shadowVisible: false,
        hotSearchVisible: false, /*默认情况下搜索不显示*/
      }
    },
    computed: {
      ...mapGetters({
        offsetY: "Book/offsetY",
        hotSearchOffsetY: "Home/hotSearchOffsetY"
      })
    },
    methods: {
      back() {
        this.hideHotSearch()
        this.showTitle()
      },
      showHotSearch() {
        this.hideTitle()
        this.hideShadow()
        this.hotSearchVisible = true
        this.$nextTick(() => {
          this.$refs.SearchList.reset()
          /*每次点击时都是返回到起始的位置,等到DOM更新完成之后才可以,需要加上this.$nextTick*/
        })
      },
      showFlapCard() {
        this.setFlapCardVisible(true)
      },
      hideHotSearch() {   /*点击返回时不显示标题,这里省略*/
        this.hotSearchVisible = false
      },
      hideTitle() {
        this.titleVisible = false
      },
      showTitle() {
        this.titleVisible = true
      },
      hideShadow() {
        this.shadowVisible = false
      },
      showShadow() {
        this.shadowVisible = true
      },
      search() {
        this.$router.push({
          path: "/home/list",
          query: {
            keyword: this.searchText
          }
        })
      },
      ...mapActions({
        setFlapCardVisible: "Home/setFlapCardVisible"
      })
    },
    components: {
      SearchList
    },
    watch: {
      offsetY(offsetY){
        if (offsetY > 0) {
          this.hideTitle()
          this.showShadow()
        } else {
          this.showTitle()
          this.hideShadow()
        }
      },
      hotSearchOffsetY(offsetY){
        if (offsetY > 0) {
          this.showShadow()
        } else {
          this.hideShadow()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .search-bar {
    position: relative;
    width: 100%;
    height: px2rem(94);
    z-index: 150;
    &.hide-title {
      height: px2rem(52);
      box-shadow: 0 px2rem(2) px2rem(2) rgba(0, 0, 0, 0.1);
    }
    &.hide-shadow {
      box-shadow: none;
    }
    .search-bar-title-wrapper {
      position: absolute; /*因为这个动画的返回按钮不需要隐藏,所以使用absolute布局方式,并且把DOM结构放在动画下面*/
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      .title-text-wrapper {
        width: 100%;
        height: px2rem(42);
        @include center
      }
      .title-icon-shake-wrapper {
        position: absolute;
        right: px2rem(15);
        top: 0;
        height: px2rem(42);
        @include center
      }
    }
    .title-icon-back-wrapper {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: px2rem(42);
      z-index: 200;
      transition: height 0.2s linear;
      @include center;
      &.hide-title {
        height: px2rem(52)
      }
    }
    .search-bar-input-wrapper {
      position: absolute; /*为了能让input框产生移动，添加absolute布局*/
      left: 0;
      top: px2rem(42);
      display: flex; /*为了让input的宽度变小,则添加display:flex*/
      width: 100%;
      height: px2rem(52);
      padding: 0 px2rem(10);
      box-sizing: border-box;
      transition: top 0.2s linear;
      &.hide-title {
        top: 0
      }
      .search-bar-blank { /* 机上图标的宽度*/
        flex: 0 0 0;
        transition: all 0.2s linear;
        width: 0;
        //flex: 0 0 px2rem(31);
        //width:px2rem(31)
        &.hide-title {
          flex: 0 0 px2rem(31);
          width: px2rem(31)
        }
      }
      .search-bar-input {
        flex: 1;
        border-radius: px2rem(20);
        width: 100%;
        background: #f4f4f4;
        padding: px2rem(5) px2rem(15);
        box-sizing: border-box;
        border: px2rem(1) solid #eee;
        @include left;
        .icon-search {
          color: #999
        }
        .input {
          width: 100%;
          height: px2rem(22);
          border: none;
          background: transparent;
          margin-left: px2rem(10);
          font-size: px2rem(12);
          color: #666;
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            color: #ccc
          }
        }
      }
    }
  }
</style>
