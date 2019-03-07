<template>
  <transition name="fade">
    <div class="slide-content-wrapper" v-show="menuVisible&&settingVisible===3">
      <transition name="slide-right">
        <div class="content" v-if="settingVisible===3">
          <div class="content-page-wrapper" v-if="bookAvailable">
            <div class="content-page">
              <component :is="currentTab===1 ? content :bookmark"></component>
            </div>
            <div class="content-page-tab">
              <div class="content-page-tab-item" @click="selectTab(1)" :class="{'selected':currentTab===1}">
                {{$t('book.navigation')}}
              </div>
              <div class="content-page-tab-item" @click="selectTab(2)" :class="{'selected':currentTab===2}">
                {{$t('book.bookmark')}}
              </div>
            </div>
          </div>
          <div class="content-empty" v-if="!bookAvailable">
            <ebook-loading></ebook-loading>
          </div>
        </div>
      </transition>
      <div class="content-bg" @click="hide"></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from "vuex"
  import EbookContent from "../ebook-content/ebook-content.vue"
  import EbookBookmark from "../ebook-bookmark/ebook-bookmark.vue"
  import EbookLoading from "../ebook-loading/ebook-loading.vue"

  export default {
    name: 'EBookSlide',
    data(){
      return {
        currentTab: 1,
        content: EbookContent,
        bookmark: EbookBookmark,
      }
    },
    computed: {
      ...mapGetters({
        menuVisible: "Book/menuVisible",
        settingVisible: "Book/settingVisible",
        bookAvailable: "Book/bookAvailable"
      })
    },
    methods: {
      hide() {
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      },
      selectTab(index) {
        this.currentTab = index
      },
      ...mapActions(
        {
          setMenuVisible: "Book/setMenuVisible",
          setSettingVisible: "Book/setSettingVisible",
          setFontFamilyVisible: "Book/setFontFamilyVisible"
        })
    },
    components: {
      EbookLoading
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .slide-content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    height: 100%;
    display: flex;
    .content {
      flex: 0 0 85%; /*使用flex可是实现宽度的自适应*/
      width: 85%;
      height: 100%;
      .content-page-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .content-page {
          flex: 1;
          width: 100%;
          overflow: hidden;
        }
        .content-page-tab {
          flex: 0 0 px2rem(48);
          width: 100%;
          height: px2rem(48);
          display: flex;
          &-item {
            flex: 1;
            font-size: px2rem(12);
            @include center
          }
        }
      }
      .content-empty {
        width: 100%;
        height: 100%;
        @include center
      }
    }
    .content-bg {
      flex: 0 0 15%;
      width: 15%;
      height: 100%;
    }
  }
</style>
