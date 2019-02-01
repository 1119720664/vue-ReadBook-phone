<template>
  <div>
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow':!menuVisible||settingVisible>=0}" v-show="menuVisible">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <book-setting-font></book-setting-font>
    <book-setting-font-popop></book-setting-font-popop>
    <book-setting-theme></book-setting-theme>
    <book-setting-progress></book-setting-progress>
  </div>

</template>

<script type="text/ecmascript-6">
  import { mapActions, mapGetters } from "vuex"
  import { EBookMixin } from "common/js/mixin"
  import BookSettingFont from "../ebook-setting-font/ebook-setting-font.vue"
  import BookSettingFontPopop from "../ebook-setting-font-popop/ebook-setting-font-popop.vue"
  import BookSettingTheme from "../ebook-setting-theme/ebook-setting-theme.vue"
  import BookSettingProgress from "../ebook-setting-progress/ebook-setting-progress.vue"

  export default {
    name: "EbookMenu",
    mixins: [EBookMixin],
    computed: {
      ...mapGetters({settingVisible: "Book/settingVisible"})
    },
    methods: {
      showSetting(key){
        this.setSettingVisible(key)
      },
      ...mapActions({setSettingVisible: "Book/setSettingVisible"})
    },
    components: {
      BookSettingFont,
      BookSettingFontPopop,
      BookSettingTheme,
      BookSettingProgress
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 200;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    font-size: px2rem(20);
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress {
        font-size: px2rem(24);
      }
      .icon-bright {
        font-size: px2rem(22);
      }
    }
  }
</style>
