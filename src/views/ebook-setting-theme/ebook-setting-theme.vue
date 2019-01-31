<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible&&settingVisible===1">
      <div class="setting-theme">
        <div class="setting-theme-item" v-for="(item,index) in themeList" :key="index" @click="setTheme(index)">
          <div class="preview" :style="{background:item.style.body.background}"></div>
          <div class="text" :class="{'selected':item.name===defaultTheme}">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from "vuex"
  import { themeList } from "common/js/book-font"
  import { globalThemeCss } from "common/js/gloubThemeCss"
  import { getTheme, saveTheme } from "common/js/localStorage"

  export default {
    name: 'EbookSettingFontPopup',
    computed: {
      themeList() {
        return themeList(this)
      },
      ...mapGetters({
        menuVisible: "Book/menuVisible",
        settingVisible: "Book/settingVisible",
        defaultTheme: "Book/defaultTheme",
        currentBook: "Book/currentBook",
        filename: "Book/filename"
      })
    },
    methods: {
      setTheme(index){
        const theme = this.themeList[index]
        this.setDefaultTheme(theme.name)
        this.currentBook.rendition.themes.select(this.defaultTheme)
        globalThemeCss(this.defaultTheme)
        saveTheme(this.filename, theme.name)
      },
      ...mapActions({setDefaultTheme: "Book/setDefaultTheme"})
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    .setting-theme {
      height: 100%;
      display: flex;
      .setting-theme-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: px2rem(5);
        box-sizing: border-box;
        .preview {
          flex: 1;
          border: px2rem(1) solid #ccc;
          box-sizing: border-box;
          &.no-border {
            border: none
          }
          &.selected {
            box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.1);
          }
        }
        .text {
          flex: 0 0 px2rem(20);
          font-size: px2rem(14);
          color: #ccc;
          @include center;
          &.selected {
            color: #333
          }
        }
      }
    }
  }
</style>
