<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible&&settingVisible===2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection">
            <span class="icon-back"></span>
          </div>
          <input class="progress"
                 type="range"
                 min="0"
                 max="100"
                 step="1"
                 @change="onProgressChange($event.target.value)"
                 @input="onProgressInput($event.target.value)"
                 :value="progress"
                 ref="progress"
                 :disabled="!bookAvailable"
          />
          <div class="progress-icon-wrapper">
            <span class="icon-forward" @click="nextSection"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text" v-if="currentBook">{{getSectionName}}</span>
          <span>{{bookAvailable ? progress + '%' : '加载中...'}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from "vuex"
  import { saveLocation, getReadTime } from "common/js/localStorage"

  export default {
    name: 'EbookSettingProgress',
    computed: {
      ...mapGetters({
        menuVisible: "Book/menuVisible",
        settingVisible: "Book/settingVisible",
        currentBook: "Book/currentBook",
        progress: "Book/progress",
        bookAvailable: "Book/bookAvailable",
        section: "Book/section",
        fileName: "Book/filename"
      }),
      getSectionName() {
        if (this.section) {                     /*获取当前的目录*/
          const sectionInfo = this.currentBook.section(this.section)
          if (sectionInfo && sectionInfo.href) {
              console.log(2222,this.currentBook.navigation)
            return this.currentBook.navigation.get(sectionInfo.href) && this.currentBook.navigation.get(sectionInfo.href).label
          }
        }
      },
    },
    methods: {
      onProgressChange(progress){
        this.setProgress(progress)
        this.displayProgress()
        this.updateProgressBg()
      },
      onProgressInput(progress){
        this.setProgress(progress)
        this.displayProgress()
        this.updateProgressBg()
      },
      displayProgress() {
        const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
        this.currentBook.rendition.display(cfi)
      },
      updateProgressBg() {              /*设置进度条的背景颜色*/
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
      },
      prevSection() {
        console.log(this.section)
        if (this.section > 0 && this.bookAvailable) {
          this.setSection(this.section - 1)
          const sectionInfo = this.currentBook.section(this.section)
          if (sectionInfo && sectionInfo.href) {
            this.currentBook.rendition.display(sectionInfo.href).then(() => {   /*渲染到指定的页面页数*/
              this.refreshLocation()
            })
          }
        }
      },
      nextSection() {
        console.log(this.currentBook.spine, this.section)
        if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
          this.setSection(this.section + 1).then(() => {   /*渲染到指定的页面页数*/
            this.displaySection()
          })
        }
      },
      displaySection() {
        const sectionInfo = this.currentBook.section(this.section)
        /*左右切换的时候调到指定的章节页面*/
        if (sectionInfo && sectionInfo.href) {
          this.currentBook.rendition.display(sectionInfo.href).then(() => {
            this.refreshLocation()
          })
        }
      },
      refreshLocation() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
        const startCfi = currentLocation.start.cfi;
        /*通过第一个字获取当前读取进度*/
        this.setProgress(Math.floor(progress * 100))
        saveLocation(this.fileName, startCfi)
      },
      getReadTimeText() {
        return this.$t('book.haveRead').replace('$1', this.getReadTimeByMinute())
      },
      getReadTimeByMinute() {
        const readTime = getReadTime(this.fileName)
        if (!readTime) {
          return 0
        } else {
          return Math.ceil(readTime / 60)
        }
      },
      ...mapActions({
        setProgress: "Book/setProgress",
        setSection: "Book/setSection"
      })
    },
    updated() {
      this.updateProgressBg()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 160;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .read-time-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(40);
        font-size: px2rem(12);
        @include center;
      }
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress-icon-wrapper {
          font-size: px2rem(20);
        }
        .progress {
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
            border: px2rem(1) solid #ddd;
          }
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(10);
        width: 100%;
        color: #333;
        font-size: px2rem(12);
        padding: 0 px2rem(15);
        box-sizing: border-box;
        @include center;
        .progress-section-text {
          @include ellipsis;
        }
      }
    }
  }
</style>
