<template>
  <div class="shelf-search-wrapper" :class="{'search-top':ifInputClicked, 'hide-shadow':ifHideShadow}">
    <div class="shelf-search" :class="{'search-top':ifInputClicked}">
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input type="text" class="search-input" v-model="searchText" :placeholder="$t('shelf.search')"
                 @click="onSearchClick"/>
        </div>
        <div class="icon-clear-wrapper" v-show="searchText.length" @click="clearSearchText">
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <div class="icon-locale-wrapper" v-if="!ifInputClicked">
        <span class="icon-cn icon" v-if="lang==='cn'" @click="switchLocale"></span>
        <span class="icon-en icon" v-else @click="switchLocale"></span>
      </div>
      <div class="cancel-btn-wrapper" @click="onCancelClick" v-if="ifInputClicked">
        <span class="cancel-text">{{$t('shelf.cancel')}}</span>
      </div>
    </div>
    <transition name="hot-search-move">
      <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
        <div class="shelf-search-tab-item" v-for="item in tabs" :key="item.id" @click="onTabClick(item.id)">
          <span class="shelf-search-tab-text" :class="{'is-selected':item.id===selectedTab}">{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import { setLocalStorage } from "common/js/localStorage"
  import { mapActions, mapGetters } from "vuex"

  export default {
    name: "EBookShelfSearch",
    data(){
      return {
        ifHideShadow: true, /*阴影隐藏是否开启*/
        ifInputClicked: false,
        searchText: '',
        selectedTab: 1,
        tabs: [
          {
            id: 1,
            text: this.$t('shelf.default')
          },
          {
            id: 2,
            text: this.$t('shelf.progress')
          },
          {
            id: 3,
            text: this.$t('shelf.purchase')
          }
        ]
      }
    },
    computed: {
      lang(){
        return this.$i18n.locale
      },
      ...mapGetters({
        offsetY: "Book/offsetY"
      })
    },
    methods: {
      onSearchClick() {
        this.ifInputClicked = true
        this.setShelfTitleVisible(false)
      },
      onCancelClick() {
        this.ifInputClicked = false
        this.setShelfTitleVisible(true)
      },
      switchLocale() {
        if (this.lang === "en") {
          this.$i18n.locale = 'cn'
        } else {
          this.$i18n.locale = 'en'
        }
        setLocalStorage("locale", this.$i18n.locale)
      },
      clearSearchText() {
        this.searchText = ''
      },
      onTabClick(selectedId) {
        this.selectedTab = selectedId
      },
      ...mapActions({setShelfTitleVisible: "Home/setShelfTitleVisible"})
    },
    watch: {
      offsetY(newVal){
        if (newVal > 0 && this.ifInputClicked) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";
  @import "~common/styles/transition.scss";

  .shelf-search-wrapper {
    position: relative;
    z-index: 105;
    width: 100%;
    height: px2rem(94);
    font-size: px2rem(16);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
    &.hide-shadow {
      box-shadow: none;
    }
    &.search-top {
      position: fixed;
      left: 0;
      top: 0;
    }
    .shelf-search {
      position: absolute;
      top: px2rem(42);
      left: 0;
      z-index: 105;
      display: flex;
      width: 100%;
      height: px2rem(52);
      transition: top 0.2s linear;
      &.search-top {
        top: 0
      }
      .search-wrapper {
        flex: 1;
        display: flex;
        margin: px2rem(8) 0 px2rem(8) px2rem(10);
        border: px2rem(1) solid #ccc;
        border-radius: px2rem(3);
        .icon-search-wrapper {
          flex: 0 0 px2rem(22);
          @include right;
          .icon-search {
            font-size: px2rem(12);
          }
        }
        .search-input-wrapper {
          flex: 1;
          @include center;
          padding: 0 px2rem(10);
          box-sizing: border-box;
          .search-input {
            width: 100%;
            font-size: px2rem(14);
            border: none;
            color: #333;
            &:focus {
              outline: none;
            }
            &::-webkit-input-placeholder {
              font-size: px2rem(14);
              color: #ccc
            }
          }
        }
        .icon-clear-wrapper {
          flex: 0 0 px2rem(24);
          @include left;
          .icon-close-circle-fill {
            font-size: px2rem(14);
            color: #ccc
          }
        }
      }
      .icon-locale-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .icon-cn, .icon-en {
          font-size: px2rem(22);
          color: #666
        }
      }
      .cancel-btn-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .cancel-text {
          font-size: px2rem(14);
          color: $color-blue;
        }
      }
    }
    .shelf-search-tab-wrapper {
      position: absolute;
      top: px2rem(52);
      left: 0;
      z-index: 105;
      display: flex;
      width: 100%;
      height: px2rem(42);
      .shelf-search-tab-item {
        flex: 1;
        @include center;
        .shelf-search-tab-text {
          font-size: px2rem(12);
          color: #999;
          &.is-selected {
            color: $color-blue
          }
        }
      }
    }
  }
</style>
